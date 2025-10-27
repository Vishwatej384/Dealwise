// src/main/java/com/dealwise/dao/DealDao.java
package com.dealwise.dao;

import com.dealwise.model.Deal;
import com.dealwise.util.DBUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class DealDao {

    public List<Deal> getAllDeals() throws SQLException {
        String sql = "SELECT * FROM deals ORDER BY created_at DESC";
        try (Connection c = DBUtil.getConnection();
             PreparedStatement ps = c.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            List<Deal> list = new ArrayList<>();
            while (rs.next()) {
                Deal d = resultSetToDeal(rs);
                list.add(d);
            }
            return list;
        }
    }

    public Deal getDealById(int id) throws SQLException {
        String sql = "SELECT * FROM deals WHERE id = ?";
        try (Connection c = DBUtil.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return resultSetToDeal(rs);
                return null;
            }
        }
    }

    public List<String> getCategories() throws SQLException {
        String sql = "SELECT DISTINCT category FROM deals";
        try (Connection c = DBUtil.getConnection();
             PreparedStatement ps = c.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            List<String> cats = new ArrayList<>();
            while (rs.next()) cats.add(rs.getString("category"));
            return cats;
        }
    }

    public List<Deal> getTopDeals(int limit) throws SQLException {
        String sql = "SELECT * FROM deals ORDER BY created_at DESC LIMIT ?";
        try (Connection c = DBUtil.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, limit);
            try (ResultSet rs = ps.executeQuery()) {
                List<Deal> list = new ArrayList<>();
                while (rs.next()) list.add(resultSetToDeal(rs));
                return list;
            }
        }
    }

    private Deal resultSetToDeal(ResultSet rs) throws SQLException {
        Deal d = new Deal();
        d.setId(rs.getInt("id"));
        d.setTitle(rs.getString("title"));
        d.setDescription(rs.getString("description"));
        d.setPrice(rs.getString("price"));
        d.setDiscount(rs.getString("discount"));
        d.setImageUrl(rs.getString("image_url"));
        d.setCategory(rs.getString("category"));
        return d;
    }
}
