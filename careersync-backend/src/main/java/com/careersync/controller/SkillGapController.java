package com.careersync.controller;

import com.careersync.dto.request.AiRequest;
import com.careersync.dto.response.AiResponse;
import com.careersync.dto.response.ApiResponse;
import com.careersync.entity.SkillAnalysis;
import com.careersync.service.SkillGapService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/skill-gap")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Skill Gap Analyzer", description = "Identify skill gaps and get learning recommendations")
public class SkillGapController {

    private final SkillGapService skillGapService;

    @Operation(
        summary = "Analyze skill gap",
        description = "Identifies missing skills for your target role and provides learning resources and project suggestions.",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            content = @Content(examples = @ExampleObject(value = """
                {
                  "targetRole": "Senior Backend Engineer",
                  "currentSkills": "Java, Spring Boot, MySQL, REST APIs, Git"
                }
            """))
        )
    )
    @PostMapping("/analyze")
    public ResponseEntity<ApiResponse<AiResponse.SkillGapResult>> analyze(
            @Valid @RequestBody AiRequest.SkillGap request) {
        AiResponse.SkillGapResult result = skillGapService.analyzeSkillGap(request);
        return ResponseEntity.ok(ApiResponse.success("Skill gap analysis complete", result));
    }

    @Operation(summary = "Get all skill analyses", description = "Returns all skill analyses for the authenticated user")
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<SkillAnalysis>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(skillGapService.getAllAnalyses()));
    }

    @Operation(summary = "Get skill analysis by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SkillAnalysis>> getById(
            @Parameter(description = "Skill analysis ID") @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(skillGapService.getAnalysisById(id)));
    }

    @Operation(summary = "Get latest skill analysis")
    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<SkillAnalysis>> getLatest() {
        return ResponseEntity.ok(ApiResponse.success(skillGapService.getLatestAnalysis()));
    }
}
