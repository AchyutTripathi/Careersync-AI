package com.careersync.dto.response;

import com.careersync.entity.Resume;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumeResponse {

    private Long id;
    private String resumeUrl;
    private String originalFilename;
    private Integer atsScore;
    private String skills;
    private String strengths;
    private String weaknesses;
    private String suggestions;
    private String analysisStatus;
    private LocalDateTime createdAt;

    public static ResumeResponse from(Resume resume) {
        return ResumeResponse.builder()
                .id(resume.getId())
                .resumeUrl(resume.getResumeUrl())
                .originalFilename(resume.getOriginalFilename())
                .atsScore(resume.getAtsScore())
                .skills(resume.getSkills())
                .strengths(resume.getStrengths())
                .weaknesses(resume.getWeaknesses())
                .suggestions(resume.getSuggestions())
                .analysisStatus(resume.getAnalysisStatus().name())
                .createdAt(resume.getCreatedAt())
                .build();
    }
}
