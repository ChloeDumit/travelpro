import { api } from "../api";

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  paymentMethod: string;
  paymentDate: string;
  description?: string;
  reference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentData {
  saleId: string;
  amount: number;
  currency: string;
  method: string;
  description?: string;
  reference?: string;
  date: string;
}

export interface UpdatePaymentData {
  amount?: number;
  currency?: string;
  status?: Payment["status"];
  paymentMethod?: string;
  paymentDate?: string;
  description?: string;
  reference?: string;
}

export const paymentsService = {
  // Get all payments
  getAll: () => api.get<{ payments: Payment[] }>("/api/payments"),

  // Get payment by ID
  getById: (id: string) => api.get<Payment>(`/api/payments/${id}`),

  // Create new payment
  create: (data: CreatePaymentData) =>
    api.post<{ message: string; payment: Payment }>("/api/payments", data),

  // Update payment
  update: (id: string, data: UpdatePaymentData) =>
    api.put<{ message: string; payment: Payment }>(`/api/payments/${id}`, data),

  // Delete payment
  delete: (id: string) =>
    api.delete<{ message: string }>(`/api/payments/${id}`),

  // Get payments by status
  getByStatus: (status: Payment["status"]) =>
    api.get<{ payments: Payment[] }>(`/api/payments?status=${status}`),

  // Get payments by date range
  getByDateRange: (startDate: string, endDate: string) =>
    api.get<{ payments: Payment[] }>(
      `/api/payments?startDate=${startDate}&endDate=${endDate}`
    ),

  // Get payments by sale ID
  getBySaleId: (saleId: string) =>
    api.get<{ payments: Payment[] }>(`/api/payments/sale/${saleId}`),

  // Get payment statistics
  getStats: () => api.get<{ stats: any }>("/api/payments/stats"),
};
