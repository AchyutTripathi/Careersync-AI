package com.careersync.service;

import com.careersync.dto.request.AiRequest;
import com.careersync.dto.response.AiResponse;
import com.careersync.entity.CareerRoadmap;

import java.util.List;

public interface CareerRoadmapService {
    AiResponse.CareerRoadmapResult generateRoadmap(AiRequest.CareerRoadmapRequest request);
    List<CareerRoadmap> getAllRoadmaps();
    CareerRoadmap getRoadmapById(Long id);
    CareerRoadmap getLatestRoadmap();
}
