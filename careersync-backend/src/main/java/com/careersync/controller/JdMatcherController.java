package com.careersync.controller;

import com.careersync.dto.request.AiRequest;
import com.careersync.dto.response.AiResponse;
import com.careersync.dto.response.ApiResponse;
import com.careersync.service.JdMatcherService;
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
@RequestMapping("/jd")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "JD Matcher", description = "Compare resume against job descriptions")
public class JdMatcherController {

    private final JdMatcherService jdMatcherService;

    @Operation(
        summary = "Match resume with job description",
        description = "Analyzes how well your resume matches a job description. Returns match %, matched/missing keywords, and improvement suggestions.",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            content = @Content(examples = @ExampleObject(value = """
                {
                  "jobDescription": "We are looking for a Senior Java Developer with 5+ years experience in Spring Boot...",
                  "resumeId": null
                }
            """))
        )
    )
    @PostMapping("/match")
    public ResponseEntity<ApiResponse<AiResponse.JdMatchResult>> match(
            @Valid @RequestBody AiRequest.JdMatch request) {
        AiResponse.JdMatchResult result = jdMatcherService.matchJobDescription(request);
        return ResponseEntity.ok(ApiResponse.success("JD match analysis complete", result));
    }
}
