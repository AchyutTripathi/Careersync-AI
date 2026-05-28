package com.careersync.controller;

import com.careersync.dto.request.AiRequest;
import com.careersync.dto.request.AuthRequest;
import com.careersync.dto.response.ApiResponse;
import com.careersync.dto.response.AuthResponse;
import com.careersync.entity.User;
import com.careersync.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Register, login, and user profile management")
public class AuthController {

    private final AuthService authService;

    @Operation(
        summary = "Register a new user",
        description = "Creates a new user account and returns a JWT token",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            content = @Content(examples = @ExampleObject(value = """
                { "name": "John Doe", "email": "john@example.com", "password": "password123" }
            """))
        )
    )
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "User registered successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Email already registered")
    })
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody AuthRequest.Register request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", response));
    }

    @Operation(
        summary = "Login",
        description = "Authenticates user credentials and returns a JWT token",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            content = @Content(examples = @ExampleObject(value = """
                { "email": "john@example.com", "password": "password123" }
            """))
        )
    )
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Login successful"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody AuthRequest.Login request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @Operation(summary = "Get current user", description = "Returns the authenticated user's profile",
               security = @SecurityRequirement(name = "Bearer Authentication"))
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse.UserResponse>> me() {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(AuthResponse.UserResponse.from(user)));
    }

    @Operation(summary = "Update profile", description = "Update current user's profile information",
               security = @SecurityRequirement(name = "Bearer Authentication"))
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<AuthResponse.UserResponse>> updateProfile(
            @RequestBody AiRequest.UpdateProfile request) {
        User user = authService.updateProfile(request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated", AuthResponse.UserResponse.from(user)));
    }
}
