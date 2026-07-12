import mongoose from "mongoose";
import AuditCycle from "../models/auditCycle.model.js";
import AuditItem from "../models/auditItem.model.js";
import ActivityLog from "../models/activityLog.model.js";

/**
 * NOTE ON ASSUMPTIONS
 * -------------------
 * 1. Model file paths are assumed to be:
 *    ../models/auditCycle.model.js
 *    ../models/auditItem.model.js
 *    ../models/activityLog.model.js
 *    Adjust the import paths above to match your actual folder structure.
 *
 * 2. ActivityLog schema (as provided):
 *    {
 *      user: ObjectId (ref: "User"),
 *      module: String (enum, includes "AUDIT"),
 *      action: String,        // free text, e.g. "CREATE_AUDIT_CYCLE"
 *      entityId: ObjectId,    // id of the affected document
 *      description: String,
 *      ipAddress: String,
 *    }
 *    Since the module enum only has a single "AUDIT" value (no separate
 *    AUDIT_CYCLE / AUDIT_ITEM entries), the distinction between the two is
 *    carried in the `action` string instead (e.g. "CREATE_AUDIT_CYCLE" vs
 *    "CREATE_AUDIT_ITEM"). If you add more granular enum values later,
 *    just change MODULE below.
 *
 * 3. Activity logging is fire-and-forget (wrapped in try/catch) so a logging
 *    failure never blocks the actual audit operation.
 *
 * 4. ipAddress is accepted as an optional param on every service function
 *    (defaults to ""); pass it from req.ip in the controller layer.
 */

const MODULE = "AUDIT";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

class ServiceError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

