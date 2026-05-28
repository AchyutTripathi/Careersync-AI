package com.careersync.service;

import com.careersync.dto.request.AiRequest;
import com.careersync.dto.response.AiResponse;

public interface CoverLetterService {
    AiResponse.CoverLetterResult generateCoverLetter(AiRequest.CoverLetter request);
}
