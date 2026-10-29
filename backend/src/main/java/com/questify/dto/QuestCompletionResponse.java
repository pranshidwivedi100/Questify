package com.questify.dto;

import java.util.ArrayList;
import java.util.List;

public class QuestCompletionResponse {
    private QuestDTO quest;
    private int xpAwarded;
    private boolean alreadyAwarded;
    private boolean levelUp;
    private int currentLevel;
    private int totalXp;
    private int currentStreak;
    private List<AchievementDTO> newlyUnlockedAchievements = new ArrayList<>();

    public QuestCompletionResponse() {
    }

    public QuestDTO getQuest() {
        return quest;
    }

    public void setQuest(QuestDTO quest) {
        this.quest = quest;
    }

    public int getXpAwarded() {
        return xpAwarded;
    }

    public void setXpAwarded(int xpAwarded) {
        this.xpAwarded = xpAwarded;
    }

    public boolean isAlreadyAwarded() {
        return alreadyAwarded;
    }

    public void setAlreadyAwarded(boolean alreadyAwarded) {
        this.alreadyAwarded = alreadyAwarded;
    }

    public boolean isLevelUp() {
        return levelUp;
    }

    public void setLevelUp(boolean levelUp) {
        this.levelUp = levelUp;
    }

    public int getCurrentLevel() {
        return currentLevel;
    }

    public void setCurrentLevel(int currentLevel) {
        this.currentLevel = currentLevel;
    }

    public int getTotalXp() {
        return totalXp;
    }

    public void setTotalXp(int totalXp) {
        this.totalXp = totalXp;
    }

    public int getCurrentStreak() {
        return currentStreak;
    }

    public void setCurrentStreak(int currentStreak) {
        this.currentStreak = currentStreak;
    }

    public List<AchievementDTO> getNewlyUnlockedAchievements() {
        return newlyUnlockedAchievements;
    }

    public void setNewlyUnlockedAchievements(List<AchievementDTO> newlyUnlockedAchievements) {
        this.newlyUnlockedAchievements = newlyUnlockedAchievements;
    }
}

