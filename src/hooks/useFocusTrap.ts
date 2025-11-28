import { useEffect } from "react";

// useFocusTrap
// Traps keyboard focus within a container (useful for modals, dialogs, dropdowns).
// Usage:
// const ref = useRef<HTMLDivElement>(null);
// useFocusTrap(ref, isOpen, () => setIsOpen(false));

export default function useFocusTrap(
  ref: React.RefObject<HTMLElement>,
  enabled = true,
  onClose?: () => void
) {
  useEffect(() => {
    if (!enabled) return;
    const container = ref?.current;
    if (!container) return;

    const focusableSelectors = [
      'a[href]',
      'area[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    const nodes = Array.from(
      container.querySelectorAll<HTMLElement>(focusableSelectors)
    ).filter((el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement);

    if (nodes.length === 0) return;

    const first = nodes[0];
    const last = nodes[nodes.length - 1];

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      } else if (e.key === "Escape") {
        if (typeof onClose === "function") onClose();
      }
    }

    // Focus the first element when trap is enabled
    try {
      first.focus();
    } catch (err) {
      /* ignore */
    }

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [ref, enabled, onClose]);
}
