package com.questify;

import com.questify.dto.CreateQuestRequest;
import com.questify.dto.QuestCompletionResponse;
import com.questify.dto.QuestDTO;
import com.questify.entity.Quest;
import com.questify.entity.QuestPriority;
import com.questify.entity.QuestStatus;
import com.questify.entity.User;
import com.questify.entity.UserProgress;
import com.questify.repository.QuestRepository;
import com.questify.repository.SubjectRepository;
import com.questify.service.GamificationEngineService;
import com.questify.service.QuestService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuestServiceTest {

    @Mock
    private QuestRepository questRepository;

    @Mock
    private SubjectRepository subjectRepository;

    @Mock
    private GamificationEngineService gamificationEngineService;

    @InjectMocks
    private QuestService questService;

    private User user;
    private Quest quest;

    @BeforeEach
    void setUp() {
        user = new User("Bob", "bob@test.com", "pass123", "UTC", 45);
        user.setId(5L);

        quest = new Quest(user, null, "Complete Math Homework", "Chapter 4", QuestPriority.HIGH, 75, null, 40);
        quest.setId(101L);
    }

    @Test
    @DisplayName("Create Quest assigns default pending status and base XP")
    void testCreateQuest() {
        CreateQuestRequest req = new CreateQuestRequest();
        req.setTitle("Complete Math Homework");
        req.setDescription("Chapter 4");
        req.setPriority(QuestPriority.HIGH);
        req.setBaseXp(75);
        req.setEstimatedMinutes(40);

        when(questRepository.save(any(Quest.class))).thenReturn(quest);

        QuestDTO result = questService.createQuest(user, req);

        assertNotNull(result);
        assertEquals("Complete Math Homework", result.getTitle());
        assertEquals(QuestStatus.PENDING, result.getStatus());
        assertEquals(75, result.getBaseXp());
    }

    @Test
    @DisplayName("Complete Quest triggers XP reward, updates status and streak")
    void testCompleteQuest() {
        when(questRepository.findByIdAndUserId(101L, 5L)).thenReturn(Optional.of(quest));
        when(questRepository.save(any(Quest.class))).thenAnswer(i -> i.getArgument(0));

        GamificationEngineService.XpRewardResult rewardResult =
                new GamificationEngineService.XpRewardResult(true, 75, 75, 1, false, List.of());
        when(gamificationEngineService.rewardXp(user, "QUEST", 101L, 75)).thenReturn(rewardResult);
        when(gamificationEngineService.recordActivityAndAdvanceStreak(user)).thenReturn(true);

        UserProgress progress = new UserProgress(user);
        progress.setTotalXp(75);
        progress.setCurrentLevel(1);
        progress.setCurrentStreak(1);
        when(gamificationEngineService.getOrCreateProgress(user)).thenReturn(progress);

        QuestCompletionResponse response = questService.completeQuest(user, 101L);

        assertNotNull(response);
        assertEquals(QuestStatus.COMPLETED, response.getQuest().getStatus());
        assertEquals(75, response.getXpAwarded());
        assertFalse(response.isAlreadyAwarded());
        assertEquals(1, response.getCurrentStreak());

        verify(gamificationEngineService).rewardXp(user, "QUEST", 101L, 75);
        verify(gamificationEngineService).recordActivityAndAdvanceStreak(user);
    }

    @Test
    @DisplayName("Reopening a quest marks status as PENDING without deleting ledger records")
    void testReopenQuest() {
        quest.setStatus(QuestStatus.COMPLETED);
        when(questRepository.findByIdAndUserId(101L, 5L)).thenReturn(Optional.of(quest));
        when(questRepository.save(any(Quest.class))).thenAnswer(i -> i.getArgument(0));

        QuestDTO reopened = questService.reopenQuest(user, 101L);

        assertEquals(QuestStatus.PENDING, reopened.getStatus());
        assertNull(reopened.getCompletedAt());
    }
}

