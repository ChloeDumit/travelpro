import { api } from "../api";
import {
  Passenger,
  PassengerFormData,
  CreatePassengerData,
  UpdatePassengerData,
} from "../../types";

export interface PassengersResponse {
  status: string;
  message: string;
  data: Passenger[];
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

export const passengersService = {
  getAll: (page = 1, limit = 100) =>
    api.get<PassengersResponse>(`/api/passengers?page=${page}&limit=${limit}`),

  getById: (id: string) => api.get<Passenger>(`/api/passengers/${id}`),

  create: (data: PassengerFormData) =>
    api.post<{ message: string; passenger: Passenger }>(
      "/api/passengers",
      data
    ),

  update: (id: string, data: UpdatePassengerData) =>
    api.put<{ message: string; passenger: Passenger }>(
      `/api/passengers/${id}`,
      data
    ),

  delete: (id: string) =>
    api.delete<{ message: string }>(`/api/passengers/${id}`),

  search: (query: string) =>
    api.get<{ passengers: Passenger[] }>(
      `/api/passengers/search?q=${encodeURIComponent(query)}`
    ),
};
