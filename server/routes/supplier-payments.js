import express from "express";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/auth.js";

const router = express.Router();

import {
  getAllSupplierPayments,
  getSupplierPaymentById,
  createSupplierPayment,
  updateSupplierPayment,
  deleteSupplierPayment,
  getSalesBySupplier,
  getSuppliersWithSales,
  getPaymentHistory,
  getPaymentStats,
} from "../controllers/supplierPayments.js";

// All routes require authentication and admin role
router.use(authenticate);
router.use(requireRole("admin"));

// Get all supplier payments
router.get("/", getAllSupplierPayments);

// Get supplier payment by ID
router.get("/:id", getSupplierPaymentById);

// Create new supplier payment
router.post("/", createSupplierPayment);

// Update supplier payment
router.put("/:id", updateSupplierPayment);

// Delete supplier payment
router.delete("/:id", deleteSupplierPayment);

// Get sales by supplier
router.get("/supplier/:supplierId/sales", getSalesBySupplier);

// Get all suppliers with their sales and payment status
router.get("/suppliers/sales", getSuppliersWithSales);

// Get payment history for a specific supplier
router.get("/supplier/:supplierId/history", getPaymentHistory);

// Get payment statistics
router.get("/stats", getPaymentStats);

export default router;
