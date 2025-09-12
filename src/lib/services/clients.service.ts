import { api } from "../api";
import { Client, ClientFormData, CreateClientData, UpdateClientData } from "../../types";

export const clientsService = {
  getAll: () => 
    api.get<Client[]>("/api/clients"),

  getById: (id: string) => 
    api.get<Client>(`/api/clients/${id}`),

  create: (data: ClientFormData) =>
    api.post<{ message: string; client: Client }>("/api/clients", data),

  update: (id: string, data: UpdateClientData) =>
    api.put<{ message: string; client: Client }>(`/api/clients/${id}`, data),

  delete: (id: string) => 
    api.delete<{ message: string }>(`/api/clients/${id}`),

  search: (query: string) =>
    api.get<{ clients: Client[] }>(`/api/clients/search?q=${encodeURIComponent(query)}`),
};