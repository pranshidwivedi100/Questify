package com.questify.repository;

import com.questify.entity.FocusSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FocusSessionRepository extends JpaRepository<FocusSession, Long> {

    List<FocusSession> findByUserIdOrderByCompletedAtDesc(Long userId);

    List<FocusSession> findByUserIdAndCompletedAtBetween(Long userId, LocalDateTime start, LocalDateTime end);

    long countByUserId(Long userId);

    @Query("SELECT COALESCE(SUM(f.durationMinutes), 0) FROM FocusSession f WHERE f.user.id = :userId AND f.completedAt >= :start AND f.completedAt <= :end")
    int sumMinutesBetween(@Param("userId") Long userId,
                          @Param("start") LocalDateTime start,
                          @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(f.durationMinutes), 0) FROM FocusSession f WHERE f.user.id = :userId AND f.subject.id = :subjectId")
    int sumMinutesBySubject(@Param("userId") Long userId, @Param("subjectId") Long subjectId);
}

