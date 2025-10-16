package mfuelearning.elearning.controller;

import mfuelearning.elearning.entity.Enrollment;
import mfuelearning.elearning.entity.EnrollmentStatus;
import mfuelearning.elearning.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "*")
public class EnrollmentController {
    
    @Autowired
    private EnrollmentService enrollmentService;
    
    @GetMapping
    public ResponseEntity<List<Enrollment>> getAllEnrollments() {
        List<Enrollment> enrollments = enrollmentService.getAllEnrollments();
        return ResponseEntity.ok(enrollments);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Enrollment> getEnrollmentById(@PathVariable Long id) {
        Optional<Enrollment> enrollment = enrollmentService.getEnrollmentById(id);
        return enrollment.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Enrollment>> getEnrollmentsByStudent(@PathVariable Long studentId) {
        List<Enrollment> enrollments = enrollmentService.getEnrollmentsByStudent(studentId);
        return ResponseEntity.ok(enrollments);
    }
    
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Enrollment>> getEnrollmentsByCourse(@PathVariable Long courseId) {
        List<Enrollment> enrollments = enrollmentService.getEnrollmentsByCourse(courseId);
        return ResponseEntity.ok(enrollments);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Enrollment>> getEnrollmentsByStatus(@PathVariable EnrollmentStatus status) {
        List<Enrollment> enrollments = enrollmentService.getEnrollmentsByStatus(status);
        return ResponseEntity.ok(enrollments);
    }
    
    @GetMapping("/student/{studentId}/active")
    public ResponseEntity<List<Enrollment>> getActiveEnrollmentsByStudent(@PathVariable Long studentId) {
        List<Enrollment> enrollments = enrollmentService.getActiveEnrollmentsByStudent(studentId);
        return ResponseEntity.ok(enrollments);
    }
    
    @GetMapping("/course/{courseId}/active")
    public ResponseEntity<List<Enrollment>> getActiveEnrollmentsByCourse(@PathVariable Long courseId) {
        List<Enrollment> enrollments = enrollmentService.getActiveEnrollmentsByCourse(courseId);
        return ResponseEntity.ok(enrollments);
    }
    
    @PostMapping("/enroll")
    public ResponseEntity<?> enrollStudent(@RequestBody Map<String, Long> request) {
        try {
            Long studentId = request.get("studentId");
            Long courseId = request.get("courseId");
            
            Enrollment enrollment = enrollmentService.enrollStudent(studentId, courseId);
            return ResponseEntity.status(HttpStatus.CREATED).body(enrollment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateEnrollmentStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            EnrollmentStatus status = EnrollmentStatus.valueOf(request.get("status"));
            Enrollment updatedEnrollment = enrollmentService.updateEnrollmentStatus(id, status);
            return ResponseEntity.ok(updatedEnrollment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeEnrollment(@PathVariable Long id) {
        try {
            Enrollment completedEnrollment = enrollmentService.completeEnrollment(id);
            return ResponseEntity.ok(completedEnrollment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}/withdraw")
    public ResponseEntity<?> withdrawStudent(@PathVariable Long id) {
        try {
            Enrollment withdrawnEnrollment = enrollmentService.withdrawStudent(id);
            return ResponseEntity.ok(withdrawnEnrollment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEnrollment(@PathVariable Long id) {
        try {
            enrollmentService.deleteEnrollment(id);
            return ResponseEntity.ok().body("Enrollment deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/check")
    public ResponseEntity<Boolean> checkEnrollment(@RequestParam Long studentId, @RequestParam Long courseId) {
        boolean isEnrolled = enrollmentService.isStudentEnrolledInCourse(studentId, courseId);
        return ResponseEntity.ok(isEnrolled);
    }
    
    @GetMapping("/stats")
    public ResponseEntity<?> getEnrollmentStats() {
        Map<String, Object> stats = Map.of(
            "total", enrollmentService.getTotalEnrollments(),
            "active", enrollmentService.getActiveEnrollments(),
            "completed", enrollmentService.getCompletedEnrollments()
        );
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/course/{courseId}/count")
    public ResponseEntity<Long> getEnrollmentCountByCourse(@PathVariable Long courseId) {
        long count = enrollmentService.getEnrollmentCountByCourse(courseId);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/student/{studentId}/count")
    public ResponseEntity<Long> getEnrollmentCountByStudent(@PathVariable Long studentId) {
        long count = enrollmentService.getEnrollmentCountByStudent(studentId);
        return ResponseEntity.ok(count);
    }
}
