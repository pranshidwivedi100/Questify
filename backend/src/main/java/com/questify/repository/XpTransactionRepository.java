package com.questify.repository;

import com.questify.entity.XpTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface XpTransactionRepository extends JpaRepository<XpTransaction, Long> {

    boolean existsByUserIdAndSourceTypeAndSourceId(Long userId, String sourceType, Long sourceId);

    List<XpTransaction> findByUserIdOrderByEarnedAtDesc(Long userId);

    @Query("SELECT COALESCE(SUM(x.xpAwarded), 0) FROM XpTransaction x WHERE x.user.id = :userId AND x.earnedAt >= :start AND x.earnedAt <= :end")
    int sumXpEarnedBetween(@Param("userId") Long userId,
                           @Param("start") LocalDateTime start,
                           @Param("end") LocalDateTime end);

    @Query("SELECT x FROM XpTransaction x WHERE x.user.id = :userId AND x.earnedAt >= :start AND x.earnedAt <= :end ORDER BY x.earnedAt ASC")
    List<XpTransaction> findByUserIdAndEarnedAtBetween(@Param("userId") Long userId,
                                                      @Param("start") LocalDateTime start,
                                                      @Param("end") LocalDateTime end);
}

