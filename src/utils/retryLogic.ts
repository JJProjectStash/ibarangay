import { AxiosError } from "axios";

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  retryCondition?: (error: AxiosError) => boolean;
}

const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  retryCondition: (error: AxiosError) => {
    // Retry on network errors or 5xx server errors
    return (
      !error.response ||
      (error.response.status >= 500 && error.response.status < 600)
    );
  },
};

export const withRetry = async <T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> => {
  const { maxRetries, baseDelay, maxDelay, retryCondition } = {
    ...defaultRetryConfig,
    ...config,
  };

  let lastError: AxiosError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as AxiosError;

      // Don't retry if it's the last attempt or if retry condition fails
      if (attempt === maxRetries || !retryCondition?.(lastError)) {
        throw lastError;
      }

      // Exponential backoff with jitter
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      const jitter = Math.random() * 0.1 * delay;

      await new Promise((resolve) => setTimeout(resolve, delay + jitter));
    }
  }

  throw lastError!;
};

export const createRetryInterceptor = (axiosInstance: any) => {
  axiosInstance.interceptors.response.use(
    (response: any) => response,
    async (error: AxiosError) => {
      const config = error.config as any;

      // Don't retry if already retried max times
      if (config.__retryCount >= 3) {
        return Promise.reject(error);
      }

      config.__retryCount = config.__retryCount || 0;
      config.__retryCount += 1;

      // Only retry on network errors or 5xx errors
      if (
        !error.response ||
        (error.response.status >= 500 && error.response.status < 600)
      ) {
        const delay = Math.pow(2, config.__retryCount) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        return axiosInstance(config);
      }

      return Promise.reject(error);
    }
  );
};
