import { api } from "../api";
import { Classification } from "../../types/";

export interface CreateClassificationData {
  name: string;
  description?: string;
  category?: string;
  active?: boolean;
}

export interface UpdateClassificationData {
  name?: string;
  description?: string;
  category?: string;
  active?: boolean;
}

export const classificationsService = {
  // Get all classifications
  getAll: () =>
    api.get<{ classifications: Classification[] }>("/api/classifications"),

  // Get classification by ID
  getById: (id: string) =>
    api.get<Classification>(`/api/classifications/${id}`),

  // Create new classification
  create: (data: CreateClassificationData) =>
    api.post<{ message: string; classification: Classification }>(
      "/api/classifications",
      data
    ),

  // Update classification
  update: (id: string, data: UpdateClassificationData) =>
    api.put<{ message: string; classification: Classification }>(
      `/api/classifications/${id}`,
      data
    ),

  // Delete classification
  delete: (id: string) =>
    api.delete<{ message: string }>(`/api/classifications/${id}`),

  // Get classifications by category
  getByCategory: (category: string) =>
    api.get<{ classifications: Classification[] }>(
      `/api/classifications?category=${encodeURIComponent(category)}`
    ),

  // Search classifications
  search: (query: string) =>
    api.get<{ classifications: Classification[] }>(
      `/api/classifications/search?q=${encodeURIComponent(query)}`
    ),
};
