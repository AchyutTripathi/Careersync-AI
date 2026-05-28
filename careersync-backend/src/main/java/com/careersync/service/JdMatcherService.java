package com.careersync.service;

import com.careersync.dto.request.AiRequest;
import com.careersync.dto.response.AiResponse;

public interface JdMatcherService {
    AiResponse.JdMatchResult matchJobDescription(AiRequest.JdMatch request);
}
