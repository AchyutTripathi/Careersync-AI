package com.careersync.service;

import com.careersync.dto.request.AiRequest;
import com.careersync.dto.response.AiResponse;
import com.careersync.entity.ChatHistory;

import java.util.List;

public interface ChatbotService {
    AiResponse.ChatMessageResult sendMessage(AiRequest.ChatMessage request);
    List<ChatHistory> getAllSessions();
    ChatHistory getSession(Long sessionId);
    void deleteSession(Long sessionId);
}
