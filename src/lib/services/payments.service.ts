import { api } from "../api";
import { Payment, CreatePaymentData, UpdatePaymentData, PaymentStatus } from "../../types";

export const paymentsService = {
  getAll: () => 
    api.get<{ payments: Payment[] }>("/api/payments"),

  getById: (id: string) => 
    api.get<Payment>(`/api/payments/${id}`),

  create: (data: CreatePaymentData) =>
    api.post<{ message: string; payment: Payment }>("/api/payments", data),

  update: (id: string, data: UpdatePaymentData) =>
    api.put<{ message: string; payment: Payment }>(`/api/payments/${id}`, data),

  delete: (id: string) => 
    api.delete<{ message: string }>(`/api/payments/${id}`),

  getBySaleId: (saleId: string) =>
    api.get<Payment[]>(`/api/payments/sale/${saleId}`),

  getByStatus: (status: PaymentStatus) =>
    api.get<{ payments: Payment[] }>(`/api/payments?status=${status}`),

  getStats: () => 
    api.get<{ stats: any }>("/api/payments/stats"),
};