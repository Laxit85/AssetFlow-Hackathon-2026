import { Router } from "express";
import { getDashboard } from "../controllers/dashboard.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();

// Protected dashboard route
router.get("/", protect, getDashboard);

export default router;
