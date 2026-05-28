package com.careersync.service;

import com.careersync.dto.request.AiRequest;
import com.careersync.dto.request.AuthRequest;
import com.careersync.dto.response.AuthResponse;
import com.careersync.entity.User;

public interface AuthService {
    AuthResponse register(AuthRequest.Register request);
    AuthResponse login(AuthRequest.Login request);
    User getCurrentUser();
    User updateProfile(AiRequest.UpdateProfile request);
}
