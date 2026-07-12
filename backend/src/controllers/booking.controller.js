import * as allocationService from "../services/allocation.service.js";
import * as bookingService from "../services/booking.service.js";

// Async handler helper to forward errors to errorHandler.js
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// ------------------------------------------------------------------
// Allocation
// ------------------------------------------------------------------

// POST /allocation
export const allocateAsset = asyncHandler(async (req, res) => {
  const allocation = await allocationService.allocateAsset(req.body, req.user);
  res.status(201).json({ success: true, data: allocation });
});

// PUT /allocation/return
export const returnAsset = asyncHandler(async (req, res) => {
  const allocation = await allocationService.returnAsset(req.body, req.user);
  res.status(200).json({ success: true, data: allocation });
});

// GET /allocation/asset/:assetId/history
export const getAllocationHistory = asyncHandler(async (req, res) => {
  const history = await allocationService.getAllocationHistory(req.params.assetId);
  res.status(200).json({ success: true, data: history });
});

// GET /allocation/overdue
export const getOverdueAllocations = asyncHandler(async (req, res) => {
  const overdue = await allocationService.getOverdueAllocations();
  res.status(200).json({ success: true, data: overdue });
});

export const getAllAllocations = asyncHandler(async (req, res) => {
  const allocations = await allocationService.getAllAllocations();
  res.status(200).json({ success: true, data: allocations });
});

// ------------------------------------------------------------------
// Transfer
// ------------------------------------------------------------------

// POST /transfer
export const requestTransfer = asyncHandler(async (req, res) => {
  const allocation = await allocationService.requestTransfer(req.body, req.user);
  res.status(201).json({ success: true, data: allocation });
});

// PUT /transfer/decision
export const decideTransfer = asyncHandler(async (req, res) => {
  const result = await allocationService.decideTransfer(req.body, req.user);
  res.status(200).json({ success: true, data: result });
});

// ------------------------------------------------------------------
// Booking
// ------------------------------------------------------------------

// POST /booking
export const createBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.createBooking(req.body, req.user);
  res.status(201).json({ success: true, data: booking });
});

// PUT /booking  (body: { bookingId, startTime?, endTime?, purpose? })
export const updateBooking = asyncHandler(async (req, res) => {
  const bookingId = req.params.id || req.body.bookingId;
  const booking = await bookingService.updateBooking(bookingId, req.body, req.user);
  res.status(200).json({ success: true, data: booking });
});

// PUT /booking/:id/cancel  (body: { cancelReason? })
export const cancelBooking = asyncHandler(async (req, res) => {
  const bookingId = req.params.id || req.body.bookingId;
  const booking = await bookingService.updateBooking(
    bookingId,
    { ...req.body, action: 'cancel' },
    req.user
  );
  res.status(200).json({ success: true, data: booking });
});

// GET /booking/resource/:resourceId
export const getResourceBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getBookingsForResource(req.params.resourceId, req.query);
  res.status(200).json({ success: true, data: bookings });
});
