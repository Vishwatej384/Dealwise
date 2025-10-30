// src/main/java/com/dealwise/model/User.java
package com.dealwise.model;

public class User {
    private int id;
    private String username;
    private String email;
    private String password;

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getuserName() { return username; }
    public void setuserName(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
