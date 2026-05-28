package com.careersync.controller;

import com.careersync.dto.request.AiRequest;
import com.careersync.dto.response.AiResponse;
import com.careersync.dto.response.ApiResponse;
import com.careersync.entity.InterviewSession;
import com.careersync.service.InterviewService;
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
@RequestMapping("/interview")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Mock Interview", description = "AI-generated interview questions and feedback scoring")
public class InterviewController {

    private final InterviewService interviewService;

    @Operation(
        summary = "Generate interview questions",
        description = "Generates AI interview questions based on category, difficulty, and role context.",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            content = @Content(examples = @ExampleObject(value = """
                {
                  "category": "BACKEND",
                  "difficultyLevel": "INTERMEDIATE",
                  "roleContext": "Senior Java Developer at a fintech startup",
                  "numberOfQuestions": 5
                }
            """))
        )
    )
    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<AiResponse.InterviewSessionResult>> generate(
            @Valid @RequestBody AiRequest.MockInterview request) {
        AiResponse.InterviewSessionResult result = interviewService.generateInterview(request);
        return ResponseEntity.ok(ApiResponse.success("Interview questions generated", result));
    }

    @Operation(
        summary = "Submit answers for feedback",
        description = "Submits your answers and receives detailed AI feedback with per-question scoring.",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            content = @Content(examples = @ExampleObject(value = """
                {
                  "sessionId": 1,
                  "answers": "Q1: Spring Boot uses auto-configuration...\\nQ2: REST is stateless..."
                }
            """))
        )
    )
    @PostMapping("/feedback")
    public ResponseEntity<ApiResponse<AiResponse.InterviewFeedbackResult>> feedback(
            @Valid @RequestBody AiRequest.InterviewFeedback request) {
        AiResponse.InterviewFeedbackResult result = interviewService.generateFeedback(request);
        return ResponseEntity.ok(ApiResponse.success("Interview feedback generated", result));
    }

    @Operation(summary = "Get all interview sessions")
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<InterviewSession>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(interviewService.getAllSessions()));
    }

    @Operation(summary = "Get interview session by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InterviewSession>> getById(
            @Parameter(description = "Session ID") @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(interviewService.getSessionById(id)));
    }

    @Operation(summary = "Delete interview session")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(description = "Session ID") @PathVariable Long id) {
        interviewService.deleteSession(id);
        return ResponseEntity.ok(ApiResponse.success("Session deleted", null));
    }
}
