package mfuelearning.elearning.service;

import mfuelearning.elearning.entity.*;
import mfuelearning.elearning.repository.SupportRequestRepository;
import mfuelearning.elearning.repository.UserRepository;
import mfuelearning.elearning.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SupportRequestService {
    
    @Autowired
    private SupportRequestRepository supportRequestRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AdminRepository adminRepository;
    
    // Get all support requests
    public List<SupportRequest> getAllSupportRequests() {
        return supportRequestRepository.findAllByOrderByCreatedAtDesc();
    }
    
    // Get support request by ID
    public Optional<SupportRequest> getSupportRequestById(Long id) {
        return supportRequestRepository.findById(id);
    }
    
    // Get support requests by user
    public List<SupportRequest> getSupportRequestsByUser(Long userId) {
        return supportRequestRepository.findByUserId(userId);
    }
    
    // Get support requests by status
    public List<SupportRequest> getSupportRequestsByStatus(SupportRequestStatus status) {
        return supportRequestRepository.findByStatusOrderByCreatedAtDesc(status);
    }
    
    // Get support requests by priority
    public List<SupportRequest> getSupportRequestsByPriority(SupportRequestPriority priority) {
        return supportRequestRepository.findByPriorityOrderByCreatedAtDesc(priority);
    }
    
    // Get support requests by type
    public List<SupportRequest> getSupportRequestsByType(SupportRequestType type) {
        return supportRequestRepository.findByType(type);
    }
    
    // Get support requests assigned to admin
    public List<SupportRequest> getSupportRequestsByAdmin(Long adminId) {
        return supportRequestRepository.findByAssignedAdminId(adminId);
    }
    
    // Create support request
    public SupportRequest createSupportRequest(Long userId, String subject, String description, 
                                             SupportRequestType type, SupportRequestPriority priority) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        SupportRequest supportRequest = new SupportRequest(user, subject, description, type, priority);
        return supportRequestRepository.save(supportRequest);
    }
    
    // Update support request
    public SupportRequest updateSupportRequest(Long id, SupportRequest requestDetails) {
        SupportRequest supportRequest = supportRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Support request not found with id: " + id));
        
        supportRequest.setSubject(requestDetails.getSubject());
        supportRequest.setDescription(requestDetails.getDescription());
        supportRequest.setType(requestDetails.getType());
        supportRequest.setPriority(requestDetails.getPriority());
        
        return supportRequestRepository.save(supportRequest);
    }
    
    // Assign support request to admin
    public SupportRequest assignToAdmin(Long requestId, Long adminId) {
        SupportRequest supportRequest = supportRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Support request not found with id: " + requestId));
        
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + adminId));
        
        supportRequest.setAssignedAdmin(admin);
        supportRequest.setStatus(SupportRequestStatus.IN_PROGRESS);
        
        return supportRequestRepository.save(supportRequest);
    }
    
    // Update support request status
    public SupportRequest updateStatus(Long id, SupportRequestStatus status) {
        SupportRequest supportRequest = supportRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Support request not found with id: " + id));
        
        supportRequest.setStatus(status);
        
        if (status == SupportRequestStatus.RESOLVED || status == SupportRequestStatus.CLOSED) {
            supportRequest.setResolvedAt(LocalDateTime.now());
        }
        
        return supportRequestRepository.save(supportRequest);
    }
    
    // Add admin response
    public SupportRequest addAdminResponse(Long id, String response) {
        SupportRequest supportRequest = supportRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Support request not found with id: " + id));
        
        supportRequest.setAdminResponse(response);
        supportRequest.setStatus(SupportRequestStatus.RESOLVED);
        supportRequest.setResolvedAt(LocalDateTime.now());
        
        return supportRequestRepository.save(supportRequest);
    }
    
    // Close support request
    public SupportRequest closeSupportRequest(Long id) {
        SupportRequest supportRequest = supportRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Support request not found with id: " + id));
        
        supportRequest.setStatus(SupportRequestStatus.CLOSED);
        if (supportRequest.getResolvedAt() == null) {
            supportRequest.setResolvedAt(LocalDateTime.now());
        }
        
        return supportRequestRepository.save(supportRequest);
    }
    
    // Delete support request
    public void deleteSupportRequest(Long id) {
        SupportRequest supportRequest = supportRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Support request not found with id: " + id));
        
        supportRequestRepository.delete(supportRequest);
    }
    
    // Get statistics
    public long getTotalSupportRequests() {
        return supportRequestRepository.count();
    }
    
    public long getSupportRequestsCountByStatus(SupportRequestStatus status) {
        return supportRequestRepository.countByStatus(status);
    }
    
    public long getSupportRequestsCountByPriority(SupportRequestPriority priority) {
        return supportRequestRepository.countByPriority(priority);
    }
    
    // Get open support requests
    public List<SupportRequest> getOpenSupportRequests() {
        return supportRequestRepository.findByStatusOrderByCreatedAtDesc(SupportRequestStatus.OPEN);
    }
    
    // Get urgent support requests
    public List<SupportRequest> getUrgentSupportRequests() {
        return supportRequestRepository.findByPriorityOrderByCreatedAtDesc(SupportRequestPriority.URGENT);
    }
}
