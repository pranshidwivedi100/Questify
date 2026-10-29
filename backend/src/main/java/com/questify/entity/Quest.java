package com.questify.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quests")
public class Quest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private QuestPriority priority = QuestPriority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private QuestStatus status = QuestStatus.PENDING;

    @Column(name = "base_xp", nullable = false)
    private Integer baseXp = 50;

    @Column(name = "due_at")
    private LocalDateTime dueAt;

    @Column(name = "estimated_minutes", nullable = false)
    private Integer estimatedMinutes = 30;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Quest() {
    }

    public Quest(User user, Subject subject, String title, String description,
                 QuestPriority priority, Integer baseXp, LocalDateTime dueAt, Integer estimatedMinutes) {
        this.user = user;
        this.subject = subject;
        this.title = title;
        this.description = description;
        this.priority = priority != null ? priority : QuestPriority.MEDIUM;
        this.status = QuestStatus.PENDING;
        this.baseXp = baseXp != null ? baseXp : 50;
        this.dueAt = dueAt;
        this.estimatedMinutes = (estimatedMinutes != null && estimatedMinutes > 0) ? estimatedMinutes : 30;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
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
}

