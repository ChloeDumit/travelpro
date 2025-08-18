import { api } from "../api";
import { Supplier } from "../../types";

export interface CreateSupplierData {
  name: string;
}

export interface UpdateSupplierData {
  name?: string;
}

export const suppliersService = {
  // Get all suppliers
  getAll: () => api.get<{ suppliers: Supplier[] }>("/api/suppliers"),

  // Get supplier by ID
  getById: (id: string) => api.get<Supplier>(`/api/suppliers/${id}`),

  // Create new supplier
  create: (data: CreateSupplierData) =>
    api.post<{ message: string; supplier: Supplier }>("/api/suppliers", data),

  // Update supplier
  update: (id: string, data: UpdateSupplierData) =>
    api.put<{ message: string; supplier: Supplier }>(
      `/api/suppliers/${id}`,
      data
    ),

  // Delete supplier
  delete: (id: string) =>
    api.delete<{ message: string }>(`/api/suppliers/${id}`),

  // Search suppliers
  search: (query: string) =>
    api.get<{ suppliers: Supplier[] }>(
      `/api/suppliers/search?q=${encodeURIComponent(query)}`
    ),
};
