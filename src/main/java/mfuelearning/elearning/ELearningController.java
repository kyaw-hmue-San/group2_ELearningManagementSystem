package mfuelearning.elearning;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;



@RestController
public class ELearningController {
    @GetMapping("/hello")
    public String getMethodName() {
        return "Hello From My World";
    }
    
}
