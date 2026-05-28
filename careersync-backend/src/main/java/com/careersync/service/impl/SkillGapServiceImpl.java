package com.careersync.service.impl;

import com.careersync.ai.GeminiAiService;
import com.careersync.dto.request.AiRequest;
import com.careersync.dto.response.AiResponse;
import com.careersync.entity.SkillAnalysis;
import com.careersync.entity.User;
import com.careersync.exception.ResourceNotFoundException;
import com.careersync.repository.SkillAnalysisRepository;
import com.careersync.service.SkillGapService;
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
public class SkillGapServiceImpl implements SkillGapService {

    private final GeminiAiService        geminiAiService;
    private final SkillAnalysisRepository skillAnalysisRepository;
    private final SecurityUtils          securityUtils;
    private final ObjectMapper           objectMapper;

    @Override
    @Transactional
    public AiResponse.SkillGapResult analyzeSkillGap(AiRequest.SkillGap request) {
        User user = securityUtils.getCurrentUser();

        try {
            String aiResponse = geminiAiService.analyzeSkillGap(
                    request.getTargetRole(), request.getCurrentSkills()
            );
            String cleanJson = cleanJson(aiResponse);
            JsonNode node    = objectMapper.readTree(cleanJson);

            List<String> missingSkills     = toList(node.path("missingSkills"));
            List<String> recommendations   = toList(node.path("recommendations"));
            List<String> learningResources = toList(node.path("learningResources"));
            List<String> suggestedProjects = toList(node.path("suggestedProjects"));

            SkillAnalysis analysis = SkillAnalysis.builder()
                    .user(user)
                    .targetRole(request.getTargetRole())
                    .currentSkills(request.getCurrentSkills())
                    .missingSkills(String.join("\n", missingSkills))
                    .recommendations(String.join("\n", recommendations))
                    .learningResources(String.join("\n", learningResources))
                    .suggestedProjects(String.join("\n", suggestedProjects))
                    .build();

            analysis = skillAnalysisRepository.save(analysis);

            return AiResponse.SkillGapResult.builder()
                    .id(analysis.getId())
                    .targetRole(analysis.getTargetRole())
                    .missingSkills(missingSkills)
                    .recommendations(recommendations)
                    .learningResources(learningResources)
                    .suggestedProjects(suggestedProjects)
                    .createdAt(analysis.getCreatedAt())
                    .build();

        } catch (Exception e) {
            log.error("Skill gap analysis failed: {}", e.getMessage());
            throw new RuntimeException("Skill gap analysis failed: " + e.getMessage());
        }
    }

    @Override
    public List<SkillAnalysis> getAllAnalyses() {
        Long userId = securityUtils.getCurrentUserId();
        return skillAnalysisRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public SkillAnalysis getAnalysisById(Long id) {
        Long userId = securityUtils.getCurrentUserId();
        return skillAnalysisRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("SkillAnalysis", id));
    }

    @Override
    public SkillAnalysis getLatestAnalysis() {
        Long userId = securityUtils.getCurrentUserId();
        return skillAnalysisRepository.findTopByUserIdOrderByCreatedAtDesc(userId)
                .orElseThrow(() -> new ResourceNotFoundException("No skill analysis found"));
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
        if (node != null && node.isArray()) node.forEach(i -> list.add(i.asText()));
        return list;
    }
}
