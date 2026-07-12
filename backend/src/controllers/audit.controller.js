import * as auditService from "../services/audit.service.js";

/**
 * NOTE ON ASSUMPTIONS
 * -------------------
 * 1. Import path for the service is assumed to be ../services/audit.service.js
 *    — adjust to match your actual folder structure.
 * 2. Auth middleware is assumed to attach the logged-in user to req.user
 *    with at least an _id field (i.e. req.user._id). Adjust getUserId()
 *    below if your auth middleware uses a different shape (e.g. req.user.id).
 * 3. Every controller is a thin wrapper: parse req -> call service -> shape
 *    response. All validation/business logic lives in the service layer.
 * 4. Errors thrown by the service carry a `statusCode` property
 *    (ServiceError). Anything without one defaults to 500.
 */

const getUserId = (req) => req.user?._id || req.user?.id;

const handleError = (res, err) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong",
  });
};

// ---------------------------------------------------------------------------
// AuditCycle controllers
// ---------------------------------------------------------------------------

export const createAuditCycle = async (req, res) => {
  try {
    const auditCycle = await auditService.createAuditCycle(req.body, getUserId(req), req.ip);
    return res.status(201).json({ success: true, data: auditCycle });
  } catch (err) {
    return handleError(res, err);
  }
};

export const getAuditCycles = async (req, res) => {
  try {
    const result = await auditService.getAuditCycles(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return handleError(res, err);
  }
};

export const getAuditCycleById = async (req, res) => {
  try {
    const auditCycle = await auditService.getAuditCycleById(req.params.id);
    return res.status(200).json({ success: true, data: auditCycle });
  } catch (err) {
    return handleError(res, err);
  }
};

export const updateAuditCycle = async (req, res) => {
  try {
    const auditCycle = await auditService.updateAuditCycle(
      req.params.id,
      req.body,
      getUserId(req),
      req.ip
    );
    return res.status(200).json({ success: true, data: auditCycle });
  } catch (err) {
    return handleError(res, err);
  }
};

export const deleteAuditCycle = async (req, res) => {
  try {
    const result = await auditService.deleteAuditCycle(req.params.id, getUserId(req), req.ip);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return handleError(res, err);
  }
};

export const getAuditCycleSummary = async (req, res) => {
  try {
    const summary = await auditService.getAuditCycleSummary(req.params.id);
    return res.status(200).json({ success: true, data: summary });
  } catch (err) {
    return handleError(res, err);
  }
};

// ---------------------------------------------------------------------------
// AuditItem controllers
// ---------------------------------------------------------------------------

export const createAuditItem = async (req, res) => {
  try {
    const auditItem = await auditService.createAuditItem(req.body, getUserId(req), req.ip);
    return res.status(201).json({ success: true, data: auditItem });
  } catch (err) {
    return handleError(res, err);
  }
};

export const bulkCreateAuditItems = async (req, res) => {
  try {
    const { auditCycleId, items } = req.body;
    const created = await auditService.bulkCreateAuditItems(
      auditCycleId,
      items,
      getUserId(req),
      req.ip
    );
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    return handleError(res, err);
  }
};

export const getAuditItems = async (req, res) => {
  try {
    const result = await auditService.getAuditItems(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return handleError(res, err);
  }
};

export const getAuditItemById = async (req, res) => {
  try {
    const auditItem = await auditService.getAuditItemById(req.params.id);
    return res.status(200).json({ success: true, data: auditItem });
  } catch (err) {
    return handleError(res, err);
  }
};

export const updateAuditItem = async (req, res) => {
  try {
    const auditItem = await auditService.updateAuditItem(
      req.params.id,
      req.body,
      getUserId(req),
      req.ip
    );
    return res.status(200).json({ success: true, data: auditItem });
  } catch (err) {
    return handleError(res, err);
  }
};

export const deleteAuditItem = async (req, res) => {
  try {
    const result = await auditService.deleteAuditItem(req.params.id, getUserId(req), req.ip);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return handleError(res, err);
  }
};