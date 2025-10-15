package mfuelearning.elearning;

import mfuelearning.elearning.service.UserService;
import mfuelearning.elearning.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;
import java.time.LocalDateTime;

@RestController
@CrossOrigin(origins = "*")
public class ELearningController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private CourseService courseService;
    
    @GetMapping("/")
    public Map<String, Object> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("application", "E-Learning Management System");
        response.put("version", "1.0.0");
        response.put("status", "running");
        response.put("message", "Welcome to the E-Learning Management System API");
        response.put("endpoints", Map.of(
            "status", "/api/status",
            "dashboard", "/api/dashboard",
            "users", "/api/users",
            "courses", "/api/courses",
            "test", "/test/hello"
        ));
        return response;
    }
    
    @GetMapping("/api/hello")
    public String getMethodName() {
        return "Hello From E-Learning Management System!";
    }
    
    @GetMapping("/api/status")
    public Map<String, Object> getSystemStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "running");
        status.put("message", "E-Learning Management System is operational");
        status.put("timestamp", LocalDateTime.now());
        status.put("totalUsers", userService.getTotalUsers());
        status.put("totalCourses", courseService.getTotalCourses());
        status.put("totalInstructors", userService.getInstructors().size());
        status.put("totalStudents", userService.getStudents().size());
        status.put("publishedCourses", courseService.getPublishedCourses().size());
        return status;
    }
    
    @GetMapping("/api/dashboard")
    public Map<String, Object> getDashboardData() {
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("users", Map.of(
            "total", userService.getTotalUsers(),
            "instructors", userService.getInstructors().size(),
            "students", userService.getStudents().size()
        ));
        dashboard.put("courses", Map.of(
            "total", courseService.getTotalCourses(),
            "published", courseService.getPublishedCourses().size()
        ));
        dashboard.put("lastUpdated", LocalDateTime.now());
        return dashboard;
    }
}
