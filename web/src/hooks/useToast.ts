import { useState, useCallback } from 'react';

export function useToast() {
  const [toast, setToast] = useState<{ message: string; id: number } | null>(null);

  const showToast = useCallback((message: string) => {
    const id = Date.now();
    setToast({ message, id });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return { showToast, toast, hideToast };
}
