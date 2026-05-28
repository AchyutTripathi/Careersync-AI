package com.careersync.service.impl;

import com.careersync.ai.GeminiAiService;
import com.careersync.dto.request.AiRequest;
import com.careersync.dto.response.AiResponse;
import com.careersync.entity.ChatHistory;
import com.careersync.entity.User;
import com.careersync.exception.ResourceNotFoundException;
import com.careersync.repository.ChatHistoryRepository;
import com.careersync.service.ChatbotService;
import com.careersync.service.ResumeService;
import com.careersync.utils.SecurityUtils;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatbotServiceImpl implements ChatbotService {

    private final GeminiAiService       geminiAiService;
    private final ChatHistoryRepository chatHistoryRepository;
    private final ResumeService         resumeService;
    private final SecurityUtils         securityUtils;
    private final ObjectMapper          objectMapper;

    @Override
    @Transactional
    public AiResponse.ChatMessageResult sendMessage(AiRequest.ChatMessage request) {
        User user = securityUtils.getCurrentUser();

        // Load or create session
        ChatHistory session;
        List<Map<String, String>> messages = new ArrayList<>();

        if (request.getSessionId() != null) {
            session = chatHistoryRepository.findByIdAndUserId(request.getSessionId(), user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("ChatSession", request.getSessionId()));
            try {
                messages = objectMapper.readValue(session.getMessages(), new TypeReference<>() {});
            } catch (Exception e) {
                messages = new ArrayList<>();
            }
        } else {
            session = ChatHistory.builder()
                    .user(user)
                    .title(generateTitle(request.getMessage()))
                    .messages("[]")
                    .build();
        }

        // Build conversation history string for context
        StringBuilder historyBuilder = new StringBuilder();
        for (Map<String, String> msg : messages) {
            historyBuilder.append(msg.get("role")).append(": ").append(msg.get("content")).append("\n");
        }

        // Get resume context if available
        String resumeContext = null;
        try {
            resumeContext = resumeService.getResumeTextForCurrentUser();
        } catch (Exception ignored) {}

        // Call Gemini
        String aiReply = geminiAiService.chatWithCareerAdvisor(
                request.getMessage(),
                historyBuilder.toString(),
                resumeContext
        );

        // Append to messages
        Map<String, String> userMsg = new HashMap<>();
        userMsg.put("role", "user");
        userMsg.put("content", request.getMessage());
        userMsg.put("timestamp", LocalDateTime.now().toString());
        messages.add(userMsg);

        Map<String, String> aiMsg = new HashMap<>();
        aiMsg.put("role", "assistant");
        aiMsg.put("content", aiReply);
        aiMsg.put("timestamp", LocalDateTime.now().toString());
        messages.add(aiMsg);

        try {
            session.setMessages(objectMapper.writeValueAsString(messages));
        } catch (Exception e) {
            session.setMessages("[]");
        }

        session = chatHistoryRepository.save(session);

        return AiResponse.ChatMessageResult.builder()
                .sessionId(session.getId())
                .userMessage(request.getMessage())
                .aiResponse(aiReply)
                .sessionTitle(session.getTitle())
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Override
    public List<ChatHistory> getAllSessions() {
        return chatHistoryRepository.findByUserIdOrderByUpdatedAtDesc(securityUtils.getCurrentUserId());
    }

    @Override
    public ChatHistory getSession(Long sessionId) {
        Long userId = securityUtils.getCurrentUserId();
        return chatHistoryRepository.findByIdAndUserId(sessionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("ChatSession", sessionId));
    }

    @Override
    @Transactional
    public void deleteSession(Long sessionId) {
        Long userId = securityUtils.getCurrentUserId();
        chatHistoryRepository.findByIdAndUserId(sessionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("ChatSession", sessionId));
        chatHistoryRepository.deleteByIdAndUserId(sessionId, userId);
    }

    private String generateTitle(String firstMessage) {
        int maxLen = Math.min(firstMessage.length(), 50);
        String title = firstMessage.substring(0, maxLen);
        return title.length() < firstMessage.length() ? title + "…" : title;
    }
}
