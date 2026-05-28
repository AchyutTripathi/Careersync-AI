package com.careersync.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "career_roadmaps")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareerRoadmap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "target_role", nullable = false)
    private String targetRole;

    @Column(name = "current_role")
    private String currentRole;

    @Column(name = "roadmap_content", columnDefinition = "LONGTEXT")
    private String roadmapContent;

    @Column(columnDefinition = "TEXT")
    private String milestones;

    @Column(columnDefinition = "TEXT")
    private String technologies;

    @Column(columnDefinition = "TEXT")
    private String timeline;

    @Column(columnDefinition = "TEXT")
    private String projects;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
