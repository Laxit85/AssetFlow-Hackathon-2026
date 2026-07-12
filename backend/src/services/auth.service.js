import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

/**
 * Service to register a new user.
 * @param {object} userData - User register data.
 * @returns {promise<object>} Created user details without password.
 */
export const registerUser = async (userData) => {
  const { firstName, lastName, email, password, role, department, phone, designation } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("Email is already registered");
    error.statusCode = 400;
    throw error;
  }

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role: role ? role.toUpperCase() : "EMPLOYEE",
    department: department || null,
    phone,
    designation
  });

  // Convert mongoose document to plain JS object and strip password
  const userResponse = user.toObject();
  delete userResponse.password;

  return userResponse;
};

/**
 * Service to login user and generate JWT.
 * @param {string} email - User email address.
 * @param {string} password - User password.
 * @returns {promise<object>} Object containing user details and token.
 */
export const loginUser = async (email, password) => {
  // Find user and explicitly select password field
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // Compare passwords
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (user.status !== "ACTIVE") {
    const error = new Error("Account is inactive. Please contact support.");
    error.statusCode = 403;
    throw error;
  }

  // Generate JWT token
  const token = generateToken(user._id);

  // Convert to object and strip password
  const userResponse = user.toObject();
  delete userResponse.password;

  return { user: userResponse, token };
};

/**
 * Service to fetch user profile.
 * @param {string} userId - User ID.
 * @returns {promise<object>} Mongoose user document.
 */
export const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return user;
};
