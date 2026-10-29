package com.questify.dto;

import java.util.List;

public class AnalyticsDashboardDTO {
    private long totalQuests;
    private long completedQuests;
    private long pendingQuests;
    private double completionRate;
    private double onTimeCompletionRate;
    private int totalFocusMinutes;
    private int totalXpEarned;
    private int currentStreak;
    private int longestStreak;
    private List<SubjectAnalyticsDTO> subjectBreakdown;
    private List<DailyTrendDTO> dailyTrends;

    public AnalyticsDashboardDTO() {
    }

    public long getTotalQuests() {
        return totalQuests;
    }

    public void setTotalQuests(long totalQuests) {
        this.totalQuests = totalQuests;
    }

    public long getCompletedQuests() {
        return completedQuests;
    }

    public void setCompletedQuests(long completedQuests) {
        this.completedQuests = completedQuests;
    }

    public long getPendingQuests() {
        return pendingQuests;
    }

    public void setPendingQuests(long pendingQuests) {
        this.pendingQuests = pendingQuests;
    }

    public double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(double completionRate) {
        this.completionRate = completionRate;
    }

    public double getOnTimeCompletionRate() {
        return onTimeCompletionRate;
    }

    public void setOnTimeCompletionRate(double onTimeCompletionRate) {
        this.onTimeCompletionRate = onTimeCompletionRate;
    }

    public int getTotalFocusMinutes() {
        return totalFocusMinutes;
    }

    public void setTotalFocusMinutes(int totalFocusMinutes) {
        this.totalFocusMinutes = totalFocusMinutes;
    }

    public int getTotalXpEarned() {
        return totalXpEarned;
    }

    public void setTotalXpEarned(int totalXpEarned) {
        this.totalXpEarned = totalXpEarned;
    }

    public int getCurrentStreak() {
        return currentStreak;
    }

    public void setCurrentStreak(int currentStreak) {
        this.currentStreak = currentStreak;
    }

    public int getLongestStreak() {
        return longestStreak;
    }

    public void setLongestStreak(int longestStreak) {
        this.longestStreak = longestStreak;
    }

    public List<SubjectAnalyticsDTO> getSubjectBreakdown() {
        return subjectBreakdown;
    }

    public void setSubjectBreakdown(List<SubjectAnalyticsDTO> subjectBreakdown) {
        this.subjectBreakdown = subjectBreakdown;
    }

    public List<DailyTrendDTO> getDailyTrends() {
        return dailyTrends;
    }

    public void setDailyTrends(List<DailyTrendDTO> dailyTrends) {
        this.dailyTrends = dailyTrends;
    }
}

