import React from "react";
import { AlertCircle, X } from "lucide-react";
import { Button } from "./button";

interface ErrorMessageProps {
  error: string;
  onDismiss?: () => void;
  className?: string;
  showIcon?: boolean;
}

export function ErrorMessage({
  error,
  onDismiss,
  className = "",
  showIcon = true,
}: ErrorMessageProps) {
  return (
    <div
      className={`bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {showIcon && <AlertCircle className="h-4 w-4 mr-2" />}
          <span>{error}</span>
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-6 w-6 p-0 text-red-600 hover:text-red-800"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
