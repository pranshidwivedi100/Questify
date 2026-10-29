package com.questify.service;

import com.questify.dto.AchievementDTO;
import com.questify.dto.CreateQuestRequest;
import com.questify.dto.QuestCompletionResponse;
import com.questify.dto.QuestDTO;
import com.questify.dto.UpdateQuestRequest;
import com.questify.entity.Quest;
import com.questify.entity.QuestPriority;
import com.questify.entity.QuestStatus;
import com.questify.entity.Subject;
import com.questify.entity.User;
import com.questify.entity.UserProgress;
import com.questify.exception.BadRequestException;
import com.questify.exception.ResourceNotFoundException;
import com.questify.repository.QuestRepository;
import com.questify.repository.SubjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestService {

    private final QuestRepository questRepository;
    private final SubjectRepository subjectRepository;
    private final GamificationEngineService gamificationEngineService;

    public QuestService(QuestRepository questRepository,
                        SubjectRepository subjectRepository,
                        GamificationEngineService gamificationEngineService) {
        this.questRepository = questRepository;
        this.subjectRepository = subjectRepository;
        this.gamificationEngineService = gamificationEngineService;
    }

    @Transactional
    public QuestDTO createQuest(User user, CreateQuestRequest request) {
        Subject subject = null;
        if (request.getSubjectId() != null) {
            subject = subjectRepository.findByIdAndUserId(request.getSubjectId(), user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + request.getSubjectId()));
        }

        Quest quest = new Quest(
                user,
                subject,
                request.getTitle().trim(),
                request.getDescription(),
                request.getPriority(),
                request.getBaseXp(),
                request.getDueAt(),
                request.getEstimatedMinutes()
        );

        Quest saved = questRepository.save(quest);
        return QuestDTO.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<QuestDTO> getQuests(User user, QuestStatus status, QuestPriority priority, Long subjectId, String search) {
        String cleanSearch = (search != null && !search.isBlank()) ? search.trim() : null;
        List<Quest> quests = questRepository.findWithFilters(user.getId(), status, priority, subjectId, cleanSearch);
        return quests.stream().map(QuestDTO::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public QuestDTO getQuestById(User user, Long id) {
        Quest quest = questRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Quest not found with id: " + id));
        return QuestDTO.fromEntity(quest);
    }

    @Transactional
    public QuestDTO updateQuest(User user, Long id, UpdateQuestRequest request) {
        Quest quest = questRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Quest not found with id: " + id));

        if (request.getSubjectId() != null) {
            Subject subject = subjectRepository.findByIdAndUserId(request.getSubjectId(), user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + request.getSubjectId()));
            quest.setSubject(subject);
        }

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            quest.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null) {
            quest.setDescription(request.getDescription());
        }
        if (request.getPriority() != null) {
            quest.setPriority(request.getPriority());
        }
        if (request.getStatus() != null) {
            quest.setStatus(request.getStatus());
            if (request.getStatus() == QuestStatus.COMPLETED && quest.getCompletedAt() == null) {
                quest.setCompletedAt(LocalDateTime.now());
            } else if (request.getStatus() != QuestStatus.COMPLETED) {
                quest.setCompletedAt(null);
            }
        }
        if (request.getBaseXp() != null && request.getBaseXp() > 0) {
            quest.setBaseXp(request.getBaseXp());
        }
        if (request.getDueAt() != null) {
            quest.setDueAt(request.getDueAt());
        }
        if (request.getEstimatedMinutes() != null && request.getEstimatedMinutes() > 0) {
            quest.setEstimatedMinutes(request.getEstimatedMinutes());
        }

        Quest saved = questRepository.save(quest);
        return QuestDTO.fromEntity(saved);
    }

    @Transactional
    public void deleteQuest(User user, Long id) {
        Quest quest = questRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Quest not found with id: " + id));
        questRepository.delete(quest);
    }

    @Transactional
    public QuestCompletionResponse completeQuest(User user, Long id) {
        Quest quest = questRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Quest not found with id: " + id));

        quest.setStatus(QuestStatus.COMPLETED);
        if (quest.getCompletedAt() == null) {
            quest.setCompletedAt(LocalDateTime.now());
        }
        Quest savedQuest = questRepository.save(quest);

        // Award XP idempotently via GamificationEngineService
        GamificationEngineService.XpRewardResult rewardResult =
                gamificationEngineService.rewardXp(user, "QUEST", quest.getId(), quest.getBaseXp());

        // Update streak
        boolean streakIncremented = gamificationEngineService.recordActivityAndAdvanceStreak(user);

        // Check First Quest achievement
        List<AchievementDTO> unlockedAchievements = new ArrayList<>();
        gamificationEngineService.checkAndUnlockAchievement(user, "FIRST_QUEST")
                .ifPresent(unlockedAchievements::add);

        UserProgress progress = gamificationEngineService.getOrCreateProgress(user);

        QuestCompletionResponse response = new QuestCompletionResponse();
        response.setQuest(QuestDTO.fromEntity(savedQuest));
        response.setXpAwarded(rewardResult.getXpAmount());
        response.setAlreadyAwarded(!rewardResult.isAwarded());
        response.setLevelUp(rewardResult.isLeveledUp());
        response.setCurrentLevel(progress.getCurrentLevel());
        response.setTotalXp(progress.getTotalXp());
        response.setCurrentStreak(progress.getCurrentStreak());
        response.setNewlyUnlockedAchievements(unlockedAchievements);

        return response;
    }

    @Transactional
    public QuestDTO reopenQuest(User user, Long id) {
        Quest quest = questRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Quest not found with id: " + id));

        quest.setStatus(QuestStatus.PENDING);
        quest.setCompletedAt(null);
        Quest saved = questRepository.save(quest);
        return QuestDTO.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<QuestDTO> getCalendarQuests(User user, LocalDateTime start, LocalDateTime end) {
        List<Quest> quests = questRepository.findByUserIdAndDueAtBetween(user.getId(), start, end);
        return quests.stream().map(QuestDTO::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<QuestDTO> getOverdueQuests(User user) {
        List<Quest> quests = questRepository.findOverdueQuests(user.getId(), LocalDateTime.now());
        return quests.stream().map(QuestDTO::fromEntity).collect(Collectors.toList());
    }
}

