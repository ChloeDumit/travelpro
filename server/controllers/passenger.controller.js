import { createController } from "./base.controller.js";
import { passengerService } from "../services/passenger.service.js";
import { validate } from "../config/validation.js";
import { passengerSchemas } from "../config/validation.js";

// Create base controller
const baseController = createController(passengerService);

export const passengerController = {
  // Get all passengers
  getAll: baseController.getAll,

  // Get passenger by ID
  getById: baseController.getById,

  // Create passenger
  create: [validate(passengerSchemas.create), baseController.create],

  // Update passenger
  update: [validate(passengerSchemas.update), baseController.update],

  // Delete passenger
  delete: baseController.delete,

  // Search passengers
  search: baseController.search,
};
