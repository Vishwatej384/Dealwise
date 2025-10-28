package com.dealwise.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBUtil {

    // MySQL connection details
    private static final String URL = "jdbc:mysql://localhost:3306/dealwise_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    private static final String USER = "root";
    private static final String PASS = "vishu@14";

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            System.out.println("✅ MySQL JDBC Driver loaded successfully!");
        } catch (ClassNotFoundException ex) {
            System.err.println("❌ MySQL JDBC Driver not found!");
            ex.printStackTrace();
        }
    }

    public static Connection getConnection() throws SQLException {
        try {
            Connection connection = DriverManager.getConnection(URL, USER, PASS);
            System.out.println("✅ Database connected successfully!");
            return connection;
        } catch (SQLException e) {
            System.err.println("❌ Database connection failed!");
            e.printStackTrace();
            throw e;
        }
    }
}
