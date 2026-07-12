const Allocation = require('../models/Allocation');
const Asset = require('../models/Asset');
const Department = require('../models/Department');
const User = require('../models/User');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');
let logger;
try {
  // optional - falls back to console if utils/logger.js isn't wired up yet
  logger = require('../utils/logger');
} catch (e) {
  logger = console;
}

class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

const ALLOCATABLE_ASSET_STATUSES = ['Available'];

async function logActivity({ user, action, entityType, entityId, details }) {
  try {
    await ActivityLog.create({ user, action, entityType, entityId, details });
  } catch (err) {
    logger.error?.(`[ActivityLog] failed: ${err.message}`);
  }
}

async function notify({ recipient, type, message, relatedEntity }) {
  try {
    if (!recipient) return;
    await Notification.create({ recipient, type, message, relatedEntity });
  } catch (err) {
    logger.error?.(`[Notification] failed: ${err.message}`);
  }
}

/** Currently active (or transfer-pending) allocation for an asset, if any. */
async function getActiveAllocationForAsset(assetId) {
  return Allocation.findOne({ asset: assetId, status: { $in: ['Active', 'TransferPending'] } })
    .populate('allocatedToEmployee', 'name email')
    .populate('allocatedToDepartment', 'name');
}

/**
 * Allocate an asset to an employee or a department.
 * Blocks double-allocation: if the asset already has an active holder,
 * throws a 409 with the current holder info and a transferSuggested flag
 * so the controller/frontend can offer the "Transfer Request" action.
 */
async function allocateAsset(payload, actingUser) {
  const { assetId, employeeId, departmentId, expectedReturnDate } = payload;

  if (!assetId) throw new AppError('assetId is required', 400);
  if (!employeeId && !departmentId) {
    throw new AppError('Provide either employeeId or departmentId to allocate the asset', 400);
  }
  if (employeeId && departmentId) {
    throw new AppError('Allocate to either an employee or a department, not both', 400);
  }

  const asset = await Asset.findById(assetId);
  if (!asset) throw new AppError('Asset not found', 404);

  const existingActive = await getActiveAllocationForAsset(assetId);
  if (existingActive) {
    const holderName = existingActive.allocatedToEmployee
      ? existingActive.allocatedToEmployee.name
      : existingActive.allocatedToDepartment?.name;
    const err = new AppError(
      `Asset is currently held by ${holderName || 'another holder'}. Raise a transfer request instead.`,
      409
    );
    err.currentAllocation = existingActive;
    err.transferSuggested = true;
    throw err;
  }

  if (!ALLOCATABLE_ASSET_STATUSES.includes(asset.status)) {
    throw new AppError(`Asset is not available for allocation (current status: ${asset.status})`, 409);
  }

  if (employeeId) {
    const employee = await User.findById(employeeId);
    if (!employee) throw new AppError('Employee not found', 404);
  }
  if (departmentId) {
    const dept = await Department.findById(departmentId);
    if (!dept) throw new AppError('Department not found', 404);
  }

  const allocation = await Allocation.create({
    asset: assetId,
    allocatedToEmployee: employeeId || null,
    allocatedToDepartment: departmentId || null,
    allocatedBy: actingUser._id,
    expectedReturnDate: expectedReturnDate || null,
    status: 'Active',
  });

  asset.status = 'Allocated';
  await asset.save();

  await logActivity({
    user: actingUser._id,
    action: 'ASSET_ALLOCATED',
    entityType: 'Allocation',
    entityId: allocation._id,
    details: `Asset ${asset.assetTag || asset._id} allocated`,
  });

  await notify({
    recipient: employeeId || null,
    type: 'Asset Assigned',
    message: `Asset ${asset.assetTag || asset.name} has been allocated to you.`,
    relatedEntity: allocation._id,
  });

  return allocation.populate([
    { path: 'asset' },
    { path: 'allocatedToEmployee', select: 'name email' },
    { path: 'allocatedToDepartment', select: 'name' },
  ]);
}

/** Mark an allocation returned, capture condition/notes, flip asset back to Available. */
async function returnAsset(payload, actingUser) {
  const { allocationId, condition, notes } = payload;
  if (!allocationId) throw new AppError('allocationId is required', 400);

  const allocation = await Allocation.findById(allocationId);
  if (!allocation) throw new AppError('Allocation not found', 404);
  if (!['Active', 'Overdue'].includes(allocation.status)) {
    throw new AppError(`Allocation is not active (current status: ${allocation.status})`, 409);
  }

  allocation.actualReturnDate = new Date();
  allocation.status = 'Returned';
  allocation.returnCondition = condition || null;
  allocation.returnNotes = notes || null;
  allocation.approvedReturnBy = actingUser._id;
  await allocation.save();

  const asset = await Asset.findById(allocation.asset);
  if (asset) {
    asset.status = 'Available';
    if (condition) asset.condition = condition;
    await asset.save();
  }

  await logActivity({
    user: actingUser._id,
    action: 'ASSET_RETURNED',
    entityType: 'Allocation',
    entityId: allocation._id,
    details: `Asset returned, condition: ${condition || 'not specified'}`,
  });

  await notify({
    recipient: allocation.allocatedBy,
    type: 'Asset Assigned',
    message: `Return recorded for allocation ${allocation._id}.`,
    relatedEntity: allocation._id,
  });

  return allocation;
}

