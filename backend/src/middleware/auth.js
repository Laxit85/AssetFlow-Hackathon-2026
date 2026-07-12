import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";
import { logger } from "../utils/logger.js";

/**
 * Middleware to protect routes and verify JWT.
 */
export const protect = async (req, res, next) => {
  let token;

  // 1. Read token from cookies or Authorization header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token is missing",
      errors: ["No authentication token provided"]
    });
  }

  try {
    // 2. Verify token
    const decoded = verifyToken(token);

    // 3. Find user and attach to req.user (excluding password)
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user not found",
        errors: ["The user belonging to this token no longer exists"]
      });
    }

    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        message: "Account is inactive",
        errors: ["Your account is deactivated. Please contact support"]
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    return res.status(401).json({
      success: false,
      message: "Not authorized, invalid token",
      errors: [error.message]
    });
  }
};
