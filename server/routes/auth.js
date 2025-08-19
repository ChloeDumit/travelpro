import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import { loginSchema, registerSchema } from "../schemas/auth.js";
import { AppError } from "../middleware/error.js";
import {
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "../constants/index.js";
import logger from "../utils/logger.js";
import { config } from "../config/index.js";

const router = express.Router();
const prisma = new PrismaClient();

// Login route
router.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

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

    logger.info(`User ${user.email} logged in successfully`);

    res.status(HTTP_STATUS.OK).json({
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      token,
      user: {
        id: user.id.toString(),
        email: user.email,
        role: user.role,
        company_id: user.company_id,
        username: user.username,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Register route
router.post("/register", validate(registerSchema), async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError("Email already registered", HTTP_STATUS.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
      },
    });

    logger.info(`New user registered: ${user.email}`);

    res.status(HTTP_STATUS.CREATED).json({
      message: SUCCESS_MESSAGES.USER_CREATED,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Logout route
router.post("/logout", authenticate, async (req, res, next) => {
  try {
    logger.info(`User ${req.user.email} logged out`);
    res
      .status(HTTP_STATUS.OK)
      .json({ message: SUCCESS_MESSAGES.LOGOUT_SUCCESS });
  } catch (error) {
    next(error);
  }
});

export default router;
