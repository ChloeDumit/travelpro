import { BaseService } from "./base.service.js";
import { AppError } from "../middleware/error.js";
import { HTTP_STATUS } from "../constants/index.js";
import logger from "../utils/logger.js";

export class ClientService extends BaseService {
  constructor() {
    super("client");
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
          { clientId: { contains: search, mode: "insensitive" } },
        ];
      }

      const pagination = this.getPaginationOptions(page, limit);
      const orderBy = { [sortBy]: sortOrder };

      const [clients, total] = await Promise.all([
        this.findMany(where, {
          ...pagination,
          orderBy,
        }),
        this.count(where),
      ]);

      return {
        clients,
        pagination: {
          ...pagination,
          total,
        },
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      logger.error("Get all clients error:", error);
      throw new AppError(
        "Failed to fetch clients",
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

      logger.error("Get client by ID error:", error);
      throw new AppError(
        "Failed to fetch client",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async create(clientData, companyId) {
    try {
      const data = {
        ...clientData,
        companyId: parseInt(companyId, 10),
      };

      return await this.create(data);
    } catch (error) {
      if (error instanceof AppError) throw error;

      logger.error("Create client error:", error);
      throw new AppError(
        "Failed to create client",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(id, clientData, companyId) {
    try {
      const where = this.addCompanyFilter({ id: parseInt(id, 10) }, companyId);
      return await this.update(where, clientData);
    } catch (error) {
      if (error instanceof AppError) throw error;

      logger.error("Update client error:", error);
      throw new AppError(
        "Failed to update client",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async delete(id, companyId) {
    try {
      const where = this.addCompanyFilter({ id: parseInt(id, 10) }, companyId);
      return await this.delete(where);
    } catch (error) {
      if (error instanceof AppError) throw error;

      logger.error("Delete client error:", error);
      throw new AppError(
        "Failed to delete client",
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
            { clientId: { contains: query, mode: "insensitive" } },
          ],
        },
        companyId
      );

      const clients = await this.findMany(where, {
        take: 10, // Limit search results
        orderBy: { name: "asc" },
      });

      return { clients };
    } catch (error) {
      if (error instanceof AppError) throw error;

      logger.error("Search clients error:", error);
      throw new AppError(
        "Failed to search clients",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const clientService = new ClientService();
