/**
 * Toast Notification Utilities
 *
 * Provides a centralized API for displaying toast notifications throughout the application.
 * Uses custom events to communicate with the ToastProvider component.
 *
 * @module utils/toast
 */

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastOptions {
  /** The message to display in the toast */
  message: string;
  /** The type/severity of the toast */
  type: ToastType;
  /** Duration in milliseconds before auto-dismissing (default: 3000) */
  duration?: number;
  /** Optional action button configuration */
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Displays a toast notification
 *
 * @param message - The message to display
 * @param type - The type of toast (success, error, info, warning)
 * @param duration - Optional duration in milliseconds (default: 3000)
 *
 * @example
 * ```typescript
 * // Success toast
 * showToast("Complaint submitted successfully!", "success");
 *
 * // Error toast with custom duration
 * showToast("Failed to load data", "error", 5000);
 *
 * // Info toast
 * showToast("Your session will expire in 5 minutes", "info");
 * ```
 */
export const showToast = (
  message: string,
  type: ToastType = "info",
  duration: number = 3000
): void => {
  const event = new CustomEvent("show-toast", {
    detail: { message, type, duration },
  });
  window.dispatchEvent(event);
};

/**
 * Displays a success toast notification
 *
 * @param message - The success message to display
 * @param duration - Optional duration in milliseconds
 *
 * @example
 * ```typescript
 * showSuccessToast("User created successfully!");
 * ```
 */
export const showSuccessToast = (message: string, duration?: number): void => {
  showToast(message, "success", duration);
};

/**
 * Displays an error toast notification
 *
 * @param message - The error message to display
 * @param duration - Optional duration in milliseconds
 *
 * @example
 * ```typescript
 * showErrorToast("Failed to save changes. Please try again.");
 * ```
 */
export const showErrorToast = (message: string, duration?: number): void => {
  showToast(message, "error", duration);
};

/**
 * Displays an info toast notification
 *
 * @param message - The info message to display
 * @param duration - Optional duration in milliseconds
 *
 * @example
 * ```typescript
 * showInfoToast("New announcement available");
 * ```
 */
export const showInfoToast = (message: string, duration?: number): void => {
  showToast(message, "info", duration);
};

/**
 * Displays a warning toast notification
 *
 * @param message - The warning message to display
 * @param duration - Optional duration in milliseconds
 *
 * @example
 * ```typescript
 * showWarningToast("Your session will expire soon");
 * ```
 */
export const showWarningToast = (message: string, duration?: number): void => {
  showToast(message, "warning", duration);
};

/**
 * Displays a toast with an action button
 *
 * @param options - Toast configuration options
 *
 * @example
 * ```typescript
 * showToastWithAction({
 *   message: "File uploaded successfully",
 *   type: "success",
 *   action: {
 *     label: "View",
 *     onClick: () => navigate("/files")
 *   }
 * });
 * ```
 */
export const showToastWithAction = (options: ToastOptions): void => {
  const event = new CustomEvent("show-toast", {
    detail: options,
  });
  window.dispatchEvent(event);
};
