import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { logger } from "./utils/logger.js";

// Load environment variables
dotenv.config();

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error(`UNCAUGHT EXCEPTION: ${err.message}`);
  logger.error(err.stack);
  logger.warn("Server shutting down due to uncaught exception...");
  process.exit(1);
});

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error(`UNHANDLED REJECTION: ${err.message}`);
  logger.error(err.stack);
  logger.warn("Server shutting down gracefully due to unhandled promise rejection...");
  server.close(() => {
    process.exit(1);
  });
});