/** Employee/holder raises a transfer request against their active allocation. */
async function requestTransfer(payload, actingUser) {
  const { allocationId, toEmployeeId, toDepartmentId, reason } = payload;
  if (!allocationId) throw new AppError('allocationId is required', 400);

  if (!toEmployeeId && !toDepartmentId) {
    throw new AppError('Provide either toEmployeeId or toDepartmentId for the transfer', 400);
  }
  if (toEmployeeId && toDepartmentId) {
    throw new AppError('Transfer to either an employee or a department, not both', 400);
  }

  const allocation = await Allocation.findById(allocationId);
  if (!allocation) throw new AppError('Allocation not found', 404);
  if (allocation.status !== 'Active') {
    throw new AppError(`Only active allocations can be transferred (current status: ${allocation.status})`, 409);
  }
  if (allocation.transferRequest && allocation.transferRequest.status === 'Pending') {
    throw new AppError('A transfer request is already pending for this allocation', 409);
  }

  allocation.transferRequest = {
    requestedBy: actingUser._id,
    requestedToEmployee: toEmployeeId || null,
    requestedToDepartment: toDepartmentId || null,
    reason: reason || '',
    status: 'Pending',
    requestedAt: new Date(),
  };
  allocation.status = 'TransferPending';
  await allocation.save();

  await logActivity({
    user: actingUser._id,
    action: 'TRANSFER_REQUESTED',
    entityType: 'Allocation',
    entityId: allocation._id,
    details: reason || '',
  });

  return allocation;
}

/**
 * Asset Manager / Department Head approves or rejects a pending transfer.
 * On approval: closes the current allocation (status Returned) and creates a
 * brand new Allocation for the new holder, keeping full history via supersededBy.
 */
async function decideTransfer(payload, actingUser) {
  const { allocationId, decision, decisionNote } = payload; // decision: 'Approved' | 'Rejected'

  if (!['Approved', 'Rejected'].includes(decision)) {
    throw new AppError('decision must be "Approved" or "Rejected"', 400);
  }

  const allocation = await Allocation.findById(allocationId);
  if (!allocation) throw new AppError('Allocation not found', 404);
  if (!allocation.transferRequest || allocation.transferRequest.status !== 'Pending') {
    throw new AppError('No pending transfer request for this allocation', 409);
  }

  allocation.transferRequest.status = decision;
  allocation.transferRequest.decidedBy = actingUser._id;
  allocation.transferRequest.decidedAt = new Date();
  allocation.transferRequest.decisionNote = decisionNote || '';

  if (decision === 'Rejected') {
    allocation.status = 'Active';
    await allocation.save();

    await logActivity({
      user: actingUser._id,
      action: 'TRANSFER_REJECTED',
      entityType: 'Allocation',
      entityId: allocation._id,
      details: decisionNote || '',
    });

    return allocation;
  }

  // Approved
  allocation.status = 'Returned';
  allocation.actualReturnDate = new Date();

  const newAllocation = await Allocation.create({
    asset: allocation.asset,
    allocatedToEmployee: allocation.transferRequest.requestedToEmployee || null,
    allocatedToDepartment: allocation.transferRequest.requestedToDepartment || null,
    allocatedBy: actingUser._id,
    status: 'Active',
  });

  allocation.supersededBy = newAllocation._id;
  await allocation.save();

  await logActivity({
    user: actingUser._id,
    action: 'TRANSFER_APPROVED',
    entityType: 'Allocation',
    entityId: newAllocation._id,
    details: `Re-allocated from allocation ${allocation._id}`,
  });

  await notify({
    recipient: newAllocation.allocatedToEmployee,
    type: 'Transfer Approved',
    message: 'An asset has been transferred to you.',
    relatedEntity: newAllocation._id,
  });

  return newAllocation.populate([
    { path: 'asset' },
    { path: 'allocatedToEmployee', select: 'name email' },
    { path: 'allocatedToDepartment', select: 'name' },
  ]);
}

/** Full allocation history for an asset (Screen 4: per-asset history). */
async function getAllocationHistory(assetId) {
  if (!assetId) throw new AppError('assetId is required', 400);
  return Allocation.find({ asset: assetId })
    .sort({ createdAt: -1 })
    .populate('allocatedToEmployee', 'name email')
    .populate('allocatedToDepartment', 'name')
    .populate('allocatedBy', 'name email');
}

/** Active allocations past their expected return date; flips them to Overdue. */
async function getOverdueAllocations() {
  const now = new Date();
  const overdue = await Allocation.find({
    status: 'Active',
    expectedReturnDate: { $ne: null, $lt: now },
  })
    .populate('asset', 'assetTag name')
    .populate('allocatedToEmployee', 'name email')
    .populate('allocatedToDepartment', 'name');

  if (overdue.length) {
    await Allocation.updateMany(
      { _id: { $in: overdue.map((a) => a._id) } },
      { $set: { status: 'Overdue' } }
    );
  }
  return overdue;
}

module.exports = {
  AppError,
  allocateAsset,
  returnAsset,
  requestTransfer,
  decideTransfer,
  getAllocationHistory,
  getOverdueAllocations,
  getActiveAllocationForAsset,
};
