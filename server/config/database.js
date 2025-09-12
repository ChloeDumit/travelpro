import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger.js";

class DatabaseConnection {
  constructor() {
    this.prisma = null;
  }

  async connect() {
    try {
      this.prisma = new PrismaClient({
        log: [
          { level: "query", emit: "event" },
          { level: "error", emit: "stdout" },
          { level: "info", emit: "stdout" },
          { level: "warn", emit: "stdout" },
        ],
      });

      // Log queries in development
      if (process.env.NODE_ENV === "development") {
        this.prisma.$on("query", (e) => {
          logger.debug(`Query: ${e.query}`);
          logger.debug(`Params: ${e.params}`);
          logger.debug(`Duration: ${e.duration}ms`);
        });
      }

      await this.prisma.$connect();
      logger.info("Database connected successfully");
    } catch (error) {
      logger.error("Database connection failed:", error);
      throw error;
    }
  }

  async disconnect() {
    if (this.prisma) {
      await this.prisma.$disconnect();
      logger.info("Database disconnected");
    }
  }

  getClient() {
    if (!this.prisma) {
      throw new Error("Database not connected");
    }
    return this.prisma;
  }
}

export const db = new DatabaseConnection();
export default db;
