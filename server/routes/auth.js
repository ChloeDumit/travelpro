import express from "express";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import { loginSchema, registerSchema } from "../schemas/auth.js";
import { login, register, logout, getCurrentUser } from "../controllers/auth.js";

const router = express.Router();

// Public routes
router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), register);

// Protected routes
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getCurrentUser);

export default router;