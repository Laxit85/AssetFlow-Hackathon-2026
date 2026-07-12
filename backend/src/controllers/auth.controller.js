import * as authService from "../services/auth.service.js";

// Helper for HTTPOnly cookie settings
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000 // 1 day
});

/**
 * Register a new user
 */
export const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user and establish session cookie
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser(email, password);

    // Set JWT in cookie
    res.cookie("token", token, getCookieOptions());

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { user, token }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user by clearing cookie
 */
export const logout = async (req, res, next) => {
  try {
    res.cookie("token", "none", {
      httpOnly: true,
      expires: new Date(Date.now() + 5 * 1000), // expires in 5 seconds
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve current authenticated user profile
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getUserProfile(req.user._id);

    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};
