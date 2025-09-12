import { api } from "../api";
import { Classification, ClassificationFormData, CreateClassificationData, UpdateClassificationData } from "../../types";

export const classificationsService = {
  getAll: () => 
    api.get<Classification[]>("/api/classifications"),

  getById: (id: string) => 
    api.get<Classification>(`/api/classifications/${id}`),

  create: (data: ClassificationFormData) =>
    api.post<{ message: string; classification: Classification }>("/api/classifications", data),

  update: (id: string, data: UpdateClassificationData) =>
    api.put<{ message: string; classification: Classification }>(`/api/classifications/${id}`, data),

  delete: (id: string) => 
    api.delete<{ message: string }>(`/api/classifications/${id}`),

  search: (query: string) =>
    api.get<{ classifications: Classification[] }>(`/api/classifications/search?q=${encodeURIComponent(query)}`),
};