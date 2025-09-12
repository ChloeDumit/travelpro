import { PrismaClient } from "@prisma/client";
import { AppError } from "../middleware/error.js";
import { HTTP_STATUS } from "../constants/index.js";
import logger from "../utils/logger.js";

export class BaseService {
  constructor(model) {
    this.model = model;
    this.prisma = new PrismaClient();
  }

  async findMany(where = {}, options = {}) {
    try {
      const { skip, take, orderBy, include } = options;

      const result = await this.prisma[this.model].findMany({
        where,
        skip,
        take,
        orderBy,
        include,
      });

      return result;
    } catch (error) {
      logger.error(`Error finding ${this.model}:`, error);
      throw new AppError(
        `Failed to fetch ${this.model}`,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findUnique(where, options = {}) {
    try {
      const { include } = options;

      const result = await this.prisma[this.model].findUnique({
        where,
        include,
      });

      if (!result) {
        throw new AppError(`${this.model} not found`, HTTP_STATUS.NOT_FOUND);
      }

      return result;
    } catch (error) {
      if (error instanceof AppError) throw error;

      logger.error(`Error finding ${this.model}:`, error);
      throw new AppError(
        `Failed to fetch ${this.model}`,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async create(data, options = {}) {
    try {
      const { include } = options;

      const result = await this.prisma[this.model].create({
        data,
        include,
      });

      logger.info(`${this.model} created successfully:`, { id: result.id });
      return result;
    } catch (error) {
      if (error.code === "P2002") {
        throw new AppError(
          `${this.model} already exists`,
          HTTP_STATUS.CONFLICT
        );
      }

      logger.error(`Error creating ${this.model}:`, error);
      throw new AppError(
        `Failed to create ${this.model}`,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(where, data, options = {}) {
    try {
      const { include } = options;

      // Check if record exists
      const existing = await this.prisma[this.model].findUnique({ where });
      if (!existing) {
        throw new AppError(`${this.model} not found`, HTTP_STATUS.NOT_FOUND);
      }

      const result = await this.prisma[this.model].update({
        where,
        data,
        include,
      });

      logger.info(`${this.model} updated successfully:`, { id: result.id });
      return result;
    } catch (error) {
      if (error instanceof AppError) throw error;

      logger.error(`Error updating ${this.model}:`, error);
      throw new AppError(
        `Failed to update ${this.model}`,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async delete(where) {
    try {
      // Check if record exists
      const existing = await this.prisma[this.model].findUnique({ where });
      if (!existing) {
        throw new AppError(`${this.model} not found`, HTTP_STATUS.NOT_FOUND);
      }

      await this.prisma[this.model].delete({ where });

      logger.info(`${this.model} deleted successfully:`, { where });
      return { message: `${this.model} deleted successfully` };
    } catch (error) {
      if (error instanceof AppError) throw error;

      logger.error(`Error deleting ${this.model}:`, error);
      throw new AppError(
        `Failed to delete ${this.model}`,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async count(where = {}) {
    try {
      return await this.prisma[this.model].count({ where });
    } catch (error) {
      logger.error(`Error counting ${this.model}:`, error);
      throw new AppError(
        `Failed to count ${this.model}`,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async exists(where) {
    try {
      const count = await this.prisma[this.model].count({ where });
      return count > 0;
    } catch (error) {
      logger.error(`Error checking ${this.model} existence:`, error);
      return false;
    }
  }

  // Multi-tenant helper
  addCompanyFilter(where, companyId) {
    return {
      ...where,
      companyId: parseInt(companyId, 10),
    };
  }

  // Pagination helper
  getPaginationOptions(page = 1, limit = 10) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    return {
      skip,
      take: limitNum,
      page: pageNum,
      limit: limitNum,
    };
  }

  // Cleanup method
  async cleanup() {
    await this.prisma.$disconnect();
  }
}
