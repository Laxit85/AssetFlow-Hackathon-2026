import Booking from "../models/Booking.js";
import Asset from "../models/Asset.js";
import Department from "../models/Department.js";
import Notification from "../models/Notification.js";
import ActivityLog from "../models/ActivityLog.js";
import { logger } from "../utils/logger.js";

export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

const ACTIVE_BOOKING_STATUSES = ['Upcoming', 'Ongoing'];

async function logActivity({ user, action, entityType, entityId, details }) {
  try {
    await ActivityLog.create({ user, action, entityType, entityId, details });
  } catch (err) {
    logger.error(`[ActivityLog] failed: ${err.message}`);
  }
}

async function notify({ recipient, type, message, relatedEntity }) {
  try {
    if (!recipient) return;
    await Notification.create({ recipient, type, message, relatedEntity });
  } catch (err) {
    logger.error(`[Notification] failed: ${err.message}`);
  }
}

/**
 * Two ranges [aStart, aEnd) and [bStart, bEnd) overlap iff aStart < bEnd && bStart < aEnd.
 */
export async function hasOverlap(resourceId, startTime, endTime, excludeBookingId = null) {
  const query = {
    resource: resourceId,
    status: { $in: ACTIVE_BOOKING_STATUSES },
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  };
  if (excludeBookingId) query._id = { $ne: excludeBookingId };
  return Booking.findOne(query);
}

function refreshComputedStatus(booking) {
  const now = new Date();
  if (booking.status === 'Cancelled' || booking.status === 'Completed') return booking;
  if (now >= booking.endTime) booking.status = 'Completed';
  else if (now >= booking.startTime) booking.status = 'Ongoing';
  else booking.status = 'Upcoming';
  return booking;
}

/** Create a booking for a shared/bookable resource, rejecting overlapping slots. */
export async function createBooking(payload, actingUser) {
  const { resourceId, departmentId, purpose, startTime, endTime } = payload;

  if (!resourceId) throw new AppError('resourceId is required', 400);

  const start = new Date(startTime);
  const end = new Date(endTime);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
    throw new AppError('Invalid startTime/endTime for booking', 400);
  }
  if (start < new Date()) {
    throw new AppError('Cannot book a slot in the past', 400);
  }

  const asset = await Asset.findById(resourceId);
  if (!asset) throw new AppError('Resource not found', 404);
  if (!asset.isBookable) {
    throw new AppError('This asset is not marked as a shared/bookable resource', 409);
  }

  if (departmentId) {
    const dept = await Department.findById(departmentId);
    if (!dept) throw new AppError('Department not found', 404);
  }

  const conflict = await hasOverlap(resourceId, start, end);
  if (conflict) {
    throw new AppError(
      `Resource is already booked from ${conflict.startTime.toISOString()} to ${conflict.endTime.toISOString()}`,
      409
    );
  }

  const booking = await Booking.create({
    resource: resourceId,
    bookedBy: actingUser._id,
    bookedForDepartment: departmentId || null,
    purpose: purpose || '',
    startTime: start,
    endTime: end,
    status: 'Upcoming',
  });

  await logActivity({
    user: actingUser._id,
    action: 'BOOKING_CREATED',
    entityType: 'Booking',
    entityId: booking._id,
    details: `Resource ${asset.assetCode || asset.assetName} booked ${start.toISOString()} - ${end.toISOString()}`,
  });

  await notify({
    recipient: actingUser._id,
    type: 'Booking Confirmed',
    message: `Your booking for ${asset.assetName} is confirmed.`,
    relatedEntity: booking._id,
  });

  return booking.populate('resource', 'assetCode assetName');
}

/**
 * Single PUT /booking entry point covering reschedule and cancel.
 */
