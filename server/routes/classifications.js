import express from "express";
import prisma from "../db.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { ROLES } from "../constants/index.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  requireRole([ROLES.ADMIN, ROLES.SALES]),
  async (req, res) => {
    try {
      const classifications = await prisma.classification.findMany({
        where: {
          companyId: req.user.companyId,
        },
      });
      res.json(classifications);
    } catch (error) {
      console.error("Error fetching classifications:", error);
      res.status(500).json({ message: "Error al obtener clasificaciones" });
    }
  }
);

router.get(
  "/:id",
  authenticate,
  requireRole([ROLES.ADMIN, ROLES.SALES]),
  async (req, res) => {
    try {
      const classification = await prisma.classification.findUnique({
        where: {
          id: parseInt(req.params.id),
          companyId: req.user.companyId,
        },
      });

      if (!classification) {
        return res.status(404).json({ message: "Clasificación no encontrada" });
      }

      res.json(classification);
    } catch (error) {
      console.error("Error fetching classification:", error);
      res.status(500).json({ message: "Error al obtener clasificación" });
    }
  }
);

router.post(
  "/",
  authenticate,
  requireRole([ROLES.ADMIN, ROLES.SALES]),
  async (req, res) => {
    try {
      const classification = await prisma.classification.create({
        data: {
          ...req.body,
          companyId: req.user.companyId,
        },
        include: {
          company: true,
        },
      });
      res.json(classification);
    } catch (error) {
      console.error("Error creating classification:", error);
      res.status(500).json({ message: "Error al crear clasificación" });
    }
  }
);

router.put(
  "/:id",
  authenticate,
  requireRole([ROLES.ADMIN, ROLES.SALES]),
  async (req, res) => {
    try {
      const classification = await prisma.classification.update({
        where: {
          id: parseInt(req.params.id),
          companyId: req.user.companyId,
        },
        data: req.body,
      });
      res.json(classification);
    } catch (error) {
      console.error("Error updating classification:", error);
      res.status(500).json({ message: "Error al actualizar clasificación" });
    }
  }
);

router.delete(
  "/:id",
  authenticate,
  requireRole([ROLES.ADMIN, ROLES.SALES]),
  async (req, res) => {
    try {
      await prisma.classification.delete({
        where: {
          id: parseInt(req.params.id),
          companyId: req.user.companyId,
        },
      });
      res.json({ message: "Clasificación eliminada exitosamente" });
    } catch (error) {
      console.error("Error deleting classification:", error);
      res.status(500).json({ message: "Error al eliminar clasificación" });
    }
  }
);

export default router;
