import express from "express";
import * as notificationController from "../controllers/notification.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", notificationController.getNotifications);
router.get("/:id", notificationController.getNotificationById);
router.patch("/read-all", notificationController.markAllAsRead);
router.patch("/:id/read", notificationController.markAsRead);
router.delete("/:id", notificationController.deleteNotification);

export default router;