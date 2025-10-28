// src/main/java/com/dealwise/controller/HelloController.java
package com.dealwise.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    @GetMapping("/api/hello")
    public String hello() {
        return "Hello from Dealwise Backend!";
    }
}
