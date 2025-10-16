package mfuelearning.elearning.repository;

import mfuelearning.elearning.entity.SupportRequest;
import mfuelearning.elearning.entity.SupportRequestStatus;
import mfuelearning.elearning.entity.SupportRequestPriority;
import mfuelearning.elearning.entity.SupportRequestType;
import mfuelearning.elearning.entity.User;
import mfuelearning.elearning.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SupportRequestRepository extends JpaRepository<SupportRequest, Long> {
    
    List<SupportRequest> findByUser(User user);
    
    List<SupportRequest> findByStatus(SupportRequestStatus status);
    
    List<SupportRequest> findByPriority(SupportRequestPriority priority);
    
    List<SupportRequest> findByType(SupportRequestType type);
    
    List<SupportRequest> findByAssignedAdmin(Admin admin);
    
    List<SupportRequest> findByUserId(Long userId);
    
    List<SupportRequest> findByAssignedAdminId(Long adminId);
    
    List<SupportRequest> findByStatusOrderByCreatedAtDesc(SupportRequestStatus status);
    
    List<SupportRequest> findByPriorityOrderByCreatedAtDesc(SupportRequestPriority priority);
    
    List<SupportRequest> findAllByOrderByCreatedAtDesc();
    
    long countByStatus(SupportRequestStatus status);
    
    long countByPriority(SupportRequestPriority priority);
    
    long countByUser(User user);
}
