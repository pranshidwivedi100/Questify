package com.questify.dto;

public class UserSummaryDTO {
    private Long id;
    private String name;
    private String email;
    private String timezone;
    private Integer dailyGoalMins;

    public UserSummaryDTO() {
    }

    public UserSummaryDTO(Long id, String name, String email, String timezone, Integer dailyGoalMins) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.timezone = timezone;
        this.dailyGoalMins = dailyGoalMins;
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
}

