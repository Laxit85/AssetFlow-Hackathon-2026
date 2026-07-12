package com.assetflow.allocation;

import com.assetflow.masters.Asset;
import com.assetflow.masters.AssetRepository;
import org.springframework.stereotype.Service;

@Service
public class AllocationService {

    private final AllocationRepository allocationRepository;
    private final AssetRepository assetRepository;

    public AllocationService(AllocationRepository allocationRepository, AssetRepository assetRepository) {
        this.allocationRepository = allocationRepository;
        this.assetRepository = assetRepository;
    }

    /**
     * THE conflict rule from the spec:
     * "You can't allocate an asset that's already taken."
     * If Priya has Laptop AF-0114 and Raj tries to allocate it too, this
     * blocks the request and tells the caller who currently holds it.
     */
    public Allocation allocate(Allocation request) {
        Asset asset = assetRepository.findById(request.getAssetId())
                .orElseThrow(() -> new IllegalStateException("Asset not found"));

        allocationRepository.findByAssetIdAndStatus(request.getAssetId(), "ACTIVE")
                .ifPresent(existing -> {
                    throw new IllegalStateException(
                        "Asset " + asset.getAssetTag() + " is currently held by employee #"
                        + existing.getEmployeeId() + ". Use Transfer Request instead.");
                });

        request.setStatus("ACTIVE");
        Allocation saved = allocationRepository.save(request);

        asset.setStatus("ALLOCATED");
        assetRepository.save(asset);

        return saved;
    }

    public Allocation returnAsset(Long allocationId) {
        Allocation allocation = allocationRepository.findById(allocationId)
                .orElseThrow(() -> new IllegalStateException("Allocation not found"));
        allocation.setStatus("RETURNED");
        allocationRepository.save(allocation);

        Asset asset = assetRepository.findById(allocation.getAssetId()).orElseThrow();
        asset.setStatus("AVAILABLE");
        assetRepository.save(asset);

        return allocation;
    }
}
