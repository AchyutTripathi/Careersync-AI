package com.careersync.service.impl;

import com.careersync.dto.request.JobApplicationRequest;
import com.careersync.dto.response.AiResponse;
import com.careersync.dto.response.JobApplicationResponse;
import com.careersync.entity.JobApplication;
import com.careersync.entity.JobApplication.ApplicationStatus;
import com.careersync.entity.User;
import com.careersync.exception.ResourceNotFoundException;
import com.careersync.repository.*;
import com.careersync.service.JobTrackerService;
import com.careersync.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobTrackerServiceImpl implements JobTrackerService {

    private final JobApplicationRepository jobRepo;
    private final ResumeRepository         resumeRepo;
    private final InterviewSessionRepository interviewRepo;
    private final SkillAnalysisRepository  skillRepo;
    private final SecurityUtils            securityUtils;

    @Override
    @Transactional
    public JobApplicationResponse create(JobApplicationRequest.Create request) {
        User user = securityUtils.getCurrentUser();
        JobApplication app = JobApplication.builder()
                .user(user)
                .companyName(request.getCompanyName())
                .role(request.getRole())
                .status(request.getStatus() != null ? request.getStatus() : ApplicationStatus.APPLIED)
                .appliedDate(request.getAppliedDate())
                .notes(request.getNotes())
                .jobUrl(request.getJobUrl())
                .salaryRange(request.getSalaryRange())
                .interviewDate(request.getInterviewDate())
                .build();
        return JobApplicationResponse.from(jobRepo.save(app));
    }

    @Override
    @Transactional
    public JobApplicationResponse update(Long id, JobApplicationRequest.Update request) {
        Long userId = securityUtils.getCurrentUserId();
        JobApplication app = jobRepo.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("JobApplication", id));

        if (request.getCompanyName()  != null) app.setCompanyName(request.getCompanyName());
        if (request.getRole()         != null) app.setRole(request.getRole());
        if (request.getStatus()       != null) app.setStatus(request.getStatus());
        if (request.getAppliedDate()  != null) app.setAppliedDate(request.getAppliedDate());
        if (request.getNotes()        != null) app.setNotes(request.getNotes());
        if (request.getJobUrl()       != null) app.setJobUrl(request.getJobUrl());
        if (request.getSalaryRange()  != null) app.setSalaryRange(request.getSalaryRange());
        if (request.getInterviewDate()!= null) app.setInterviewDate(request.getInterviewDate());

        return JobApplicationResponse.from(jobRepo.save(app));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Long userId = securityUtils.getCurrentUserId();
        JobApplication app = jobRepo.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("JobApplication", id));
        jobRepo.delete(app);
    }

    @Override
    public List<JobApplicationResponse> getAll() {
        Long userId = securityUtils.getCurrentUserId();
        return jobRepo.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(JobApplicationResponse::from).collect(Collectors.toList());
    }

    @Override
    public JobApplicationResponse getById(Long id) {
        Long userId = securityUtils.getCurrentUserId();
        return JobApplicationResponse.from(
                jobRepo.findByIdAndUserId(id, userId)
                        .orElseThrow(() -> new ResourceNotFoundException("JobApplication", id))
        );
    }

    @Override
    public AiResponse.DashboardStats getStats() {
        Long userId = securityUtils.getCurrentUserId();

        long totalResumes      = resumeRepo.countByUserId(userId);
        long totalApplications = jobRepo.countByUserId(userId);
        long interviewSessions = interviewRepo.countByUserId(userId);
        long skillAnalyses     = skillRepo.findByUserIdOrderByCreatedAtDesc(userId).size();
        long activeApplications= jobRepo.countByUserIdAndStatus(userId, ApplicationStatus.INTERVIEW)
                               + jobRepo.countByUserIdAndStatus(userId, ApplicationStatus.PHONE_SCREEN)
                               + jobRepo.countByUserIdAndStatus(userId, ApplicationStatus.APPLIED);

        Integer latestAtsScore = resumeRepo.findTopByUserIdOrderByCreatedAtDesc(userId)
                .map(r -> r.getAtsScore()).orElse(null);

        // Application breakdown by status
        Map<String, Long> byStatus = new LinkedHashMap<>();
        List<Object[]> statusCounts = jobRepo.countByStatusForUser(userId);
        for (Object[] row : statusCounts) {
            byStatus.put(row[0].toString(), (Long) row[1]);
        }

        return AiResponse.DashboardStats.builder()
                .totalResumes(totalResumes)
                .latestAtsScore(latestAtsScore)
                .totalApplications(totalApplications)
                .activeApplications(activeApplications)
                .interviewSessions(interviewSessions)
                .skillAnalyses(skillAnalyses)
                .applicationsByStatus(byStatus)
                .build();
    }
}
