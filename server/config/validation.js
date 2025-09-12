import { z } from "zod";

// Common validation schemas
export const commonSchemas = {
  id: z.union([z.string(), z.number()]).transform((val) => {
    const num = typeof val === "string" ? parseInt(val, 10) : val;
    if (isNaN(num) || num <= 0) {
      throw new Error("Invalid ID");
    }
    return num;
  }),

  email: z.string().email("Invalid email format"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password too long"),

  phone: z
    .string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number")
    .optional(),

  currency: z
    .number()
    .min(0, "Amount must be positive")
    .max(999999999, "Amount too large"),

  date: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Invalid date format"),
};

// Auth validation schemas
export const authSchemas = {
  login: z.object({
    email: commonSchemas.email,
    password: z.string().min(1, "Password is required"),
  }),

  register: z.object({
    username: z
      .string()
      .min(2, "Username too short")
      .max(50, "Username too long"),
    email: commonSchemas.email,
    password: commonSchemas.password,
    role: z.enum(["ADMIN", "USER"]),
  }),
};

// User validation schemas
export const userSchemas = {
  create: z.object({
    username: z.string().min(2).max(50),
    email: commonSchemas.email,
    password: commonSchemas.password,
    role: z.enum(["ADMIN", "USER"]),
  }),

  update: z.object({
    username: z.string().min(2).max(50).optional(),
    email: commonSchemas.email.optional(),
    role: z.enum(["ADMIN", "USER"]).optional(),
  }),
};

// Client validation schemas
export const clientSchemas = {
  create: z.object({
    name: z.string().min(2, "Name too short").max(100, "Name too long"),
    clientId: z.string().max(50).optional(),
    address: z.string().max(255).optional(),
    email: commonSchemas.email.optional(),
    phone: commonSchemas.phone,
  }),

  update: z.object({
    name: z.string().min(2).max(100).optional(),
    clientId: z.string().max(50).optional(),
    address: z.string().max(255).optional(),
    email: commonSchemas.email.optional(),
    phone: commonSchemas.phone,
  }),
};

// Passenger validation schemas
export const passengerSchemas = {
  create: z.object({
    name: z.string().min(2, "Name too short").max(100, "Name too long"),
    passengerId: z.string().min(1, "Passenger ID required").max(50),
    email: commonSchemas.email.optional(),
    dateOfBirth: commonSchemas.date,
  }),

  update: z.object({
    name: z.string().min(2).max(100).optional(),
    passengerId: z.string().min(1).max(50).optional(),
    email: commonSchemas.email.optional(),
    dateOfBirth: commonSchemas.date.optional(),
  }),
};

// Supplier validation schemas
export const supplierSchemas = {
  create: z.object({
    name: z.string().min(2, "Name too short").max(100, "Name too long"),
    contactPerson: z.string().max(100).optional(),
    email: commonSchemas.email.optional(),
    phone: commonSchemas.phone,
    address: z.string().max(255).optional(),
  }),

  update: z.object({
    name: z.string().min(2).max(100).optional(),
    contactPerson: z.string().max(100).optional(),
    email: commonSchemas.email.optional(),
    phone: commonSchemas.phone,
    address: z.string().max(255).optional(),
  }),
};

// Sale validation schemas
export const saleSchemas = {
  create: z.object({
    passengerName: z.string().min(2).max(100),
    clientId: commonSchemas.id,
    travelDate: commonSchemas.date,
    region: z.string().min(2).max(100),
    serviceType: z.string().min(2).max(100),
    saleType: z.string().min(2).max(100),
    totalCost: commonSchemas.currency,
    paymentDate: commonSchemas.date.optional(),
    notes: z.string().max(500).optional(),
    items: z
      .array(
        z.object({
          supplierId: commonSchemas.id,
          operatorId: commonSchemas.id,
          classificationId: commonSchemas.id,
          passengers: z.array(
            z.object({
              name: z.string().min(2).max(100),
              passengerId: z.string().min(1).max(50),
              email: commonSchemas.email.optional(),
              dateOfBirth: commonSchemas.date,
            })
          ),
          cost: commonSchemas.currency,
          paymentDate: commonSchemas.date.optional(),
          notes: z.string().max(500).optional(),
        })
      )
      .min(1, "At least one item required"),
  }),

  update: z.object({
    passengerName: z.string().min(2).max(100).optional(),
    clientId: commonSchemas.id.optional(),
    travelDate: commonSchemas.date.optional(),
    region: z.string().min(2).max(100).optional(),
    serviceType: z.string().min(2).max(100).optional(),
    saleType: z.string().min(2).max(100).optional(),
    totalCost: commonSchemas.currency.optional(),
    paymentDate: commonSchemas.date.optional(),
    notes: z.string().max(500).optional(),
    status: z
      .enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"])
      .optional(),
  }),
};

// Validation middleware factory
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors: errorMessages,
        });
      }
      next(error);
    }
  };
};
