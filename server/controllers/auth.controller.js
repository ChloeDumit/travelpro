import { ApiResponse, asyncHandler } from "../utils/response.js";
import { authService } from "../services/auth.service.js";
import { validate } from "../config/validation.js";
import { authSchemas } from "../config/validation.js";
import logger from "../utils/logger.js";

export const authController = {
  // Login
  login: [
    validate(authSchemas.login),
    asyncHandler(async (req, res) => {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      return ApiResponse.success(res, result, result.message, 200);
    }),
  ],

  // Register
  register: [
    validate(authSchemas.register),
    asyncHandler(async (req, res) => {
      const userData = req.body;

      const result = await authService.register(userData);

      return ApiResponse.created(res, result, result.message);
    }),
  ],

  // Get current user
  getCurrentUser: [
    asyncHandler(async (req, res) => {
      const { userId } = req.user;

      const result = await authService.getCurrentUser(userId);

      return ApiResponse.success(res, result, "User fetched successfully");
    }),
  ],

  // Update profile
  updateProfile: [
    validate(authSchemas.register.partial()),
    asyncHandler(async (req, res) => {
      const { userId } = req.user;
      const updateData = req.body;

      const result = await authService.updateProfile(userId, updateData);

      return ApiResponse.success(res, result, result.message);
    }),
  ],

  // Logout
  logout: [
    asyncHandler(async (req, res) => {
      const result = await authService.logout();

      return ApiResponse.success(res, result, result.message);
    }),
  ],
};
