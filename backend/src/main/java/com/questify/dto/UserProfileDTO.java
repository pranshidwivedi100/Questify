package com.questify.dto;

public class UserProfileDTO {
    private Long id;
    private String name;
    private String email;
    private String timezone;
    private Integer dailyGoalMins;
    private UserProgressDTO progress;

    public UserProfileDTO() {
    }

    public UserProfileDTO(Long id, String name, String email, String timezone, Integer dailyGoalMins, UserProgressDTO progress) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.timezone = timezone;
        this.dailyGoalMins = dailyGoalMins;
        this.progress = progress;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public Integer getDailyGoalMins() {
        return dailyGoalMins;
    }

    public void setDailyGoalMins(Integer dailyGoalMins) {
        this.dailyGoalMins = dailyGoalMins;
    }

    public UserProgressDTO getProgress() {
        return progress;
    }

    public void setProgress(UserProgressDTO progress) {
        this.progress = progress;
    }
}

