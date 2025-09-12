// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3001",
  TIMEOUT: 10000,
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  AUTH_USER: "auth_user",
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

// Sale Status
export const SALE_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  OVERDUE: "OVERDUE",
  CANCELLED: "CANCELLED",
} as const;

// Common Messages
export const MESSAGES = {
  LOADING: {
    DEFAULT: "Cargando...",
    PASSENGERS: "Cargando pasajeros...",
    CLIENTS: "Cargando clientes...",
    SUPPLIERS: "Cargando proveedores...",
    SALES: "Cargando ventas...",
    PAYMENTS: "Cargando pagos...",
  },
  SUCCESS: {
    CREATED: "Creado exitosamente",
    UPDATED: "Actualizado exitosamente",
    DELETED: "Eliminado exitosamente",
    SAVED: "Guardado exitosamente",
  },
  ERROR: {
    GENERIC: "Ha ocurrido un error",
    NETWORK: "Error de conexión",
    UNAUTHORIZED: "No autorizado",
    NOT_FOUND: "No encontrado",
    VALIDATION: "Error de validación",
  },
  CONFIRM: {
    DELETE: "¿Estás seguro de que quieres eliminar este elemento?",
    CANCEL: "¿Estás seguro de que quieres cancelar?",
  },
} as const;

// Form Validation
export const VALIDATION = {
  REQUIRED: "Este campo es requerido",
  EMAIL: "Email inválido",
  MIN_LENGTH: (min: number) => `Mínimo ${min} caracteres`,
  MAX_LENGTH: (max: number) => `Máximo ${max} caracteres`,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: "dd/MM/yyyy",
  API: "yyyy-MM-dd",
  DATETIME: "dd/MM/yyyy HH:mm",
} as const;
