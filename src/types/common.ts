// Base types
export interface BaseEntity {
  id: string | number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyEntity extends BaseEntity {
  companyId: number;
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface FormState {
  isSubmitting: boolean;
  isValid: boolean;
  errors: Record<string, string>;
}

// Loading states
export interface LoadingState {
  loading: boolean;
  error: string | null;
}

// User types
export type UserRole = "ADMIN" | "USER";

export interface User extends CompanyEntity {
  username: string;
  email: string;
  role: UserRole;
}

// Status types
export type SaleStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
export type PaymentStatus = "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";

// Common form props
export interface FormProps<T> {
  onSubmit: (data: T) => void;
  loading?: boolean;
  initialData?: Partial<T>;
  onCancel?: () => void;
}

// Modal props
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

// Table props
export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  onRowClick?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
}

// Search and filter types
export interface SearchFilters {
  query?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

// Error types
export interface AppError {
  message: string;
  code?: string;
  field?: string;
}

// Success types
export interface SuccessMessage {
  message: string;
  type?: "success" | "info" | "warning";
}
