package com.questify.dto;

import com.questify.entity.Quest;
import com.questify.entity.QuestPriority;
import com.questify.entity.QuestStatus;

import java.time.LocalDateTime;

public class QuestDTO {
    private Long id;
    private Long subjectId;
    private String subjectName;
    private String subjectColor;
    private String title;
    private String description;
    private QuestPriority priority;
    private QuestStatus status;
    private Integer baseXp;
    private LocalDateTime dueAt;
    private Integer estimatedMinutes;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private boolean overdue;

    public QuestDTO() {
    }

    public static QuestDTO fromEntity(Quest quest) {
        QuestDTO dto = new QuestDTO();
        dto.setId(quest.getId());
        if (quest.getSubject() != null) {
            dto.setSubjectId(quest.getSubject().getId());
            dto.setSubjectName(quest.getSubject().getName());
            dto.setSubjectColor(quest.getSubject().getColorHex());
        }
        dto.setTitle(quest.getTitle());
        dto.setDescription(quest.getDescription());
        dto.setPriority(quest.getPriority());
        dto.setStatus(quest.getStatus());
        dto.setBaseXp(quest.getBaseXp());
        dto.setDueAt(quest.getDueAt());
        dto.setEstimatedMinutes(quest.getEstimatedMinutes());
        dto.setCompletedAt(quest.getCompletedAt());
        dto.setCreatedAt(quest.getCreatedAt());

        if (quest.getDueAt() != null && quest.getStatus() != QuestStatus.COMPLETED) {
            dto.setOverdue(LocalDateTime.now().isAfter(quest.getDueAt()));
        } else {
            dto.setOverdue(false);
        }

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

    public QuestPriority getPriority() {
        return priority;
    }

    public void setPriority(QuestPriority priority) {
        this.priority = priority;
    }

    public QuestStatus getStatus() {
        return status;
    }

    public void setStatus(QuestStatus status) {
        this.status = status;
    }

    public Integer getBaseXp() {
        return baseXp;
    }

    public void setBaseXp(Integer baseXp) {
        this.baseXp = baseXp;
    }

    public LocalDateTime getDueAt() {
        return dueAt;
    }

    public void setDueAt(LocalDateTime dueAt) {
        this.dueAt = dueAt;
    }

    public Integer getEstimatedMinutes() {
        return estimatedMinutes;
    }

    public void setEstimatedMinutes(Integer estimatedMinutes) {
        this.estimatedMinutes = estimatedMinutes;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isOverdue() {
        return overdue;
    }

    public void setOverdue(boolean overdue) {
        this.overdue = overdue;
    }
}

