package com.assetflow.masters;

import com.assetflow.common.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class LocationController {
    private final LocationRepository repo;
    public LocationController(LocationRepository repo) { this.repo = repo; }

    @GetMapping
    public ApiResponse<List<Location>> all() { return ApiResponse.ok(repo.findAll()); }

    @PostMapping
    public ApiResponse<Location> create(@RequestBody Location l) { return ApiResponse.ok(repo.save(l)); }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) { repo.deleteById(id); return ApiResponse.ok(null); }
}
