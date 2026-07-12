import Department from "../models/Department.js";

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export const getDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find()
    .populate("parentDepartment")
    .populate("departmentHead", "firstName lastName email");

  res.status(200).json({ success: true, data: departments });
});

export const getDepartmentById = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id)
    .populate("parentDepartment")
    .populate("departmentHead", "firstName lastName email");

  if (!department) {
    return res.status(404).json({ success: false, message: "Department not found" });
  }
  res.status(200).json({ success: true, data: department });
});

export const createDepartment = asyncHandler(async (req, res) => {
  const department = await Department.create(req.body);
  res.status(201).json({ success: true, data: department });
});

export const updateDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!department) {
    return res.status(404).json({ success: false, message: "Department not found" });
  }
  res.status(200).json({ success: true, data: department });
});

export const deleteDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findByIdAndDelete(req.params.id);
  if (!department) {
    return res.status(404).json({ success: false, message: "Department not found" });
  }
  res.status(200).json({ success: true, data: {} });
});
