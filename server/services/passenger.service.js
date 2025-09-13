import { BaseService } from "./base.service.js";
import { AppError } from "../middleware/error.js";
import { HTTP_STATUS } from "../constants/index.js";
import logger from "../utils/logger.js";

export class PassengerService extends BaseService {
  constructor() {
    super("passenger");
  }

  async getAll(companyId, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        sortBy = "name",
        sortOrder = "asc",
      } = options;

      const where = this.addCompanyFilter({}, companyId);

      // Add search filter if provided
      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { passengerId: { contains: search, mode: "insensitive" } },
        ];
      }

      const pagination = this.getPaginationOptions(page, limit);
      const orderBy = { [sortBy]: sortOrder };

      const [passengers, total] = await Promise.all([
        this.findMany(where, {
          ...pagination,
          orderBy,
        }),
        this.count(where),
      ]);

      return {
        passengers,
        pagination: {
          ...pagination,
          total,
        },
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      logger.error("Get all passengers error:", error);
      throw new AppError(
        "Failed to fetch passengers",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getById(id, companyId) {
    try {
      const where = this.addCompanyFilter({ id: parseInt(id, 10) }, companyId);
      return await this.findUnique(where);
    } catch (error) {
      if (error instanceof AppError) throw error;

      logger.error("Get passenger by ID error:", error);
      throw new AppError(
        "Failed to fetch passenger",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async create(passengerData, companyId) {
    try {
      const data = {
        ...passengerData,
        companyId: parseInt(companyId, 10),
      };

      return await super.create(data);
    } catch (error) {
      if (error instanceof AppError) throw error;

      logger.error("Create passenger error:", error);
      throw new AppError(
        "Failed to create passenger",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(id, passengerData, companyId) {
    try {
      const where = this.addCompanyFilter({ id: parseInt(id, 10) }, companyId);
      return await super.update(where, passengerData);
    } catch (error) {
      if (error instanceof AppError) throw error;

      logger.error("Update passenger error:", error);
      throw new AppError(
        "Failed to update passenger",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async delete(id, companyId) {
    try {
      const where = this.addCompanyFilter({ id: parseInt(id, 10) }, companyId);
      return await super.delete(where);
    } catch (error) {
      if (error instanceof AppError) throw error;

      logger.error("Delete passenger error:", error);
      throw new AppError(
        "Failed to delete passenger",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async search(query, companyId) {
    try {
      const where = this.addCompanyFilter(
        {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { passengerId: { contains: query, mode: "insensitive" } },
          ],
        },
        companyId
      );

      const passengers = await this.findMany(where, {
        take: 10, // Limit search results
        orderBy: { name: "asc" },
      });

      return { passengers };
    } catch (error) {
      if (error instanceof AppError) throw error;

      logger.error("Search passengers error:", error);
      throw new AppError(
        "Failed to search passengers",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getByPassengerId(passengerId, companyId) {
    try {
      const where = this.addCompanyFilter({ passengerId }, companyId);
      return await this.findUnique(where);
    } catch (error) {
      if (error instanceof AppError) throw error;

      logger.error("Get passenger by passengerId error:", error);
      throw new AppError(
        "Failed to fetch passenger",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const passengerService = new PassengerService();
