package com.assetflow.masters;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "assets")
public class Asset {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String assetTag; // e.g. AF-0001

    private String name;
    private Long categoryId;
    private String serialNumber;
    private LocalDate acquisitionDate;
    private BigDecimal acquisitionCost;
    private String condition;
    private Long locationId;

    // AVAILABLE | ALLOCATED | RESERVED | UNDER_MAINTENANCE | LOST | RETIRED | DISPOSED
    private String status = "AVAILABLE";
    private boolean bookable = false;

    public Long getId() { return id; }
    public String getAssetTag() { return assetTag; }
    public void setAssetTag(String assetTag) { this.assetTag = assetTag; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }
    public LocalDate getAcquisitionDate() { return acquisitionDate; }
    public void setAcquisitionDate(LocalDate acquisitionDate) { this.acquisitionDate = acquisitionDate; }
    public BigDecimal getAcquisitionCost() { return acquisitionCost; }
    public void setAcquisitionCost(BigDecimal acquisitionCost) { this.acquisitionCost = acquisitionCost; }
    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }
    public Long getLocationId() { return locationId; }
    public void setLocationId(Long locationId) { this.locationId = locationId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public boolean isBookable() { return bookable; }
    public void setBookable(boolean bookable) { this.bookable = bookable; }
}
