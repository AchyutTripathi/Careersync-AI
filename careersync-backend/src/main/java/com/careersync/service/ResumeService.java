package com.careersync.service;

import com.careersync.dto.response.ResumeResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ResumeService {
    ResumeResponse uploadResume(MultipartFile file);
    ResumeResponse analyzeResume(Long resumeId);
    List<ResumeResponse> getAllResumes();
    ResumeResponse getResumeById(Long resumeId);
    ResumeResponse getLatestResume();
    void deleteResume(Long resumeId);
    String getResumeTextForCurrentUser();
}
