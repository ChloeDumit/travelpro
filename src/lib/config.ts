import {
  API_CONFIG,
  STORAGE_KEYS,
  PAGINATION,
  DATE_FORMATS,
} from "./constants";

// Environment configuration
export const config = {
  // API Configuration
  api: {
    baseUrl: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
  },

  // Storage configuration
  storage: {
    keys: STORAGE_KEYS,
  },

  // Pagination configuration
  pagination: {
    defaultPageSize: PAGINATION.DEFAULT_PAGE_SIZE,
    pageSizeOptions: PAGINATION.PAGE_SIZE_OPTIONS,
  },

  // Date formatting
  dateFormats: DATE_FORMATS,

  // Feature flags
  features: {
    enableMultiTenancy: true,
    enableRealTimeUpdates: false,
    enableAdvancedReporting: true,
    enableBulkOperations: true,
  },

  // UI Configuration
  ui: {
    theme: "light" as const,
    language: "es" as const,
    dateFormat: "dd/MM/yyyy",
    currency: "USD",
  },

  // Validation rules
  validation: {
    password: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false,
    },
    email: {
      required: true,
    },
    name: {
      minLength: 2,
      maxLength: 100,
    },
  },
} as const;

// Type for the config object
export type Config = typeof config;
