import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthState } from "../../hooks/useAuthState";
import { User } from "../../types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: User["role"][];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredRoles = [],
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, isInitialized, hasAnyRole } =
    useAuthState();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading || !isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role requirements if specified
  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    // Redirect to dashboard if user doesn't have required role
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
