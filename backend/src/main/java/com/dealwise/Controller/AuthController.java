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
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserDao userDao = new UserDao();
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Value("${dealwise.jwt.secret}")
    private String jwtSecret;

    @PostMapping("/signup")
    public Map<String,Object> signup(@RequestBody Map<String,String> body) throws SQLException {
        String name = body.get("name");
        String email = body.get("email");
        String password = body.get("password");
        Map<String,Object> res = new HashMap<>();
        if (name == null || email == null || password == null) {
            res.put("success", false);
            res.put("message", "Missing fields");
            return res;
        }

        String hashed = passwordEncoder.encode(password);
        boolean ok = userDao.createUser(name, email, hashed);
        res.put("success", ok);
        if (!ok) res.put("message", "Could not create user (maybe duplicate email).");
        return res;
    }

    @PostMapping("/login")
    public Map<String,Object> login(@RequestBody Map<String,String> body) throws SQLException {
        String email = body.get("email");
        String password = body.get("password");
        Map<String,Object> res = new HashMap<>();
        try (ResultSet rs = userDao.findByEmail(email)) {
            if (rs.next()) {
                String hash = rs.getString("password_hash");
                if (passwordEncoder.matches(password, hash)) {
                    // sign JWT
                    byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
                    var key = Keys.hmacShaKeyFor(keyBytes);

                    String token = Jwts.builder()
                            .setSubject(String.valueOf(rs.getInt("id")))
                            .claim("name", rs.getString("name"))
                            .claim("email", rs.getString("email"))
                            .setIssuedAt(new Date())
                            .setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 7))
                            .signWith(key)
                            .compact();
                    res.put("token", token);
                    res.put("name", rs.getString("name"));
                    return res;
                }
            }
        }
        res.put("error", "Invalid credentials");
        return res;
    }
}
