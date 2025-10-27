// src/main/java/com/dealwise/util/DBUtil.java
package com.dealwise.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBUtil {
    // Update these values by editing application.properties or directly here for quick dev
    private static final String URL = System.getProperty("dealwise.db.url",
            "jdbc:mysql://localhost:3306/dealwise_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC");
    private static final String USER = System.getProperty("dealwise.db.user", "root");
    private static final String PASS = System.getProperty("dealwise.db.password", "your_mysql_password_here");

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException ex) {
            ex.printStackTrace();
        }
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASS);
    }
}
