/**
 * Performance monitoring and optimization utilities
 */

// Performance metrics collection
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Measure component render time
  measureRender(componentName: string, renderFn: () => void): void {
    const start = performance.now();
    renderFn();
    const end = performance.now();

    this.addMetric(`render_${componentName}`, end - start);
  }

  // Measure API call duration
  async measureApiCall<T>(
    apiName: string,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const start = performance.now();
    try {
      const result = await apiCall();
      const end = performance.now();
      this.addMetric(`api_${apiName}`, end - start);
      return result;
    } catch (error) {
      const end = performance.now();
      this.addMetric(`api_${apiName}_error`, end - start);
      throw error;
    }
  }

  // Add metric to collection
  private addMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    const values = this.metrics.get(name)!;
    values.push(value);

    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift();
    }
  }

  // Get performance statistics
  getStats(metricName: string) {
    const values = this.metrics.get(metricName) || [];
    if (values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    return {
      count: values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
    };
  }

  // Report all metrics (for debugging)
  reportAll(): void {
    console.group("Performance Metrics");
    for (const [name] of this.metrics) {
      const stats = this.getStats(name);
      if (stats) {
        console.log(`${name}:`, stats);
      }
    }
    console.groupEnd();
  }
}

// Memory usage monitoring
export function monitorMemoryUsage(): void {
  if ("memory" in performance) {
    const memory = (
      performance as unknown as {
        memory: {
          usedJSHeapSize: number;
          totalJSHeapSize: number;
          jsHeapSizeLimit: number;
        };
      }
    ).memory;
    console.log("Memory Usage:", {
      used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)} MB`,
      total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)} MB`,
      limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)} MB`,
    });
  }
}

// Debounce function for performance optimization
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(this: unknown, ...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };

    const callNow = immediate && !timeout;

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func.apply(this, args);
  };
}

// Throttle function for performance optimization
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Web Vitals measurement
export function measureWebVitals(): void {
  // Largest Contentful Paint
  if ("PerformanceObserver" in window) {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log("LCP:", lastEntry.startTime);
    }).observe({ entryTypes: ["largest-contentful-paint"] });

    // First Input Delay
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        if ("processingStart" in entry) {
          console.log(
            "FID:",
            (entry as { processingStart: number }).processingStart -
              entry.startTime
          );
        }
      });
    }).observe({ entryTypes: ["first-input"] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        if ("hadRecentInput" in entry && "value" in entry) {
          const layoutShiftEntry = entry as {
            hadRecentInput: boolean;
            value: number;
          };
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value;
            console.log("CLS:", clsValue);
          }
        }
      });
    }).observe({ entryTypes: ["layout-shift"] });
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();
