package com.assetflow.booking;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository repository;

    public BookingService(BookingRepository repository) {
        this.repository = repository;
    }

    /**
     * THE overlap rule from the spec:
     * "Room B2 is booked 9:00-10:00. A request for 9:30-10:30 gets rejected
     * since it overlaps; a request for 10:00-11:00 is fine since it starts
     * right after." Standard half-open interval overlap check:
     * new.start < existing.end AND new.end > existing.start
     */
    public Booking book(Booking request) {
        List<Booking> existingBookings =
                repository.findByResourceAssetIdAndStatusNot(request.getResourceAssetId(), "CANCELLED");

        boolean overlaps = existingBookings.stream().anyMatch(existing ->
                request.getStartTime().isBefore(existing.getEndTime())
                && request.getEndTime().isAfter(existing.getStartTime())
        );

        if (overlaps) {
            throw new IllegalStateException(
                "This resource is already booked for an overlapping time slot.");
        }

        request.setStatus("UPCOMING");
        return repository.save(request);
    }

    public Booking cancel(Long id) {
        Booking booking = repository.findById(id).orElseThrow(() -> new IllegalStateException("Booking not found"));
        booking.setStatus("CANCELLED");
        return repository.save(booking);
    }
}
