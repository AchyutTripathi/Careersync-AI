package com.careersync.repository;

import com.careersync.entity.InterviewSession;
import com.careersync.entity.InterviewSession.InterviewCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InterviewSessionRepository extends JpaRepository<InterviewSession, Long> {
    List<InterviewSession> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<InterviewSession> findByUserIdAndCategory(Long userId, InterviewCategory category);
    Optional<InterviewSession> findByIdAndUserId(Long id, Long userId);
    long countByUserId(Long userId);
}
