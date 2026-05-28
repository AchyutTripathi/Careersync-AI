package com.careersync.service.impl;

import com.careersync.ai.GeminiAiService;
import com.careersync.dto.request.AiRequest;
import com.careersync.dto.response.AiResponse;
import com.careersync.entity.Resume;
import com.careersync.exception.BadRequestException;
import com.careersync.exception.ResourceNotFoundException;
import com.careersync.repository.ResumeRepository;
import com.careersync.service.JdMatcherService;
import com.careersync.service.ResumeService;
import com.careersync.utils.SecurityUtils;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class JdMatcherServiceImpl implements JdMatcherService {

    private final GeminiAiService  geminiAiService;
    private final ResumeRepository resumeRepository;
    private final SecurityUtils    securityUtils;
    private final ObjectMapper     objectMapper;

    @Override
    public AiResponse.JdMatchResult matchJobDescription(AiRequest.JdMatch request) {
        Long userId = securityUtils.getCurrentUserId();

        String resumeText;
        if (request.getResumeId() != null) {
            resumeText = resumeRepository.findByIdAndUserId(request.getResumeId(), userId)
                    .map(Resume::getExtractedText)
                    .orElseThrow(() -> new ResourceNotFoundException("Resume", request.getResumeId()));
        } else {
            resumeText = resumeRepository.findTopByUserIdOrderByCreatedAtDesc(userId)
                    .map(Resume::getExtractedText)
                    .orElseThrow(() -> new BadRequestException("No resume found. Please upload a resume first."));
        }

        if (resumeText == null || resumeText.isBlank()) {
            throw new BadRequestException("Resume has no extractable text. Please re-upload your resume.");
        }

        try {
            String aiResponse = geminiAiService.matchJobDescription(resumeText, request.getJobDescription());
            String cleanJson  = cleanJson(aiResponse);
            JsonNode node     = objectMapper.readTree(cleanJson);

            return AiResponse.JdMatchResult.builder()
                    .matchPercentage(node.path("matchPercentage").asInt(0))
                    .matchedKeywords(toList(node.path("matchedKeywords")))
                    .missingKeywords(toList(node.path("missingKeywords")))
                    .overallAssessment(node.path("overallAssessment").asText(""))
                    .improvements(toList(node.path("improvements")))
                    .build();

        } catch (Exception e) {
            log.error("JD matching failed: {}", e.getMessage());
            throw new RuntimeException("JD analysis failed: " + e.getMessage());
        }
    }

    private String cleanJson(String raw) {
        if (raw == null) return "{}";
        raw = raw.trim();
        if (raw.startsWith("```json")) raw = raw.substring(7);
        else if (raw.startsWith("```")) raw = raw.substring(3);
        if (raw.endsWith("```")) raw = raw.substring(0, raw.length() - 3);
        return raw.trim();
    }

    private List<String> toList(JsonNode node) {
        List<String> list = new ArrayList<>();
        if (node != null && node.isArray()) {
            node.forEach(item -> list.add(item.asText()));
        }
        return list;
    }
}
