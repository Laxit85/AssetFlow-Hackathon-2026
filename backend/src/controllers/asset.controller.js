import Asset from "../models/Asset.js";

// Helper for error handlers
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export const getAssets = asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.category) query.category = req.query.category;
  if (req.query.department) query.department = req.query.department;
  if (req.query.status) query.status = req.query.status.toUpperCase();

  const assets = await Asset.find(query)
    .populate("category")
    .populate("department");

  res.status(200).json({ success: true, data: assets });
});

export const getAssetById = asyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id)
    .populate("category")
    .populate("department");
  if (!asset) {
    return res.status(404).json({ success: false, message: "Asset not found" });
  }
  res.status(200).json({ success: true, data: asset });
});

export const createAsset = asyncHandler(async (req, res) => {
  const asset = await Asset.create(req.body);
  res.status(201).json({ success: true, data: asset });
});

export const updateAsset = asyncHandler(async (req, res) => {
  const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!asset) {
    return res.status(404).json({ success: false, message: "Asset not found" });
  }
  res.status(200).json({ success: true, data: asset });
});

export const deleteAsset = asyncHandler(async (req, res) => {
  const asset = await Asset.findByIdAndDelete(req.params.id);
  if (!asset) {
    return res.status(404).json({ success: false, message: "Asset not found" });
  }
  res.status(200).json({ success: true, data: {} });
});
