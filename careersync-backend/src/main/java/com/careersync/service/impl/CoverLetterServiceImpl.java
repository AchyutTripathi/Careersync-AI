package com.careersync.service.impl;

import com.careersync.ai.GeminiAiService;
import com.careersync.dto.request.AiRequest;
import com.careersync.dto.response.AiResponse;
import com.careersync.service.CoverLetterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CoverLetterServiceImpl implements CoverLetterService {

    private final GeminiAiService geminiAiService;

    @Override
    public AiResponse.CoverLetterResult generateCoverLetter(AiRequest.CoverLetter request) {
        try {
            String content = geminiAiService.generateCoverLetter(
                    request.getCompanyName(),
                    request.getRole(),
                    request.getExperience(),
                    request.getAdditionalInfo()
            );

            int wordCount = content.trim().split("\\s+").length;

            return AiResponse.CoverLetterResult.builder()
                    .coverLetter(content.trim())
                    .tone("Professional")
                    .wordCount(wordCount)
                    .build();

        } catch (Exception e) {
            log.error("Cover letter generation failed: {}", e.getMessage());
            throw new RuntimeException("Cover letter generation failed: " + e.getMessage());
        }
    }
}
