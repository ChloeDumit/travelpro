export type UserRole = "admin" | "sales" | "finance";

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  companyId: number;
  createdAt: string;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  companyId: number;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  role?: UserRole;
}

export const userRoleOptions = [
  { value: "admin", label: "Administrador" },
  { value: "sales", label: "Ventas" },
  { value: "finance", label: "Finanzas" },
] as const;