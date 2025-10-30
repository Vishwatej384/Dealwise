// src/main/java/com/dealwise/controller/AuthController.java
package com.dealwise.controller;

import com.dealwise.dao.UserDao;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;

@CrossOrigin(origins = {"http://localhost:5500", "http://127.0.0.1:5500"})
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserDao userDao = new UserDao();
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Value("${dealwise.jwt.secret}")
    private String jwtSecret;

    @PostMapping("/signup")
    public Map<String, Object> signup(@RequestBody Map<String, String> body) throws SQLException {
        String username = body.get("username");
        String email = body.get("email");
        String password = body.get("password");
        Map<String, Object> res = new HashMap<>();

        // Validation check
        if (username == null || email == null || password == null ||
            username.isEmpty() || email.isEmpty() || password.isEmpty()) {
            res.put("success", false);
            res.put("message", "All fields are required.");
            return res;
        }

        // Hash password
        String hashed = passwordEncoder.encode(password);
        boolean ok = userDao.createUser(username, email, hashed);

        if (ok) {
            res.put("success", true);
            res.put("message", "User registered successfully!");
        } else {
            res.put("success", false);
            res.put("message", "Signup failed. Email may already exist.");
        }

        return res;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) throws SQLException {
        String email = body.get("email");
        String password = body.get("password");
        Map<String, Object> res = new HashMap<>();

        try (ResultSet rs = userDao.findByEmail(email)) {
            if (rs.next()) {
                String hash = rs.getString("password");
                if (passwordEncoder.matches(password, hash)) {
                    // sign JWT
                    byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
                    var key = Keys.hmacShaKeyFor(keyBytes);

                    String token = Jwts.builder()
                            .setSubject(String.valueOf(rs.getInt("id")))
                            .claim("username", rs.getString("username"))
                            .claim("email", rs.getString("email"))
                            .setIssuedAt(new Date())
                            .setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 7)) // 7 days
                            .signWith(key, io.jsonwebtoken.SignatureAlgorithm.HS384)
                            .compact();

                    res.put("success", true);
                    res.put("token", token);
                    res.put("username", rs.getString("username"));
                    return res;
                }
            }
        }

        res.put("success", false);
        res.put("message", "Invalid credentials. Please check your email or password.");
        return res;
    }
}
