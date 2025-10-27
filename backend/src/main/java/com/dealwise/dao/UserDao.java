// src/main/java/com/dealwise/dao/UserDao.java
package com.dealwise.dao;

import com.dealwise.util.DBUtil;

import java.sql.*;

public class UserDao {

    public boolean createUser(String name, String email, String passwordHash) throws SQLException {
        String sql = "INSERT INTO users (name, email, password_hash) VALUES (?,?,?)";
        try (Connection c = DBUtil.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, name);
            ps.setString(2, email);
            ps.setString(3, passwordHash);
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
}
