import { api } from "../api";
import { User, UserRole } from "../../types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: {
    user: User;
    token: string;
    message: string;
  };
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  companyId: number;
}

export const authService = {
  login: (credentials: LoginCredentials) =>
    api.post<LoginResponse>("/api/auth/login", credentials),

  register: (data: RegisterData) =>
    api.post<{ message: string; user: User }>("/api/auth/register", data),

  logout: () => api.post<{ message: string }>("/api/auth/logout"),

  getCurrentUser: () => api.get<{ user: AuthUser }>("/api/users/me"),

  updateProfile: (data: Partial<AuthUser>) =>
    api.put<{ message: string; user: AuthUser }>("/api/users/me", data),
};
