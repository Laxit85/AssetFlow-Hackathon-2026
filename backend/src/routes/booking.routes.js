const express = require('express');
const router = express.Router();

const controller = require('../controllers/booking.controller');

// Assumed middleware exports - adjust names to match your actual
// middleware/auth.js and middleware/role.js implementations.
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.use(authenticate);

// ----- Allocation -----
router.post('/allocation', authorize('Admin', 'AssetManager'), controller.allocateAsset);
router.put('/allocation/return', authorize('Admin', 'AssetManager'), controller.returnAsset);
router.get('/allocation/asset/:assetId/history', controller.getAllocationHistory);
router.get(
  '/allocation/overdue',
  authorize('Admin', 'AssetManager', 'DepartmentHead'),
  controller.getOverdueAllocations
);

// ----- Transfer -----
router.post('/transfer', controller.requestTransfer);
router.put(
  '/transfer/decision',
  authorize('Admin', 'AssetManager', 'DepartmentHead'),
  controller.decideTransfer
);

// ----- Resource Booking -----
router.post('/booking', controller.createBooking);
router.put('/booking', controller.updateBooking);
router.put('/booking/:id', controller.updateBooking);
router.put('/booking/:id/cancel', controller.cancelBooking);
router.get('/booking/resource/:resourceId', controller.getResourceBookings);

module.exports = router;
