package com.careersync.service;

import com.careersync.dto.request.AiRequest;
import com.careersync.dto.response.AiResponse;
import com.careersync.entity.SkillAnalysis;

import java.util.List;

public interface SkillGapService {
    AiResponse.SkillGapResult analyzeSkillGap(AiRequest.SkillGap request);
    List<SkillAnalysis> getAllAnalyses();
    SkillAnalysis getAnalysisById(Long id);
    SkillAnalysis getLatestAnalysis();
}
