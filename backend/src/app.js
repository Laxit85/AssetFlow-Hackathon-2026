import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";

import { logger } from "./utils/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import maintenanceRoutes from "./routes/maintenance.routes.js";

app.use("/api/maintenance", maintenanceRoutes);
// Future Route Imports
// import assetRoutes from "./routes/asset.routes.js";
// import bookingRoutes from "./routes/booking.routes.js";
// import maintenanceRoutes from "./routes/maintenance.routes.js";
// import auditRoutes from "./routes/audit.routes.js";

const app = express();

// 1. Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// 2. Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later",
    errors: ["Rate limit exceeded. Please wait 15 minutes before retrying."]
  }
});
app.use("/api", limiter);

// 3. Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. Request Logging
const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  }
);
app.use(morganMiddleware);

// 5. API Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Future Routes
// app.use("/api/assets", assetRoutes);
// app.use("/api/bookings", bookingRoutes);
// app.use("/api/maintenance", maintenanceRoutes);
// app.use("/api/audits", auditRoutes);

// 6. 404 Route Handler
app.use((req, res, next) => {
  const error = new Error(`Can't find ${req.originalUrl} on this server`);
  error.statusCode = 404;
  next(error);
});

// 7. Global Error Handler
app.use(errorHandler);

export default app;
