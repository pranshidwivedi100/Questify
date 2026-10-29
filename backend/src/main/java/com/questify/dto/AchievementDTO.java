package com.questify.dto;

import com.questify.entity.Achievement;
import com.questify.entity.UserAchievement;

import java.time.LocalDateTime;

public class AchievementDTO {
    private Long id;
    private String code;
    private String title;
    private String description;
    private String iconName;
    private Integer xpReward;
    private boolean unlocked;
    private LocalDateTime unlockedAt;

    public AchievementDTO() {
    }

    public static AchievementDTO fromEntity(Achievement a, UserAchievement ua) {
        AchievementDTO dto = new AchievementDTO();
        dto.setId(a.getId());
        dto.setCode(a.getCode());
        dto.setTitle(a.getTitle());
        dto.setDescription(a.getDescription());
        dto.setIconName(a.getIconName());
        dto.setXpReward(a.getXpReward());
        if (ua != null) {
            dto.setUnlocked(true);
            dto.setUnlockedAt(ua.getUnlockedAt());
        } else {
            dto.setUnlocked(false);
            dto.setUnlockedAt(null);
        }
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIconName() {
        return iconName;
    }

    public void setIconName(String iconName) {
        this.iconName = iconName;
    }

    public Integer getXpReward() {
        return xpReward;
    }

    public void setXpReward(Integer xpReward) {
        this.xpReward = xpReward;
    }

    public boolean isUnlocked() {
        return unlocked;
    }

    public void setUnlocked(boolean unlocked) {
        this.unlocked = unlocked;
    }

    public LocalDateTime getUnlockedAt() {
        return unlockedAt;
    }

    public void setUnlockedAt(LocalDateTime unlockedAt) {
        this.unlockedAt = unlockedAt;
    }
}

