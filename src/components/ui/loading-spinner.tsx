import React from "react";
import { cn } from "../../lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-4 border-primary-600 border-t-transparent",
        sizeClasses[size],
        className
      )}
    />
  );
}

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg" | "xl";
  fullScreen?: boolean;
}

export function LoadingState({
  message = "Cargando...",
  size = "md",
  fullScreen = false,
}: LoadingStateProps) {
  const containerClasses = fullScreen
    ? "flex flex-col items-center justify-center min-h-screen"
    : "flex flex-col items-center justify-center py-8";

  return (
    <div className={containerClasses}>
      <LoadingSpinner size={size} />
      <p className="mt-2 text-gray-600">{message}</p>
    </div>
  );
}

interface PageLoadingProps {
  message?: string;
}

export function PageLoading({ message = "Cargando..." }: PageLoadingProps) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
}
