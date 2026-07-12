import Allocation from "../models/Allocation.js";
import Asset from "../models/Asset.js";
import Department from "../models/Department.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import ActivityLog from "../models/ActivityLog.js";
import { logger } from "../utils/logger.js";

export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

const ALLOCATABLE_ASSET_STATUSES = ['AVAILABLE', 'Available'];

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

/** Currently active (or transfer-pending) allocation for an asset, if any. */
export async function getActiveAllocationForAsset(assetId) {
  return Allocation.findOne({ asset: assetId, status: { $in: ['Active', 'TransferPending'] } })
    .populate('allocatedToEmployee', 'firstName lastName email')
    .populate('allocatedToDepartment', 'name departmentName');
}

/**
 * Allocate an asset to an employee or a department.
 * Blocks double-allocation: if the asset already has an active holder,
 * throws a 409 with the current holder info and a transferSuggested flag
 */
export async function allocateAsset(payload, actingUser) {
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
      ? `${existingActive.allocatedToEmployee.firstName} ${existingActive.allocatedToEmployee.lastName}`
      : (existingActive.allocatedToDepartment?.departmentName || existingActive.allocatedToDepartment?.name);
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

  asset.status = 'ALLOCATED';
  await asset.save();

  await logActivity({
    user: actingUser._id,
    action: 'ASSET_ALLOCATED',
    entityType: 'Allocation',
    entityId: allocation._id,
    details: `Asset ${asset.assetCode || asset._id} allocated`,
  });

  await notify({
    recipient: employeeId || null,
    type: 'Asset Assigned',
    message: `Asset ${asset.assetCode || asset.assetName} has been allocated to you.`,
    relatedEntity: allocation._id,
  });

  return allocation.populate([
    { path: 'asset' },
    { path: 'allocatedToEmployee', select: 'firstName lastName email' },
    { path: 'allocatedToDepartment', select: 'departmentName name' },
  ]);
}

/** Return / Check-in an asset, releasing it back to Available. */
export async function returnAsset(payload, actingUser) {
  const { assetId, returnCondition, returnNotes } = payload;

  if (!assetId) throw new AppError('assetId is required', 400);

  const asset = await Asset.findById(assetId);
  if (!asset) throw new AppError('Asset not found', 404);

  const allocation = await getActiveAllocationForAsset(assetId);
  if (!allocation) throw new AppError('No active allocation record found for this asset', 409);

  allocation.status = 'Returned';
  allocation.actualReturnDate = new Date();
  allocation.returnCondition = returnCondition || 'Good';
  allocation.returnNotes = returnNotes || '';
  allocation.approvedReturnBy = actingUser._id;
  await allocation.save();

  asset.status = 'AVAILABLE';
  if (returnCondition === 'Damaged') {
    asset.status = 'UNDER_MAINTENANCE';
  }
  await asset.save();

  await logActivity({
    user: actingUser._id,
    action: 'ASSET_RETURNED',
    entityType: 'Allocation',
    entityId: allocation._id,
    details: `Returned in ${allocation.returnCondition} condition`,
  });

  await notify({
    recipient: allocation.allocatedToEmployee,
    type: 'Asset Returned',
    message: `Asset ${asset.assetName} has been returned.`,
    relatedEntity: allocation._id,
  });

  return allocation;
}

/** Initiate an asset transfer request from the current allocation. */
export async function requestTransfer(payload, actingUser) {
  const { assetId, requestedToEmployeeId, requestedToDepartmentId, reason } = payload;

  if (!assetId) throw new AppError('assetId is required', 400);
  if (!requestedToEmployeeId && !requestedToDepartmentId) {
    throw new AppError('Specify target employee or department for transfer', 400);
  }
  if (requestedToEmployeeId && requestedToDepartmentId) {
    throw new AppError('Specify either target employee or department, not both', 400);
  }

  const allocation = await getActiveAllocationForAsset(assetId);
  if (!allocation) throw new AppError('No active allocation found for this asset', 409);

  if (allocation.status === 'TransferPending') {
    throw new AppError('A transfer request is already pending for this asset', 409);
  }

  allocation.status = 'TransferPending';
  allocation.transferRequest = {
    requestedBy: actingUser._id,
    requestedToEmployee: requestedToEmployeeId || null,
    requestedToDepartment: requestedToDepartmentId || null,
    reason: reason || '',
    status: 'Pending',
    requestedAt: new Date(),
  };

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

/** Decide on a pending transfer (Approve or Reject). */
export async function decideTransfer(payload, actingUser) {
  const { allocationId, decision, decisionNote } = payload;

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
    { path: 'allocatedToEmployee', select: 'firstName lastName email' },
    { path: 'allocatedToDepartment', select: 'departmentName name' },
  ]);
}

/** Full allocation history for an asset (Screen 4: per-asset history). */
export async function getAllocationHistory(assetId) {
  if (!assetId) throw new AppError('assetId is required', 400);
  return Allocation.find({ asset: assetId })
    .sort({ createdAt: -1 })
    .populate('allocatedToEmployee', 'firstName lastName email')
    .populate('allocatedToDepartment', 'departmentName name')
    .populate('allocatedBy', 'firstName lastName email');
}

/** Active allocations past their expected return date; flips them to Overdue. */
export async function getOverdueAllocations() {
  const now = new Date();
  const overdue = await Allocation.find({
    status: 'Active',
    expectedReturnDate: { $ne: null, $lt: now },
  })
    .populate('asset', 'assetCode assetName')
    .populate('allocatedToEmployee', 'firstName lastName email')
    .populate('allocatedToDepartment', 'departmentName name');

  if (overdue.length) {
    await Allocation.updateMany(
      { _id: { $in: overdue.map((a) => a._id) } },
      { $set: { status: 'Overdue' } }
    );
  }
  return overdue;
}

/** Get all allocations across the organization. */
export async function getAllAllocations() {
  return Allocation.find()
    .sort({ createdAt: -1 })
    .populate("asset")
    .populate("allocatedToEmployee", "firstName lastName email")
    .populate("allocatedToDepartment", "departmentName name")
    .populate("allocatedBy", "firstName lastName email");
}
