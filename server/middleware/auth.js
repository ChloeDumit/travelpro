import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { AppError } from "./error.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "../constants/index.js";

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
    }

    const token = authHeader.split(" ")[1];
    
    if (!token) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new AppError(ERROR_MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED));
    }
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Token expired", HTTP_STATUS.UNAUTHORIZED));
    }
    next(error);
  }
};

export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError(ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN));
    }

    next();
  };
};