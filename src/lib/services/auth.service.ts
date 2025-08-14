import { api } from "../api";
import { User } from "../../types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  message: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: User["role"];
}

export const authService = {
  // Login user
  login: (credentials: LoginCredentials) =>
    api.post<LoginResponse>("/api/auth/login", credentials),

  // Register user
  register: (data: RegisterData) => api.post<User>("/api/auth/register", data),

  // Logout user
  logout: () => api.post("/api/auth/logout"),

  // Get current user
  getCurrentUser: () => api.get<{ user: User }>("/api/users/me"),

  // Update current user profile
  updateProfile: (data: Partial<User>) => api.put<User>("/api/users/me", data),
};
