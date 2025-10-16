package mfuelearning.elearning.repository;

import mfuelearning.elearning.entity.Certificate;
import mfuelearning.elearning.entity.CertificateStatus;
import mfuelearning.elearning.entity.User;
import mfuelearning.elearning.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    
    List<Certificate> findByStudent(User student);
    
    List<Certificate> findByCourse(Course course);
    
    List<Certificate> findByStatus(CertificateStatus status);
    
    Optional<Certificate> findByCertificateNumber(String certificateNumber);
    
    List<Certificate> findByStudentAndCourse(User student, Course course);
    
    List<Certificate> findByStudentId(Long studentId);
    
    List<Certificate> findByCourseId(Long courseId);
    
    boolean existsByCertificateNumber(String certificateNumber);
    
    long countByStatus(CertificateStatus status);
    
    long countByStudent(User student);
}
