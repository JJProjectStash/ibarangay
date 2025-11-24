import { useState, useEffect, useCallback } from "react";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds (default: 5 minutes)
  key: string;
}

/**
 * Custom hook for caching API responses with TTL
 */
export function useApiCache<T>(
  fetchFn: () => Promise<T>,
  options: CacheOptions
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { ttl = 5 * 60 * 1000, key } = options; // Default 5 minutes

  const getCachedData = useCallback((): T | null => {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (!cached) return null;

      const entry: CacheEntry<T> = JSON.parse(cached);
      const now = Date.now();

      if (now - entry.timestamp > ttl) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }

      return entry.data;
    } catch {
      return null;
    }
  }, [key, ttl]);

  const setCachedData = useCallback(
    (newData: T) => {
      try {
        const entry: CacheEntry<T> = {
          data: newData,
          timestamp: Date.now(),
        };
        localStorage.setItem(`cache_${key}`, JSON.stringify(entry));
      } catch (error) {
        console.error("Failed to cache data:", error);
      }
    },
    [key]
  );

  const fetchData = useCallback(
    async (forceRefresh = false) => {
      // Check cache first
      if (!forceRefresh) {
        const cached = getCachedData();
        if (cached) {
          setData(cached);
          return cached;
        }
      }

      setLoading(true);
      setError(null);

      try {
        const result = await fetchFn();
        setData(result);
        setCachedData(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchFn, getCachedData, setCachedData]
  );

  const invalidateCache = useCallback(() => {
    localStorage.removeItem(`cache_${key}`);
    setData(null);
  }, [key]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    invalidateCache,
  };
}
