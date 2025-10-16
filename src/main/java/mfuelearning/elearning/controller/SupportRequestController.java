package mfuelearning.elearning.controller;

import mfuelearning.elearning.entity.*;
import mfuelearning.elearning.service.SupportRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/support")
@CrossOrigin(origins = "*")
public class SupportRequestController {
    
    @Autowired
    private SupportRequestService supportRequestService;
    
    @GetMapping
    public ResponseEntity<List<SupportRequest>> getAllSupportRequests() {
        List<SupportRequest> requests = supportRequestService.getAllSupportRequests();
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SupportRequest> getSupportRequestById(@PathVariable Long id) {
        Optional<SupportRequest> request = supportRequestService.getSupportRequestById(id);
        return request.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SupportRequest>> getSupportRequestsByUser(@PathVariable Long userId) {
        List<SupportRequest> requests = supportRequestService.getSupportRequestsByUser(userId);
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<SupportRequest>> getSupportRequestsByStatus(@PathVariable SupportRequestStatus status) {
        List<SupportRequest> requests = supportRequestService.getSupportRequestsByStatus(status);
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<SupportRequest>> getSupportRequestsByPriority(@PathVariable SupportRequestPriority priority) {
        List<SupportRequest> requests = supportRequestService.getSupportRequestsByPriority(priority);
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<SupportRequest>> getSupportRequestsByType(@PathVariable SupportRequestType type) {
        List<SupportRequest> requests = supportRequestService.getSupportRequestsByType(type);
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/admin/{adminId}")
    public ResponseEntity<List<SupportRequest>> getSupportRequestsByAdmin(@PathVariable Long adminId) {
        List<SupportRequest> requests = supportRequestService.getSupportRequestsByAdmin(adminId);
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/open")
    public ResponseEntity<List<SupportRequest>> getOpenSupportRequests() {
        List<SupportRequest> requests = supportRequestService.getOpenSupportRequests();
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/urgent")
    public ResponseEntity<List<SupportRequest>> getUrgentSupportRequests() {
        List<SupportRequest> requests = supportRequestService.getUrgentSupportRequests();
        return ResponseEntity.ok(requests);
    }
    
    @PostMapping
    public ResponseEntity<?> createSupportRequest(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            String subject = request.get("subject").toString();
            String description = request.get("description").toString();
            SupportRequestType type = SupportRequestType.valueOf(request.get("type").toString());
            SupportRequestPriority priority = SupportRequestPriority.valueOf(request.get("priority").toString());
            
            SupportRequest supportRequest = supportRequestService.createSupportRequest(userId, subject, description, type, priority);
            return ResponseEntity.status(HttpStatus.CREATED).body(supportRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSupportRequest(@PathVariable Long id, @RequestBody SupportRequest requestDetails) {
        try {
            SupportRequest updatedRequest = supportRequestService.updateSupportRequest(id, requestDetails);
            return ResponseEntity.ok(updatedRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}/assign")
    public ResponseEntity<?> assignToAdmin(@PathVariable Long id, @RequestBody Map<String, Long> request) {
        try {
            Long adminId = request.get("adminId");
            SupportRequest assignedRequest = supportRequestService.assignToAdmin(id, adminId);
            return ResponseEntity.ok(assignedRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            SupportRequestStatus status = SupportRequestStatus.valueOf(request.get("status"));
            SupportRequest updatedRequest = supportRequestService.updateStatus(id, status);
            return ResponseEntity.ok(updatedRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}/respond")
    public ResponseEntity<?> addAdminResponse(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String response = request.get("response");
            SupportRequest updatedRequest = supportRequestService.addAdminResponse(id, response);
            return ResponseEntity.ok(updatedRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}/close")
    public ResponseEntity<?> closeSupportRequest(@PathVariable Long id) {
        try {
            SupportRequest closedRequest = supportRequestService.closeSupportRequest(id);
            return ResponseEntity.ok(closedRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSupportRequest(@PathVariable Long id) {
        try {
            supportRequestService.deleteSupportRequest(id);
            return ResponseEntity.ok().body("Support request deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/stats")
    public ResponseEntity<?> getSupportRequestStats() {
        Map<String, Object> stats = Map.of(
            "total", supportRequestService.getTotalSupportRequests(),
            "open", supportRequestService.getSupportRequestsCountByStatus(SupportRequestStatus.OPEN),
            "inProgress", supportRequestService.getSupportRequestsCountByStatus(SupportRequestStatus.IN_PROGRESS),
            "resolved", supportRequestService.getSupportRequestsCountByStatus(SupportRequestStatus.RESOLVED),
            "closed", supportRequestService.getSupportRequestsCountByStatus(SupportRequestStatus.CLOSED),
            "urgent", supportRequestService.getSupportRequestsCountByPriority(SupportRequestPriority.URGENT),
            "high", supportRequestService.getSupportRequestsCountByPriority(SupportRequestPriority.HIGH)
        );
        return ResponseEntity.ok(stats);
    }
}
