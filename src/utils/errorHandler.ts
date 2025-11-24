/**
 * Error Handler Utilities
 *
 * Provides centralized error handling and message extraction for the application.
 * Supports various error types including Axios errors, validation errors, and custom errors.
 *
 * @module utils/errorHandler
 */

import { AxiosError } from "axios";

/**
 * Extracts a user-friendly error message from various error types
 *
 * @param error - The error object (can be AxiosError, Error, or unknown)
 * @returns A human-readable error message string
 *
 * @example
 * ```typescript
 * try {
 *   await api.createComplaint(data);
 * } catch (error) {
 *   const message = getErrorMessage(error);
 *   showErrorToast(message);
 * }
 * ```
 */
export const getErrorMessage = (error: unknown): string => {
  // Handle Axios errors (API responses)
  if (error instanceof AxiosError) {
    // Server responded with error
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    // Network error
    if (error.message === "Network Error") {
      return "Network error. Please check your internet connection.";
    }

    // Timeout error
    if (error.code === "ECONNABORTED") {
      return "Request timeout. Please try again.";
    }

    // Generic Axios error
    return error.message || "An unexpected error occurred";
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === "string") {
    return error;
  }

  // Fallback for unknown error types
  return "An unexpected error occurred. Please try again.";
};

/**
 * Checks if an error is a network-related error
 *
 * @param error - The error object to check
 * @returns True if the error is network-related, false otherwise
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.message === "Network Error" || error.code === "ECONNABORTED";
  }
  return false;
};

/**
 * Checks if an error is an authentication error (401 Unauthorized)
 *
 * @param error - The error object to check
 * @returns True if the error is an authentication error, false otherwise
 */
export const isAuthError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 401;
  }
  return false;
};

/**
 * Checks if an error is a validation error (400 Bad Request)
 *
 * @param error - The error object to check
 * @returns True if the error is a validation error, false otherwise
 */
export const isValidationError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 400;
  }
  return false;
};

/**
 * Extracts validation errors from an API response
 *
 * @param error - The error object
 * @returns An object mapping field names to error messages, or null if not a validation error
 *
 * @example
 * ```typescript
 * try {
 *   await api.register(formData);
 * } catch (error) {
 *   const validationErrors = getValidationErrors(error);
 *   if (validationErrors) {
 *     Object.entries(validationErrors).forEach(([field, message]) => {
 *       setFieldError(field, message);
 *     });
 *   }
 * }
 * ```
 */
export const getValidationErrors = (
  error: unknown
): Record<string, string> | null => {
  if (error instanceof AxiosError && error.response?.status === 400) {
    const errors = error.response.data?.errors;
    if (errors && typeof errors === "object") {
      return errors as Record<string, string>;
    }
  }
  return null;
};
