package com.assetflow.allocation;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "allocations")
public class Allocation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long assetId;
    private Long employeeId;
    private Long departmentId;
    private LocalDate expectedReturnDate;

    // ACTIVE | RETURNED
    private String status = "ACTIVE";

    public Long getId() { return id; }
    public Long getAssetId() { return assetId; }
    public void setAssetId(Long assetId) { this.assetId = assetId; }
    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
    public LocalDate getExpectedReturnDate() { return expectedReturnDate; }
    public void setExpectedReturnDate(LocalDate expectedReturnDate) { this.expectedReturnDate = expectedReturnDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
