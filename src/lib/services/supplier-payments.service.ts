import { api } from "../api";

export interface SupplierPayment {
  id: string;
  supplierId: string;
  supplierName: string;
  amount: number;
  currency: string;
  paymentDate: string;
  description: string;
  relatedSales: string[];
  paymentMethod: string;
  reference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierPaymentData {
  supplierId: string;
  amount: number;
  currency: string;
  paymentDate: string;
  description: string;
  relatedSales: string[];
  paymentMethod: string;
  reference?: string;
}

export interface UpdateSupplierPaymentData {
  amount?: number;
  currency?: string;
  paymentDate?: string;
  description?: string;
  relatedSales?: string[];
  paymentMethod?: string;
  reference?: string;
}

export interface SalesBySupplier {
  supplierId: string;
  supplierName: string;
  totalAmount: number;
  currency: string;
  sales: Array<{
    id: string;
    passengerName: string;
    totalCost: number;
    status: string;
    creationDate: string;
  }>;
}

export const supplierPaymentsService = {
  // Get all supplier payments
  getAll: () =>
    api.get<{ payments: SupplierPayment[] }>("/api/supplier-payments"),

  // Get supplier payment by ID
  getById: (id: string) =>
    api.get<SupplierPayment>(`/api/supplier-payments/${id}`),

  // Create new supplier payment
  create: (data: CreateSupplierPaymentData) =>
    api.post<{ message: string; payment: SupplierPayment }>(
      "/api/supplier-payments",
      data
    ),

  // Update supplier payment
  update: (id: string, data: UpdateSupplierPaymentData) =>
    api.put<{ message: string; payment: SupplierPayment }>(
      `/api/supplier-payments/${id}`,
      data
    ),

  // Delete supplier payment
  delete: (id: string) =>
    api.delete<{ message: string }>(`/api/supplier-payments/${id}`),

  // Get sales by supplier
  getSalesBySupplier: (supplierId: string) =>
    api.get<SalesBySupplier>(
      `/api/supplier-payments/supplier/${supplierId}/sales`
    ),

  // Get all suppliers with their sales and payment status
  getSuppliersWithSales: () =>
    api.get<{ suppliers: SalesBySupplier[] }>(
      "/api/supplier-payments/suppliers/sales"
    ),

  // Get payment history for a specific supplier
  getPaymentHistory: (supplierId: string) =>
    api.get<{ payments: SupplierPayment[] }>(
      `/api/supplier-payments/supplier/${supplierId}/history`
    ),

  // Get payment statistics
  getStats: () => api.get<{ stats: any }>("/api/supplier-payments/stats"),
};
