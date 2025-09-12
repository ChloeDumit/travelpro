import { api } from "../api";
import { Operator, OperatorFormData, CreateOperatorData, UpdateOperatorData } from "../../types";

export const operatorsService = {
  getAll: () => 
    api.get<Operator[]>("/api/operators"),

  getById: (id: string) => 
    api.get<Operator>(`/api/operators/${id}`),

  create: (data: OperatorFormData) =>
    api.post<{ message: string; operator: Operator }>("/api/operators", data),

  update: (id: string, data: UpdateOperatorData) =>
    api.put<{ message: string; operator: Operator }>(`/api/operators/${id}`, data),

  delete: (id: string) => 
    api.delete<{ message: string }>(`/api/operators/${id}`),

  search: (query: string) =>
    api.get<{ operators: Operator[] }>(`/api/operators/search?q=${encodeURIComponent(query)}`),
};