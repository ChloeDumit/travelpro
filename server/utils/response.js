/**
 * Standardized API response utilities
 */

export class ApiResponse {
  static success(res, data = null, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
      status: "success",
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  static created(res, data = null, message = "Resource created successfully") {
    return res.status(201).json({
      status: "success",
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  static error(
    res,
    message = "An error occurred",
    statusCode = 500,
    errors = null
  ) {
    return res.status(statusCode).json({
      status: "error",
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  }

  static validationError(res, errors, message = "Validation failed") {
    return res.status(400).json({
      status: "error",
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  }

  static notFound(res, message = "Resource not found") {
    return res.status(404).json({
      status: "error",
      message,
      timestamp: new Date().toISOString(),
    });
  }

  static unauthorized(res, message = "Unauthorized access") {
    return res.status(401).json({
      status: "error",
      message,
      timestamp: new Date().toISOString(),
    });
  }

  static forbidden(res, message = "Forbidden access") {
    return res.status(403).json({
      status: "error",
      message,
      timestamp: new Date().toISOString(),
    });
  }

  static conflict(res, message = "Resource already exists") {
    return res.status(409).json({
      status: "error",
      message,
      timestamp: new Date().toISOString(),
    });
  }

  static paginated(res, data, pagination, message = "Success") {
    return res.status(200).json({
      status: "success",
      message,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: Math.ceil(pagination.total / pagination.limit),
        hasNext:
          pagination.page < Math.ceil(pagination.total / pagination.limit),
        hasPrev: pagination.page > 1,
      },
      timestamp: new Date().toISOString(),
    });
  }
}

// Async wrapper for controllers
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Pagination helper
export const getPagination = (page = 1, limit = 10) => {
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  return {
    page: pageNum,
    limit: limitNum,
    skip,
  };
};

// Sort helper
export const getSort = (sortBy = "id", sortOrder = "asc") => {
  return {
    [sortBy]: sortOrder === "desc" ? "desc" : "asc",
  };
};

// Search helper
export const getSearchFilter = (searchTerm, searchFields) => {
  if (!searchTerm || !searchFields.length) return {};

  return {
    OR: searchFields.map((field) => ({
      [field]: {
        contains: searchTerm,
        mode: "insensitive",
      },
    })),
  };
};
