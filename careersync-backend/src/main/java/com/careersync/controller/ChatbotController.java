package com.careersync.controller;

import com.careersync.dto.request.AiRequest;
import com.careersync.dto.response.AiResponse;
import com.careersync.dto.response.ApiResponse;
import com.careersync.entity.ChatHistory;
import com.careersync.service.ChatbotService;
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
@RequestMapping("/chat")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "AI Chatbot", description = "Context-aware career guidance chatbot powered by Gemini AI")
public class ChatbotController {

    private final ChatbotService chatbotService;

    @Operation(
        summary = "Send a chat message",
        description = "Send a message to the AI career advisor. Optionally pass a sessionId to continue an existing conversation.",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            content = @Content(examples = @ExampleObject(value = """
                {
                  "message": "How should I prepare for a system design interview at Google?",
                  "sessionId": null
                }
            """))
        )
    )
    @PostMapping("/send")
    public ResponseEntity<ApiResponse<AiResponse.ChatMessageResult>> send(
            @Valid @RequestBody AiRequest.ChatMessage request) {
        AiResponse.ChatMessageResult result = chatbotService.sendMessage(request);
        return ResponseEntity.ok(ApiResponse.success("Message sent", result));
    }

    @Operation(
        summary = "Get all chat sessions",
        description = "Returns all chat session summaries for the authenticated user, sorted by most recent."
    )
    @GetMapping("/sessions")
    public ResponseEntity<ApiResponse<List<ChatHistory>>> getSessions() {
        return ResponseEntity.ok(ApiResponse.success(chatbotService.getAllSessions()));
    }

    @Operation(summary = "Get a specific chat session", description = "Returns full message history for a session.")
    @GetMapping("/session/{id}")
    public ResponseEntity<ApiResponse<ChatHistory>> getSession(
            @Parameter(description = "Session ID") @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(chatbotService.getSession(id)));
    }

    @Operation(summary = "Delete a chat session")
    @DeleteMapping("/session/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSession(
            @Parameter(description = "Session ID") @PathVariable Long id) {
        chatbotService.deleteSession(id);
        return ResponseEntity.ok(ApiResponse.success("Session deleted", null));
    }
}
