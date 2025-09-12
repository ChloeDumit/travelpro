import React from "react";
import { CheckCircle, X } from "lucide-react";
import { Button } from "./button";

interface SuccessMessageProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
  showIcon?: boolean;
}

export function SuccessMessage({
  message,
  onDismiss,
  className = "",
  showIcon = true,
}: SuccessMessageProps) {
  return (
    <div
      className={`bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {showIcon && <CheckCircle className="h-4 w-4 mr-2" />}
          <span>{message}</span>
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-6 w-6 p-0 text-green-600 hover:text-green-800"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
