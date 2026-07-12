package com.assetflow.masters;

import com.assetflow.common.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class AssetCategoryController {
    private final AssetCategoryRepository repo;
    public AssetCategoryController(AssetCategoryRepository repo) { this.repo = repo; }

    @GetMapping
    public ApiResponse<List<AssetCategory>> all() { return ApiResponse.ok(repo.findAll()); }

    @PostMapping
    public ApiResponse<AssetCategory> create(@RequestBody AssetCategory c) { return ApiResponse.ok(repo.save(c)); }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) { repo.deleteById(id); return ApiResponse.ok(null); }
}
