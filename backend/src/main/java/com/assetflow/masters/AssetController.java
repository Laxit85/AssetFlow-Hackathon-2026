package com.assetflow.masters;

import com.assetflow.common.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
public class AssetController {
    private final AssetRepository repo;
    public AssetController(AssetRepository repo) { this.repo = repo; }

    @GetMapping
    public ApiResponse<List<Asset>> all() { return ApiResponse.ok(repo.findAll()); }

    @GetMapping("/bookable")
    public ApiResponse<List<Asset>> bookable() { return ApiResponse.ok(repo.findByBookableTrue()); }

    @PostMapping
    public ApiResponse<Asset> create(@RequestBody Asset a) {
        // Auto-generate the asset tag if the client didn't send one: AF-0001, AF-0002, ...
        if (a.getAssetTag() == null || a.getAssetTag().isBlank()) {
            long next = repo.count() + 1;
            a.setAssetTag(String.format("AF-%04d", next));
        }
        a.setStatus("AVAILABLE");
        return ApiResponse.ok(repo.save(a));
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<Asset> updateStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        Asset a = repo.findById(id).orElseThrow();
        a.setStatus(body.get("status"));
        return ApiResponse.ok(repo.save(a));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) { repo.deleteById(id); return ApiResponse.ok(null); }
}
