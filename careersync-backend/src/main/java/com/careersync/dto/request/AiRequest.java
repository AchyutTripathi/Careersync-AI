package com.careersync.dto.request;

import com.careersync.entity.InterviewSession.DifficultyLevel;
import com.careersync.entity.InterviewSession.InterviewCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

public class AiRequest {

    @Data
    public static class JdMatch {
        @NotBlank(message = "Job description is required")
        private String jobDescription;
        private Long resumeId;
    }

    @Data
    public static class CoverLetter {
        @NotBlank(message = "Company name is required")
        private String companyName;

        @NotBlank(message = "Role is required")
        private String role;

        @NotBlank(message = "Experience summary is required")
        private String experience;

        private String additionalInfo;
        private Long resumeId;
    }

    @Data
    public static class SkillGap {
        @NotBlank(message = "Target role is required")
        private String targetRole;

        private String currentSkills;
        private Long resumeId;
    }

    @Data
    public static class MockInterview {
        @NotNull(message = "Category is required")
        private InterviewCategory category;

        private String roleContext;
        private DifficultyLevel difficultyLevel = DifficultyLevel.INTERMEDIATE;
        private Integer numberOfQuestions = 5;
    }

    @Data
    public static class InterviewFeedback {
        @NotNull(message = "Session ID is required")
        private Long sessionId;

        @NotBlank(message = "Answers are required")
        private String answers;
    }

    @Data
    public static class CareerRoadmapRequest {
        @NotBlank(message = "Target role is required")
        private String targetRole;

        private String currentRole;
        private Integer experienceYears;
        private String currentSkills;
    }

    @Data
    public static class ChatMessage {
        @NotBlank(message = "Message is required")
        private String message;

        private Long sessionId;
        private String context;
    }

    @Data
    public static class UpdateProfile {
        private String name;
        private String currentRole;
        private String targetRole;
        private Integer yearsExperience;
    }
}
