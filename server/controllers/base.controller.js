import { ApiResponse, asyncHandler, getPagination } from "../utils/response.js";
import { AppError } from "../middleware/error.js";
import { HTTP_STATUS } from "../constants/index.js";
import logger from "../utils/logger.js";

export class BaseController {
  constructor(service) {
    this.service = service;
  }

  // Get all records with pagination and search
  getAll = asyncHandler(async (req, res) => {
    const { companyId } = req.user;
    const { page, limit, search, sortBy, sortOrder } = req.query;

    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
      search,
      sortBy: sortBy || "id",
      sortOrder: sortOrder || "asc",
    };

    const result = await this.service.getAll(companyId, options);

    return ApiResponse.paginated(
      res,
      result[Object.keys(result)[0]], // Get the main data array
      result.pagination,
      `${this.service.model}s fetched successfully`
    );
  });

  // Get single record by ID
  getById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { companyId } = req.user;

    const result = await this.service.getById(id, companyId);

    return ApiResponse.success(
      res,
      result,
      `${this.service.model} fetched successfully`
    );
  });

  // Create new record
  create = asyncHandler(async (req, res) => {
    const { companyId } = req.user;
    const data = req.body;

    const result = await this.service.create(data, companyId);

    return ApiResponse.created(
      res,
      result,
      `${this.service.model} created successfully`
    );
  });

  // Update existing record
  update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { companyId } = req.user;
    const data = req.body;

    const result = await this.service.update(id, data, companyId);

    return ApiResponse.success(
      res,
      result,
      `${this.service.model} updated successfully`
    );
  });

  // Delete record
  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { companyId } = req.user;

    await this.service.delete(id, companyId);

    return ApiResponse.success(
      res,
      null,
      `${this.service.model} deleted successfully`
    );
  });

  // Search records
  search = asyncHandler(async (req, res) => {
    const { q } = req.query;
    const { companyId } = req.user;

    if (!q) {
      throw new AppError("Search query is required", HTTP_STATUS.BAD_REQUEST);
    }

    const result = await this.service.search(q, companyId);

    return ApiResponse.success(res, result, "Search completed successfully");
  });
}

// Factory function to create controllers
export const createController = (service) => {
  return new BaseController(service);
};
