import { api } from "../api";
import { Client } from "../../types";

export interface CreateClientData {
  name: string;
  clientId?: string;
  email?: string;
  address?: string;
}

export interface UpdateClientData {
  name?: string;
  clientId?: string;
  email?: string;
  address?: string;
}

export const clientsService = {
  // Get all clients
  getAll: () => api.get<{ clients: Client[] }>("/api/clients"),

  // Get client by ID
  getById: (id: string) => api.get<Client>(`/api/clients/${id}`),

  // Create new client
  create: (data: CreateClientData) =>
    api.post<{ message: string; client: Client }>("/api/clients", data),

  // Update client
  update: (id: string, data: UpdateClientData) =>
    api.put<{ message: string; client: Client }>(`/api/clients/${id}`, data),

  // Delete client
  delete: (id: string) => api.delete<{ message: string }>(`/api/clients/${id}`),

  // Search clients
  search: (query: string) =>
    api.get<{ clients: Client[] }>(
      `/api/clients/search?q=${encodeURIComponent(query)}`
    ),
};
