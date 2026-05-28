package com.careersync.config;

import io.swagger.v3.oas.models.*;
import io.swagger.v3.oas.models.info.*;
import io.swagger.v3.oas.models.security.*;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Value("${server.port:8080}")
    private String serverPort;

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(apiInfo())
                .servers(List.of(
                        new Server().url("http://localhost:" + serverPort + "/api").description("Local Development"),
                        new Server().url("https://api.careersync.ai").description("Production")
                ))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication",
                                new SecurityScheme()
                                        .name("Bearer Authentication")
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Enter your JWT token (without 'Bearer ' prefix)")
                        )
                );
    }

    private Info apiInfo() {
        return new Info()
                .title("CareerSync AI REST API")
                .description("""
                        ## CareerSync AI - Full Stack Career Optimization Platform
                        
                        AI-powered career platform with:
                        - **Resume Analysis** — ATS scoring, skills, strengths, weaknesses
                        - **JD Matching** — Match percentage, keyword gap analysis
                        - **Cover Letter Generation** — AI-tailored professional letters
                        - **Skill Gap Analysis** — Missing skills, learning resources
                        - **Mock Interviews** — AI questions + feedback scoring
                        - **Career Roadmaps** — Milestones and timelines
                        - **Job Tracker** — Application pipeline management
                        - **AI Chatbot** — Context-aware career guidance
                        
                        ### Authentication
                        All endpoints (except `/auth/**`) require a valid JWT Bearer token.
                        Register → Login → copy token → click **Authorize** above.
                        """)
                .version("1.0.0")
                .contact(new Contact()
                        .name("CareerSync AI")
                        .email("support@careersync.ai")
                        .url("https://careersync.ai"))
                .license(new License()
                        .name("MIT License")
                        .url("https://opensource.org/licenses/MIT"));
    }
}
