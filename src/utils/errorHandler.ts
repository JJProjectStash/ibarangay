import { AxiosError } from "axios";

/**
 * Error response interface
 */
export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Extract error message from various error types
 * @param error - Error object from API call
 * @returns User-friendly error message
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ErrorResponse;

    // Handle validation errors
    if (data?.errors) {
      const firstError = Object.values(data.errors)[0];
      return firstError?.[0] || "Validation error occurred";
    }

    // Handle general API errors
    if (data?.message) {
      return data.message;
    }

    // Handle network errors
    if (error.code === "ECONNABORTED") {
      return "Request timeout. Please try again.";
    }

    if (error.code === "ERR_NETWORK") {
      return "Network error. Please check your connection.";
    }

    // Handle HTTP status codes
    switch (error.response?.status) {
      case 400:
        return "Invalid request. Please check your input.";
      case 401:
        return "Unauthorized. Please log in again.";
      case 403:
        return "Access denied. You do not have permission.";
      case 404:
        return "Resource not found.";
      case 409:
        return "Conflict. Resource already exists.";
      case 429:
        return "Too many requests. Please try again later.";
      case 500:
        return "Server error. Please try again later.";
      case 503:
        return "Service unavailable. Please try again later.";
      default:
        return "An unexpected error occurred.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unknown error occurred";
};

/**
 * Check if error is a network error
 * @param error - Error object
 * @returns True if network error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.code === "ERR_NETWORK" || error.code === "ECONNABORTED";
  }
  return false;
};

/**
 * Check if error is an authentication error
 * @param error - Error object
 * @returns True if auth error
 */
export const isAuthError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 401;
  }
  return false;
};

/**
 * Check if error is a validation error
 * @param error - Error object
 * @returns True if validation error
 */
export const isValidationError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ErrorResponse;
    return error.response?.status === 400 && !!data?.errors;
  }
  return false;
};

/**
 * Retry function with exponential backoff
 * @param fn - Function to retry
 * @param maxRetries - Maximum number of retries
 * @param delay - Initial delay in milliseconds
 * @returns Promise with function result
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: unknown;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on auth errors or validation errors
      if (isAuthError(error) || isValidationError(error)) {
        throw error;
      }

      // Only retry on network errors or server errors
      if (
        i < maxRetries - 1 &&
        (isNetworkError(error) ||
          (error instanceof AxiosError &&
            error.response?.status &&
            error.response.status >= 500))
      ) {
        await new Promise((resolve) =>
          setTimeout(resolve, delay * Math.pow(2, i))
        );
        continue;
      }

      throw error;
    }
  }

  throw lastError;
};

/**
 * Handle API error and show toast notification
 * @param error - Error object
 * @param showToast - Toast notification function
 * @param customMessage - Custom error message
 */
export const handleApiError = (
  error: unknown,
  showToast?: (message: string, type: "error" | "success" | "info") => void,
  customMessage?: string
): void => {
  const message = customMessage || getErrorMessage(error);

  if (showToast) {
    showToast(message, "error");
  } else {
    console.error("API Error:", message, error);
  }
};
