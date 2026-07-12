package com.assetflow.masters;

import jakarta.persistence.*;

@Entity
@Table(name = "employees")
public class Employee {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private Long departmentId;
    private String role = "EMPLOYEE";
    private String status = "ACTIVE";

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
