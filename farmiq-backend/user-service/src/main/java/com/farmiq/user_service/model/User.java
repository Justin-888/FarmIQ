package com.farmiq.user_service.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String fullName;

    private String phone;
    private String region;
    private String country = "Ghana";

    @Enumerated(EnumType.STRING)
    private Role role = Role.FARMER;

    @Enumerated(EnumType.STRING)
    private SubscriptionTier subscriptionTier = SubscriptionTier.FREE;

    private LocalDateTime createdAt = LocalDateTime.now();
    private boolean active = true;

    public enum Role { FARMER, ADMIN, ENTERPRISE }
    public enum SubscriptionTier { FREE, FARMER_PRO, FARM_PLUS, ENTERPRISE }

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public SubscriptionTier getSubscriptionTier() { return subscriptionTier; }
    public void setSubscriptionTier(SubscriptionTier subscriptionTier) { this.subscriptionTier = subscriptionTier; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}