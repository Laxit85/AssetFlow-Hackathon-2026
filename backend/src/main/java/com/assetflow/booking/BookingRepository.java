package com.assetflow.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByResourceAssetIdAndStatusNot(Long resourceAssetId, String status);
}
