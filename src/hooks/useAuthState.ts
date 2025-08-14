import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/auth-context";
import { User } from "../types";

export function useAuthState() {
  const { user, isLoading, isAuthenticated, refreshUser } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setIsInitialized(true);
    }
  }, [isLoading]);

  const checkAuth = useCallback(async () => {
    if (isAuthenticated) {
      await refreshUser();
    }
  }, [isAuthenticated, refreshUser]);

  const hasRole = useCallback(
    (role: User["role"]) => user?.role === role,
    [user?.role]
  );

  const hasAnyRole = useCallback(
    (roles: User["role"][]) => roles.includes(user?.role as User["role"]),
    [user?.role]
  );

  return {
    user,
    isLoading,
    isAuthenticated,
    isInitialized,
    checkAuth,
    hasRole,
    hasAnyRole,
  };
}
