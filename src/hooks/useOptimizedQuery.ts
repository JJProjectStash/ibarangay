import { useState, useEffect, useCallback, useRef } from "react";
import { performanceMonitor } from "../utils/performance";

interface QueryOptions<T> {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number;
  staleTime?: number;
  retry?: number | boolean;
  retryDelay?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  select?: (data: T) => unknown;
}

interface QueryResult<T> {
  data: T | undefined;
  error: Error | null;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  isSuccess: boolean;
  refetch: () => Promise<void>;
  invalidate: () => void;
}

/**
 * Optimized query hook with caching, retry logic, and performance monitoring
 */
export function useOptimizedQuery<T>(
  queryKey: string | string[],
  queryFn: () => Promise<T>,
  options: QueryOptions<T> = {}
): QueryResult<T> {
  const {
    enabled = true,
    refetchOnWindowFocus = false,
    refetchInterval,
    staleTime = 300000, // 5 minutes
    retry = 3,
    retryDelay = 1000,
    onSuccess,
    onError,
    select,
  } = options;

  const [data, setData] = useState<T | undefined>();
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isFetching, setIsFetching] = useState(false);
  const [lastFetch, setLastFetch] = useState<number>(0);

  const retryCountRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();

  const key = Array.isArray(queryKey) ? queryKey.join("-") : queryKey;

  const fetchData = useCallback(
    async (isRefetch = false) => {
      if (!enabled) return;

      // Check if data is still fresh
      if (!isRefetch && data && Date.now() - lastFetch < staleTime) {
        return;
      }

      setIsFetching(true);
      if (!data) setIsLoading(true);
      setError(null);

      try {
        const result = await performanceMonitor.measureApiCall(
          `query_${key}`,
          queryFn
        );

        const finalData = select ? (select(result) as T) : result;
        setData(finalData);
        setLastFetch(Date.now());
        retryCountRef.current = 0;

        onSuccess?.(finalData);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Query failed");

        // Retry logic
        const shouldRetry =
          typeof retry === "boolean" ? retry : retryCountRef.current < retry;

        if (shouldRetry) {
          retryCountRef.current++;
          timeoutRef.current = setTimeout(() => {
            fetchData(isRefetch);
          }, retryDelay * retryCountRef.current);
        } else {
          setError(error);
          onError?.(error);
        }
      } finally {
        setIsLoading(false);
        setIsFetching(false);
      }
    },
    [
      enabled,
      queryFn,
      key,
      data,
      lastFetch,
      staleTime,
      retry,
      retryDelay,
      onSuccess,
      onError,
      select,
    ]
  );

  const refetch = useCallback(() => fetchData(true), [fetchData]);

  const invalidate = useCallback(() => {
    setLastFetch(0);
    if (enabled) {
      fetchData(true);
    }
  }, [enabled, fetchData]);

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled, key, fetchData]);

  // Refetch on window focus
  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      if (document.visibilityState === "visible") {
        fetchData(true);
      }
    };

    document.addEventListener("visibilitychange", handleFocus);
    return () => document.removeEventListener("visibilitychange", handleFocus);
  }, [refetchOnWindowFocus, fetchData]);

  // Refetch interval
  useEffect(() => {
    if (!refetchInterval || !enabled) return;

    intervalRef.current = setInterval(() => {
      fetchData(true);
    }, refetchInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refetchInterval, enabled, fetchData]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    data,
    error,
    isLoading,
    isFetching,
    isError: !!error,
    isSuccess: !!data && !error,
    refetch,
    invalidate,
  };
}

/**
 * Optimized mutation hook with loading states and error handling
 */
export function useOptimizedMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: Error, variables: TVariables) => void;
    onSettled?: (
      data: TData | undefined,
      error: Error | null,
      variables: TVariables
    ) => void;
  } = {}
) {
  const [data, setData] = useState<TData | undefined>();
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mutate = useCallback(
    async (variables: TVariables) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await performanceMonitor.measureApiCall("mutation", () =>
          mutationFn(variables)
        );

        setData(result);
        options.onSuccess?.(result, variables);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Mutation failed");
        setError(error);
        options.onError?.(error, variables);
        throw error;
      } finally {
        setIsLoading(false);
        options.onSettled?.(data, error, variables);
      }
    },
    [mutationFn, options, data, error]
  );

  const reset = useCallback(() => {
    setData(undefined);
    setError(null);
  }, []);

  return {
    data,
    error,
    isLoading,
    isError: !!error,
    isSuccess: !!data && !error,
    mutate,
    reset,
  };
}

export default useOptimizedQuery;
