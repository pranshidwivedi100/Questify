package com.questify.repository;

import com.questify.entity.Quest;
import com.questify.entity.QuestPriority;
import com.questify.entity.QuestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface QuestRepository extends JpaRepository<Quest, Long> {

    List<Quest> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Quest> findByIdAndUserId(Long id, Long userId);

    long countByUserId(Long userId);

    long countByUserIdAndStatus(Long userId, QuestStatus status);

    @Query("SELECT q FROM Quest q WHERE q.user.id = :userId " +
           "AND (:status IS NULL OR q.status = :status) " +
           "AND (:priority IS NULL OR q.priority = :priority) " +
           "AND (:subjectId IS NULL OR (q.subject IS NOT NULL AND q.subject.id = :subjectId)) " +
           "AND (:search IS NULL OR LOWER(q.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(q.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY CASE WHEN q.status = 'PENDING' THEN 1 WHEN q.status = 'IN_PROGRESS' THEN 2 ELSE 3 END, q.dueAt ASC NULLS LAST, q.createdAt DESC")
    List<Quest> findWithFilters(@Param("userId") Long userId,
                                @Param("status") QuestStatus status,
                                @Param("priority") QuestPriority priority,
                                @Param("subjectId") Long subjectId,
                                @Param("search") String search);

    List<Quest> findByUserIdAndDueAtBetween(Long userId, LocalDateTime start, LocalDateTime end);

    @Query("SELECT q FROM Quest q WHERE q.user.id = :userId AND q.dueAt IS NOT NULL AND q.status != 'COMPLETED' AND q.dueAt < :now")
    List<Quest> findOverdueQuests(@Param("userId") Long userId, @Param("now") LocalDateTime now);

    @Query("SELECT q FROM Quest q WHERE q.user.id = :userId AND q.completedAt >= :start AND q.completedAt <= :end")
    List<Quest> findCompletedBetween(@Param("userId") Long userId,
                                     @Param("start") LocalDateTime start,
                                     @Param("end") LocalDateTime end);
}

