package com.careersync.controller;

import com.careersync.dto.response.ApiResponse;
import com.careersync.dto.response.ResumeResponse;
import com.careersync.service.ResumeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/resume")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Resume", description = "Upload and analyze resumes with AI-powered ATS scoring")
public class ResumeController {

    private final ResumeService resumeService;

    @Operation(
        summary = "Upload resume",
        description = "Upload a PDF resume. Text is extracted and stored. Call /analyze next to run AI analysis."
    )
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Resume uploaded successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid file type or size"),
    })
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ResumeResponse>> upload(
            @Parameter(description = "PDF resume file (max 10MB)")
            @RequestParam("file") MultipartFile file) {
        ResumeResponse response = resumeService.uploadResume(file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Resume uploaded successfully", response));
    }

    @Operation(
        summary = "Analyze resume",
        description = "Runs Gemini AI analysis on the uploaded resume. Returns ATS score, skills, strengths, weaknesses, and suggestions."
    )
    @PostMapping("/{id}/analyze")
    public ResponseEntity<ApiResponse<ResumeResponse>> analyze(
            @Parameter(description = "Resume ID") @PathVariable Long id) {
        ResumeResponse response = resumeService.analyzeResume(id);
        return ResponseEntity.ok(ApiResponse.success("Resume analysis completed", response));
    }

    @Operation(summary = "Get all resumes", description = "Returns all resumes for the authenticated user")
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<ResumeResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(resumeService.getAllResumes()));
    }

    @Operation(summary = "Get resume by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResumeResponse>> getById(
            @Parameter(description = "Resume ID") @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(resumeService.getResumeById(id)));
    }

    @Operation(summary = "Get latest resume", description = "Returns the most recently uploaded resume")
    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<ResumeResponse>> getLatest() {
        return ResponseEntity.ok(ApiResponse.success(resumeService.getLatestResume()));
    }

    @Operation(summary = "Delete resume")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(description = "Resume ID") @PathVariable Long id) {
        resumeService.deleteResume(id);
        return ResponseEntity.ok(ApiResponse.success("Resume deleted", null));
    }
}
