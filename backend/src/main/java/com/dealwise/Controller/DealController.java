// src/main/java/com/dealwise/controller/DealController.java
package com.dealwise.controller;

import com.dealwise.dao.DealDao;
import com.dealwise.model.Deal;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class DealController {
    private final DealDao dao = new DealDao();

    @GetMapping("/deals")
    public List<Deal> getDeals(@RequestParam(required = false) String category) throws SQLException {
        List<Deal> all = dao.getAllDeals();
        if (category == null || category.isEmpty()) return all;
        return all.stream()
                .filter(d -> category.equalsIgnoreCase(d.getCategory()))
                .collect(Collectors.toList());
    }

    @GetMapping("/deals/{id}")
    public Deal getDeal(@PathVariable int id) throws SQLException {
        return dao.getDealById(id);
    }

    @GetMapping("/categories")
    public List<String> categories() throws SQLException {
        return dao.getCategories();
    }

    @GetMapping("/topdeals")
    public List<Deal> topDeals(@RequestParam(defaultValue = "6") int limit) throws SQLException {
        return dao.getTopDeals(limit);
    }
}
