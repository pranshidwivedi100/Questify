package com.questify.service;

import com.questify.dto.AchievementDTO;
import com.questify.dto.UserProgressDTO;
import com.questify.entity.Achievement;
import com.questify.entity.User;
import com.questify.entity.UserAchievement;
import com.questify.entity.UserProgress;
import com.questify.entity.XpTransaction;
import com.questify.repository.AchievementRepository;
import com.questify.repository.UserAchievementRepository;
import com.questify.repository.UserProgressRepository;
import com.questify.repository.XpTransactionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GamificationEngineService {

    private static final Logger logger = LoggerFactory.getLogger(GamificationEngineService.class);

    private final UserProgressRepository userProgressRepository;
    private final XpTransactionRepository xpTransactionRepository;
    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;

    public GamificationEngineService(UserProgressRepository userProgressRepository,
                                     XpTransactionRepository xpTransactionRepository,
                                     AchievementRepository achievementRepository,
                                     UserAchievementRepository userAchievementRepository) {
        this.userProgressRepository = userProgressRepository;
        this.xpTransactionRepository = xpTransactionRepository;
        this.achievementRepository = achievementRepository;
        this.userAchievementRepository = userAchievementRepository;
    }

    public int calculateLevel(int totalXp) {
        if (totalXp <= 0) return 1;
        return (int) Math.floor(0.1 * Math.sqrt(totalXp)) + 1;
    }

    public UserProgress getOrCreateProgress(User user) {
        return userProgressRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    UserProgress newProgress = new UserProgress(user);
                    return userProgressRepository.save(newProgress);
                });
    }

    public UserProgressDTO getUserProgressDTO(User user) {
        UserProgress progress = getOrCreateProgress(user);
        return UserProgressDTO.fromEntity(progress);
    }

    @Transactional
    public XpRewardResult rewardXp(User user, String sourceType, Long sourceId, int xpAwarded) {
        // Strict Idempotency Check
        if (xpTransactionRepository.existsByUserIdAndSourceTypeAndSourceId(user.getId(), sourceType, sourceId)) {
            logger.info("XP already awarded for user: {}, type: {}, id: {}. Skipping.", user.getId(), sourceType, sourceId);
            UserProgress progress = getOrCreateProgress(user);
            return new XpRewardResult(false, 0, progress.getTotalXp(), progress.getCurrentLevel(), false, List.of());
        }

        try {
            XpTransaction transaction = new XpTransaction(user, sourceType, sourceId, xpAwarded);
            xpTransactionRepository.saveAndFlush(transaction);
        } catch (DataIntegrityViolationException ex) {
            // Concurrent duplicate catch
            logger.warn("Caught concurrent duplicate XP transaction for user: {}, type: {}, id: {}", user.getId(), sourceType, sourceId);
            UserProgress progress = getOrCreateProgress(user);
            return new XpRewardResult(false, 0, progress.getTotalXp(), progress.getCurrentLevel(), false, List.of());
        }

        UserProgress progress = getOrCreateProgress(user);
        int oldLevel = progress.getCurrentLevel();
        int newTotalXp = progress.getTotalXp() + xpAwarded;
        int newLevel = calculateLevel(newTotalXp);
        boolean leveledUp = newLevel > oldLevel;

        progress.setTotalXp(newTotalXp);
        progress.setCurrentLevel(newLevel);
        userProgressRepository.save(progress);

        List<AchievementDTO> unlocked = new ArrayList<>();
        return new XpRewardResult(true, xpAwarded, newTotalXp, newLevel, leveledUp, unlocked);
    }

    @Transactional
    public boolean recordActivityAndAdvanceStreak(User user) {
        UserProgress progress = getOrCreateProgress(user);

        ZoneId zoneId;
        try {
            zoneId = ZoneId.of(user.getTimezone() != null ? user.getTimezone() : "UTC");
        } catch (Exception e) {
            zoneId = ZoneId.of("UTC");
        }

        LocalDate today = ZonedDateTime.now(zoneId).toLocalDate();
        LocalDate lastDate = progress.getLastActivityDate();

        boolean streakIncremented = false;

        if (lastDate == null) {
            progress.setCurrentStreak(1);
            progress.setLongestStreak(Math.max(progress.getLongestStreak(), 1));
            progress.setLastActivityDate(today);
            streakIncremented = true;
        } else if (lastDate.equals(today)) {
            // Activity already recorded today, no streak alteration
            streakIncremented = false;
        } else if (lastDate.equals(today.minusDays(1))) {
            // Consecutive day
            int newStreak = progress.getCurrentStreak() + 1;
            progress.setCurrentStreak(newStreak);
            progress.setLongestStreak(Math.max(progress.getLongestStreak(), newStreak));
            progress.setLastActivityDate(today);
            streakIncremented = true;
        } else if (lastDate.isBefore(today.minusDays(1))) {
            // Missed one or more days -> streak resets to 1
            progress.setCurrentStreak(1);
            progress.setLastActivityDate(today);
            streakIncremented = true;
        }

        userProgressRepository.save(progress);

        // Check streak milestones
        if (progress.getCurrentStreak() >= 3) {
            checkAndUnlockAchievement(user, "STREAK_3");
        }
        if (progress.getCurrentStreak() >= 7) {
            checkAndUnlockAchievement(user, "STREAK_7");
        }

        return streakIncremented;
    }

    @Transactional
    public Optional<AchievementDTO> checkAndUnlockAchievement(User user, String code) {
        if (userAchievementRepository.existsByUserIdAndAchievementCode(user.getId(), code)) {
            return Optional.empty();
        }

        Optional<Achievement> achievementOpt = achievementRepository.findByCode(code);
        if (achievementOpt.isEmpty()) {
            return Optional.empty();
        }

        Achievement achievement = achievementOpt.get();
        try {
            UserAchievement ua = new UserAchievement(user, achievement);
            userAchievementRepository.saveAndFlush(ua);

            // Reward achievement XP idempotently
            rewardXp(user, "ACHIEVEMENT", achievement.getId(), achievement.getXpReward());

            return Optional.of(AchievementDTO.fromEntity(achievement, ua));
        } catch (DataIntegrityViolationException ex) {
            return Optional.empty();
        }
    }

    @Transactional(readOnly = true)
    public List<AchievementDTO> getAllAchievementsWithUserStatus(User user) {
        List<Achievement> allAchievements = achievementRepository.findAll();
        List<UserAchievement> userAchievements = userAchievementRepository.findByUserIdOrderByUnlockedAtDesc(user.getId());

        Map<Long, UserAchievement> map = userAchievements.stream()
                .collect(Collectors.toMap(ua -> ua.getAchievement().getId(), ua -> ua, (existing, replacement) -> existing));

        return allAchievements.stream()
                .map(a -> AchievementDTO.fromEntity(a, map.get(a.getId())))
                .collect(Collectors.toList());
    }

    public static class XpRewardResult {
        private final boolean awarded;
        private final int xpAmount;
        private final int totalXp;
        private final int level;
        private final boolean leveledUp;
        private final List<AchievementDTO> unlockedAchievements;

        public XpRewardResult(boolean awarded, int xpAmount, int totalXp, int level, boolean leveledUp,
                              List<AchievementDTO> unlockedAchievements) {
            this.awarded = awarded;
            this.xpAmount = xpAmount;
            this.totalXp = totalXp;
            this.level = level;
            this.leveledUp = leveledUp;
            this.unlockedAchievements = unlockedAchievements;
        }

        public boolean isAwarded() {
            return awarded;
        }

        public int getXpAmount() {
            return xpAmount;
        }

        public int getTotalXp() {
            return totalXp;
        }

        public int getLevel() {
            return level;
        }

        public boolean isLeveledUp() {
            return leveledUp;
        }

        public List<AchievementDTO> getUnlockedAchievements() {
            return unlockedAchievements;
        }
    }
}