export async function updateBooking(bookingId, payload, actingUser) {
  if (!bookingId) throw new AppError('bookingId is required', 400);

  const booking = await Booking.findById(bookingId);
  if (!booking) throw new AppError('Booking not found', 404);
  if (['Cancelled', 'Completed'].includes(booking.status)) {
    throw new AppError(`Cannot modify a booking that is already ${booking.status}`, 409);
  }

  const isOwner = String(booking.bookedBy) === String(actingUser._id);
  const isPrivileged = ['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'Admin', 'AssetManager', 'DepartmentHead'].includes(actingUser.role);
  if (!isOwner && !isPrivileged) {
    throw new AppError('Not authorized to modify this booking', 403);
  }

  if (payload.action === 'cancel') {
    booking.status = 'Cancelled';
    booking.cancelledBy = actingUser._id;
    booking.cancelReason = payload.cancelReason || '';
    await booking.save();

    await logActivity({
      user: actingUser._id,
      action: 'BOOKING_CANCELLED',
      entityType: 'Booking',
      entityId: booking._id,
      details: booking.cancelReason,
    });

    await notify({
      recipient: booking.bookedBy,
      type: 'Booking Cancelled',
      message: 'Your booking has been cancelled.',
      relatedEntity: booking._id,
    });

    return booking;
  }

  // Reschedule path
  const newStart = payload.startTime ? new Date(payload.startTime) : booking.startTime;
  const newEnd = payload.endTime ? new Date(payload.endTime) : booking.endTime;
  if (newStart >= newEnd) throw new AppError('Invalid startTime/endTime for booking', 400);

  if (payload.startTime || payload.endTime) {
    const conflict = await hasOverlap(booking.resource, newStart, newEnd, booking._id);
    if (conflict) {
      throw new AppError(
        `Resource is already booked from ${conflict.startTime.toISOString()} to ${conflict.endTime.toISOString()}`,
        409
      );
    }
    booking.startTime = newStart;
    booking.endTime = newEnd;
    booking.reminderSent = false;
    booking.status = 'Upcoming';
  }
  if (payload.purpose !== undefined) booking.purpose = payload.purpose;

  await booking.save();

  await logActivity({
    user: actingUser._id,
    action: 'BOOKING_RESCHEDULED',
    entityType: 'Booking',
    entityId: booking._id,
    details: `New slot ${booking.startTime.toISOString()} - ${booking.endTime.toISOString()}`,
  });

  return booking;
}

/** Calendar view: bookings for one resource, optionally within a date range. */
export async function getBookingsForResource(resourceId, { from, to } = {}) {
  if (!resourceId) throw new AppError('resourceId is required', 400);
  const query = { resource: resourceId };
  if (from || to) {
    query.startTime = {};
    if (from) query.startTime.$gte = new Date(from);
    if (to) query.startTime.$lte = new Date(to);
  }
  const bookings = await Booking.find(query).sort({ startTime: 1 });
  return bookings.map(refreshComputedStatus);
}

/** For a notification worker/cron: sends "starts soon" reminders once per booking. */
export async function getUpcomingBookingsForReminder(windowMinutes = 30) {
  const now = new Date();
  const windowEnd = new Date(now.getTime() + windowMinutes * 60000);
  const bookings = await Booking.find({
    status: 'Upcoming',
    reminderSent: false,
    startTime: { $gte: now, $lte: windowEnd },
  }).populate('resource', 'assetName assetCode');

  for (const booking of bookings) {
    await notify({
      recipient: booking.bookedBy,
      type: 'Booking Reminder',
      message: `Reminder: your booking for ${booking.resource?.assetName || 'a resource'} starts soon.`,
      relatedEntity: booking._id,
    });
    booking.reminderSent = true;
    await booking.save();
  }
  return bookings;
}

/** For a cron/worker: flips Upcoming -> Ongoing -> Completed as time passes. */
export async function refreshAllBookingStatuses() {
  const now = new Date();
  await Booking.updateMany(
    { status: 'Upcoming', startTime: { $lte: now }, endTime: { $gt: now } },
    { $set: { status: 'Ongoing' } }
  );
  await Booking.updateMany(
    { status: { $in: ['Upcoming', 'Ongoing'] }, endTime: { $lte: now } },
    { $set: { status: 'Completed' } }
  );
}
