import express from "express";
import { authenticate, requireRole } from "../middleware/auth.js";
import { ROLES } from "../constants/index.js";
import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} from "../controllers/clients.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all clients
router.get("/", requireRole([ROLES.ADMIN, ROLES.SALES]), getAllClients);

// Get client by ID
router.get("/:id", requireRole([ROLES.ADMIN, ROLES.SALES]), getClientById);

// Create new client
router.post("/", requireRole([ROLES.ADMIN, ROLES.SALES]), createClient);

// Update client
router.put("/:id", requireRole([ROLES.ADMIN, ROLES.SALES]), updateClient);

// Delete client
router.delete("/:id", requireRole([ROLES.ADMIN, ROLES.SALES]), deleteClient);

export default router;