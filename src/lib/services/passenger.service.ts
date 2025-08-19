import { api } from "../api";
import { Passenger } from "../../types";

export interface CreatePassengerData {
  name: string;
  passengerId?: string;
  email?: string;
  dateOfBirth: string;
}

export interface UpdatePassengerData {
  name?: string;
  passengerId?: string;
  email?: string;
  dateOfBirth?: string;
}

export const passengersService = {
  // Get all passengers
  getAll: () => api.get<{ passengers: Passenger[] }>("/api/passengers"),

  // Get client by ID
  getById: (id: string) => api.get<Passenger>(`/api/passengers/${id}`),

  // Create new client
  create: (data: CreatePassengerData) =>
    api.post<{ message: string; passenger: Passenger }>(
      "/api/passengers",
      data
    ),

  // Update client
  update: (id: string, data: UpdatePassengerData) =>
    api.put<{ message: string; passenger: Passenger }>(
      `/api/passengers/${id}`,
      data
    ),

  // Delete client
  delete: (id: string) =>
    api.delete<{ message: string }>(`/api/passengers/${id}`),

  // Search passengers
  search: (query: string) =>
    api.get<{ passengers: Passenger[] }>(
      `/api/passengers/search?q=${encodeURIComponent(query)}`
    ),
};
