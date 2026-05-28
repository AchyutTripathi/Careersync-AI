package com.careersync.dto.response;

import com.careersync.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String tokenType;
    private UserResponse user;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserResponse {
        private Long id;
        private String name;
        private String email;
        private String role;
        private String currentRole;
        private String targetRole;
        private Integer yearsExperience;
        private String profilePicture;

        public static UserResponse from(User user) {
            return UserResponse.builder()
                    .id(user.getId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .role(user.getRole().name())
                    .currentRole(user.getCurrentRole())
                    .targetRole(user.getTargetRole())
                    .yearsExperience(user.getYearsExperience())
                    .profilePicture(user.getProfilePicture())
                    .build();
        }
    }
}
