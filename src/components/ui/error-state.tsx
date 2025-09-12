import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./button";

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  title?: string;
}

export function ErrorState({ 
  error, 
  onRetry, 
  title = "Error" 
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
        <AlertCircle className="h-6 w-6 text-red-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-4">{error}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Reintentar
        </Button>
      )}
    </div>
  );
}