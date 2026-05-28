package com.careersync.repository;

import com.careersync.entity.SkillAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillAnalysisRepository extends JpaRepository<SkillAnalysis, Long> {
    List<SkillAnalysis> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<SkillAnalysis> findTopByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<SkillAnalysis> findByIdAndUserId(Long id, Long userId);
}
