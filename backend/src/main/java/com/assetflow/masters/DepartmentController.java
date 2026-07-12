package com.assetflow.masters;

import com.assetflow.common.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {
    private final DepartmentRepository repo;
    public DepartmentController(DepartmentRepository repo) { this.repo = repo; }

    @GetMapping
    public ApiResponse<List<Department>> all() { return ApiResponse.ok(repo.findAll()); }

    @PostMapping
    public ApiResponse<Department> create(@RequestBody Department d) { return ApiResponse.ok(repo.save(d)); }

    @PutMapping("/{id}")
    public ApiResponse<Department> update(@PathVariable Long id, @RequestBody Department d) {
        d.getClass();
        Department existing = repo.findById(id).orElseThrow();
        existing.setName(d.getName());
        existing.setHeadId(d.getHeadId());
        existing.setStatus(d.getStatus());
        return ApiResponse.ok(repo.save(existing));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) { repo.deleteById(id); return ApiResponse.ok(null); }
}
