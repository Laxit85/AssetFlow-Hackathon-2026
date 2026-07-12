import User from "../models/User.js";

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export const getEmployees = asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.role) query.role = req.query.role.toUpperCase();
  if (req.query.department) query.department = req.query.department;
  if (req.query.status) query.status = req.query.status.toUpperCase();

  const employees = await User.find(query)
    .populate("department");

  res.status(200).json({ success: true, data: employees });
});

export const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await User.findById(req.params.id)
    .populate("department");
  if (!employee) {
    return res.status(404).json({ success: false, message: "Employee not found" });
  }
  res.status(200).json({ success: true, data: employee });
});

export const createEmployee = asyncHandler(async (req, res) => {
  const employee = await User.create(req.body);
  const employeeResponse = employee.toObject();
  delete employeeResponse.password;
  res.status(201).json({ success: true, data: employeeResponse });
});

export const updateEmployee = asyncHandler(async (req, res) => {
  // If updating password, it will be hashed by pre-save hook in User model
  // but if password is empty string/undefined, delete it so it is not updated to blank
  if (!req.body.password) {
    delete req.body.password;
  }

  // To trigger pre-save hooks correctly when updating, we fetch and then update
  const employee = await User.findById(req.params.id);
  if (!employee) {
    return res.status(404).json({ success: false, message: "Employee not found" });
  }

  Object.assign(employee, req.body);
  await employee.save();

  const employeeResponse = employee.toObject();
  delete employeeResponse.password;

  res.status(200).json({ success: true, data: employeeResponse });
});

export const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await User.findByIdAndDelete(req.params.id);
  if (!employee) {
    return res.status(404).json({ success: false, message: "Employee not found" });
  }
  res.status(200).json({ success: true, data: {} });
});
