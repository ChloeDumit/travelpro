import { useState, useCallback } from "react";

interface LoadingState {
  loading: boolean;
  error: string | null;
}

interface UseLoadingStateReturn extends LoadingState {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  executeWithLoading: <T>(
    asyncFunction: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: Error) => void
  ) => Promise<T | null>;
}

export function useLoadingState(initialLoading = false): UseLoadingStateReturn {
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const executeWithLoading = useCallback(
    async <T>(
      asyncFunction: () => Promise<T>,
      onSuccess?: (result: T) => void,
      onError?: (error: Error) => void
    ): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);
        const result = await asyncFunction();
        onSuccess?.(result);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        onError?.(err instanceof Error ? err : new Error(errorMessage));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    setLoading,
    setError,
    clearError,
    executeWithLoading,
  };
}
