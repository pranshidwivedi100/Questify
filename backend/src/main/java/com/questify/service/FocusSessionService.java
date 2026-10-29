package com.questify.service;

import com.questify.dto.FocusSessionDTO;
import com.questify.dto.LogFocusSessionRequest;
import com.questify.entity.FocusSession;
import com.questify.entity.Quest;
import com.questify.entity.Subject;
import com.questify.entity.User;
import com.questify.exception.ResourceNotFoundException;
import com.questify.repository.FocusSessionRepository;
import com.questify.repository.QuestRepository;
import com.questify.repository.SubjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FocusSessionService {

    private final FocusSessionRepository focusSessionRepository;
    private final SubjectRepository subjectRepository;
    private final QuestRepository questRepository;
    private final GamificationEngineService gamificationEngineService;

    public FocusSessionService(FocusSessionRepository focusSessionRepository,
                               SubjectRepository subjectRepository,
                               QuestRepository questRepository,
                               GamificationEngineService gamificationEngineService) {
        this.focusSessionRepository = focusSessionRepository;
        this.subjectRepository = subjectRepository;
        this.questRepository = questRepository;
        this.gamificationEngineService = gamificationEngineService;
    }

    @Transactional
    public FocusSessionDTO logFocusSession(User user, LogFocusSessionRequest request) {
        Subject subject = null;
        if (request.getSubjectId() != null) {
            subject = subjectRepository.findByIdAndUserId(request.getSubjectId(), user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + request.getSubjectId()));
        }

        Quest quest = null;
        if (request.getQuestId() != null) {
            quest = questRepository.findByIdAndUserId(request.getQuestId(), user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Quest not found with id: " + request.getQuestId()));
        }

        LocalDateTime completedAt = request.getCompletedAt() != null ? request.getCompletedAt() : LocalDateTime.now();
        LocalDateTime startedAt = request.getStartedAt() != null ? request.getStartedAt() : completedAt.minusMinutes(request.getDurationMinutes());

        // 2 XP per minute of focused study
        int xpEarned = request.getDurationMinutes() * 2;

        FocusSession session = new FocusSession(
                user,
                subject,
                quest,
                request.getDurationMinutes(),
                startedAt,
                completedAt,
                xpEarned
        );

        FocusSession saved = focusSessionRepository.save(session);

        // Award XP idempotently
        gamificationEngineService.rewardXp(user, "FOCUS_SESSION", saved.getId(), xpEarned);

        // Update streak
        gamificationEngineService.recordActivityAndAdvanceStreak(user);

        // Focus Master badge check
        if (request.getDurationMinutes() >= 25) {
            gamificationEngineService.checkAndUnlockAchievement(user, "FOCUS_MASTER");
        }

        return FocusSessionDTO.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<FocusSessionDTO> getUserSessions(User user) {
        List<FocusSession> sessions = focusSessionRepository.findByUserIdOrderByCompletedAtDesc(user.getId());
        return sessions.stream().map(FocusSessionDTO::fromEntity).collect(Collectors.toList());
    }

    @Transactional
    public void deleteSession(User user, Long id) {
        FocusSession session = focusSessionRepository.findById(id)
                .filter(s -> s.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Focus session not found with id: " + id));
        focusSessionRepository.delete(session);
    }
}

