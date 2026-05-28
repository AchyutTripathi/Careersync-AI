package com.careersync.dto.response;

import com.careersync.entity.JobApplication;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobApplicationResponse {

    private Long id;
    private String companyName;
    private String role;
    private String status;
    private LocalDate appliedDate;
    private String notes;
    private String jobUrl;
    private String salaryRange;
    private LocalDate interviewDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static JobApplicationResponse from(JobApplication app) {
        return JobApplicationResponse.builder()
                .id(app.getId())
                .companyName(app.getCompanyName())
                .role(app.getRole())
                .status(app.getStatus().name())
                .appliedDate(app.getAppliedDate())
                .notes(app.getNotes())
                .jobUrl(app.getJobUrl())
                .salaryRange(app.getSalaryRange())
                .interviewDate(app.getInterviewDate())
                .createdAt(app.getCreatedAt())
                .updatedAt(app.getUpdatedAt())
                .build();
    }
}
