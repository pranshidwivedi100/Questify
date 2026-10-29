package com.questify.dto;

import com.questify.entity.QuestPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class CreateQuestRequest {

    private Long subjectId;

    @NotBlank(message = "Title is required")
    @Size(min = 1, max = 255, message = "Title must be between 1 and 255 characters")
    private String title;

    private String description;
    private QuestPriority priority = QuestPriority.MEDIUM;

    @Positive(message = "Base XP must be positive")
    private Integer baseXp = 50;

    private LocalDateTime dueAt;

    @Positive(message = "Estimated minutes must be positive")
    private Integer estimatedMinutes = 30;

    public CreateQuestRequest() {
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
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
}

