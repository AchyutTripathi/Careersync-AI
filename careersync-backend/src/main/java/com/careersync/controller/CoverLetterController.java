package com.careersync.controller;

import com.careersync.dto.request.AiRequest;
import com.careersync.dto.response.AiResponse;
import com.careersync.dto.response.ApiResponse;
import com.careersync.service.CoverLetterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cover-letter")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Cover Letter", description = "AI-generated professional cover letters")
public class CoverLetterController {

    private final CoverLetterService coverLetterService;

    @Operation(
        summary = "Generate cover letter",
        description = "Generates a tailored cover letter using Gemini AI based on company, role, and your experience.",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            content = @Content(examples = @ExampleObject(value = """
                {
                  "companyName": "Google",
                  "role": "Senior Software Engineer",
                  "experience": "5 years of backend development with Java Spring Boot, microservices, and cloud platforms",
                  "additionalInfo": "I am passionate about Google's mission of organizing information"
                }
            """))
        )
    )
    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<AiResponse.CoverLetterResult>> generate(
            @Valid @RequestBody AiRequest.CoverLetter request) {
        AiResponse.CoverLetterResult result = coverLetterService.generateCoverLetter(request);
        return ResponseEntity.ok(ApiResponse.success("Cover letter generated", result));
    }
}
