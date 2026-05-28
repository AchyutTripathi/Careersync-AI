package com.careersync.controller;

import com.careersync.dto.request.JobApplicationRequest;
import com.careersync.dto.response.AiResponse;
import com.careersync.dto.response.ApiResponse;
import com.careersync.dto.response.JobApplicationResponse;
import com.careersync.service.JobTrackerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Job Tracker", description = "Track and manage job applications with status pipeline")
public class JobTrackerController {

    private final JobTrackerService jobTrackerService;

    @Operation(
        summary = "Add job application",
        description = "Create a new job application entry to track in your pipeline.",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            content = @Content(examples = @ExampleObject(value = """
                {
                  "companyName": "Stripe",
                  "role": "Backend Engineer",
                  "status": "APPLIED",
                  "appliedDate": "2024-06-01",
                  "jobUrl": "https://stripe.com/jobs/123",
                  "salaryRange": "$150K - $200K",
                  "notes": "Applied via referral from John"
                }
            """))
        )
    )
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> create(
            @Valid @RequestBody JobApplicationRequest.Create request) {
        JobApplicationResponse response = jobTrackerService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Job application added", response));
    }

    @Operation(
        summary = "Update job application",
        description = "Update the status, notes, or any field of an existing application.",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            content = @Content(examples = @ExampleObject(value = """
                { "status": "INTERVIEW", "interviewDate": "2024-06-15", "notes": "Technical round scheduled" }
            """))
        )
    )
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> update(
            @Parameter(description = "Application ID") @PathVariable Long id,
            @RequestBody JobApplicationRequest.Update request) {
        JobApplicationResponse response = jobTrackerService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success("Application updated", response));
    }

    @Operation(summary = "Delete job application")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(description = "Application ID") @PathVariable Long id) {
        jobTrackerService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Application deleted", null));
    }

    @Operation(summary = "Get all job applications", description = "Returns all job applications sorted by newest first")
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<JobApplicationResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(jobTrackerService.getAll()));
    }

    @Operation(summary = "Get job application by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> getById(
            @Parameter(description = "Application ID") @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(jobTrackerService.getById(id)));
    }

    @Operation(summary = "Get dashboard statistics",
               description = "Returns aggregate stats: total applications, by status, ATS scores, interview counts")
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AiResponse.DashboardStats>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(jobTrackerService.getStats()));
    }
}
