package com.careersync.controller;

import com.careersync.dto.request.AiRequest;
import com.careersync.dto.response.AiResponse;
import com.careersync.dto.response.ApiResponse;
import com.careersync.entity.CareerRoadmap;
import com.careersync.service.CareerRoadmapService;
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
@RequestMapping("/roadmap")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Career Roadmap", description = "AI-generated personalized career roadmaps with milestones")
public class CareerRoadmapController {

    private final CareerRoadmapService roadmapService;

    @Operation(
        summary = "Generate career roadmap",
        description = "Creates a personalized step-by-step roadmap with phases, technologies, and projects to reach your target role.",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            content = @Content(examples = @ExampleObject(value = """
                {
                  "targetRole": "Staff Software Engineer",
                  "currentRole": "Junior Developer",
                  "experienceYears": 2,
                  "currentSkills": "Java, Spring Boot, MySQL, REST APIs"
                }
            """))
        )
    )
    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<AiResponse.CareerRoadmapResult>> generate(
            @Valid @RequestBody AiRequest.CareerRoadmapRequest request) {
        AiResponse.CareerRoadmapResult result = roadmapService.generateRoadmap(request);
        return ResponseEntity.ok(ApiResponse.success("Career roadmap generated", result));
    }

    @Operation(summary = "Get all roadmaps")
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<CareerRoadmap>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(roadmapService.getAllRoadmaps()));
    }

    @Operation(summary = "Get roadmap by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CareerRoadmap>> getById(
            @Parameter(description = "Roadmap ID") @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(roadmapService.getRoadmapById(id)));
    }

    @Operation(summary = "Get latest roadmap")
    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<CareerRoadmap>> getLatest() {
        return ResponseEntity.ok(ApiResponse.success(roadmapService.getLatestRoadmap()));
    }
}
