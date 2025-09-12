import { api } from "../api";
import { User } from "../../types";

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  role: User["role"];
  firstName: string;
  lastName: string;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: User["role"];
  active?: boolean;
}

export interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const usersService = {
  // Get all users
  getAll: (page = 1, limit = 100) =>
    api.get<UsersResponse>(`/api/users?page=${page}&limit=${limit}`),

  // Get user by ID
  getById: (id: string) => api.get<User>(`/api/users/${id}`),

  // Create new user
  create: (data: CreateUserData) => api.post<User>("/api/users", data),

  // Update user
  update: (id: string, data: UpdateUserData) =>
    api.put<User>(`/api/users/${id}`, data),

  // Delete user
  delete: (id: string) => api.delete(`/api/users/${id}`),

  // Get users by role
  getByRole: (role: User["role"]) =>
    api.get<{ users: User[] }>(`/api/users?role=${role}`),
};
