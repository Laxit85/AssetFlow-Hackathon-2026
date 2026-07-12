package com.assetflow.auth;

import com.assetflow.common.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Minimal login for the hackathon demo: checks email + password against
    // the users table and returns the user (with role) if it matches.
    // Replace with BCrypt + JWT before any real deployment.
    @PostMapping("/login")
    public ApiResponse<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        return userRepository.findByEmail(email)
                .filter(u -> u.getPassword().equals(password))
                .<ApiResponse<?>>map(ApiResponse::ok)
                .orElse(ApiResponse.error("Invalid email or password"));
    }

    // Signup always creates a plain Employee account — no role selection here.
    // Roles are only ever assigned later, by an Admin, from the Employee Directory.
    @PostMapping("/signup")
    public ApiResponse<User> signup(@RequestBody User user) {
        user.setRole("EMPLOYEE");
        user.setStatus("ACTIVE");
        return ApiResponse.ok(userRepository.save(user));
    }
}