const logActivity = async ({ user, action, entityId, description, ipAddress = "" }) => {
  try {
    await ActivityLog.create({
      user,
      module: MODULE,
      action,
      entityId,
      description,
      ipAddress,
    });
  } catch (err) {
    // Never let logging failures break the main operation
    console.error("ActivityLog write failed:", err.message);
  }
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const buildPagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

// ---------------------------------------------------------------------------
// AuditCycle CRUD
// ---------------------------------------------------------------------------

const AUDIT_CYCLE_POPULATE = [
  { path: "department", select: "name code" },
  { path: "createdBy", select: "name email" },
];

export const createAuditCycle = async (data, userId, ipAddress) => {
  const { cycleName, department, location, startDate, endDate, status } = data;

  if (!cycleName || !department || !startDate || !endDate) {
    throw new ServiceError(
      "cycleName, department, startDate and endDate are required",
      400
    );
  }

  if (new Date(startDate) > new Date(endDate)) {
    throw new ServiceError("startDate cannot be after endDate", 400);
  }

  const auditCycle = await AuditCycle.create({
    cycleName,
    department,
    location,
    startDate,
    endDate,
    status,
    createdBy: userId,
  });

  await logActivity({
    user: userId,
    action: "CREATE_AUDIT_CYCLE",
    entityId: auditCycle._id,
    description: `Audit cycle "${auditCycle.cycleName}" (${auditCycle.auditCode}) created`,
    ipAddress,
  });

  return auditCycle.populate(AUDIT_CYCLE_POPULATE);
};

export const getAuditCycles = async (query = {}) => {
  const { page, limit, skip } = buildPagination(query);
  const { status, department, location, search, startDate, endDate, sortBy, sortOrder } = query;

  const filter = {};

  if (status) filter.status = status;
  if (department && isValidObjectId(department)) filter.department = department;
  if (location) filter.location = { $regex: location, $options: "i" };

  if (startDate || endDate) {
    filter.startDate = {};
    if (startDate) filter.startDate.$gte = new Date(startDate);
    if (endDate) filter.startDate.$lte = new Date(endDate);
  }

  if (search) {
    filter.$or = [
      { cycleName: { $regex: search, $options: "i" } },
      { auditCode: { $regex: search, $options: "i" } },
    ];
  }

  const sort = { [sortBy || "createdAt"]: sortOrder === "asc" ? 1 : -1 };

  const [data, total] = await Promise.all([
    AuditCycle.find(filter)
      .populate(AUDIT_CYCLE_POPULATE)
      .sort(sort)
      .skip(skip)
      .limit(limit),
    AuditCycle.countDocuments(filter),
  ]);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAuditCycleById = async (id) => {
  if (!isValidObjectId(id)) throw new ServiceError("Invalid audit cycle id", 400);

  const auditCycle = await AuditCycle.findById(id).populate(AUDIT_CYCLE_POPULATE);
  if (!auditCycle) throw new ServiceError("Audit cycle not found", 404);

  return auditCycle;
};

export const updateAuditCycle = async (id, data, userId, ipAddress) => {
  if (!isValidObjectId(id)) throw new ServiceError("Invalid audit cycle id", 400);

  const allowedFields = ["cycleName", "department", "location", "startDate", "endDate", "status"];
  const updates = {};
  for (const field of allowedFields) {
    if (data[field] !== undefined) updates[field] = data[field];
  }

  if (updates.startDate && updates.endDate && new Date(updates.startDate) > new Date(updates.endDate)) {
    throw new ServiceError("startDate cannot be after endDate", 400);
  }

  const auditCycle = await AuditCycle.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).populate(AUDIT_CYCLE_POPULATE);

  if (!auditCycle) throw new ServiceError("Audit cycle not found", 404);

  await logActivity({
    user: userId,
    action: "UPDATE_AUDIT_CYCLE",
    entityId: auditCycle._id,
    description: `Audit cycle "${auditCycle.cycleName}" (${auditCycle.auditCode}) updated`,
    ipAddress,
  });

  return auditCycle;
};

export const deleteAuditCycle = async (id, userId, ipAddress) => {
  if (!isValidObjectId(id)) throw new ServiceError("Invalid audit cycle id", 400);

  const auditCycle = await AuditCycle.findById(id);
  if (!auditCycle) throw new ServiceError("Audit cycle not found", 404);

  const itemCount = await AuditItem.countDocuments({ auditCycle: id });

  // Cascade delete related audit items
  if (itemCount > 0) {
    await AuditItem.deleteMany({ auditCycle: id });
  }

  await auditCycle.deleteOne();

  await logActivity({
    user: userId,
    action: "DELETE_AUDIT_CYCLE",
    entityId: id,
    description: `Audit cycle "${auditCycle.cycleName}" (${auditCycle.auditCode}) deleted along with ${itemCount} audit item(s)`,
    ipAddress,
  });

  return { deleted: true, auditCycleId: id, deletedItemsCount: itemCount };
};

// ---------------------------------------------------------------------------
// AuditItem CRUD
// ---------------------------------------------------------------------------

const AUDIT_ITEM_POPULATE = [
  { path: "auditCycle", select: "cycleName auditCode status" },
  { path: "asset", select: "name assetCode category" },
  { path: "auditor", select: "name email" },
];

export const createAuditItem = async (data, userId, ipAddress) => {
  const { auditCycle, asset, auditor, expectedLocation, actualLocation, result, remarks, verifiedAt } = data;

  if (!auditCycle || !asset || !auditor || !result) {
    throw new ServiceError("auditCycle, asset, auditor and result are required", 400);
  }

  if (!isValidObjectId(auditCycle)) throw new ServiceError("Invalid auditCycle id", 400);
  if (!isValidObjectId(asset)) throw new ServiceError("Invalid asset id", 400);
  if (!isValidObjectId(auditor)) throw new ServiceError("Invalid auditor id", 400);

  const cycleExists = await AuditCycle.exists({ _id: auditCycle });
  if (!cycleExists) throw new ServiceError("Audit cycle not found", 404);

  const auditItem = await AuditItem.create({
    auditCycle,
    asset,
    auditor,
    expectedLocation,
    actualLocation,
    result,
    remarks,
    verifiedAt,
  });

  await logActivity({
    user: userId,
    action: "CREATE_AUDIT_ITEM",
    entityId: auditItem._id,
    description: `Audit item created for asset with result "${result}"`,
    ipAddress,
  });

  return auditItem.populate(AUDIT_ITEM_POPULATE);
};

/**
 * Bulk create audit items in a single audit cycle — common when an auditor
 * submits a batch of scanned/verified assets at once.
 */
export const bulkCreateAuditItems = async (auditCycleId, items, userId, ipAddress) => {
  if (!isValidObjectId(auditCycleId)) throw new ServiceError("Invalid auditCycle id", 400);
  if (!Array.isArray(items) || items.length === 0) {
    throw new ServiceError("items must be a non-empty array", 400);
  }

  const cycleExists = await AuditCycle.exists({ _id: auditCycleId });
  if (!cycleExists) throw new ServiceError("Audit cycle not found", 404);

  const docs = items.map((item) => ({
    ...item,
    auditCycle: auditCycleId,
  }));

  const created = await AuditItem.insertMany(docs, { ordered: false });

  await logActivity({
    user: userId,
    action: "BULK_CREATE_AUDIT_ITEM",
    entityId: auditCycleId,
    description: `${created.length} audit item(s) bulk-created for audit cycle ${auditCycleId}`,
    ipAddress,
  });

  return created;
};

export const getAuditItems = async (query = {}) => {
  const { page, limit, skip } = buildPagination(query);
  const { auditCycle, asset, auditor, result, search, sortBy, sortOrder } = query;

  const filter = {};

  if (auditCycle && isValidObjectId(auditCycle)) filter.auditCycle = auditCycle;
  if (asset && isValidObjectId(asset)) filter.asset = asset;
  if (auditor && isValidObjectId(auditor)) filter.auditor = auditor;
  if (result) filter.result = result;

  if (search) {
    filter.$or = [
      { expectedLocation: { $regex: search, $options: "i" } },
      { actualLocation: { $regex: search, $options: "i" } },
      { remarks: { $regex: search, $options: "i" } },
    ];
  }

  const sort = { [sortBy || "createdAt"]: sortOrder === "asc" ? 1 : -1 };

  const [data, total] = await Promise.all([
    AuditItem.find(filter)
      .populate(AUDIT_ITEM_POPULATE)
      .sort(sort)
      .skip(skip)
      .limit(limit),
    AuditItem.countDocuments(filter),
  ]);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAuditItemById = async (id) => {
  if (!isValidObjectId(id)) throw new ServiceError("Invalid audit item id", 400);

  const auditItem = await AuditItem.findById(id).populate(AUDIT_ITEM_POPULATE);
  if (!auditItem) throw new ServiceError("Audit item not found", 404);

  return auditItem;
};

export const updateAuditItem = async (id, data, userId, ipAddress) => {
  if (!isValidObjectId(id)) throw new ServiceError("Invalid audit item id", 400);

  const allowedFields = [
    "expectedLocation",
    "actualLocation",
    "result",
    "remarks",
    "verifiedAt",
    "auditor",
  ];
  const updates = {};
  for (const field of allowedFields) {
    if (data[field] !== undefined) updates[field] = data[field];
  }

  const auditItem = await AuditItem.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).populate(AUDIT_ITEM_POPULATE);

  if (!auditItem) throw new ServiceError("Audit item not found", 404);

  await logActivity({
    user: userId,
    action: "UPDATE_AUDIT_ITEM",
    entityId: auditItem._id,
    description: `Audit item updated (result: ${auditItem.result})`,
    ipAddress,
  });

  return auditItem;
};

export const deleteAuditItem = async (id, userId, ipAddress) => {
  if (!isValidObjectId(id)) throw new ServiceError("Invalid audit item id", 400);

  const auditItem = await AuditItem.findById(id);
  if (!auditItem) throw new ServiceError("Audit item not found", 404);

  await auditItem.deleteOne();

  await logActivity({
    user: userId,
    action: "DELETE_AUDIT_ITEM",
    entityId: id,
    description: `Audit item deleted (was linked to audit cycle ${auditItem.auditCycle})`,
    ipAddress,
  });

  return { deleted: true, auditItemId: id };
};

// ---------------------------------------------------------------------------
// Reporting helper
// ---------------------------------------------------------------------------

/**
 * Aggregated result-count summary for a given audit cycle, e.g.
 * { VERIFIED: 120, MISSING: 3, DAMAGED: 5, total: 128 }
 */
export const getAuditCycleSummary = async (auditCycleId) => {
  if (!isValidObjectId(auditCycleId)) throw new ServiceError("Invalid auditCycle id", 400);

  const cycleExists = await AuditCycle.exists({ _id: auditCycleId });
  if (!cycleExists) throw new ServiceError("Audit cycle not found", 404);

  const results = await AuditItem.aggregate([
    { $match: { auditCycle: new mongoose.Types.ObjectId(auditCycleId) } },
    { $group: { _id: "$result", count: { $sum: 1 } } },
  ]);

  const summary = { VERIFIED: 0, MISSING: 0, DAMAGED: 0, total: 0 };
  for (const row of results) {
    summary[row._id] = row.count;
    summary.total += row.count;
  }

  return summary;
};

export { ServiceError };