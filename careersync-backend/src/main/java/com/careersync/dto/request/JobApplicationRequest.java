package com.careersync.dto.request;

import com.careersync.entity.JobApplication.ApplicationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

public class JobApplicationRequest {

    @Data
    public static class Create {
        @NotBlank(message = "Company name is required")
        private String companyName;

        @NotBlank(message = "Role is required")
        private String role;

        private ApplicationStatus status = ApplicationStatus.APPLIED;
        private LocalDate appliedDate;
        private String notes;
        private String jobUrl;
        private String salaryRange;
        private LocalDate interviewDate;
    }

    @Data
    public static class Update {
        private String companyName;
        private String role;
        private ApplicationStatus status;
        private LocalDate appliedDate;
        private String notes;
        private String jobUrl;
        private String salaryRange;
        private LocalDate interviewDate;
    }
}
