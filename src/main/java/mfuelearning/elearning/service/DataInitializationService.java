package mfuelearning.elearning.service;

import mfuelearning.elearning.entity.*;
import mfuelearning.elearning.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class DataInitializationService implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Only initialize if database is empty
        if (userRepository.count() == 0) {
            initializeData();
        }
    }
    
    private void initializeData() {
        // Create sample users
        User admin = new User("admin", "admin@elearning.com", "admin123", 
                             "System", "Administrator", UserRole.ADMIN);
        
        User instructor1 = new User("john_doe", "john.doe@elearning.com", "instructor123", 
                                   "John", "Doe", UserRole.INSTRUCTOR);
        
        User instructor2 = new User("jane_smith", "jane.smith@elearning.com", "instructor123", 
                                   "Jane", "Smith", UserRole.INSTRUCTOR);
        
        User student1 = new User("alice_johnson", "alice.johnson@student.com", "student123", 
                                "Alice", "Johnson", UserRole.STUDENT);
        
        User student2 = new User("bob_wilson", "bob.wilson@student.com", "student123", 
                                "Bob", "Wilson", UserRole.STUDENT);
        
        User student3 = new User("carol_brown", "carol.brown@student.com", "student123", 
                                "Carol", "Brown", UserRole.STUDENT);
        
        // Save users
        userRepository.save(admin);
        userRepository.save(instructor1);
        userRepository.save(instructor2);
        userRepository.save(student1);
        userRepository.save(student2);
        userRepository.save(student3);
        
        // Create sample courses
        Course course1 = new Course("Introduction to Java Programming", 
                                   "Learn the fundamentals of Java programming language including OOP concepts, data structures, and basic algorithms.", 
                                   instructor1, "CS101", 3);
        course1.setMaxStudents(30);
        course1.setStartDate(LocalDateTime.now().plusDays(7));
        course1.setEndDate(LocalDateTime.now().plusDays(97)); // 90 days course
        course1.setStatus(CourseStatus.PUBLISHED);
        
        Course course2 = new Course("Web Development with Spring Boot", 
                                   "Build modern web applications using Spring Boot framework, REST APIs, and database integration.", 
                                   instructor1, "CS201", 4);
        course2.setMaxStudents(25);
        course2.setStartDate(LocalDateTime.now().plusDays(14));
        course2.setEndDate(LocalDateTime.now().plusDays(104)); // 90 days course
        course2.setStatus(CourseStatus.PUBLISHED);
        
        Course course3 = new Course("Database Design and Management", 
                                   "Learn database design principles, SQL, and database management systems.", 
                                   instructor2, "CS301", 3);
        course3.setMaxStudents(35);
        course3.setStartDate(LocalDateTime.now().plusDays(21));
        course3.setEndDate(LocalDateTime.now().plusDays(111)); // 90 days course
        course3.setStatus(CourseStatus.PUBLISHED);
        
        Course course4 = new Course("Mobile App Development", 
                                   "Create mobile applications for Android and iOS platforms.", 
                                   instructor2, "CS401", 4);
        course4.setMaxStudents(20);
        course4.setStartDate(LocalDateTime.now().plusDays(30));
        course4.setEndDate(LocalDateTime.now().plusDays(120)); // 90 days course
        course4.setStatus(CourseStatus.DRAFT);
        
        // Save courses
        courseRepository.save(course1);
        courseRepository.save(course2);
        courseRepository.save(course3);
        courseRepository.save(course4);
        
        System.out.println("✅ Sample data initialized successfully!");
        System.out.println("📊 Created " + userRepository.count() + " users and " + courseRepository.count() + " courses");
    }
}
