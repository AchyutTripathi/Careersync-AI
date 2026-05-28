package com.careersync.ai;

import com.careersync.exception.AiServiceException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class GeminiAiService {

    @Value("${app.gemini.api.key}")
    private String apiKey;

    @Value("${app.gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateContent(String prompt) {
        try {
            String url = apiUrl + "?key=" + apiKey;

            ObjectNode requestBody = objectMapper.createObjectNode();
            ArrayNode  contents   = requestBody.putArray("contents");
            ObjectNode content    = contents.addObject();
            ArrayNode  parts      = content.putArray("parts");
            parts.addObject().put("text", prompt);

            // Safety & generation config
            ObjectNode genConfig = requestBody.putObject("generationConfig");
            genConfig.put("temperature", 0.7);
            genConfig.put("maxOutputTokens", 8192);
            genConfig.put("topP", 0.95);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>(
                    objectMapper.writeValueAsString(requestBody), headers
            );

            log.debug("Calling Gemini API for prompt of length: {}", prompt.length());
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new AiServiceException("Gemini API returned non-200 status: " + response.getStatusCode());
            }

            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode candidates = root.path("candidates");

            if (candidates.isEmpty()) {
                throw new AiServiceException("No candidates returned from Gemini API");
            }

            String text = candidates.get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

            log.debug("Gemini response length: {}", text.length());
            return text;

        } catch (AiServiceException e) {
            throw e;
        } catch (Exception e) {
            log.error("Gemini API call failed: {}", e.getMessage(), e);
            throw new AiServiceException("Failed to get response from Gemini AI: " + e.getMessage(), e);
        }
    }

    // ── Specialized prompt builders ──────────────────────────────────────────

    public String analyzeResume(String resumeText) {
        String prompt = """
                You are an expert ATS (Applicant Tracking System) and career coach.
                Analyze this resume thoroughly and respond ONLY with a valid JSON object.
                
                Resume text:
                ---
                %s
                ---
                
                Respond ONLY with this exact JSON structure (no markdown, no extra text):
                {
                  "atsScore": <integer 0-100>,
                  "skills": ["skill1", "skill2", ...],
                  "strengths": ["strength1", "strength2", ...],
                  "weaknesses": ["weakness1", "weakness2", ...],
                  "suggestions": ["suggestion1", "suggestion2", ...]
                }
                """.formatted(truncate(resumeText, 8000));
        return generateContent(prompt);
    }

    public String matchJobDescription(String resumeText, String jobDescription) {
        String prompt = """
                You are an expert recruiter and ATS specialist.
                Compare this resume against the job description and respond ONLY with valid JSON.
                
                Resume:
                ---
                %s
                ---
                
                Job Description:
                ---
                %s
                ---
                
                Respond ONLY with this exact JSON (no markdown, no extra text):
                {
                  "matchPercentage": <integer 0-100>,
                  "matchedKeywords": ["keyword1", "keyword2", ...],
                  "missingKeywords": ["keyword1", "keyword2", ...],
                  "overallAssessment": "<2-3 sentence assessment>",
                  "improvements": ["improvement1", "improvement2", ...]
                }
                """.formatted(truncate(resumeText, 4000), truncate(jobDescription, 4000));
        return generateContent(prompt);
    }

    public String generateCoverLetter(String companyName, String role, String experience, String additionalInfo) {
        String prompt = """
                You are an expert career coach and professional writer.
                Write a compelling, tailored cover letter.
                
                Company: %s
                Role: %s
                Candidate Experience: %s
                Additional Context: %s
                
                Write a professional cover letter (3-4 paragraphs, ~300-400 words).
                Include: opening hook, relevant experience match, specific value proposition, strong closing.
                Use a confident, professional, yet authentic tone.
                Return ONLY the cover letter text, no JSON, no extra formatting.
                """.formatted(companyName, role, experience, additionalInfo != null ? additionalInfo : "None");
        return generateContent(prompt);
    }

    public String analyzeSkillGap(String targetRole, String currentSkills) {
        String prompt = """
                You are an expert tech career coach and skills assessor.
                Analyze the skill gap for this career goal and respond ONLY with valid JSON.
                
                Target Role: %s
                Current Skills: %s
                
                Respond ONLY with this exact JSON (no markdown, no extra text):
                {
                  "missingSkills": ["skill1", "skill2", ...],
                  "recommendations": ["recommendation1", "recommendation2", ...],
                  "learningResources": ["resource1", "resource2", ...],
                  "suggestedProjects": ["project1", "project2", ...]
                }
                """.formatted(targetRole, currentSkills != null ? currentSkills : "Not specified");
        return generateContent(prompt);
    }

    public String generateInterviewQuestions(String category, String difficulty, String roleContext, int count) {
        String prompt = """
                You are an expert technical interviewer at a top tech company.
                Generate %d interview questions for the given context and respond ONLY with valid JSON.
                
                Category: %s
                Difficulty: %s
                Role Context: %s
                
                Respond ONLY with this exact JSON (no markdown, no extra text):
                {
                  "questions": [
                    {
                      "number": 1,
                      "question": "<question text>",
                      "hint": "<brief hint for the candidate>",
                      "expectedTopics": "<key topics expected in answer>"
                    }
                  ]
                }
                """.formatted(count, category, difficulty, roleContext != null ? roleContext : "General");
        return generateContent(prompt);
    }

    public String generateInterviewFeedback(String questionsAndAnswers, String category) {
        String prompt = """
                You are an expert technical interviewer providing detailed feedback.
                Evaluate these interview answers and respond ONLY with valid JSON.
                
                Category: %s
                
                Questions and Answers:
                ---
                %s
                ---
                
                Respond ONLY with this exact JSON (no markdown, no extra text):
                {
                  "overallScore": <integer 0-100>,
                  "overallFeedback": "<3-4 sentence overall assessment>",
                  "questionFeedbacks": [
                    {
                      "questionNumber": 1,
                      "question": "<question>",
                      "answer": "<candidate answer>",
                      "score": <integer 0-100>,
                      "feedback": "<specific feedback>",
                      "strengths": "<what was good>",
                      "improvements": "<what to improve>"
                    }
                  ]
                }
                """.formatted(category, truncate(questionsAndAnswers, 6000));
        return generateContent(prompt);
    }

    public String generateCareerRoadmap(String targetRole, String currentRole, Integer years, String currentSkills) {
        String prompt = """
                You are an expert career strategist and tech industry mentor.
                Create a personalized career roadmap and respond ONLY with valid JSON.
                
                Target Role: %s
                Current Role: %s
                Years of Experience: %s
                Current Skills: %s
                
                Respond ONLY with this exact JSON (no markdown, no extra text):
                {
                  "roadmapContent": "<detailed overview of the journey>",
                  "milestones": [
                    {
                      "phase": 1,
                      "title": "<phase title>",
                      "description": "<what to do>",
                      "duration": "<e.g. 3 months>",
                      "skills": ["skill1", "skill2"]
                    }
                  ],
                  "technologies": ["tech1", "tech2", ...],
                  "timeline": "<overall timeline e.g. 12-18 months>",
                  "projects": ["project1", "project2", ...]
                }
                """.formatted(
                targetRole,
                currentRole != null ? currentRole : "Not specified",
                years != null ? years + " years" : "Not specified",
                currentSkills != null ? currentSkills : "Not specified"
        );
        return generateContent(prompt);
    }

    public String chatWithCareerAdvisor(String userMessage, String conversationHistory, String resumeContext) {
        String prompt = """
                You are CareerSync AI, an expert career advisor with deep knowledge of:
                - Resume writing and optimization
                - Job search strategies
                - Interview preparation
                - Career transitions and growth
                - Tech industry trends and skills
                
                %s
                
                %s
                
                User: %s
                
                Provide a helpful, specific, actionable response. Be conversational but expert.
                Keep responses focused and under 300 words unless detail is genuinely needed.
                """.formatted(
                resumeContext != null ? "User's Resume Context:\n" + truncate(resumeContext, 2000) : "",
                conversationHistory != null ? "Previous conversation:\n" + truncate(conversationHistory, 3000) : "",
                userMessage
        );
        return generateContent(prompt);
    }

    private String truncate(String text, int maxLength) {
        if (text == null) return "";
        return text.length() > maxLength ? text.substring(0, maxLength) + "..." : text;
    }
}
