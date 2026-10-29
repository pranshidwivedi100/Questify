package com.questify;

import com.questify.entity.User;
import com.questify.entity.UserProgress;
import com.questify.repository.UserProgressRepository;
import com.questify.repository.UserRepository;
import com.questify.repository.XpTransactionRepository;
import com.questify.service.GamificationEngineService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class XpDuplicatePreventionIntegrationTest {

    @Autowired
    private GamificationEngineService gamificationEngineService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProgressRepository userProgressRepository;

    @Autowired
    private XpTransactionRepository xpTransactionRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        xpTransactionRepository.deleteAll();
        userProgressRepository.deleteAll();
        userRepository.deleteAll();

        testUser = userRepository.save(new User("Test User", "test@questify.io", "hashedPass", "UTC", 60));
    }

    @Test
    @DisplayName("XP transactions prevent duplicate XP rewards on same quest across multiple calls")
    void testXpLedgerUniqueness() {
        Long questId = 42L;
        int questXp = 50;

        // Call 1: Should award 50 XP
        GamificationEngineService.XpRewardResult r1 =
                gamificationEngineService.rewardXp(testUser, "QUEST", questId, questXp);

        assertTrue(r1.isAwarded());
        assertEquals(50, r1.getXpAmount());
        assertEquals(50, r1.getTotalXp());

        // Call 2: Second attempt on the exact same quest
        GamificationEngineService.XpRewardResult r2 =
                gamificationEngineService.rewardXp(testUser, "QUEST", questId, questXp);

        assertFalse(r2.isAwarded(), "Second XP reward must be rejected");
        assertEquals(0, r2.getXpAmount(), "Zero additional XP should be awarded");
        assertEquals(50, r2.getTotalXp(), "Total XP must remain strictly 50");

        // Verify only 1 ledger record exists in DB
        assertEquals(1, xpTransactionRepository.count());

        // Call 3: Different quest id should succeed
        GamificationEngineService.XpRewardResult r3 =
                gamificationEngineService.rewardXp(testUser, "QUEST", 43L, 30);

        assertTrue(r3.isAwarded());
        assertEquals(30, r3.getXpAmount());
        assertEquals(80, r3.getTotalXp());
        assertEquals(2, xpTransactionRepository.count());
    }
}

