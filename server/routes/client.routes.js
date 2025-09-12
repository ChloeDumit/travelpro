import express from "express";
import { clientController } from "../controllers/client.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Client routes
router.get("/", clientController.getAll);
router.get("/search", clientController.search);
router.get("/:id", clientController.getById);
router.post("/", clientController.create);
router.put("/:id", clientController.update);
router.delete("/:id", clientController.delete);

export default router;
