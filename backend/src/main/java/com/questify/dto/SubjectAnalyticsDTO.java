package com.questify.dto;

public class SubjectAnalyticsDTO {
    private Long subjectId;
    private String subjectName;
    private String colorHex;
    private Double targetHours;
    private Double completedHours;
    private long questCount;
    private long completedQuestCount;

    public SubjectAnalyticsDTO() {
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
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

    public Double getCompletedHours() {
        return completedHours;
    }

    public void setCompletedHours(Double completedHours) {
        this.completedHours = completedHours;
    }

    public long getQuestCount() {
        return questCount;
    }

    public void setQuestCount(long questCount) {
        this.questCount = questCount;
    }

    public long getCompletedQuestCount() {
        return completedQuestCount;
    }

    public void setCompletedQuestCount(long completedQuestCount) {
        this.completedQuestCount = completedQuestCount;
    }
}

