import express from "express";
import * as auditController from "../controllers/audit.controller.js";
import { protect } from "../middleware/auth.js";

/**
 * NOTE ON ASSUMPTIONS
 * -------------------
 * 1. Import path for the controller is assumed to be
 *    ../controllers/audit.controller.js — adjust to match your structure.
 * 2. Auth middleware is assumed to live at ../middlewares/auth.middleware.js
 *    and export a `protect` function that verifies the JWT/session and
 *    attaches req.user. Rename the import/usage if yours differs
 *    (e.g. verifyToken, isAuthenticated, requireAuth).
 * 3. No role-based restriction (e.g. admin-only delete) is applied here
 *    since no role/permission model was provided. If you have one
 *    (e.g. authorize("admin")), add it after `protect` on the routes
 *    that should be restricted — deleteAuditCycle and deleteAuditItem
 *    are the most likely candidates.
 */

const router = express.Router();

router.use(protect);

// ---------------------------------------------------------------------------
// AuditCycle routes
// ---------------------------------------------------------------------------

router.post("/cycles", auditController.createAuditCycle);
router.get("/cycles", auditController.getAuditCycles);
router.get("/cycles/:id", auditController.getAuditCycleById);
router.patch("/cycles/:id", auditController.updateAuditCycle);
router.delete("/cycles/:id", auditController.deleteAuditCycle);
router.get("/cycles/:id/summary", auditController.getAuditCycleSummary);

// ---------------------------------------------------------------------------
// AuditItem routes
// ---------------------------------------------------------------------------

router.post("/items", auditController.createAuditItem);
router.post("/items/bulk", auditController.bulkCreateAuditItems);
router.get("/items", auditController.getAuditItems);
router.get("/items/:id", auditController.getAuditItemById);
router.patch("/items/:id", auditController.updateAuditItem);
router.delete("/items/:id", auditController.deleteAuditItem);

export default router;