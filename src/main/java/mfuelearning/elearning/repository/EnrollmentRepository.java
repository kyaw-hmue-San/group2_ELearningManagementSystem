package mfuelearning.elearning.repository;

import mfuelearning.elearning.entity.Enrollment;
import mfuelearning.elearning.entity.EnrollmentStatus;
import mfuelearning.elearning.entity.User;
import mfuelearning.elearning.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    
    List<Enrollment> findByStudent(User student);
    
    List<Enrollment> findByCourse(Course course);
    
    List<Enrollment> findByStatus(EnrollmentStatus status);
    
    List<Enrollment> findByStudentId(Long studentId);
    
    List<Enrollment> findByCourseId(Long courseId);
    
    List<Enrollment> findByStudentIdAndStatus(Long studentId, EnrollmentStatus status);
    
    List<Enrollment> findByCourseIdAndStatus(Long courseId, EnrollmentStatus status);
    
    Optional<Enrollment> findByStudentAndCourse(User student, Course course);
    
    long countByStatus(EnrollmentStatus status);
    
    long countByStudent(User student);
    
    long countByCourse(Course course);
    
    long countByCourseAndStatus(Course course, EnrollmentStatus status);
    
    long countByStudentIdAndStatus(Long studentId, EnrollmentStatus status);
    
    boolean existsByStudentAndCourse(User student, Course course);
}
