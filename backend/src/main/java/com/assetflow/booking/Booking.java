package com.assetflow.booking;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long resourceAssetId;
    private Long bookedBy;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    // UPCOMING | ONGOING | COMPLETED | CANCELLED
    private String status = "UPCOMING";

    public Long getId() { return id; }
    public Long getResourceAssetId() { return resourceAssetId; }
    public void setResourceAssetId(Long resourceAssetId) { this.resourceAssetId = resourceAssetId; }
    public Long getBookedBy() { return bookedBy; }
    public void setBookedBy(Long bookedBy) { this.bookedBy = bookedBy; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
