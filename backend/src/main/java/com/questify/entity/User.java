package com.questify.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(length = 50)
    private String timezone = "UTC";

    @Column(name = "daily_goal_mins")
    private Integer dailyGoalMins = 60;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private UserProgress progress;

    public User() {
    }

    public User(String name, String email, String passwordHash, String timezone, Integer dailyGoalMins) {
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.timezone = (timezone != null && !timezone.isBlank()) ? timezone : "UTC";
        this.dailyGoalMins = (dailyGoalMins != null && dailyGoalMins > 0) ? dailyGoalMins : 60;
        this.createdAt = LocalDateTime.now();
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

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public UserProgress getProgress() {
        return progress;
    }

    public void setProgress(UserProgress progress) {
        this.progress = progress;
    }
}

