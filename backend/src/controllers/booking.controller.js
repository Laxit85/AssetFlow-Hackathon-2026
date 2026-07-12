const allocationService = require('../services/allocation.service');
const bookingService = require('../services/booking.service');

// small local helper so route handlers can stay async without try/catch boilerplate;
// errors flow to middleware/errorHandler.js via next(err)
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// ------------------------------------------------------------------
// Allocation
// ------------------------------------------------------------------

// POST /allocation
exports.allocateAsset = asyncHandler(async (req, res) => {
  const allocation = await allocationService.allocateAsset(req.body, req.user);
  res.status(201).json({ success: true, data: allocation });
});

// PUT /allocation/return
exports.returnAsset = asyncHandler(async (req, res) => {
  const allocation = await allocationService.returnAsset(req.body, req.user);
  res.status(200).json({ success: true, data: allocation });
});

// GET /allocation/asset/:assetId/history
exports.getAllocationHistory = asyncHandler(async (req, res) => {
  const history = await allocationService.getAllocationHistory(req.params.assetId);
  res.status(200).json({ success: true, data: history });
});

// GET /allocation/overdue
exports.getOverdueAllocations = asyncHandler(async (req, res) => {
  const overdue = await allocationService.getOverdueAllocations();
  res.status(200).json({ success: true, data: overdue });
});

// ------------------------------------------------------------------
// Transfer
// ------------------------------------------------------------------

// POST /transfer
exports.requestTransfer = asyncHandler(async (req, res) => {
  const allocation = await allocationService.requestTransfer(req.body, req.user);
  res.status(201).json({ success: true, data: allocation });
});

// PUT /transfer/decision  { allocationId, decision: 'Approved' | 'Rejected', decisionNote }
exports.decideTransfer = asyncHandler(async (req, res) => {
  const result = await allocationService.decideTransfer(req.body, req.user);
  res.status(200).json({ success: true, data: result });
});

// ------------------------------------------------------------------
// Booking
// ------------------------------------------------------------------

// POST /booking
exports.createBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.createBooking(req.body, req.user);
  res.status(201).json({ success: true, data: booking });
});

// PUT /booking  (body: { bookingId, startTime?, endTime?, purpose? }) - reschedule
// PUT /booking/:id also supported for REST-style clients
exports.updateBooking = asyncHandler(async (req, res) => {
  const bookingId = req.params.id || req.body.bookingId;
  const booking = await bookingService.updateBooking(bookingId, req.body, req.user);
  res.status(200).json({ success: true, data: booking });
});

// PUT /booking/:id/cancel  (body: { cancelReason? })
exports.cancelBooking = asyncHandler(async (req, res) => {
  const bookingId = req.params.id || req.body.bookingId;
  const booking = await bookingService.updateBooking(
    bookingId,
    { ...req.body, action: 'cancel' },
    req.user
  );
  res.status(200).json({ success: true, data: booking });
});

// GET /booking/resource/:resourceId?from=&to=
exports.getResourceBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getBookingsForResource(req.params.resourceId, req.query);
  res.status(200).json({ success: true, data: bookings });
});
