import React from "react";
import { cn } from "../../lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
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
  size?: "sm" | "md" | "lg";
}

export function LoadingState({ message = "Cargando...", size = "md" }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <LoadingSpinner size={size} />
      <p className="mt-2 text-gray-600">{message}</p>
    </div>
  );
}