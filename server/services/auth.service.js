import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { config } from "../config/index.js";
import { AppError } from "../middleware/error.js";
import {
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "../constants/index.js";
import logger from "../utils/logger.js";

const prisma = new PrismaClient();

export class AuthService {
  async login(email, password) {
    try {
      // Validate input
      if (!email || !password) {
        throw new AppError(
          "Email and password are required",
          HTTP_STATUS.BAD_REQUEST
        );
      }

      // Find user with company
      const user = await prisma.user.findUnique({
        where: { email },
        include: { company: true },
      });

      if (!user) {
        throw new AppError(
          ERROR_MESSAGES.INVALID_CREDENTIALS,
          HTTP_STATUS.UNAUTHORIZED
        );
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new AppError(
          ERROR_MESSAGES.INVALID_CREDENTIALS,
          HTTP_STATUS.UNAUTHORIZED
        );
      }

      // Generate token
      const token = this.generateToken(user);

      // Prepare user response (exclude password)
      const userResponse = {
        id: user.id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        company: {
          id: user.company.id,
          name: user.company.name,
        },
      };

      logger.info(`User logged in successfully: ${user.email}`);

      return {
        user: userResponse,
        token,
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      logger.error("Login error:", error);
      throw new AppError("Login failed", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  async register(userData) {
    try {
      const { username, email, password, role } = userData;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new AppError(
          "User with this email already exists",
          HTTP_STATUS.CONFLICT
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          role,
          companyId: 1, // Default company for now
        },
        include: { company: true },
      });

      // Generate token
      const token = this.generateToken(user);

      // Prepare user response
      const userResponse = {
        id: user.id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        company: {
          id: user.company.id,
          name: user.company.name,
        },
      };

      logger.info(`User registered successfully: ${user.email}`);

      return {
        user: userResponse,
        token,
        message: SUCCESS_MESSAGES.USER_CREATED,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      logger.error("Registration error:", error);
      throw new AppError(
        "Registration failed",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getCurrentUser(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId, 10) },
        include: { company: true },
      });

      if (!user) {
        throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
      }

      // Prepare user response (exclude password)
      const userResponse = {
        id: user.id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        company: {
          id: user.company.id,
          name: user.company.name,
        },
      };

      return { user: userResponse };
    } catch (error) {
      if (error instanceof AppError) throw error;

      logger.error("Get current user error:", error);
      throw new AppError(
        "Failed to get user",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateProfile(userId, updateData) {
    try {
      const { username, email } = updateData;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id: parseInt(userId, 10) },
      });

      if (!existingUser) {
        throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
      }

      // Check if email is already taken by another user
      if (email && email !== existingUser.email) {
        const emailExists = await prisma.user.findUnique({
          where: { email },
        });

        if (emailExists) {
          throw new AppError("Email already taken", HTTP_STATUS.CONFLICT);
        }
      }

      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(userId, 10) },
        data: {
          ...(username && { username }),
          ...(email && { email }),
        },
        include: { company: true },
      });

      // Prepare user response
      const userResponse = {
        id: updatedUser.id.toString(),
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        companyId: updatedUser.companyId,
        company: {
          id: updatedUser.company.id,
          name: updatedUser.company.name,
        },
      };

      logger.info(`User profile updated: ${updatedUser.email}`);

      return {
        user: userResponse,
        message: SUCCESS_MESSAGES.USER_UPDATED,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      logger.error("Update profile error:", error);
      throw new AppError(
        "Failed to update profile",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  generateToken(user) {
    return jwt.sign(
      {
        userId: user.id.toString(),
        role: user.role,
        companyId: user.companyId,
        username: user.username,
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiration }
    );
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, config.jwtSecret);
    } catch (error) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_TOKEN,
        HTTP_STATUS.UNAUTHORIZED
      );
    }
  }

  async logout() {
    // In a more sophisticated setup, you might want to blacklist the token
    // For now, we'll just return a success message
    return { message: SUCCESS_MESSAGES.LOGOUT_SUCCESS };
  }
}

export const authService = new AuthService();
