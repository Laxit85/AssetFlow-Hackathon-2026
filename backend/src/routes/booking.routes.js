import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";
import * as controller from "../controllers/booking.controller.js";

const router = Router();

router.use(protect);

// ----- Allocation -----
router.post('/allocation', allowRoles('ADMIN', 'ASSET_MANAGER', 'Admin', 'AssetManager'), controller.allocateAsset);
router.get('/allocation', controller.getAllAllocations);
router.put('/allocation/return', allowRoles('ADMIN', 'ASSET_MANAGER', 'Admin', 'AssetManager'), controller.returnAsset);
router.get('/allocation/asset/:assetId/history', controller.getAllocationHistory);
router.get(
  '/allocation/overdue',
  allowRoles('ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'Admin', 'AssetManager', 'DepartmentHead'),
  controller.getOverdueAllocations
);

// ----- Transfer -----
router.post('/transfer', controller.requestTransfer);
router.put(
  '/transfer/decision',
  allowRoles('ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'Admin', 'AssetManager', 'DepartmentHead'),
  controller.decideTransfer
);

// ----- Resource Booking -----
router.post('/booking', controller.createBooking);
router.put('/booking', controller.updateBooking);
router.put('/booking/:id', controller.updateBooking);
router.put('/booking/:id/cancel', controller.cancelBooking);
router.get('/booking/resource/:resourceId', controller.getResourceBookings);

export default router;
