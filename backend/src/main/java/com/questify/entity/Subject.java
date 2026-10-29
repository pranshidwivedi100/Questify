package com.questify.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "subjects")
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "color_hex", nullable = false, length = 20)
    private String colorHex = "#8B5CF6";

    @Column(name = "target_hours", nullable = false)
    private Double targetHours = 10.0;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Subject() {
    }

    public Subject(User user, String name, String colorHex, Double targetHours) {
        this.user = user;
        this.name = name;
        this.colorHex = (colorHex != null && !colorHex.isBlank()) ? colorHex : "#8B5CF6";
        this.targetHours = (targetHours != null && targetHours > 0) ? targetHours : 10.0;
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
}

