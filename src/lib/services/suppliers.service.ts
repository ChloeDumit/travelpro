import { api } from "../api";
import { Supplier, SupplierFormData, CreateSupplierData, UpdateSupplierData } from "../../types";

export const suppliersService = {
  getAll: () => 
    api.get<Supplier[]>("/api/suppliers"),

  getById: (id: string) => 
    api.get<Supplier>(`/api/suppliers/${id}`),

  create: (data: SupplierFormData) =>
    api.post<{ message: string; supplier: Supplier }>("/api/suppliers", data),

  update: (id: string, data: UpdateSupplierData) =>
    api.put<{ message: string; supplier: Supplier }>(`/api/suppliers/${id}`, data),

  delete: (id: string) => 
    api.delete<{ message: string }>(`/api/suppliers/${id}`),

  search: (query: string) =>
    api.get<{ suppliers: Supplier[] }>(`/api/suppliers/search?q=${encodeURIComponent(query)}`),
};