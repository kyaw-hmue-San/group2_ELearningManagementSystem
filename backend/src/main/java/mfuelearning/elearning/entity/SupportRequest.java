package mfuelearning.elearning.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@Entity
@Table(name = "support_requests")
public class SupportRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User user;
    
    @Column(nullable = false)
    private String subject;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;
    
    @Enumerated(EnumType.STRING)
    private SupportRequestType type;
    
    @Enumerated(EnumType.STRING)
    private SupportRequestPriority priority;
    
    @Enumerated(EnumType.STRING)
    private SupportRequestStatus status;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_admin_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Admin assignedAdmin;
    
    @Column(columnDefinition = "TEXT")
    private String adminResponse;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
    
    // Constructors
    public SupportRequest() {}
    
    public SupportRequest(User user, String subject, String description, SupportRequestType type, SupportRequestPriority priority) {
        this.user = user;
        this.subject = subject;
        this.description = description;
        this.type = type;
        this.priority = priority;
        this.status = SupportRequestStatus.OPEN;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public SupportRequestType getType() { return type; }
    public void setType(SupportRequestType type) { this.type = type; }
    
    public SupportRequestPriority getPriority() { return priority; }
    public void setPriority(SupportRequestPriority priority) { this.priority = priority; }
    
    public SupportRequestStatus getStatus() { return status; }
    public void setStatus(SupportRequestStatus status) { this.status = status; }
    
    public Admin getAssignedAdmin() { return assignedAdmin; }
    public void setAssignedAdmin(Admin assignedAdmin) { this.assignedAdmin = assignedAdmin; }
    
    public String getAdminResponse() { return adminResponse; }
    public void setAdminResponse(String adminResponse) { this.adminResponse = adminResponse; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
    
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
