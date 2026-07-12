import mongoose from "mongoose";
import Notification from "../models/Notification.js";

/**
 * NOTE ON ASSUMPTIONS
 * -------------------
 * 1. Import path assumed: ../models/notification.model.js — adjust to match
 *    your actual folder structure.
 * 2. This module does not write to ActivityLog. Notifications are usually
 *    triggered as a side effect of actions in other modules (maintenance,
 *    audit, allocation, etc.) rather than being an auditable action
 *    themselves. If you do want every notification create/read/delete
 *    logged, say so and I'll wire in the same logActivity pattern used in
 *    audit.service.js.
 * 3. `notify()` is the function other modules (maintenance, audit, booking)
 *    should import and call to push a notification to a user — e.g. from
 *    maintenance.service.js: `await notify(userId, "Maintenance overdue",
 *    "...", "WARNING")`.
 */

class ServiceError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const buildPagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Create and persist a notification for a user. This is the function other
 * services should call to notify a user of something.
 */
export const notify = async (userId, title, message, type = "INFO") => {
  if (!userId || !title || !message) {
    throw new ServiceError("userId, title and message are required", 400);
  }

  return Notification.create({ user: userId, title, message, type });
};

/**
 * Same as notify(), but fire-and-forget — use this from inside other
 * services when a failed notification should never block the calling
 * operation (e.g. maintenance/audit writes).
 */
export const notifySafe = async (userId, title, message, type = "INFO") => {
  try {
    return await notify(userId, title, message, type);
  } catch (err) {
    console.error("Notification create failed:", err.message);
    return null;
  }
};

export const getNotifications = async (userId, query = {}) => {
  if (!isValidObjectId(userId)) throw new ServiceError("Invalid user id", 400);

  const { page, limit, skip } = buildPagination(query);
  const { type, isRead, search, sortBy, sortOrder } = query;

  const filter = { user: userId };

  if (type) filter.type = type;
  if (isRead !== undefined) filter.isRead = isRead === "true" || isRead === true;

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { message: { $regex: search, $options: "i" } },
      { notificationCode: { $regex: search, $options: "i" } },
    ];
  }

  const sort = { [sortBy || "createdAt"]: sortOrder === "asc" ? 1 : -1 };

  const [data, total, unreadCount] = await Promise.all([
    Notification.find(filter).sort(sort).skip(skip).limit(limit),
    Notification.countDocuments(filter),
    Notification.countDocuments({ user: userId, isRead: false }),
  ]);

  return {
    data,
    unreadCount,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getNotificationById = async (id, userId) => {
  if (!isValidObjectId(id)) throw new ServiceError("Invalid notification id", 400);

  const notification = await Notification.findOne({ _id: id, user: userId });
  if (!notification) throw new ServiceError("Notification not found", 404);

  return notification;
};

export const markAsRead = async (id, userId) => {
  if (!isValidObjectId(id)) throw new ServiceError("Invalid notification id", 400);

  const notification = await Notification.findOneAndUpdate(
    { _id: id, user: userId },
    { isRead: true },
    { new: true }
  );

  if (!notification) throw new ServiceError("Notification not found", 404);

  return notification;
};

export const markAllAsRead = async (userId) => {
  if (!isValidObjectId(userId)) throw new ServiceError("Invalid user id", 400);

  const result = await Notification.updateMany(
    { user: userId, isRead: false },
    { isRead: true }
  );

  return { modifiedCount: result.modifiedCount };
};

export const deleteNotification = async (id, userId) => {
  if (!isValidObjectId(id)) throw new ServiceError("Invalid notification id", 400);

  const notification = await Notification.findOneAndDelete({ _id: id, user: userId });
  if (!notification) throw new ServiceError("Notification not found", 404);

  return { deleted: true, notificationId: id };
};

export { ServiceError };