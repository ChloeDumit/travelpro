import { z } from "zod";
import { VALIDATION } from "./constants";

// Common validation schemas
export const commonSchemas = {
  // Required string with minimum length
  requiredString: (minLength = 1, maxLength = 255) =>
    z
      .string()
      .min(minLength, VALIDATION.MIN_LENGTH(minLength))
      .max(maxLength, VALIDATION.MAX_LENGTH(maxLength)),

  // Email validation
  email: z.string().email(VALIDATION.EMAIL).optional().or(z.literal("")),

  // Phone number validation
  phone: z
    .string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Número de teléfono inválido")
    .optional()
    .or(z.literal("")),

  // Date validation
  date: z
    .string()
    .min(1, VALIDATION.REQUIRED)
    .refine((date) => !isNaN(Date.parse(date)), "Fecha inválida"),

  // Currency amount validation
  currency: z
    .number()
    .min(0, "El monto debe ser mayor o igual a 0")
    .max(999999999, "El monto es demasiado grande"),

  // ID validation
  id: z.union([z.string(), z.number()]).refine((val) => {
    if (typeof val === "string") return val.length > 0;
    return val > 0;
  }, "ID inválido"),
};

// User validation schemas
export const userSchemas = {
  login: z.object({
    email: z.string().email(VALIDATION.EMAIL),
    password: z.string().min(1, VALIDATION.REQUIRED),
  }),

  register: z.object({
    username: commonSchemas.requiredString(2, 50),
    email: z.string().email(VALIDATION.EMAIL),
    password: z
      .string()
      .min(8, VALIDATION.MIN_LENGTH(8))
      .max(100, VALIDATION.MAX_LENGTH(100)),
    role: z.enum(["ADMIN", "USER"]),
  }),

  updateProfile: z.object({
    username: commonSchemas.requiredString(2, 50).optional(),
    email: z.string().email(VALIDATION.EMAIL).optional(),
  }),
};

// Passenger validation schemas
export const passengerSchemas = {
  create: z.object({
    name: commonSchemas.requiredString(2, 100),
    passengerId: commonSchemas.requiredString(1, 50),
    email: commonSchemas.email,
    dateOfBirth: commonSchemas.date,
  }),

  update: z.object({
    name: commonSchemas.requiredString(2, 100).optional(),
    passengerId: commonSchemas.requiredString(1, 50).optional(),
    email: commonSchemas.email,
    dateOfBirth: commonSchemas.date.optional(),
  }),
};

// Client validation schemas
export const clientSchemas = {
  create: z.object({
    name: commonSchemas.requiredString(2, 100),
    clientId: z.string().max(50).optional(),
    address: z.string().max(255).optional(),
    email: commonSchemas.email,
    phone: commonSchemas.phone,
  }),

  update: z.object({
    name: commonSchemas.requiredString(2, 100).optional(),
    clientId: z.string().max(50).optional(),
    address: z.string().max(255).optional(),
    email: commonSchemas.email,
    phone: commonSchemas.phone,
  }),
};

// Supplier validation schemas
export const supplierSchemas = {
  create: z.object({
    name: commonSchemas.requiredString(2, 100),
    contactPerson: z.string().max(100).optional(),
    email: commonSchemas.email,
    phone: commonSchemas.phone,
    address: z.string().max(255).optional(),
  }),

  update: z.object({
    name: commonSchemas.requiredString(2, 100).optional(),
    contactPerson: z.string().max(100).optional(),
    email: commonSchemas.email,
    phone: commonSchemas.phone,
    address: z.string().max(255).optional(),
  }),
};

// Sale validation schemas
export const saleSchemas = {
  create: z.object({
    passengerName: commonSchemas.requiredString(2, 100),
    clientId: commonSchemas.id,
    travelDate: commonSchemas.date,
    region: commonSchemas.requiredString(2, 100),
    serviceType: commonSchemas.requiredString(2, 100),
    saleType: commonSchemas.requiredString(2, 100),
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
              name: commonSchemas.requiredString(2, 100),
              passengerId: commonSchemas.requiredString(1, 50),
              email: commonSchemas.email,
              dateOfBirth: commonSchemas.date,
            })
          ),
          cost: commonSchemas.currency,
          paymentDate: commonSchemas.date.optional(),
          notes: z.string().max(500).optional(),
        })
      )
      .min(1, "Debe tener al menos un item"),
  }),

  update: z.object({
    passengerName: commonSchemas.requiredString(2, 100).optional(),
    clientId: commonSchemas.id.optional(),
    travelDate: commonSchemas.date.optional(),
    region: commonSchemas.requiredString(2, 100).optional(),
    serviceType: commonSchemas.requiredString(2, 100).optional(),
    saleType: commonSchemas.requiredString(2, 100).optional(),
    totalCost: commonSchemas.currency.optional(),
    paymentDate: commonSchemas.date.optional(),
    notes: z.string().max(500).optional(),
    status: z
      .enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"])
      .optional(),
  }),
};

// Payment validation schemas
export const paymentSchemas = {
  create: z.object({
    amount: commonSchemas.currency,
    paymentDate: commonSchemas.date,
    method: z.enum(["CASH", "CARD", "TRANSFER", "CHECK"]),
    reference: z.string().max(100).optional(),
    notes: z.string().max(500).optional(),
  }),

  update: z.object({
    amount: commonSchemas.currency.optional(),
    paymentDate: commonSchemas.date.optional(),
    method: z.enum(["CASH", "CARD", "TRANSFER", "CHECK"]).optional(),
    reference: z.string().max(100).optional(),
    notes: z.string().max(500).optional(),
  }),
};
