package com.questify.dto;

import com.questify.entity.FocusSession;

import java.time.LocalDateTime;

public class FocusSessionDTO {
    private Long id;
    private Long subjectId;
    private String subjectName;
    private String subjectColor;
    private Long questId;
    private String questTitle;
    private Integer durationMinutes;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private Integer xpEarned;

    public FocusSessionDTO() {
    }

    public static FocusSessionDTO fromEntity(FocusSession session) {
        FocusSessionDTO dto = new FocusSessionDTO();
        dto.setId(session.getId());
        if (session.getSubject() != null) {
            dto.setSubjectId(session.getSubject().getId());
            dto.setSubjectName(session.getSubject().getName());
            dto.setSubjectColor(session.getSubject().getColorHex());
        }
        if (session.getQuest() != null) {
            dto.setQuestId(session.getQuest().getId());
            dto.setQuestTitle(session.getQuest().getTitle());
        }
        dto.setDurationMinutes(session.getDurationMinutes());
        dto.setStartedAt(session.getStartedAt());
        dto.setCompletedAt(session.getCompletedAt());
        dto.setXpEarned(session.getXpEarned());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getSubjectColor() {
        return subjectColor;
    }

    public void setSubjectColor(String subjectColor) {
        this.subjectColor = subjectColor;
    }

    public Long getQuestId() {
        return questId;
    }

    public void setQuestId(Long questId) {
        this.questId = questId;
    }

    public String getQuestTitle() {
        return questTitle;
    }

    public void setQuestTitle(String questTitle) {
        this.questTitle = questTitle;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public Integer getXpEarned() {
        return xpEarned;
    }

    public void setXpEarned(Integer xpEarned) {
        this.xpEarned = xpEarned;
    }
}

