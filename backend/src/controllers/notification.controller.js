import * as notificationService from "../services/notification.service.js";

/**
 * NOTE: same assumptions as audit.controller.js — req.user._id from auth
 * middleware, service errors carry statusCode, thin controller layer.
 */

const getUserId = (req) => req.user?._id || req.user?.id;

const handleError = (res, err) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong",
  });
};

export const getNotifications = async (req, res) => {
  try {
    const result = await notificationService.getNotifications(getUserId(req), req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return handleError(res, err);
  }
};

export const getNotificationById = async (req, res) => {
  try {
    const notification = await notificationService.getNotificationById(
      req.params.id,
      getUserId(req)
    );
    return res.status(200).json({ success: true, data: notification });
  } catch (err) {
    return handleError(res, err);
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, getUserId(req));
    return res.status(200).json({ success: true, data: notification });
  } catch (err) {
    return handleError(res, err);
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const result = await notificationService.markAllAsRead(getUserId(req));
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return handleError(res, err);
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const result = await notificationService.deleteNotification(req.params.id, getUserId(req));
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return handleError(res, err);
  }
};