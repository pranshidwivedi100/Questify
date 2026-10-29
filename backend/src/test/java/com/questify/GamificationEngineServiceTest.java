package com.questify;

import com.questify.dto.AchievementDTO;
import com.questify.entity.Achievement;
import com.questify.entity.User;
import com.questify.entity.UserProgress;
import com.questify.entity.XpTransaction;
import com.questify.repository.AchievementRepository;
import com.questify.repository.UserAchievementRepository;
import com.questify.repository.UserProgressRepository;
import com.questify.repository.XpTransactionRepository;
import com.questify.service.GamificationEngineService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GamificationEngineServiceTest {

    @Mock
    private UserProgressRepository userProgressRepository;

    @Mock
    private XpTransactionRepository xpTransactionRepository;

    @Mock
    private AchievementRepository achievementRepository;

    @Mock
    private UserAchievementRepository userAchievementRepository;

    @InjectMocks
    private GamificationEngineService gamificationEngineService;

    private User testUser;
    private UserProgress testProgress;

    @BeforeEach
    void setUp() {
        testUser = new User("Alice", "alice@test.com", "encodedPass", "UTC", 60);
        testUser.setId(1L);

        testProgress = new UserProgress(testUser);
        testProgress.setId(10L);
        testProgress.setTotalXp(0);
        testProgress.setCurrentLevel(1);
        testProgress.setCurrentStreak(0);
        testProgress.setLongestStreak(0);
    }

    @Test
    @DisplayName("Level Formula: floor(0.1 * sqrt(totalXp)) + 1 matches progression targets")
    void testLevelFormula() {
        assertEquals(1, gamificationEngineService.calculateLevel(0));
        assertEquals(1, gamificationEngineService.calculateLevel(50));
        assertEquals(2, gamificationEngineService.calculateLevel(100)); // sqrt(100)=10 -> 0.1*10=1 -> +1 = 2
        assertEquals(2, gamificationEngineService.calculateLevel(350));
        assertEquals(3, gamificationEngineService.calculateLevel(400)); // sqrt(400)=20 -> 0.1*20=2 -> +1 = 3
        assertEquals(4, gamificationEngineService.calculateLevel(900)); // sqrt(900)=30 -> 0.1*30=3 -> +1 = 4
        assertEquals(6, gamificationEngineService.calculateLevel(2500)); // sqrt(2500)=50 -> 0.1*50=5 -> +1 = 6
    }

    @Test
    @DisplayName("Idempotent XP: Rewards XP once and rejects duplicate requests")
    void testIdempotentXpAwarding() {
        when(userProgressRepository.findByUserId(1L)).thenReturn(Optional.of(testProgress));
        when(xpTransactionRepository.existsByUserIdAndSourceTypeAndSourceId(1L, "QUEST", 99L))
                .thenReturn(false)
                .thenReturn(true);
        when(xpTransactionRepository.saveAndFlush(any(XpTransaction.class))).thenAnswer(i -> i.getArgument(0));
        when(userProgressRepository.save(any(UserProgress.class))).thenAnswer(i -> i.getArgument(0));

        // First attempt: should award XP
        GamificationEngineService.XpRewardResult firstResult =
                gamificationEngineService.rewardXp(testUser, "QUEST", 99L, 100);

        assertTrue(firstResult.isAwarded());
        assertEquals(100, firstResult.getXpAmount());
        assertEquals(100, firstResult.getTotalXp());
        assertEquals(2, firstResult.getLevel());
        assertTrue(firstResult.isLeveledUp());

        // Second attempt: must be strictly rejected (0 XP awarded, awarded = false)
        GamificationEngineService.XpRewardResult secondResult =
                gamificationEngineService.rewardXp(testUser, "QUEST", 99L, 100);

        assertFalse(secondResult.isAwarded());
        assertEquals(0, secondResult.getXpAmount());
        assertEquals(100, secondResult.getTotalXp());
    }

    @Test
    @DisplayName("Streak Tracking: Increments on consecutive day and resets on missed day")
    void testStreakAdvancementAndReset() {
        when(userProgressRepository.findByUserId(1L)).thenReturn(Optional.of(testProgress));
        when(userProgressRepository.save(any(UserProgress.class))).thenAnswer(i -> i.getArgument(0));

        // Case 1: First activity ever
        boolean advanced = gamificationEngineService.recordActivityAndAdvanceStreak(testUser);
        assertTrue(advanced);
        assertEquals(1, testProgress.getCurrentStreak());
        assertEquals(1, testProgress.getLongestStreak());

        // Case 2: Same day activity -> streak stays 1
        advanced = gamificationEngineService.recordActivityAndAdvanceStreak(testUser);
        assertFalse(advanced);
        assertEquals(1, testProgress.getCurrentStreak());

        // Case 3: Consecutive day activity
        testProgress.setLastActivityDate(LocalDate.now().minusDays(1));
        advanced = gamificationEngineService.recordActivityAndAdvanceStreak(testUser);
        assertTrue(advanced);
        assertEquals(2, testProgress.getCurrentStreak());
        assertEquals(2, testProgress.getLongestStreak());

        // Case 4: Missed two days -> reset to 1
        testProgress.setLastActivityDate(LocalDate.now().minusDays(3));
        advanced = gamificationEngineService.recordActivityAndAdvanceStreak(testUser);
        assertTrue(advanced);
        assertEquals(1, testProgress.getCurrentStreak());
        assertEquals(2, testProgress.getLongestStreak()); // Longest streak preserved!
    }
}

