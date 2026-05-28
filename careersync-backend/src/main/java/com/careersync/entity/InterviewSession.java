package com.careersync.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "interview_sessions")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InterviewCategory category;

    @Column(columnDefinition = "LONGTEXT")
    private String questions;

    @Column(columnDefinition = "LONGTEXT")
    private String answers;

    @Column(columnDefinition = "LONGTEXT")
    private String feedback;

    @Column(name = "overall_score")
    private Integer overallScore;

    @Column(name = "role_context")
    private String roleContext;

    @Column(name = "difficulty_level")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private DifficultyLevel difficultyLevel = DifficultyLevel.INTERMEDIATE;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum InterviewCategory {
        HR, DSA, BACKEND, FRONTEND, SYSTEM_DESIGN, BEHAVIORAL, MIXED
    }

    public enum DifficultyLevel {
        BEGINNER, INTERMEDIATE, ADVANCED
    }
}
