/**
 * Accessibility utilities for enterprise-grade web applications
 */

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(
  message: string,
  priority: "polite" | "assertive" = "polite"
) {
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Trap focus within a modal or dialog
 */
export function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  };

  element.addEventListener("keydown", handleTabKey);

  // Focus first element
  firstFocusable?.focus();

  return () => {
    element.removeEventListener("keydown", handleTabKey);
  };
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Check if user prefers dark mode
 */
export function prefersDarkMode(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * Generate unique ID for accessibility labels
 */
let idCounter = 0;
export function generateA11yId(prefix: string = "a11y"): string {
  return `${prefix}-${++idCounter}-${Date.now()}`;
}

/**
 * Skip to main content functionality
 */
export function setupSkipToMain() {
  const skipLink = document.createElement("a");
  skipLink.href = "#main-content";
  skipLink.className = "skip-to-main";
  skipLink.textContent = "Skip to main content";
  skipLink.style.cssText = `
    position: absolute;
    left: -9999px;
    z-index: 999;
    padding: 1em;
    background-color: #000;
    color: #fff;
    text-decoration: none;
  `;

  skipLink.addEventListener("focus", () => {
    skipLink.style.left = "0";
  });

  skipLink.addEventListener("blur", () => {
    skipLink.style.left = "-9999px";
  });

  document.body.insertBefore(skipLink, document.body.firstChild);
}

/**
 * Keyboard navigation helper
 */
export function handleArrowNavigation(
  event: KeyboardEvent,
  items: HTMLElement[],
  currentIndex: number,
  onSelect: (index: number) => void
) {
  let newIndex = currentIndex;

  switch (event.key) {
    case "ArrowDown":
    case "ArrowRight":
      event.preventDefault();
      newIndex = (currentIndex + 1) % items.length;
      break;
    case "ArrowUp":
    case "ArrowLeft":
      event.preventDefault();
      newIndex = (currentIndex - 1 + items.length) % items.length;
      break;
    case "Home":
      event.preventDefault();
      newIndex = 0;
      break;
    case "End":
      event.preventDefault();
      newIndex = items.length - 1;
      break;
    case "Enter":
    case " ":
      event.preventDefault();
      onSelect(currentIndex);
      return;
    default:
      return;
  }

  items[newIndex]?.focus();
  onSelect(newIndex);
}
