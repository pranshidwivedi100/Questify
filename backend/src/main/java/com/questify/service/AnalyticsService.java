package com.questify.service;

import com.questify.dto.AnalyticsDashboardDTO;
import com.questify.dto.DailyTrendDTO;
import com.questify.dto.SubjectAnalyticsDTO;
import com.questify.entity.Quest;
import com.questify.entity.QuestStatus;
import com.questify.entity.Subject;
import com.questify.entity.User;
import com.questify.entity.UserProgress;
import com.questify.repository.FocusSessionRepository;
import com.questify.repository.QuestRepository;
import com.questify.repository.SubjectRepository;
import com.questify.repository.XpTransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class AnalyticsService {

    private final QuestRepository questRepository;
    private final SubjectRepository subjectRepository;
    private final FocusSessionRepository focusSessionRepository;
    private final XpTransactionRepository xpTransactionRepository;
    private final GamificationEngineService gamificationEngineService;

    public AnalyticsService(QuestRepository questRepository,
                            SubjectRepository subjectRepository,
                            FocusSessionRepository focusSessionRepository,
                            XpTransactionRepository xpTransactionRepository,
                            GamificationEngineService gamificationEngineService) {
        this.questRepository = questRepository;
        this.subjectRepository = subjectRepository;
        this.focusSessionRepository = focusSessionRepository;
        this.xpTransactionRepository = xpTransactionRepository;
        this.gamificationEngineService = gamificationEngineService;
    }

    @Transactional(readOnly = true)
    public AnalyticsDashboardDTO getDashboardAnalytics(User user) {
        AnalyticsDashboardDTO dto = new AnalyticsDashboardDTO();

        UserProgress progress = gamificationEngineService.getOrCreateProgress(user);
        dto.setCurrentStreak(progress.getCurrentStreak());
        dto.setLongestStreak(progress.getLongestStreak());
        dto.setTotalXpEarned(progress.getTotalXp());

        List<Quest> allQuests = questRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        long totalQuests = allQuests.size();
        long completedQuests = allQuests.stream().filter(q -> q.getStatus() == QuestStatus.COMPLETED).count();
        long pendingQuests = totalQuests - completedQuests;

        dto.setTotalQuests(totalQuests);
        dto.setCompletedQuests(completedQuests);
        dto.setPendingQuests(pendingQuests);

        double completionRate = totalQuests > 0 ? ((double) completedQuests / totalQuests) * 100.0 : 0.0;
        dto.setCompletionRate(Math.round(completionRate * 10.0) / 10.0);

        long onTimeCount = allQuests.stream()
                .filter(q -> q.getStatus() == QuestStatus.COMPLETED && q.getCompletedAt() != null)
                .filter(q -> q.getDueAt() == null || !q.getCompletedAt().isAfter(q.getDueAt()))
                .count();

        double onTimeRate = completedQuests > 0 ? ((double) onTimeCount / completedQuests) * 100.0 : 100.0;
        dto.setOnTimeCompletionRate(Math.round(onTimeRate * 10.0) / 10.0);

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime thirtyDaysAgo = now.minusDays(30);
        int totalMinutes = focusSessionRepository.sumMinutesBetween(user.getId(), thirtyDaysAgo, now);
        dto.setTotalFocusMinutes(totalMinutes);

        // Subject Breakdown
        List<Subject> subjects = subjectRepository.findByUserIdOrderByNameAsc(user.getId());
        List<SubjectAnalyticsDTO> subjectBreakdown = new ArrayList<>();
        for (Subject s : subjects) {
            SubjectAnalyticsDTO sDto = new SubjectAnalyticsDTO();
            sDto.setSubjectId(s.getId());
            sDto.setSubjectName(s.getName());
            sDto.setColorHex(s.getColorHex());
            sDto.setTargetHours(s.getTargetHours());

            int minutesStudied = focusSessionRepository.sumMinutesBySubject(user.getId(), s.getId());
            sDto.setCompletedHours(Math.round((minutesStudied / 60.0) * 10.0) / 10.0);

            long count = allQuests.stream().filter(q -> q.getSubject() != null && q.getSubject().getId().equals(s.getId())).count();
            long compCount = allQuests.stream().filter(q -> q.getSubject() != null && q.getSubject().getId().equals(s.getId()) && q.getStatus() == QuestStatus.COMPLETED).count();
            sDto.setQuestCount(count);
            sDto.setCompletedQuestCount(compCount);

            subjectBreakdown.add(sDto);
        }
        dto.setSubjectBreakdown(subjectBreakdown);

        // Daily Trends for past 7 days
        List<DailyTrendDTO> dailyTrends = new ArrayList<>();
        LocalDate today = LocalDate.now();
        for (int i = 6; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            LocalDateTime dayStart = d.atStartOfDay();
            LocalDateTime dayEnd = d.atTime(LocalTime.MAX);

            int dayMinutes = focusSessionRepository.sumMinutesBetween(user.getId(), dayStart, dayEnd);
            int dayXp = xpTransactionRepository.sumXpEarnedBetween(user.getId(), dayStart, dayEnd);
            List<Quest> dayQuests = questRepository.findCompletedBetween(user.getId(), dayStart, dayEnd);

            String dayName = d.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            dailyTrends.add(new DailyTrendDTO(d, dayName, dayMinutes, dayXp, dayQuests.size()));
        }
        dto.setDailyTrends(dailyTrends);

        return dto;
    }
}

