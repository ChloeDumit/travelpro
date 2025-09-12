import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { config } from "../config/index.js";
import { AppError } from "../middleware/error.js";
import { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/index.js";
import logger from "../utils/logger.js";

const prisma = new PrismaClient();

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      throw new AppError("Email and password are required", HTTP_STATUS.BAD_REQUEST);
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: true },
    });

    if (!user) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    // Generate token
    const token = jwt.sign(
      {
        userId: user.id.toString(),
        role: user.role,
        companyId: user.companyId,
        username: user.username,
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiration }
    );

    // Prepare user response
    const userResponse = {
      id: user.id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
      companyId: user.companyId,
    };

    logger.info(`User ${user.email} logged in successfully`);

    res.status(HTTP_STATUS.OK).json({
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      token,
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const { username, email, password, role, companyId } = req.body;

    // Validate input
    if (!username || !email || !password || !role) {
      throw new AppError("All fields are required", HTTP_STATUS.BAD_REQUEST);
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new AppError("User already exists", HTTP_STATUS.BAD_REQUEST);
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
        companyId: companyId || 1, // Default company
      },
    });

    const userResponse = {
      id: user.id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
      companyId: user.companyId,
    };

    logger.info(`New user registered: ${user.email}`);

    res.status(HTTP_STATUS.CREATED).json({
      message: SUCCESS_MESSAGES.USER_CREATED,
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    logger.info(`User ${req.user?.email || 'unknown'} logged out`);
    res.status(HTTP_STATUS.OK).json({ 
      message: SUCCESS_MESSAGES.LOGOUT_SUCCESS 
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.user.userId) },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        companyId: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const userResponse = {
      id: user.id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
      companyId: user.companyId,
      createdAt: user.createdAt.toISOString(),
    };

    res.status(HTTP_STATUS.OK).json({ user: userResponse });
  } catch (error) {
    next(error);
  }
};