/**
 * Performance optimization utilities
 */

/**
 * Lazy load images with Intersection Observer
 */
export function lazyLoadImages(selector: string = "img[data-src]") {
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.getAttribute("data-src");
          if (src) {
            img.src = src;
            img.removeAttribute("data-src");
            observer.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll(selector).forEach((img) => {
      imageObserver.observe(img);
    });

    return () => imageObserver.disconnect();
  }
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Measure performance of a function
 */
export async function measurePerformance<T>(
  name: string,
  fn: () => Promise<T> | T
): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const end = performance.now();
    console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
    return result;
  } catch (error) {
    const end = performance.now();
    console.error(
      `[Performance] ${name} failed after ${(end - start).toFixed(2)}ms`,
      error
    );
    throw error;
  }
}

/**
 * Preload critical resources
 */
export function preloadResources(
  resources: Array<{ href: string; as: string; type?: string }>
) {
  resources.forEach(({ href, as, type }) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    document.head.appendChild(link);
  });
}

/**
 * Check if device has slow connection
 */
export function isSlowConnection(): boolean {
  const connection =
    (navigator as any).connection ||
    (navigator as any).mozConnection ||
    (navigator as any).webkitConnection;
  if (!connection) return false;

  return (
    connection.effectiveType === "slow-2g" ||
    connection.effectiveType === "2g" ||
    connection.saveData
  );
}

/**
 * Virtual scrolling helper for large lists
 */
export class VirtualScroller {
  private itemHeight: number;
  private visibleCount: number;
  private totalCount: number;
  private scrollTop: number = 0;

  constructor(container: HTMLElement, itemHeight: number, totalCount: number) {
    this.itemHeight = itemHeight;
    this.totalCount = totalCount;
    this.visibleCount = Math.ceil(container.clientHeight / itemHeight) + 2;
  }

  getVisibleRange(): { start: number; end: number } {
    const start = Math.floor(this.scrollTop / this.itemHeight);
    const end = Math.min(start + this.visibleCount, this.totalCount);
    return { start, end };
  }

  updateScroll(scrollTop: number) {
    this.scrollTop = scrollTop;
  }

  getTotalHeight(): number {
    return this.totalCount * this.itemHeight;
  }

  getOffsetY(): number {
    const { start } = this.getVisibleRange();
    return start * this.itemHeight;
  }
}

/**
 * Request idle callback wrapper
 */
export function runWhenIdle(
  callback: () => void,
  options?: IdleRequestOptions
) {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(callback, options);
  } else {
    setTimeout(callback, 1);
  }
}

/**
 * Batch DOM updates
 */
export function batchDOMUpdates(updates: Array<() => void>) {
  requestAnimationFrame(() => {
    updates.forEach((update) => update());
  });
}
