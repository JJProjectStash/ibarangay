import { useState, useCallback } from "react";

interface UseRetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  onRetry?: (attempt: number) => void;
  onMaxRetriesReached?: () => void;
}

export const useRetry = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: UseRetryOptions = {}
) => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    onRetry,
    onMaxRetriesReached,
  } = options;

  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const executeWithRetry = useCallback(
    async (...args: Parameters<T>): Promise<ReturnType<T>> => {
      let attempt = 0;

      while (attempt < maxRetries) {
        try {
          const result = await fn(...args);
          setRetryCount(0);
          setIsRetrying(false);
          return result;
        } catch (error) {
          attempt++;
          setRetryCount(attempt);

          if (attempt >= maxRetries) {
            setIsRetrying(false);
            onMaxRetriesReached?.();
            throw error;
          }

          setIsRetrying(true);
          onRetry?.(attempt);

          // Wait before retrying with exponential backoff
          await new Promise((resolve) =>
            setTimeout(resolve, retryDelay * Math.pow(2, attempt - 1))
          );
        }
      }

      throw new Error("Max retries reached");
    },
    [fn, maxRetries, retryDelay, onRetry, onMaxRetriesReached]
  );

  const reset = useCallback(() => {
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  return {
    execute: executeWithRetry,
    isRetrying,
    retryCount,
    reset,
  };
};
