package com.questify.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "xp_transactions",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_xp_transaction", columnNames = {"user_id", "source_type", "source_id"})
    }
)
public class XpTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "source_type", nullable = false, length = 50)
    private String sourceType;

    @Column(name = "source_id", nullable = false)
    private Long sourceId;

    @Column(name = "xp_awarded", nullable = false)
    private Integer xpAwarded;

    @Column(name = "earned_at", updatable = false)
    private LocalDateTime earnedAt = LocalDateTime.now();

    public XpTransaction() {
    }

    public XpTransaction(User user, String sourceType, Long sourceId, Integer xpAwarded) {
        this.user = user;
        this.sourceType = sourceType;
        this.sourceId = sourceId;
        this.xpAwarded = xpAwarded;
        this.earnedAt = LocalDateTime.now();
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

    public String getSourceType() {
        return sourceType;
    }

    public void setSourceType(String sourceType) {
        this.sourceType = sourceType;
    }

    public Long getSourceId() {
        return sourceId;
    }

    public void setSourceId(Long sourceId) {
        this.sourceId = sourceId;
    }

    public Integer getXpAwarded() {
        return xpAwarded;
    }

    public void setXpAwarded(Integer xpAwarded) {
        this.xpAwarded = xpAwarded;
    }

    public LocalDateTime getEarnedAt() {
        return earnedAt;
    }

    public void setEarnedAt(LocalDateTime earnedAt) {
        this.earnedAt = earnedAt;
    }
}

