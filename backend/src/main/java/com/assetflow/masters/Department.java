package com.assetflow.masters;

import jakarta.persistence.*;

@Entity
@Table(name = "departments")
public class Department {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Long headId;
    private String status = "ACTIVE";

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Long getHeadId() { return headId; }
    public void setHeadId(Long headId) { this.headId = headId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
