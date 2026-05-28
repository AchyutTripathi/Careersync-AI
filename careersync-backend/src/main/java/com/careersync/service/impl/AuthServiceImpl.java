package com.careersync.service.impl;

import com.careersync.dto.request.AiRequest;
import com.careersync.dto.request.AuthRequest;
import com.careersync.dto.response.AuthResponse;
import com.careersync.entity.User;
import com.careersync.exception.BadRequestException;
import com.careersync.exception.DuplicateResourceException;
import com.careersync.repository.UserRepository;
import com.careersync.security.jwt.JwtUtils;
import com.careersync.service.AuthService;
import com.careersync.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository       userRepository;
    private final PasswordEncoder      passwordEncoder;
    private final JwtUtils             jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final SecurityUtils        securityUtils;

    @Override
    @Transactional
    public AuthResponse register(AuthRequest.Register request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.USER)
                .build();

        user = userRepository.save(user);
        log.info("New user registered: {}", user.getEmail());

        String token = jwtUtils.generateToken(user.getEmail());
        return buildAuthResponse(token, user);
    }

    @Override
    public AuthResponse login(AuthRequest.Login request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(auth);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        String token = jwtUtils.generateToken(user.getEmail());
        log.info("User logged in: {}", user.getEmail());
        return buildAuthResponse(token, user);
    }

    @Override
    public User getCurrentUser() {
        return securityUtils.getCurrentUser();
    }

    @Override
    @Transactional
    public User updateProfile(AiRequest.UpdateProfile request) {
        User user = securityUtils.getCurrentUser();
        if (request.getName()          != null) user.setName(request.getName());
        if (request.getCurrentRole()   != null) user.setCurrentRole(request.getCurrentRole());
        if (request.getTargetRole()    != null) user.setTargetRole(request.getTargetRole());
        if (request.getYearsExperience() != null) user.setYearsExperience(request.getYearsExperience());
        return userRepository.save(user);
    }

    private AuthResponse buildAuthResponse(String token, User user) {
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(AuthResponse.UserResponse.from(user))
                .build();
    }
}
