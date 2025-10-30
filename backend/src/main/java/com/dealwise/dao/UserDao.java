// src/main/java/com/dealwise/dao/UserDao.java
package com.dealwise.dao;

import com.dealwise.util.DBUtil;

import java.sql.*;

public class UserDao {

    public boolean createUser(String username, String email, String password) throws SQLException {
        String sql = "INSERT INTO users (username, email, password) VALUES (?,?,?)";
        try (Connection c = DBUtil.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, username);
            ps.setString(2, email);
            ps.setString(3, password);
            return ps.executeUpdate() == 1;
        }
    }

    public ResultSet findByEmail(String email) throws SQLException {
        // Note: caller must close ResultSet and Connection (we return just ResultSet for simplicity)
        Connection c = DBUtil.getConnection();
        PreparedStatement ps = c.prepareStatement("SELECT * FROM users WHERE email = ?");
        ps.setString(1, email);
        return ps.executeQuery();
    }

    public ResultSet findById(int id) throws SQLException {
        Connection c = DBUtil.getConnection();
        PreparedStatement ps = c.prepareStatement("SELECT * FROM users WHERE id = ?");
        ps.setInt(1, id);
        return ps.executeQuery();
    }

    public boolean updateUser(int id, String username, String email) throws SQLException {
        String sql = "UPDATE users SET username = ?, email = ? WHERE id = ?";
        try (Connection c = DBUtil.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, username);
            ps.setString(2, email);
            ps.setInt(3, id);
            return ps.executeUpdate() == 1;
        }
    }
}
