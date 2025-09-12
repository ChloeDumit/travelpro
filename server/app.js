import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config/index.js";
import { errorHandler } from "./middleware/error.js";
import logger from "./utils/logger.js";
import { db } from "./config/database.js";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.js";
import salesRoutes from "./routes/sales.js";
import clientRoutes from "./routes/client.routes.js";
import suppliersRoutes from "./routes/suppliers.js";
import operatorsRoutes from "./routes/operators.js";
import classificationsRoutes from "./routes/classifications.js";
import supplierPaymentsRoutes from "./routes/supplier-payments.js";
import paymentsRoutes from "./routes/payments.js";
import passengerRoutes from "./routes/passenger.routes.js";
import companySettingsRoutes from "./routes/company-settings.js";

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173", // Vite dev server
  "http://localhost:3000", // Alternative dev port
  "https://www.tripsoffice.com", // Production frontend
  "https://tripsoffice.com", // Production frontend without www
].filter(Boolean); // Remove any undefined values

console.log("Allowed CORS origins:", allowedOrigins);
console.log("FRONTEND_URL env var:", process.env.FRONTEND_URL);

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("CORS request from:", origin);

      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        console.log("Origin allowed:", origin);
        return callback(null, true);
      } else {
        console.log("Origin blocked:", origin);
        console.log("Allowed origins:", allowedOrigins);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    exposedHeaders: ["Authorization"],
    optionsSuccessStatus: 200, // for legacy browsers
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/suppliers", suppliersRoutes);
app.use("/api/operators", operatorsRoutes);
app.use("/api/classifications", classificationsRoutes);
app.use("/api/supplier-payments", supplierPaymentsRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/passengers", passengerRoutes);
app.use("/api/company", companySettingsRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down gracefully");
  await db.disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  logger.info("SIGINT received, shutting down gracefully");
  await db.disconnect();
  process.exit(0);
});

export default app;
