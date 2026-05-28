package com.careersync.service;

import com.careersync.dto.request.AiRequest;
import com.careersync.dto.response.AiResponse;
import com.careersync.entity.InterviewSession;

import java.util.List;

public interface InterviewService {
    AiResponse.InterviewSessionResult generateInterview(AiRequest.MockInterview request);
    AiResponse.InterviewFeedbackResult generateFeedback(AiRequest.InterviewFeedback request);
    List<InterviewSession> getAllSessions();
    InterviewSession getSessionById(Long id);
    void deleteSession(Long id);
}
