package com.assetflow.masters;

import com.assetflow.common.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    private final EmployeeRepository repo;
    public EmployeeController(EmployeeRepository repo) { this.repo = repo; }

    @GetMapping
    public ApiResponse<List<Employee>> all() { return ApiResponse.ok(repo.findAll()); }

    @PostMapping
    public ApiResponse<Employee> create(@RequestBody Employee e) { return ApiResponse.ok(repo.save(e)); }

    // This is the ONLY place a role should be promoted from Employee to
    // Department Head / Asset Manager — called from the Employee Directory screen.
    @PatchMapping("/{id}/role")
    public ApiResponse<Employee> promote(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        Employee e = repo.findById(id).orElseThrow();
        e.setRole(body.get("role"));
        return ApiResponse.ok(repo.save(e));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) { repo.deleteById(id); return ApiResponse.ok(null); }
}
