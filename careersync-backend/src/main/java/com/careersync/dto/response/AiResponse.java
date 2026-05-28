package com.careersync.dto.response;

import com.careersync.entity.CareerRoadmap;
import com.careersync.entity.InterviewSession;
import com.careersync.entity.SkillAnalysis;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

public class AiResponse {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class JdMatchResult {
        private Integer matchPercentage;
        private List<String> matchedKeywords;
        private List<String> missingKeywords;
        private String overallAssessment;
        private List<String> improvements;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CoverLetterResult {
        private String coverLetter;
        private String tone;
        private Integer wordCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillGapResult {
        private Long id;
        private String targetRole;
        private List<String> currentSkills;
        private List<String> missingSkills;
        private List<String> recommendations;
        private List<String> learningResources;
        private List<String> suggestedProjects;
        private LocalDateTime createdAt;

        public static SkillGapResult from(SkillAnalysis sa) {
            return SkillGapResult.builder()
                    .id(sa.getId())
                    .targetRole(sa.getTargetRole())
                    .createdAt(sa.getCreatedAt())
                    .build();
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InterviewSessionResult {
        private Long id;
        private String category;
        private String roleContext;
        private String difficultyLevel;
        private List<InterviewQuestion> questions;
        private LocalDateTime createdAt;

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class InterviewQuestion {
            private Integer number;
            private String question;
            private String hint;
            private String expectedTopics;
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InterviewFeedbackResult {
        private Long sessionId;
        private Integer overallScore;
        private String overallFeedback;
        private List<QuestionFeedback> questionFeedbacks;

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class QuestionFeedback {
            private Integer questionNumber;
            private String question;
            private String answer;
            private Integer score;
            private String feedback;
            private String strengths;
            private String improvements;
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CareerRoadmapResult {
        private Long id;
        private String targetRole;
        private String currentRole;
        private String roadmapContent;
        private List<Milestone> milestones;
        private List<String> technologies;
        private String timeline;
        private List<String> projects;
        private LocalDateTime createdAt;

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class Milestone {
            private Integer phase;
            private String title;
            private String description;
            private String duration;
            private List<String> skills;
        }

        public static CareerRoadmapResult from(CareerRoadmap cr) {
            return CareerRoadmapResult.builder()
                    .id(cr.getId())
                    .targetRole(cr.getTargetRole())
                    .currentRole(cr.getCurrentRole())
                    .roadmapContent(cr.getRoadmapContent())
                    .createdAt(cr.getCreatedAt())
                    .build();
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChatMessageResult {
        private Long sessionId;
        private String userMessage;
        private String aiResponse;
        private String sessionTitle;
        private LocalDateTime timestamp;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DashboardStats {
        private long totalResumes;
        private Integer latestAtsScore;
        private long totalApplications;
        private long activeApplications;
        private long interviewSessions;
        private long skillAnalyses;
        private java.util.Map<String, Long> applicationsByStatus;
    }
}
