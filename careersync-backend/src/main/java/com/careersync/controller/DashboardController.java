package com.careersync.controller;

import com.careersync.dto.response.AiResponse;
import com.careersync.dto.response.ApiResponse;
import com.careersync.service.JobTrackerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Dashboard", description = "Aggregate statistics and metrics for the user dashboard")
public class DashboardController {

    private final JobTrackerService jobTrackerService;

    @Operation(
        summary = "Get dashboard statistics",
        description = """
            Returns aggregate statistics for the authenticated user:
            - Total resumes uploaded and latest ATS score
            - Job application count and breakdown by status
            - Interview session count
            - Skill analysis count
            """
    )
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AiResponse.DashboardStats>> getStats() {
        AiResponse.DashboardStats stats = jobTrackerService.getStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved", stats));
    }
}
