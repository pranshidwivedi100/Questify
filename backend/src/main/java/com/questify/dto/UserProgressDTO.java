package com.questify.dto;

import java.time.LocalDate;

public class UserProgressDTO {
    private Long id;
    private Integer totalXp;
    private Integer currentLevel;
    private Integer currentStreak;
    private Integer longestStreak;
    private LocalDate lastActivityDate;
    private Integer currentLevelBaseXp;
    private Integer nextLevelBaseXp;
    private Integer xpIntoCurrentLevel;
    private Integer xpNeededForNextLevel;
    private Double progressPercent;

    public UserProgressDTO() {
    }

    public static UserProgressDTO fromEntity(com.questify.entity.UserProgress progress) {
        UserProgressDTO dto = new UserProgressDTO();
        dto.setId(progress.getId());
        dto.setTotalXp(progress.getTotalXp());
        dto.setCurrentLevel(progress.getCurrentLevel());
        dto.setCurrentStreak(progress.getCurrentStreak());
        dto.setLongestStreak(progress.getLongestStreak());
        dto.setLastActivityDate(progress.getLastActivityDate());

        int level = progress.getCurrentLevel();
        // Level formula: floor(0.1 * sqrt(xp)) + 1
        // xp for level L: 100 * (L - 1)^2
        int baseForCurrent = 100 * (level - 1) * (level - 1);
        int baseForNext = 100 * level * level;
        int xpIntoLevel = Math.max(0, progress.getTotalXp() - baseForCurrent);
        int xpSpan = Math.max(1, baseForNext - baseForCurrent);
        double percent = Math.min(100.0, ((double) xpIntoLevel / xpSpan) * 100.0);

        dto.setCurrentLevelBaseXp(baseForCurrent);
        dto.setNextLevelBaseXp(baseForNext);
        dto.setXpIntoCurrentLevel(xpIntoLevel);
        dto.setXpNeededForNextLevel(xpSpan);
        dto.setProgressPercent(Math.round(percent * 10.0) / 10.0);

        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getTotalXp() {
        return totalXp;
    }

    public void setTotalXp(Integer totalXp) {
        this.totalXp = totalXp;
    }

    public Integer getCurrentLevel() {
        return currentLevel;
    }

    public void setCurrentLevel(Integer currentLevel) {
        this.currentLevel = currentLevel;
    }

    public Integer getCurrentStreak() {
        return currentStreak;
    }

    public void setCurrentStreak(Integer currentStreak) {
        this.currentStreak = currentStreak;
    }

    public Integer getLongestStreak() {
        return longestStreak;
    }

    public void setLongestStreak(Integer longestStreak) {
        this.longestStreak = longestStreak;
    }

    public LocalDate getLastActivityDate() {
        return lastActivityDate;
    }

    public void setLastActivityDate(LocalDate lastActivityDate) {
        this.lastActivityDate = lastActivityDate;
    }

    public Integer getCurrentLevelBaseXp() {
        return currentLevelBaseXp;
    }

    public void setCurrentLevelBaseXp(Integer currentLevelBaseXp) {
        this.currentLevelBaseXp = currentLevelBaseXp;
    }

    public Integer getNextLevelBaseXp() {
        return nextLevelBaseXp;
    }

    public void setNextLevelBaseXp(Integer nextLevelBaseXp) {
        this.nextLevelBaseXp = nextLevelBaseXp;
    }

    public Integer getXpIntoCurrentLevel() {
        return xpIntoCurrentLevel;
    }

    public void setXpIntoCurrentLevel(Integer xpIntoCurrentLevel) {
        this.xpIntoCurrentLevel = xpIntoCurrentLevel;
    }

    public Integer getXpNeededForNextLevel() {
        return xpNeededForNextLevel;
    }

    public void setXpNeededForNextLevel(Integer xpNeededForNextLevel) {
        this.xpNeededForNextLevel = xpNeededForNextLevel;
    }

    public Double getProgressPercent() {
        return progressPercent;
    }

    public void setProgressPercent(Double progressPercent) {
        this.progressPercent = progressPercent;
    }
}

