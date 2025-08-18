import { api } from "../api";
import { Operator } from "../../types";

export interface CreateOperatorData {
  name: string;
}

export interface UpdateOperatorData {
  name?: string;
}

export const operatorsService = {
  // Get all operators
  getAll: () => api.get<{ operators: Operator[] }>("/api/operators"),

  // Get operator by ID
  getById: (id: string) => api.get<Operator>(`/api/operators/${id}`),

  // Create new operator
  create: (data: CreateOperatorData) =>
    api.post<{ message: string; operator: Operator }>("/api/operators", data),

  // Update operator
  update: (id: string, data: UpdateOperatorData) =>
    api.put<{ message: string; operator: Operator }>(
      `/api/operators/${id}`,
      data
    ),

  // Delete operator
  delete: (id: string) =>
    api.delete<{ message: string }>(`/api/operators/${id}`),

  // Search operators
  search: (query: string) =>
    api.get<{ operators: Operator[] }>(
      `/api/operators/search?q=${encodeURIComponent(query)}`
    ),
};
