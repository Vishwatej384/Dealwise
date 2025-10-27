// src/main/java/com/dealwise/controller/ProfileController.java
package com.dealwise.controller;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
public class ProfileController {

    @Value("${dealwise.jwt.secret}")
    private String jwtSecret;

    @GetMapping("/api/profile")
    public Object profile(@RequestHeader(value = "Authorization", required = false) String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return Map.of("error", "Missing token");
        }
        String token = authorization.substring(7);
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        var key = Keys.hmacShaKeyFor(keyBytes);
        var claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
        return Map.of(
                "id", claims.getSubject(),
                "name", claims.get("name"),
                "email", claims.get("email")
        );
    }
}
