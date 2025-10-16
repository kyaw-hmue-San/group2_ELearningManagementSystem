package mfuelearning.elearning.service;

import mfuelearning.elearning.entity.Course;
import mfuelearning.elearning.entity.CourseStatus;
import mfuelearning.elearning.entity.User;
import mfuelearning.elearning.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Service
public class CourseService {
    
    @Autowired
    private CourseRepository courseRepository;
    
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }
    
    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }
    
    public Optional<Course> getCourseByCourseCode(String courseCode) {
        return courseRepository.findByCourseCode(courseCode);
    }
    
    public List<Course> getCoursesByInstructor(User instructor) {
        return courseRepository.findByInstructor(instructor);
    }
    
    public List<Course> getCoursesByStatus(CourseStatus status) {
        return courseRepository.findByStatus(status);
    }
    
    public List<Course> getPublishedCourses() {
        return courseRepository.findByStatus(CourseStatus.PUBLISHED);
    }
    
    public List<Course> searchCoursesByTitle(String title) {
        return courseRepository.findByTitleContainingIgnoreCase(title);
    }
    
    public Course createCourse(Course course) {
        // Check if course code already exists
        if (courseRepository.existsByCourseCode(course.getCourseCode())) {
            throw new RuntimeException("Course code already exists: " + course.getCourseCode());
        }
        return courseRepository.save(course);
    }
    
    public Course updateCourse(Long id, Course courseDetails) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        
        course.setTitle(courseDetails.getTitle());
        course.setDescription(courseDetails.getDescription());
        course.setCreditHours(courseDetails.getCreditHours());
        course.setMaxStudents(courseDetails.getMaxStudents());
        course.setStartDate(courseDetails.getStartDate());
        course.setEndDate(courseDetails.getEndDate());
        course.setStatus(courseDetails.getStatus());
        
        return courseRepository.save(course);
    }
    
    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        courseRepository.delete(course);
    }
    
    public Course publishCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        course.setStatus(CourseStatus.PUBLISHED);
        return courseRepository.save(course);
    }
    
    public Course activateCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        course.setStatus(CourseStatus.ACTIVE);
        return courseRepository.save(course);
    }
    
    public long getTotalCourses() {
        return courseRepository.count();
    }
    
    // Admin course approval methods
    public List<Course> getPendingCourses() {
        return courseRepository.findByStatus(CourseStatus.PENDING_APPROVAL);
    }
    
    public Course approveCourse(Long courseId, Long adminId, String feedback) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        
        course.setStatus(CourseStatus.APPROVED);
        course.setAdminFeedback(feedback);
        course.setReviewedBy(adminId);
        course.setReviewedAt(LocalDateTime.now());
        
        return courseRepository.save(course);
    }
    
    public Course rejectCourse(Long courseId, Long adminId, String feedback) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        
        course.setStatus(CourseStatus.REJECTED);
        course.setAdminFeedback(feedback);
        course.setReviewedBy(adminId);
        course.setReviewedAt(LocalDateTime.now());
        
        return courseRepository.save(course);
    }
    
    public Course submitForApproval(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        
        course.setStatus(CourseStatus.PENDING_APPROVAL);
        return courseRepository.save(course);
    }
    
    public List<Course> getRejectedCourses() {
        return courseRepository.findByStatus(CourseStatus.REJECTED);
    }
    
    public List<Course> getApprovedCourses() {
        return courseRepository.findByStatus(CourseStatus.APPROVED);
    }
}
