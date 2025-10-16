package mfuelearning.elearning.service;

import mfuelearning.elearning.entity.*;
import mfuelearning.elearning.repository.CertificateRepository;
import mfuelearning.elearning.repository.UserRepository;
import mfuelearning.elearning.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CertificateService {
    
    @Autowired
    private CertificateRepository certificateRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    // Get all certificates
    public List<Certificate> getAllCertificates() {
        return certificateRepository.findAll();
    }
    
    // Get certificate by ID
    public Optional<Certificate> getCertificateById(Long id) {
        return certificateRepository.findById(id);
    }
    
    // Get certificates by student
    public List<Certificate> getCertificatesByStudent(Long studentId) {
        return certificateRepository.findByStudentId(studentId);
    }
    
    // Get certificates by course
    public List<Certificate> getCertificatesByCourse(Long courseId) {
        return certificateRepository.findByCourseId(courseId);
    }
    
    // Get certificates by status
    public List<Certificate> getCertificatesByStatus(CertificateStatus status) {
        return certificateRepository.findByStatus(status);
    }
    
    // Issue certificate
    public Certificate issueCertificate(Long studentId, Long courseId, String grade, Double score) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        
        // Check if certificate already exists
        List<Certificate> existingCerts = certificateRepository.findByStudentAndCourse(student, course);
        if (!existingCerts.isEmpty()) {
            throw new RuntimeException("Certificate already exists for this student and course");
        }
        
        // Generate unique certificate number
        String certificateNumber = generateCertificateNumber();
        
        Certificate certificate = new Certificate(student, course, certificateNumber, grade, score);
        certificate.setCompletionDate(LocalDateTime.now());
        
        return certificateRepository.save(certificate);
    }
    
    // Update certificate
    public Certificate updateCertificate(Long id, Certificate certificateDetails) {
        Certificate certificate = certificateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificate not found with id: " + id));
        
        certificate.setGrade(certificateDetails.getGrade());
        certificate.setScore(certificateDetails.getScore());
        certificate.setStatus(certificateDetails.getStatus());
        certificate.setNotes(certificateDetails.getNotes());
        certificate.setCertificateUrl(certificateDetails.getCertificateUrl());
        
        return certificateRepository.save(certificate);
    }
    
    // Revoke certificate
    public Certificate revokeCertificate(Long id, String reason) {
        Certificate certificate = certificateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificate not found with id: " + id));
        
        certificate.setStatus(CertificateStatus.REVOKED);
        certificate.setNotes(reason);
        
        return certificateRepository.save(certificate);
    }
    
    // Delete certificate
    public void deleteCertificate(Long id) {
        Certificate certificate = certificateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificate not found with id: " + id));
        
        certificateRepository.delete(certificate);
    }
    
    // Get certificate by certificate number
    public Optional<Certificate> getCertificateByCertificateNumber(String certificateNumber) {
        return certificateRepository.findByCertificateNumber(certificateNumber);
    }
    
    // Get total certificates count
    public long getTotalCertificates() {
        return certificateRepository.count();
    }
    
    // Get certificates count by status
    public long getCertificatesCountByStatus(CertificateStatus status) {
        return certificateRepository.countByStatus(status);
    }
    
    // Generate unique certificate number
    private String generateCertificateNumber() {
        String prefix = "CERT";
        String timestamp = String.valueOf(System.currentTimeMillis());
        String uuid = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        String certificateNumber = prefix + "-" + timestamp + "-" + uuid;
        
        // Ensure uniqueness
        while (certificateRepository.existsByCertificateNumber(certificateNumber)) {
            uuid = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            certificateNumber = prefix + "-" + timestamp + "-" + uuid;
        }
        
        return certificateNumber;
    }
}
