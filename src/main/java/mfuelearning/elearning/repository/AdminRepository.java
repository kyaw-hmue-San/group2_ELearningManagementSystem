package mfuelearning.elearning.repository;

import mfuelearning.elearning.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    
    Optional<Admin> findByUsername(String username);
    
    Optional<Admin> findByEmail(String email);
    
    Optional<Admin> findByUsernameAndPassword(String username, String password);
    
    List<Admin> findByIsActive(Boolean isActive);
    
    List<Admin> findByDepartment(String department);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
}
