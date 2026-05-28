package com.careersync.service.impl;

import com.careersync.ai.GeminiAiService;
import com.careersync.dto.request.AiRequest;
import com.careersync.dto.response.AiResponse;
import com.careersync.entity.CareerRoadmap;
import com.careersync.entity.User;
import com.careersync.exception.ResourceNotFoundException;
import com.careersync.repository.CareerRoadmapRepository;
import com.careersync.service.CareerRoadmapService;
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
public class CareerRoadmapServiceImpl implements CareerRoadmapService {

    private final GeminiAiService         geminiAiService;
    private final CareerRoadmapRepository roadmapRepository;
    private final SecurityUtils           securityUtils;
    private final ObjectMapper            objectMapper;

    @Override
    @Transactional
    public AiResponse.CareerRoadmapResult generateRoadmap(AiRequest.CareerRoadmapRequest request) {
        User user = securityUtils.getCurrentUser();

        try {
            String aiResponse = geminiAiService.generateCareerRoadmap(
                    request.getTargetRole(),
                    request.getCurrentRole(),
                    request.getExperienceYears(),
                    request.getCurrentSkills()
            );

            String cleanJson = cleanJson(aiResponse);
            JsonNode root    = objectMapper.readTree(cleanJson);

            String roadmapContent = root.path("roadmapContent").asText("");
            String timeline       = root.path("timeline").asText("");
            List<String> techs    = toList(root.path("technologies"));
            List<String> projects = toList(root.path("projects"));

            // Parse milestones
            List<AiResponse.CareerRoadmapResult.Milestone> milestones = new ArrayList<>();
            JsonNode msNodes = root.path("milestones");
            for (JsonNode ms : msNodes) {
                milestones.add(AiResponse.CareerRoadmapResult.Milestone.builder()
                        .phase(ms.path("phase").asInt())
                        .title(ms.path("title").asText())
                        .description(ms.path("description").asText())
                        .duration(ms.path("duration").asText())
                        .skills(toList(ms.path("skills")))
                        .build());
            }

            CareerRoadmap roadmap = CareerRoadmap.builder()
                    .user(user)
                    .targetRole(request.getTargetRole())
                    .currentRole(request.getCurrentRole())
                    .roadmapContent(roadmapContent)
                    .milestones(objectMapper.writeValueAsString(milestones))
                    .technologies(String.join("\n", techs))
                    .timeline(timeline)
                    .projects(String.join("\n", projects))
                    .experienceYears(request.getExperienceYears())
                    .build();

            roadmap = roadmapRepository.save(roadmap);

            return AiResponse.CareerRoadmapResult.builder()
                    .id(roadmap.getId())
                    .targetRole(roadmap.getTargetRole())
                    .currentRole(roadmap.getCurrentRole())
                    .roadmapContent(roadmapContent)
                    .milestones(milestones)
                    .technologies(techs)
                    .timeline(timeline)
                    .projects(projects)
                    .createdAt(roadmap.getCreatedAt())
                    .build();

        } catch (Exception e) {
            log.error("Roadmap generation failed: {}", e.getMessage());
            throw new RuntimeException("Roadmap generation failed: " + e.getMessage());
        }
    }

    @Override
    public List<CareerRoadmap> getAllRoadmaps() {
        return roadmapRepository.findByUserIdOrderByCreatedAtDesc(securityUtils.getCurrentUserId());
    }

    @Override
    public CareerRoadmap getRoadmapById(Long id) {
        Long userId = securityUtils.getCurrentUserId();
        return roadmapRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("CareerRoadmap", id));
    }

    @Override
    public CareerRoadmap getLatestRoadmap() {
        Long userId = securityUtils.getCurrentUserId();
        return roadmapRepository.findTopByUserIdOrderByCreatedAtDesc(userId)
                .orElseThrow(() -> new ResourceNotFoundException("No roadmap found"));
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
