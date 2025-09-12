import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "./button";
import { ErrorMessage } from "./error-message";
import { SuccessMessage } from "./success-message";

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onBack?: () => void;
  backLabel?: string;
  error?: string | null;
  success?: string | null;
  onDismissError?: () => void;
  onDismissSuccess?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

export function PageLayout({
  title,
  subtitle,
  children,
  onBack,
  backLabel = "Volver",
  error,
  success,
  onDismissError,
  onDismissSuccess,
  actions,
  className = "",
}: PageLayoutProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {actions}
          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {backLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      {error && <ErrorMessage error={error} onDismiss={onDismissError} />}

      {success && (
        <SuccessMessage message={success} onDismiss={onDismissSuccess} />
      )}

      {/* Content */}
      {children}
    </div>
  );
}
