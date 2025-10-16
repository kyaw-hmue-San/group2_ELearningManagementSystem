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
    
    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    
    @Autowired
    private CertificateRepository certificateRepository;
    
    @Autowired
    private SupportRequestRepository supportRequestRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Only initialize if database is empty
        if (adminRepository.count() == 0) {
            initializeData();
        }
    }
    
    private void initializeData() {
        // Create sample admin accounts
        Admin mainAdmin = new Admin("admin", "admin123", "System Administrator", 
                                   "admin@elearning.com", "IT Department");
        
        Admin techAdmin = new Admin("tech_admin", "tech123", "Technical Administrator", 
                                   "tech@elearning.com", "Technical Support");
        
        // Save admins
        adminRepository.save(mainAdmin);
        adminRepository.save(techAdmin);
        
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
        
        // Create some pending approval courses
        Course pendingCourse1 = new Course("Advanced JavaScript", 
                                          "Deep dive into modern JavaScript concepts and frameworks.", 
                                          instructor1, "CS501", 3);
        pendingCourse1.setMaxStudents(25);
        pendingCourse1.setStartDate(LocalDateTime.now().plusDays(14));
        pendingCourse1.setEndDate(LocalDateTime.now().plusDays(104));
        pendingCourse1.setStatus(CourseStatus.PENDING_APPROVAL);
        
        Course pendingCourse2 = new Course("Machine Learning Basics", 
                                          "Introduction to machine learning algorithms and applications.", 
                                          instructor2, "CS601", 4);
        pendingCourse2.setMaxStudents(30);
        pendingCourse2.setStartDate(LocalDateTime.now().plusDays(21));
        pendingCourse2.setEndDate(LocalDateTime.now().plusDays(111));
        pendingCourse2.setStatus(CourseStatus.PENDING_APPROVAL);
        
        // Save courses
        courseRepository.save(course1);
        courseRepository.save(course2);
        courseRepository.save(course3);
        courseRepository.save(course4);
        courseRepository.save(pendingCourse1);
        courseRepository.save(pendingCourse2);
        
        // Create sample enrollments
        Enrollment enrollment1 = new Enrollment();
        enrollment1.setStudent(student1);
        enrollment1.setCourse(course1);
        enrollment1.setEnrollmentDate(LocalDateTime.now().minusDays(10));
        enrollment1.setStatus(EnrollmentStatus.ACTIVE);
        
        Enrollment enrollment2 = new Enrollment();
        enrollment2.setStudent(student2);
        enrollment2.setCourse(course1);
        enrollment2.setEnrollmentDate(LocalDateTime.now().minusDays(8));
        enrollment2.setStatus(EnrollmentStatus.COMPLETED);
        enrollment2.setCompletionDate(LocalDateTime.now().minusDays(1));
        
        Enrollment enrollment3 = new Enrollment();
        enrollment3.setStudent(student3);
        enrollment3.setCourse(course2);
        enrollment3.setEnrollmentDate(LocalDateTime.now().minusDays(5));
        enrollment3.setStatus(EnrollmentStatus.ACTIVE);
        
        enrollmentRepository.save(enrollment1);
        enrollmentRepository.save(enrollment2);
        enrollmentRepository.save(enrollment3);
        
        // Create sample certificates
        Certificate cert1 = new Certificate(student2, course1, "CERT-" + System.currentTimeMillis() + "-001", "A", 92.5);
        cert1.setCompletionDate(LocalDateTime.now().minusDays(1));
        certificateRepository.save(cert1);
        
        // Create sample support requests
        SupportRequest support1 = new SupportRequest(student1, "Cannot access course materials", 
                                                    "I'm having trouble accessing the video lectures for Java Programming course.", 
                                                    SupportRequestType.TECHNICAL_ISSUE, SupportRequestPriority.HIGH);
        
        SupportRequest support2 = new SupportRequest(student3, "Enrollment issue", 
                                                    "I want to enroll in the Database course but getting an error.", 
                                                    SupportRequestType.ENROLLMENT_ISSUE, SupportRequestPriority.MEDIUM);
        
        SupportRequest support3 = new SupportRequest(instructor1, "Course approval status", 
                                                    "When will my Advanced JavaScript course be approved?", 
                                                    SupportRequestType.COURSE_INQUIRY, SupportRequestPriority.LOW);
        
        supportRequestRepository.save(support1);
        supportRequestRepository.save(support2);
        supportRequestRepository.save(support3);
        
        System.out.println("✅ Sample data initialized successfully!");
        System.out.println("📊 Created " + adminRepository.count() + " admins, " + userRepository.count() + " users, " + courseRepository.count() + " courses");
        System.out.println("📊 Created " + enrollmentRepository.count() + " enrollments, " + certificateRepository.count() + " certificates, " + supportRequestRepository.count() + " support requests");
    }
}
