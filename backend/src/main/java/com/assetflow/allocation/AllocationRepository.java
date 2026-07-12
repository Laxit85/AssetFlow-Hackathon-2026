package com.assetflow.allocation;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AllocationRepository extends JpaRepository<Allocation, Long> {
    Optional<Allocation> findByAssetIdAndStatus(Long assetId, String status);
    List<Allocation> findByStatus(String status);
}
