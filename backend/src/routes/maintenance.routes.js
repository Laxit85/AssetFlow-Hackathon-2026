import express from "express";
import { protect } from "../middleware/auth.js";

import {
    createMaintenance,
    getAllMaintenance,
    getMaintenanceById,
    updateMaintenance,
    deleteMaintenance,
    approveMaintenance,
    resolveMaintenance
} from "../controllers/maintenance.controller.js";

const router = express.Router();

router.use(protect);

router.post("/", createMaintenance);
router.get("/", getAllMaintenance);
router.get("/:id", getMaintenanceById);
router.put("/:id", updateMaintenance);
router.delete("/:id", deleteMaintenance);
router.put("/:id/approve", approveMaintenance);
router.put("/:id/resolve", resolveMaintenance);

export default router;