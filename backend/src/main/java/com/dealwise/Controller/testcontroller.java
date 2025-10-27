package com.dealwise.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class testcontroller {

    @GetMapping("/hello")
    public String sayHello() {
        return "Hello from DealWise Backend!";
    }

    @GetMapping("/")
    public String home() {
        return "Welcome to the DealWise API!";
    }
}
