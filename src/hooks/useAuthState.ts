import { useCallback } from "react";
import { useAuth } from "../contexts/auth-context";
import { UserRole } from "../types";

export function useAuthState() {
  const { user, isLoading, isAuthenticated, error, clearError } = useAuth();

  const hasRole = useCallback(
    (role: UserRole): boolean => {
      return user?.role === role;
    },
    [user?.role]
  );

  const hasAnyRole = useCallback(
    (roles: UserRole[]): boolean => {
      return user?.role ? roles.includes(user.role) : false;
    },
    [user?.role]
  );

  const isAdmin = useCallback((): boolean => {
    return hasRole("admin");
  }, [hasRole]);

  const isSales = useCallback((): boolean => {
    return hasRole("sales");
  }, [hasRole]);

  const isFinance = useCallback((): boolean => {
    return hasRole("finance");
  }, [hasRole]);

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
    clearError,
    hasRole,
    hasAnyRole,
    isAdmin,
    isSales,
    isFinance,
    isInitialized: !isLoading,
  };
}