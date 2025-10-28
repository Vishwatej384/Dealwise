// src/main/java/com/dealwise/controller/ProfileController.java
package com.dealwise.controller;

import com.dealwise.dao.UserDao;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserDao userDao = new UserDao();

    @Value("${dealwise.jwt.secret}")
    private String jwtSecret;

    @GetMapping
    public Map<String, Object> getProfile(@RequestHeader("Authorization") String authHeader) throws SQLException {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String token = authHeader.replace("Bearer ", "");
            byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
            var key = Keys.hmacShaKeyFor(keyBytes);
            
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            
            int userId = Integer.parseInt(claims.getSubject());
            
            try (ResultSet rs = userDao.findById(userId)) {
                if (rs.next()) {
                    response.put("success", true);
                    response.put("id", rs.getInt("id"));
                    response.put("name", rs.getString("name"));
                    response.put("email", rs.getString("email"));
                    response.put("created_at", rs.getTimestamp("created_at"));
                } else {
                    response.put("success", false);
                    response.put("message", "User not found");
                }
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Invalid token");
        }
        
        return response;
    }

    @PutMapping
    public Map<String, Object> updateProfile(@RequestHeader("Authorization") String authHeader, 
                                            @RequestBody Map<String, String> body) throws SQLException {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String token = authHeader.replace("Bearer ", "");
            byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
            var key = Keys.hmacShaKeyFor(keyBytes);
            
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            
            int userId = Integer.parseInt(claims.getSubject());
            String name = body.get("name");
            String email = body.get("email");
            
            boolean updated = userDao.updateUser(userId, name, email);
            
            if (updated) {
                response.put("success", true);
                response.put("message", "Profile updated successfully");
            } else {
                response.put("success", false);
                response.put("message", "Failed to update profile");
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Invalid token or update failed");
        }
        
        return response;
    }
}
