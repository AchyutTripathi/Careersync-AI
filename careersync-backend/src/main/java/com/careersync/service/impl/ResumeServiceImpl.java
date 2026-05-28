package com.careersync.service.impl;

import com.careersync.ai.GeminiAiService;
import com.careersync.dto.response.ResumeResponse;
import com.careersync.entity.Resume;
import com.careersync.entity.User;
import com.careersync.exception.BadRequestException;
import com.careersync.exception.ResourceNotFoundException;
import com.careersync.repository.ResumeRepository;
import com.careersync.service.ResumeService;
import com.careersync.utils.FileStorageUtils;
import com.careersync.utils.PdfExtractorUtils;
import com.careersync.utils.SecurityUtils;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeServiceImpl implements ResumeService {

    private final ResumeRepository  resumeRepository;
    private final SecurityUtils     securityUtils;
    private final FileStorageUtils  fileStorageUtils;
    private final PdfExtractorUtils pdfExtractorUtils;
    private final GeminiAiService   geminiAiService;
    private final ObjectMapper      objectMapper;

    @Override
    @Transactional
    public ResumeResponse uploadResume(MultipartFile file) {
        User user     = securityUtils.getCurrentUser();
        String stored = fileStorageUtils.storeFile(file);
        Path   path   = fileStorageUtils.getFilePath(stored);

        String extractedText;
        try {
            extractedText = pdfExtractorUtils.extractText(path);
        } catch (Exception e) {
            fileStorageUtils.deleteFile(stored);
            throw new BadRequestException("Could not extract text from PDF. Ensure it is a readable (non-scanned) PDF.");
        }

        Resume resume = Resume.builder()
                .user(user)
                .resumeUrl(stored)
                .originalFilename(file.getOriginalFilename())
                .extractedText(extractedText)
                .analysisStatus(Resume.AnalysisStatus.PENDING)
                .build();

        return ResumeResponse.from(resumeRepository.save(resume));
    }

    @Override
    @Transactional
    public ResumeResponse analyzeResume(Long resumeId) {
        User   user   = securityUtils.getCurrentUser();
        Resume resume = resumeRepository.findByIdAndUserId(resumeId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Resume", resumeId));

        if (resume.getExtractedText() == null || resume.getExtractedText().isBlank()) {
            throw new BadRequestException("Resume has no extractable text to analyze");
        }

        resume.setAnalysisStatus(Resume.AnalysisStatus.ANALYZING);
        resumeRepository.save(resume);

        try {
            String aiResponse = geminiAiService.analyzeResume(resume.getExtractedText());
            String cleanJson  = cleanJson(aiResponse);
            JsonNode node     = objectMapper.readTree(cleanJson);

            resume.setAtsScore(node.path("atsScore").asInt(0));
            resume.setSkills(joinArray(node.path("skills")));
            resume.setStrengths(joinArray(node.path("strengths")));
            resume.setWeaknesses(joinArray(node.path("weaknesses")));
            resume.setSuggestions(joinArray(node.path("suggestions")));
            resume.setAnalysisStatus(Resume.AnalysisStatus.COMPLETED);

        } catch (Exception e) {
            log.error("Resume analysis failed for id {}: {}", resumeId, e.getMessage());
            resume.setAnalysisStatus(Resume.AnalysisStatus.FAILED);
            resumeRepository.save(resume);
            throw new RuntimeException("AI analysis failed: " + e.getMessage());
        }

        return ResumeResponse.from(resumeRepository.save(resume));
    }

    @Override
    public List<ResumeResponse> getAllResumes() {
        Long userId = securityUtils.getCurrentUserId();
        return resumeRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(ResumeResponse::from).collect(Collectors.toList());
    }

    @Override
    public ResumeResponse getResumeById(Long resumeId) {
        Long userId = securityUtils.getCurrentUserId();
        Resume resume = resumeRepository.findByIdAndUserId(resumeId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume", resumeId));
        return ResumeResponse.from(resume);
    }

    @Override
    public ResumeResponse getLatestResume() {
        Long userId = securityUtils.getCurrentUserId();
        Resume resume = resumeRepository.findTopByUserIdOrderByCreatedAtDesc(userId)
                .orElseThrow(() -> new ResourceNotFoundException("No resume found for current user"));
        return ResumeResponse.from(resume);
    }

    @Override
    @Transactional
    public void deleteResume(Long resumeId) {
        Long   userId = securityUtils.getCurrentUserId();
        Resume resume = resumeRepository.findByIdAndUserId(resumeId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume", resumeId));
        fileStorageUtils.deleteFile(resume.getResumeUrl());
        resumeRepository.delete(resume);
    }

    @Override
    public String getResumeTextForCurrentUser() {
        Long userId = securityUtils.getCurrentUserId();
        return resumeRepository.findTopByUserIdOrderByCreatedAtDesc(userId)
                .map(Resume::getExtractedText)
                .orElse(null);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private String cleanJson(String raw) {
        if (raw == null) return "{}";
        raw = raw.trim();
        if (raw.startsWith("```json")) raw = raw.substring(7);
        else if (raw.startsWith("```"))     raw = raw.substring(3);
        if (raw.endsWith("```")) raw = raw.substring(0, raw.length() - 3);
        return raw.trim();
    }

    private String joinArray(JsonNode node) {
        if (node == null || node.isNull() || !node.isArray()) return "";
        StringBuilder sb = new StringBuilder();
        node.forEach(item -> {
            if (sb.length() > 0) sb.append("\n");
            sb.append(item.asText());
        });
        return sb.toString();
    }
}
