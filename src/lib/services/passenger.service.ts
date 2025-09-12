import { api } from "../api";
import { Passenger, PassengerFormData, CreatePassengerData, UpdatePassengerData } from "../../types";

export const passengersService = {
  getAll: () => 
    api.get<{ passengers: Passenger[] }>("/api/passengers"),

  getById: (id: string) => 
    api.get<Passenger>(`/api/passengers/${id}`),

  create: (data: PassengerFormData) =>
    api.post<{ message: string; passenger: Passenger }>("/api/passengers", data),

  update: (id: string, data: UpdatePassengerData) =>
    api.put<{ message: string; passenger: Passenger }>(`/api/passengers/${id}`, data),

  delete: (id: string) => 
    api.delete<{ message: string }>(`/api/passengers/${id}`),

  search: (query: string) =>
    api.get<{ passengers: Passenger[] }>(`/api/passengers/search?q=${encodeURIComponent(query)}`),
};