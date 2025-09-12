import { useState, useCallback } from "react";
import { useLoadingState } from "./useLoadingState";

interface CrudOperations<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  setItems: (items: T[]) => void;
  addItem: (item: T) => void;
  updateItem: (id: string | number, updatedItem: Partial<T>) => void;
  removeItem: (id: string | number) => void;
  clearError: () => void;
  executeWithLoading: <R>(
    asyncFunction: () => Promise<R>,
    onSuccess?: (result: R) => void,
    onError?: (error: Error) => void
  ) => Promise<R | null>;
}

export function useCrudOperations<T extends { id: string | number }>(
  initialItems: T[] = []
): CrudOperations<T> {
  const [items, setItems] = useState<T[]>(initialItems);
  const { loading, error, clearError, executeWithLoading } = useLoadingState();

  const addItem = useCallback((item: T) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const updateItem = useCallback(
    (id: string | number, updatedItem: Partial<T>) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...updatedItem } : item
        )
      );
    },
    []
  );

  const removeItem = useCallback((id: string | number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return {
    items,
    loading,
    error,
    setItems,
    addItem,
    updateItem,
    removeItem,
    clearError,
    executeWithLoading,
  };
}
