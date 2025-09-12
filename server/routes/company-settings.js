import express from "express";
import { authenticate, requireRole } from "../middleware/auth.js";
import { ROLES } from "../constants/index.js";
import { companySettingsController } from "../controllers/company-settings.controller.js";

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(requireRole([ROLES.ADMIN]));

// Company settings routes
router.get("/settings", companySettingsController.getSettings);
router.put("/settings", companySettingsController.updateSettings);

// Currency rates routes
router.get("/currency-rates", companySettingsController.getCurrencyRates);
router.post("/currency-rates", companySettingsController.addCurrencyRate);
router.put("/currency-rates", companySettingsController.updateCurrencyRates);
router.put("/currency-rates/:id", companySettingsController.updateCurrencyRate);
router.delete(
  "/currency-rates/:id",
  companySettingsController.deleteCurrencyRate
);
router.patch(
  "/currency-rates/:id/toggle",
  companySettingsController.toggleCurrencyRate
);

export default router;
