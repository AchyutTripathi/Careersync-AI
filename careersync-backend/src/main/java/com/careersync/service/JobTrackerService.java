package com.careersync.service;

import com.careersync.dto.request.JobApplicationRequest;
import com.careersync.dto.response.AiResponse;
import com.careersync.dto.response.JobApplicationResponse;

import java.util.List;

public interface JobTrackerService {
    JobApplicationResponse create(JobApplicationRequest.Create request);
    JobApplicationResponse update(Long id, JobApplicationRequest.Update request);
    void delete(Long id);
    List<JobApplicationResponse> getAll();
    JobApplicationResponse getById(Long id);
    AiResponse.DashboardStats getStats();
}
