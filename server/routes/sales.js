import express from "express";
import { authenticate, requireRole } from "../middleware/auth.js";
import { ROLES } from "../constants/index.js";
import {
  getAllSales,
  getMySales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
  getTotalSales,
  getSalesStats,
  getSalesStatsByType,
  getUpcomingDepartures,
  getSalesOverview,
} from "../controllers/sales.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all sales (admin and sales roles)
router.get("/", requireRole([ROLES.ADMIN, ROLES.SALES]), getAllSales);

// Get sales by current user
router.get("/my-sales", requireRole([ROLES.SALES]), getMySales);
router.get("/total", requireRole([ROLES.ADMIN, ROLES.SALES]), getTotalSales);

// Get sales statistics
router.get("/stats", requireRole([ROLES.ADMIN, ROLES.SALES]), getSalesStats);

// Get sales statistics by type
router.get(
  "/stats-by-type",
  requireRole([ROLES.ADMIN, ROLES.SALES]),
  getSalesStatsByType
);

// Get upcoming departures
router.get(
  "/upcoming-departures",
  requireRole([ROLES.ADMIN, ROLES.SALES]),
  getUpcomingDepartures
);

// Get sales overview for charts
router.get(
  "/sales-overview",
  requireRole([ROLES.ADMIN, ROLES.SALES]),
  getSalesOverview
);

// Get sale by ID
router.get("/:id", requireRole([ROLES.ADMIN, ROLES.SALES]), getSaleById);

// Create new sale
router.post("/", requireRole([ROLES.SALES, ROLES.ADMIN]), createSale);

// Update sale
router.put("/:id", requireRole([ROLES.SALES, ROLES.ADMIN]), updateSale);

// Delete sale
router.delete("/:id", requireRole([ROLES.SALES, ROLES.ADMIN]), deleteSale);

// Get total sales amount

export default router;
