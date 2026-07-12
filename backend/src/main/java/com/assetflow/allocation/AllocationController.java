package com.assetflow.allocation;

import com.assetflow.common.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/allocations")
public class AllocationController {

    private final AllocationRepository repo;
    private final AllocationService service;

    public AllocationController(AllocationRepository repo, AllocationService service) {
        this.repo = repo;
        this.service = service;
    }

    @GetMapping
    public ApiResponse<List<Allocation>> all() { return ApiResponse.ok(repo.findAll()); }

    @PostMapping
    public ApiResponse<Allocation> allocate(@RequestBody Allocation request) {
        return ApiResponse.ok(service.allocate(request));
    }

    @PatchMapping("/{id}/return")
    public ApiResponse<Allocation> returnAsset(@PathVariable Long id) {
        return ApiResponse.ok(service.returnAsset(id));
    }
}
