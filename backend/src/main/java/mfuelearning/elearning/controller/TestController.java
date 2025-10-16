package mfuelearning.elearning.controller;

import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/test")
@CrossOrigin(origins = "*")
public class TestController {
    
    @GetMapping("/hello")
    public String hello() {
        return "Hello! E-Learning System is working!";
    }
    
    @GetMapping("/status")
    public Map<String, Object> status() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "All systems operational");
        response.put("timestamp", LocalDateTime.now().toString());
        return response;
    }
    
    @GetMapping("/")
    public Map<String, Object> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("application", "E-Learning Management System");
        response.put("version", "1.0.0");
        response.put("endpoints", Map.of(
            "test", "/test/hello",
            "api", "/api/status",
            "users", "/api/users",
            "courses", "/api/courses"
        ));
        return response;
    }
}
