import { api } from "../api";
import { Client, ClientFormData, UpdateClientData } from "../../types";

export interface ClientsResponse {
  status: string;
  message: string;
  data: Client[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  timestamp: string;
}

export const clientsService = {
  getAll: (page = 1, limit = 100) =>
    api.get<ClientsResponse>(`/api/clients?page=${page}&limit=${limit}`),

  getById: (id: string) => api.get<Client>(`/api/clients/${id}`),

  create: (data: ClientFormData) =>
    api.post<{ message: string; client: Client }>("/api/clients", data),

  update: (id: string, data: UpdateClientData) =>
    api.put<{ message: string; client: Client }>(`/api/clients/${id}`, data),

  delete: (id: string) => api.delete<{ message: string }>(`/api/clients/${id}`),

  search: (query: string) =>
    api.get<{ clients: Client[] }>(
      `/api/clients/search?q=${encodeURIComponent(query)}`
    ),
};
