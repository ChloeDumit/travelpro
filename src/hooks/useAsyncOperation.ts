import { useState, useCallback } from "react";

interface AsyncOperationState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface AsyncOperationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useAsyncOperation<T, Args extends any[]>(
  operation: (...args: Args) => Promise<{ data?: T; message?: string }>,
  options: AsyncOperationOptions = {}
) {
  const [state, setState] = useState<AsyncOperationState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: Args) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await operation(...args);

        if (response.data) {
          setState((prev) => ({
            ...prev,
            data: response.data!,
            loading: false,
          }));
          options.onSuccess?.(response.data);
          return response;
        } else {
          setState((prev) => ({
            ...prev,
            loading: false,
          }));
          options.onSuccess?.(response);
          return response;
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          loading: false,
        }));
        options.onError?.(errorMessage);
        throw error;
      }
    },
    [operation, options.onSuccess, options.onError]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute: execute as (
      ...args: Args
    ) => Promise<{ data?: T; message?: string }>,
    reset,
  };
}
