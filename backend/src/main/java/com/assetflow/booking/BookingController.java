package com.assetflow.booking;

import com.assetflow.common.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingRepository repo;
    private final BookingService service;

    public BookingController(BookingRepository repo, BookingService service) {
        this.repo = repo;
        this.service = service;
    }

    @GetMapping
    public ApiResponse<List<Booking>> all() { return ApiResponse.ok(repo.findAll()); }

    @PostMapping
    public ApiResponse<Booking> book(@RequestBody Booking request) {
        return ApiResponse.ok(service.book(request));
    }

    @PatchMapping("/{id}/cancel")
    public ApiResponse<Booking> cancel(@PathVariable Long id) {
        return ApiResponse.ok(service.cancel(id));
    }
}
