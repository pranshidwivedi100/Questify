package com.questify.dto;

import com.questify.entity.Subject;

import java.time.LocalDateTime;

public class SubjectDTO {
    private Long id;
    private String name;
    private String colorHex;
    private Double targetHours;
    private LocalDateTime createdAt;
    private long totalQuests;
    private long completedQuests;
    private int totalMinutesStudied;

    public SubjectDTO() {
    }

    public static SubjectDTO fromEntity(Subject subject) {
        SubjectDTO dto = new SubjectDTO();
        dto.setId(subject.getId());
        dto.setName(subject.getName());
        dto.setColorHex(subject.getColorHex());
        dto.setTargetHours(subject.getTargetHours());
        dto.setCreatedAt(subject.getCreatedAt());
        return dto;
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

    public String getColorHex() {
        return colorHex;
    }

    public void setColorHex(String colorHex) {
        this.colorHex = colorHex;
    }

    public Double getTargetHours() {
        return targetHours;
    }

    public void setTargetHours(Double targetHours) {
        this.targetHours = targetHours;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
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

    public int getTotalMinutesStudied() {
        return totalMinutesStudied;
    }

    public void setTotalMinutesStudied(int totalMinutesStudied) {
        this.totalMinutesStudied = totalMinutesStudied;
    }
}

