package com.farmiq.user_service.dto;

public class AuthResponse {
    private String token;
    private String email;
    private String fullName;
    private String role;
    private String subscriptionTier;

    public AuthResponse(String token, String email, String fullName, String role, String subscriptionTier) {
        this.token = token;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.subscriptionTier = subscriptionTier;
    }

    public String getToken() { return token; }
    public String getEmail() { return email; }
    public String getFullName() { return fullName; }
    public String getRole() { return role; }
    public String getSubscriptionTier() { return subscriptionTier; }
}