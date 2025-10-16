package mfuelearning.elearning.controller;

import mfuelearning.elearning.entity.Certificate;
import mfuelearning.elearning.entity.CertificateStatus;
import mfuelearning.elearning.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/certificates")
@CrossOrigin(origins = "*")
public class CertificateController {
    
    @Autowired
    private CertificateService certificateService;
    
    @GetMapping
    public ResponseEntity<List<Certificate>> getAllCertificates() {
        List<Certificate> certificates = certificateService.getAllCertificates();
        return ResponseEntity.ok(certificates);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Certificate> getCertificateById(@PathVariable Long id) {
        Optional<Certificate> certificate = certificateService.getCertificateById(id);
        return certificate.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Certificate>> getCertificatesByStudent(@PathVariable Long studentId) {
        List<Certificate> certificates = certificateService.getCertificatesByStudent(studentId);
        return ResponseEntity.ok(certificates);
    }
    
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Certificate>> getCertificatesByCourse(@PathVariable Long courseId) {
        List<Certificate> certificates = certificateService.getCertificatesByCourse(courseId);
        return ResponseEntity.ok(certificates);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Certificate>> getCertificatesByStatus(@PathVariable CertificateStatus status) {
        List<Certificate> certificates = certificateService.getCertificatesByStatus(status);
        return ResponseEntity.ok(certificates);
    }
    
    @GetMapping("/number/{certificateNumber}")
    public ResponseEntity<Certificate> getCertificateByCertificateNumber(@PathVariable String certificateNumber) {
        Optional<Certificate> certificate = certificateService.getCertificateByCertificateNumber(certificateNumber);
        return certificate.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/issue")
    public ResponseEntity<?> issueCertificate(@RequestBody Map<String, Object> request) {
        try {
            Long studentId = Long.valueOf(request.get("studentId").toString());
            Long courseId = Long.valueOf(request.get("courseId").toString());
            String grade = request.get("grade").toString();
            Double score = Double.valueOf(request.get("score").toString());
            
            Certificate certificate = certificateService.issueCertificate(studentId, courseId, grade, score);
            return ResponseEntity.status(HttpStatus.CREATED).body(certificate);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCertificate(@PathVariable Long id, @RequestBody Certificate certificateDetails) {
        try {
            Certificate updatedCertificate = certificateService.updateCertificate(id, certificateDetails);
            return ResponseEntity.ok(updatedCertificate);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}/revoke")
    public ResponseEntity<?> revokeCertificate(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String reason = request.get("reason");
            Certificate revokedCertificate = certificateService.revokeCertificate(id, reason);
            return ResponseEntity.ok(revokedCertificate);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCertificate(@PathVariable Long id) {
        try {
            certificateService.deleteCertificate(id);
            return ResponseEntity.ok().body("Certificate deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/stats")
    public ResponseEntity<?> getCertificateStats() {
        Map<String, Object> stats = Map.of(
            "total", certificateService.getTotalCertificates(),
            "issued", certificateService.getCertificatesCountByStatus(CertificateStatus.ISSUED),
            "revoked", certificateService.getCertificatesCountByStatus(CertificateStatus.REVOKED),
            "pending", certificateService.getCertificatesCountByStatus(CertificateStatus.PENDING)
        );
        return ResponseEntity.ok(stats);
    }
}
