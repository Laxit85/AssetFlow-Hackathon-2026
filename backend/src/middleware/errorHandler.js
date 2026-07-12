import { logger } from "../utils/logger.js";

/**
 * Global Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
  logger.error(err.stack || err.message);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = [];

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
    errors = Object.values(err.errors).map((val) => val.message);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = "Duplicate field value entered";
    errors = [`The value for ${field} already exists.`];
  }

  // Mongoose CastError
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Resource not found with id of ${err.value}`;
    errors = [`Invalid format for ${err.path}`];
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
    errors = ["Authentication token is invalid"];
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
    errors = ["Authentication token has expired"];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length > 0 ? errors : [message],
    error: process.env.NODE_ENV === "development" ? {
      message: err.message,
      stack: err.stack
    } : null
  });
};
