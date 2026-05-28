package com.careersync.service.impl;

import com.careersync.ai.GeminiAiService;
import com.careersync.dto.request.AiRequest;
import com.careersync.dto.response.AiResponse;
import com.careersync.entity.InterviewSession;
import com.careersync.entity.User;
import com.careersync.exception.ResourceNotFoundException;
import com.careersync.repository.InterviewSessionRepository;
import com.careersync.service.InterviewService;
import com.careersync.utils.SecurityUtils;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class InterviewServiceImpl implements InterviewService {

    private final GeminiAiService          geminiAiService;
    private final InterviewSessionRepository sessionRepository;
    private final SecurityUtils            securityUtils;
    private final ObjectMapper             objectMapper;

    @Override
    @Transactional
    public AiResponse.InterviewSessionResult generateInterview(AiRequest.MockInterview request) {
        User user = securityUtils.getCurrentUser();

        try {
            String aiResponse = geminiAiService.generateInterviewQuestions(
                    request.getCategory().name(),
                    request.getDifficultyLevel().name(),
                    request.getRoleContext(),
                    request.getNumberOfQuestions()
            );

            String cleanJson = cleanJson(aiResponse);
            JsonNode root    = objectMapper.readTree(cleanJson);
            JsonNode qNodes  = root.path("questions");

            List<AiResponse.InterviewSessionResult.InterviewQuestion> questions = new ArrayList<>();
            for (JsonNode q : qNodes) {
                questions.add(AiResponse.InterviewSessionResult.InterviewQuestion.builder()
                        .number(q.path("number").asInt())
                        .question(q.path("question").asText())
                        .hint(q.path("hint").asText(""))
                        .expectedTopics(q.path("expectedTopics").asText(""))
                        .build());
            }

            String questionsJson = objectMapper.writeValueAsString(questions);
            InterviewSession session = InterviewSession.builder()
                    .user(user)
                    .category(request.getCategory())
                    .difficultyLevel(request.getDifficultyLevel())
                    .roleContext(request.getRoleContext())
                    .questions(questionsJson)
                    .build();

            session = sessionRepository.save(session);

            return AiResponse.InterviewSessionResult.builder()
                    .id(session.getId())
                    .category(session.getCategory().name())
                    .difficultyLevel(session.getDifficultyLevel().name())
                    .roleContext(session.getRoleContext())
                    .questions(questions)
                    .createdAt(session.getCreatedAt())
                    .build();

        } catch (Exception e) {
            log.error("Interview generation failed: {}", e.getMessage());
            throw new RuntimeException("Interview generation failed: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public AiResponse.InterviewFeedbackResult generateFeedback(AiRequest.InterviewFeedback request) {
        Long userId = securityUtils.getCurrentUserId();
        InterviewSession session = sessionRepository.findByIdAndUserId(request.getSessionId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("InterviewSession", request.getSessionId()));

        try {
            String aiResponse = geminiAiService.generateInterviewFeedback(
                    request.getAnswers(), session.getCategory().name()
            );

            String cleanJson = cleanJson(aiResponse);
            JsonNode root    = objectMapper.readTree(cleanJson);

            int overallScore    = root.path("overallScore").asInt(0);
            String overallFeedback = root.path("overallFeedback").asText("");
            JsonNode fbNodes    = root.path("questionFeedbacks");

            List<AiResponse.InterviewFeedbackResult.QuestionFeedback> feedbacks = new ArrayList<>();
            for (JsonNode fb : fbNodes) {
                feedbacks.add(AiResponse.InterviewFeedbackResult.QuestionFeedback.builder()
                        .questionNumber(fb.path("questionNumber").asInt())
                        .question(fb.path("question").asText())
                        .answer(fb.path("answer").asText())
                        .score(fb.path("score").asInt(0))
                        .feedback(fb.path("feedback").asText())
                        .strengths(fb.path("strengths").asText())
                        .improvements(fb.path("improvements").asText())
                        .build());
            }

            session.setAnswers(request.getAnswers());
            session.setFeedback(aiResponse);
            session.setOverallScore(overallScore);
            sessionRepository.save(session);

            return AiResponse.InterviewFeedbackResult.builder()
                    .sessionId(session.getId())
                    .overallScore(overallScore)
                    .overallFeedback(overallFeedback)
                    .questionFeedbacks(feedbacks)
                    .build();

        } catch (Exception e) {
            log.error("Interview feedback failed: {}", e.getMessage());
            throw new RuntimeException("Interview feedback generation failed: " + e.getMessage());
        }
    }

    @Override
    public List<InterviewSession> getAllSessions() {
        return sessionRepository.findByUserIdOrderByCreatedAtDesc(securityUtils.getCurrentUserId());
    }

    @Override
    public InterviewSession getSessionById(Long id) {
        Long userId = securityUtils.getCurrentUserId();
        return sessionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("InterviewSession", id));
    }

    @Override
    @Transactional
    public void deleteSession(Long id) {
        Long userId = securityUtils.getCurrentUserId();
        InterviewSession session = sessionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("InterviewSession", id));
        sessionRepository.delete(session);
    }

    private String cleanJson(String raw) {
        if (raw == null) return "{}";
        raw = raw.trim();
        if (raw.startsWith("```json")) raw = raw.substring(7);
        else if (raw.startsWith("```")) raw = raw.substring(3);
        if (raw.endsWith("```")) raw = raw.substring(0, raw.length() - 3);
        return raw.trim();
    }
}
