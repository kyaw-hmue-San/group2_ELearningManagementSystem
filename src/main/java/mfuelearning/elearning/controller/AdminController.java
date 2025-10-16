package mfuelearning.elearning.controller;

import mfuelearning.elearning.entity.Admin;
import mfuelearning.elearning.service.AdminService;
import mfuelearning.elearning.service.UserService;
import mfuelearning.elearning.service.CourseService;
import mfuelearning.elearning.service.EnrollmentService;
import mfuelearning.elearning.service.CertificateService;
import mfuelearning.elearning.service.SupportRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    
    @Autowired
    private AdminService adminService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private CourseService courseService;
    
    @Autowired
    private EnrollmentService enrollmentService;
    
    @Autowired
    private CertificateService certificateService;
    
    @Autowired
    private SupportRequestService supportRequestService;
    
    // Admin Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String username = credentials.get("username");
            String password = credentials.get("password");
            
            Optional<Admin> admin = adminService.authenticateAdmin(username, password);
            
            if (admin.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Login successful");
                response.put("admin", admin.get());
                response.put("timestamp", LocalDateTime.now());
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Invalid username or password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Login failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Admin Dashboard Data
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardData() {
        try {
            Map<String, Object> dashboard = new HashMap<>();
            
            // System Statistics
            dashboard.put("totalUsers", userService.getTotalUsers());
            dashboard.put("totalStudents", userService.getStudents().size());
            dashboard.put("totalInstructors", userService.getInstructors().size());
            dashboard.put("totalCourses", courseService.getTotalCourses());
            dashboard.put("publishedCourses", courseService.getPublishedCourses().size());
            dashboard.put("totalAdmins", adminService.getTotalAdmins());
            dashboard.put("totalEnrollments", enrollmentService.getTotalEnrollments());
            dashboard.put("activeEnrollments", enrollmentService.getActiveEnrollments());
            dashboard.put("totalCertificates", certificateService.getTotalCertificates());
            dashboard.put("openSupportRequests", supportRequestService.getSupportRequestsCountByStatus(mfuelearning.elearning.entity.SupportRequestStatus.OPEN));
            
            // Recent Data
            dashboard.put("recentUsers", userService.getAllUsers().stream().limit(5).toList());
            dashboard.put("recentCourses", courseService.getAllCourses().stream().limit(5).toList());
            
            dashboard.put("lastUpdated", LocalDateTime.now());
            
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving dashboard data: " + e.getMessage());
        }
    }
    
    // Get All Users (for admin management)
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            return ResponseEntity.ok(userService.getAllUsers());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving users: " + e.getMessage());
        }
    }
    
    // Get All Courses (for admin management)
    @GetMapping("/courses")
    public ResponseEntity<?> getAllCourses() {
        try {
            return ResponseEntity.ok(courseService.getAllCourses());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving courses: " + e.getMessage());
        }
    }
    
    // Get Students Only
    @GetMapping("/students")
    public ResponseEntity<?> getAllStudents() {
        try {
            return ResponseEntity.ok(userService.getStudents());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving students: " + e.getMessage());
        }
    }
    
    // Get Instructors Only
    @GetMapping("/instructors")
    public ResponseEntity<?> getAllInstructors() {
        try {
            return ResponseEntity.ok(userService.getInstructors());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving instructors: " + e.getMessage());
        }
    }
    
    // Create Admin (for initial setup)
    @PostMapping("/create")
    public ResponseEntity<?> createAdmin(@RequestBody Admin admin) {
        try {
            Admin createdAdmin = adminService.createAdmin(admin);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdAdmin);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    // Update Admin Profile
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAdmin(@PathVariable Long id, @RequestBody Admin adminDetails) {
        try {
            Admin updatedAdmin = adminService.updateAdmin(id, adminDetails);
            return ResponseEntity.ok(updatedAdmin);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    // Change Admin Password
    @PutMapping("/{id}/password")
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody Map<String, String> passwordData) {
        try {
            String newPassword = passwordData.get("newPassword");
            Admin updatedAdmin = adminService.changePassword(id, newPassword);
            return ResponseEntity.ok(Map.of(
                "message", "Password changed successfully",
                "admin", updatedAdmin
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    // Get all enrollments
    @GetMapping("/enrollments")
    public ResponseEntity<?> getAllEnrollments() {
        try {
            return ResponseEntity.ok(enrollmentService.getAllEnrollments());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving enrollments: " + e.getMessage());
        }
    }
    
    // Get all certificates
    @GetMapping("/certificates")
    public ResponseEntity<?> getAllCertificates() {
        try {
            return ResponseEntity.ok(certificateService.getAllCertificates());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving certificates: " + e.getMessage());
        }
    }
    
    // Get all support requests
    @GetMapping("/support-requests")
    public ResponseEntity<?> getAllSupportRequests() {
        try {
            return ResponseEntity.ok(supportRequestService.getAllSupportRequests());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving support requests: " + e.getMessage());
        }
    }
    
    // Get all admins
    @GetMapping("/all-admins")
    public ResponseEntity<?> getAllAdmins() {
        try {
            return ResponseEntity.ok(adminService.getAllAdmins());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving admins: " + e.getMessage());
        }
    }
    
    // Course approval endpoints
    @GetMapping("/courses/pending")
    public ResponseEntity<?> getPendingCourses() {
        try {
            return ResponseEntity.ok(courseService.getPendingCourses());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving pending courses: " + e.getMessage());
        }
    }
    
    @PostMapping("/courses/{courseId}/approve")
    public ResponseEntity<?> approveCourse(@PathVariable Long courseId, @RequestBody Map<String, Object> request) {
        try {
            Long adminId = Long.valueOf(request.get("adminId").toString());
            String feedback = request.getOrDefault("feedback", "Course approved").toString();
            
            mfuelearning.elearning.entity.Course approvedCourse = courseService.approveCourse(courseId, adminId, feedback);
            return ResponseEntity.ok(Map.of(
                "message", "Course approved successfully",
                "course", approvedCourse
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error approving course: " + e.getMessage());
        }
    }
    
    @PostMapping("/courses/{courseId}/reject")
    public ResponseEntity<?> rejectCourse(@PathVariable Long courseId, @RequestBody Map<String, Object> request) {
        try {
            Long adminId = Long.valueOf(request.get("adminId").toString());
            String feedback = request.get("feedback").toString();
            
            mfuelearning.elearning.entity.Course rejectedCourse = courseService.rejectCourse(courseId, adminId, feedback);
            return ResponseEntity.ok(Map.of(
                "message", "Course rejected",
                "course", rejectedCourse
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error rejecting course: " + e.getMessage());
        }
    }
}
