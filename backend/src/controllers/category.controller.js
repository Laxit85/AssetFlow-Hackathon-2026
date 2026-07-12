import Category from "../models/Category.js";

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.status(200).json({ success: true, data: categories });
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }
  res.status(200).json({ success: true, data: category });
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, data: category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!category) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }
  res.status(200).json({ success: true, data: category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }
  res.status(200).json({ success: true, data: {} });
});
