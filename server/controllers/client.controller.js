import { createController } from "./base.controller.js";
import { clientService } from "../services/client.service.js";
import { validate } from "../config/validation.js";
import { clientSchemas } from "../config/validation.js";

// Create base controller
const baseController = createController(clientService);

export const clientController = {
  // Get all clients
  getAll: baseController.getAll,

  // Get client by ID
  getById: baseController.getById,

  // Create client
  create: [validate(clientSchemas.create), baseController.create],

  // Update client
  update: [validate(clientSchemas.update), baseController.update],

  // Delete client
  delete: baseController.delete,

  // Search clients
  search: baseController.search,
};
