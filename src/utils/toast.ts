/**
 * Toast notification utility
 * Provides a centralized way to show toast notifications
 */

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastOptions {
  message: string;
  type: ToastType;
  duration?: number;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
}

/**
 * Show a toast notification
 * @param message - Toast message
 * @param type - Toast type
 * @param duration - Duration in milliseconds (default: 3000)
 * @param position - Toast position (default: 'top-right')
 */
export const showToast = (
  message: string,
  type: ToastType = "info",
  duration = 3000,
  position: ToastOptions["position"] = "top-right"
): void => {
  // Create toast container if it doesn't exist
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = `fixed ${getPositionClass(
      position
    )} z-50 space-y-2 p-4`;
    container.setAttribute('role', 'region');
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }

  // Create toast element
  const toast = document.createElement("div");
  toast.className = `
    flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg
    transform transition-all duration-300 ease-in-out
    ${getTypeClass(type)}
    animate-slide-in
  `;

  // Add icon
  const icon = document.createElement("span");
  icon.innerHTML = getIcon(type);
  icon.className = "flex-shrink-0";

  // Add message
  const messageEl = document.createElement("span");
  messageEl.textContent = message;
  messageEl.className = "text-sm font-medium";

  // Add close button
  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = "×";
  closeBtn.className =
    "ml-auto text-xl font-bold opacity-70 hover:opacity-100 transition-opacity";
  closeBtn.onclick = () => removeToast(toast);

  toast.appendChild(icon);
  toast.appendChild(messageEl);
  // For errors, announce as alert; otherwise use role=status
  if (type === 'error') {
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-atomic', 'true');
  } else {
    toast.setAttribute('role', 'status');
  }
  toast.appendChild(closeBtn);
  container.appendChild(toast);

  // Auto remove after duration
  setTimeout(() => removeToast(toast), duration);
};

/**
 * Remove toast element with animation
 * @param toast - Toast element to remove
 */
const removeToast = (toast: HTMLElement): void => {
  toast.classList.add("animate-slide-out");
  setTimeout(() => {
    toast.remove();

    // Remove container if empty
    const container = document.getElementById("toast-container");
    if (container && container.children.length === 0) {
      container.remove();
    }
  }, 300);
};

/**
 * Get CSS class for toast position
 * @param position - Toast position
 * @returns CSS class string
 */
const getPositionClass = (position: ToastOptions["position"]): string => {
  switch (position) {
    case "top-left":
      return "top-0 left-0";
    case "top-center":
      return "top-0 left-1/2 -translate-x-1/2";
    case "top-right":
      return "top-0 right-0";
    case "bottom-left":
      return "bottom-0 left-0";
    case "bottom-center":
      return "bottom-0 left-1/2 -translate-x-1/2";
    case "bottom-right":
      return "bottom-0 right-0";
    default:
      return "top-0 right-0";
  }
};

/**
 * Get CSS class for toast type
 * @param type - Toast type
 * @returns CSS class string
 */
const getTypeClass = (type: ToastType): string => {
  switch (type) {
    case "success":
      return "bg-green-500 text-white";
    case "error":
      return "bg-red-500 text-white";
    case "warning":
      return "bg-yellow-500 text-white";
    case "info":
      return "bg-blue-500 text-white";
    default:
      return "bg-gray-800 text-white";
  }
};

/**
 * Get icon SVG for toast type
 * @param type - Toast type
 * @returns SVG icon string
 */
const getIcon = (type: ToastType): string => {
  const iconClass = "w-5 h-5";

  switch (type) {
    case "success":
      return `<svg class="${iconClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>`;
    case "error":
      return `<svg class="${iconClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>`;
    case "warning":
      return `<svg class="${iconClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>`;
    case "info":
      return `<svg class="${iconClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>`;
    default:
      return "";
  }
};

// Convenience methods
export const toast = {
  success: (message: string, duration?: number) =>
    showToast(message, "success", duration),
  error: (message: string, duration?: number) =>
    showToast(message, "error", duration),
  warning: (message: string, duration?: number) =>
    showToast(message, "warning", duration),
  info: (message: string, duration?: number) =>
    showToast(message, "info", duration),
};

// Add CSS animations
const style = document.createElement("style");
style.textContent = `
  @keyframes slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slide-out {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
  }
  
  .animate-slide-out {
    animation: slide-out 0.3s ease-in;
  }
`;
document.head.appendChild(style);
