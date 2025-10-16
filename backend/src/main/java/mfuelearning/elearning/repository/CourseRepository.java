package mfuelearning.elearning.repository;

import mfuelearning.elearning.entity.Course;
import mfuelearning.elearning.entity.CourseStatus;
import mfuelearning.elearning.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    List<Course> findByInstructor(User instructor);
    
    List<Course> findByStatus(CourseStatus status);
    
    Optional<Course> findByCourseCode(String courseCode);
    
    List<Course> findByTitleContainingIgnoreCase(String title);
    
    boolean existsByCourseCode(String courseCode);
}
