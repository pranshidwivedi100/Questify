package com.questify.dto;

import java.time.LocalDate;

public class DailyTrendDTO {
    private LocalDate date;
    private String dayOfWeek;
    private int focusMinutes;
    private int xpEarned;
    private int completedQuests;

    public DailyTrendDTO() {
    }

    public DailyTrendDTO(LocalDate date, String dayOfWeek, int focusMinutes, int xpEarned, int completedQuests) {
        this.date = date;
        this.dayOfWeek = dayOfWeek;
        this.focusMinutes = focusMinutes;
        this.xpEarned = xpEarned;
        this.completedQuests = completedQuests;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public int getFocusMinutes() {
        return focusMinutes;
    }

    public void setFocusMinutes(int focusMinutes) {
        this.focusMinutes = focusMinutes;
    }

    public int getXpEarned() {
        return xpEarned;
    }

    public void setXpEarned(int xpEarned) {
        this.xpEarned = xpEarned;
    }

    public int getCompletedQuests() {
        return completedQuests;
    }

    public void setCompletedQuests(int completedQuests) {
        this.completedQuests = completedQuests;
    }
}

