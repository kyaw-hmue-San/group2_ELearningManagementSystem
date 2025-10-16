package mfuelearning.elearning.service;

import mfuelearning.elearning.entity.Admin;
import mfuelearning.elearning.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AdminService {
    
    @Autowired
    private AdminRepository adminRepository;
    
    // Authentication
    public Optional<Admin> authenticateAdmin(String username, String password) {
        Optional<Admin> admin = adminRepository.findByUsernameAndPassword(username, password);
        if (admin.isPresent() && admin.get().getIsActive()) {
            // Update last login
            Admin adminEntity = admin.get();
            adminEntity.setLastLogin(LocalDateTime.now());
            adminRepository.save(adminEntity);
            return Optional.of(adminEntity);
        }
        return Optional.empty();
    }
    
    // Get admin by username
    public Optional<Admin> getAdminByUsername(String username) {
        return adminRepository.findByUsername(username);
    }
    
    // Get all admins
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }
    
    // Get active admins
    public List<Admin> getActiveAdmins() {
        return adminRepository.findByIsActive(true);
    }
    
    // Create admin (for initial setup)
    public Admin createAdmin(Admin admin) {
        if (adminRepository.existsByUsername(admin.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (adminRepository.existsByEmail(admin.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        // Ensure all required fields are set
        if (admin.getPassword() == null || admin.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password is required");
        }
        if (admin.getUsername() == null || admin.getUsername().trim().isEmpty()) {
            throw new RuntimeException("Username is required");
        }
        if (admin.getEmail() == null || admin.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        
        // Set timestamps
        admin.setCreatedAt(LocalDateTime.now());
        admin.setUpdatedAt(LocalDateTime.now());
        admin.setIsActive(true);
        
        return adminRepository.save(admin);
    }
    
    // Update admin
    public Admin updateAdmin(Long id, Admin adminDetails) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + id));
        
        admin.setFullName(adminDetails.getFullName());
        admin.setEmail(adminDetails.getEmail());
        admin.setDepartment(adminDetails.getDepartment());
        admin.setIsActive(adminDetails.getIsActive());
        
        return adminRepository.save(admin);
    }
    
    // Change password
    public Admin changePassword(Long id, String newPassword) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + id));
        
        admin.setPassword(newPassword);
        return adminRepository.save(admin);
    }
    
    // Deactivate admin
    public Admin deactivateAdmin(Long id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + id));
        
        admin.setIsActive(false);
        return adminRepository.save(admin);
    }
    
    // Get total admin count
    public long getTotalAdmins() {
        return adminRepository.count();
    }
}
