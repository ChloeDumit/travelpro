import express from "express";
import { passengerController } from "../controllers/passenger.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Passenger routes
router.get("/", passengerController.getAll);
router.get("/search", passengerController.search);
router.get("/:id", passengerController.getById);
router.post("/", passengerController.create);
router.put("/:id", passengerController.update);
router.delete("/:id", passengerController.delete);

export default router;
