package mfuelearning.elearning.service;

import mfuelearning.elearning.entity.*;
import mfuelearning.elearning.repository.EnrollmentRepository;
import mfuelearning.elearning.repository.UserRepository;
import mfuelearning.elearning.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EnrollmentService {
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    // Get all enrollments
    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }
    
    // Get enrollment by ID
    public Optional<Enrollment> getEnrollmentById(Long id) {
        return enrollmentRepository.findById(id);
    }
    
    // Get enrollments by student
    public List<Enrollment> getEnrollmentsByStudent(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId);
    }
    
    // Get enrollments by course
    public List<Enrollment> getEnrollmentsByCourse(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId);
    }
    
    // Get enrollments by status
    public List<Enrollment> getEnrollmentsByStatus(EnrollmentStatus status) {
        return enrollmentRepository.findByStatus(status);
    }
    
    // Enroll student in course
    public Enrollment enrollStudent(Long studentId, Long courseId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        
        // Check if student is actually a student
        if (student.getRole() != UserRole.STUDENT) {
            throw new RuntimeException("User is not a student");
        }
        
        // Check if already enrolled
        Optional<Enrollment> existingEnrollment = enrollmentRepository.findByStudentAndCourse(student, course);
        if (existingEnrollment.isPresent()) {
            throw new RuntimeException("Student is already enrolled in this course");
        }
        
        // Check course capacity
        long currentEnrollments = enrollmentRepository.countByCourseAndStatus(course, EnrollmentStatus.ACTIVE);
        if (currentEnrollments >= course.getMaxStudents()) {
            throw new RuntimeException("Course is full");
        }
        
        // Check if course is published
        if (course.getStatus() != CourseStatus.PUBLISHED && course.getStatus() != CourseStatus.ACTIVE) {
            throw new RuntimeException("Course is not available for enrollment");
        }
        
        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setEnrollmentDate(LocalDateTime.now());
        enrollment.setStatus(EnrollmentStatus.ACTIVE);
        
        return enrollmentRepository.save(enrollment);
    }
    
    // Update enrollment status
    public Enrollment updateEnrollmentStatus(Long id, EnrollmentStatus status) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enrollment not found with id: " + id));
        
        enrollment.setStatus(status);
        
        if (status == EnrollmentStatus.COMPLETED) {
            enrollment.setCompletionDate(LocalDateTime.now());
        }
        
        return enrollmentRepository.save(enrollment);
    }
    
    // Complete enrollment
    public Enrollment completeEnrollment(Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enrollment not found with id: " + id));
        
        enrollment.setStatus(EnrollmentStatus.COMPLETED);
        enrollment.setCompletionDate(LocalDateTime.now());
        
        return enrollmentRepository.save(enrollment);
    }
    
    // Withdraw student from course
    public Enrollment withdrawStudent(Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enrollment not found with id: " + id));
        
        enrollment.setStatus(EnrollmentStatus.WITHDRAWN);
        
        return enrollmentRepository.save(enrollment);
    }
    
    // Delete enrollment
    public void deleteEnrollment(Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enrollment not found with id: " + id));
        
        enrollmentRepository.delete(enrollment);
    }
    
    // Get student's active enrollments
    public List<Enrollment> getActiveEnrollmentsByStudent(Long studentId) {
        return enrollmentRepository.findByStudentIdAndStatus(studentId, EnrollmentStatus.ACTIVE);
    }
    
    // Get course's active enrollments
    public List<Enrollment> getActiveEnrollmentsByCourse(Long courseId) {
        return enrollmentRepository.findByCourseIdAndStatus(courseId, EnrollmentStatus.ACTIVE);
    }
    
    // Get completed enrollments by student
    public List<Enrollment> getCompletedEnrollmentsByStudent(Long studentId) {
        return enrollmentRepository.findByStudentIdAndStatus(studentId, EnrollmentStatus.COMPLETED);
    }
    
    // Check if student is enrolled in course
    public boolean isStudentEnrolledInCourse(Long studentId, Long courseId) {
        User student = userRepository.findById(studentId).orElse(null);
        Course course = courseRepository.findById(courseId).orElse(null);
        
        if (student == null || course == null) {
            return false;
        }
        
        Optional<Enrollment> enrollment = enrollmentRepository.findByStudentAndCourse(student, course);
        return enrollment.isPresent() && enrollment.get().getStatus() == EnrollmentStatus.ACTIVE;
    }
    
    // Get enrollment statistics
    public long getTotalEnrollments() {
        return enrollmentRepository.count();
    }
    
    public long getActiveEnrollments() {
        return enrollmentRepository.countByStatus(EnrollmentStatus.ACTIVE);
    }
    
    public long getCompletedEnrollments() {
        return enrollmentRepository.countByStatus(EnrollmentStatus.COMPLETED);
    }
    
    public long getEnrollmentCountByCourse(Long courseId) {
        Course course = courseRepository.findById(courseId).orElse(null);
        if (course == null) return 0;
        return enrollmentRepository.countByCourseAndStatus(course, EnrollmentStatus.ACTIVE);
    }
    
    public long getEnrollmentCountByStudent(Long studentId) {
        return enrollmentRepository.countByStudentIdAndStatus(studentId, EnrollmentStatus.ACTIVE);
    }
}
