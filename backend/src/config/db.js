import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`❌ Database Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

// Handle graceful shutdown
const gracefulShutdown = async (signal) => {
  try {
    await mongoose.connection.close();
    logger.info(`MongoDB connection closed through app termination (${signal})`);
    process.exit(0);
  } catch (err) {
    logger.error(`Error during MongoDB graceful shutdown: ${err.message}`);
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

export default connectDB;