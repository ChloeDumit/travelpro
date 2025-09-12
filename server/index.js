import app from "./app.js";
import { config } from "./config/index.js";
import { db } from "./config/database.js";
import logger from "./utils/logger.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize database connection
const startServer = async () => {
  try {
    // Connect to database
    await db.connect();

    // Start server
    const PORT = process.env.PORT || config.port || 3001;
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
