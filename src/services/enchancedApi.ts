import axios, { AxiosInstance, AxiosError } from "axios";
import { withRetry, createRetryInterceptor } from "../utils/retryLogic";
import { getCSRFToken } from "../utils/csrfUtils";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

class EnhancedApiService {
  private api: AxiosInstance;
  private requestsInFlight = new Set<string>();

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000, // 30 second timeout
    });

    this.setupInterceptors();
    createRetryInterceptor(this.api);
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add CSRF token
        const csrfToken = getCSRFToken();
        if (csrfToken) {
          config.headers["X-CSRF-Token"] = csrfToken;
        }

        // Add request deduplication
        const requestKey = `${config.method}:${config.url}:${JSON.stringify(
          config.params
        )}`;
        if (this.requestsInFlight.has(requestKey)) {
          const controller = new AbortController();
          controller.abort();
          config.signal = controller.signal;
        } else {
          this.requestsInFlight.add(requestKey);
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        // Remove from in-flight requests
        const requestKey = `${response.config.method}:${
          response.config.url
        }:${JSON.stringify(response.config.params)}`;
        this.requestsInFlight.delete(requestKey);

        // Handle rate limiting headers
        const rateLimitHeaders = {
          remaining: response.headers["x-ratelimit-remaining"],
          limit: response.headers["x-ratelimit-limit"],
          reset: response.headers["x-ratelimit-reset"],
        };

        if (rateLimitHeaders.remaining !== undefined) {
          // Emit rate limit info for UI feedback
          window.dispatchEvent(
            new CustomEvent("rateLimit", {
              detail: rateLimitHeaders,
            })
          );
        }

        return response;
      },
      (error: AxiosError) => {
        // Remove from in-flight requests
        if (error.config) {
          const requestKey = `${error.config.method}:${
            error.config.url
          }:${JSON.stringify(error.config.params)}`;
          this.requestsInFlight.delete(requestKey);
        }

        // Handle specific error types
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }

        if (error.response?.status === 429) {
          // Rate limited
          const retryAfter = error.response.headers["retry-after"];
          window.dispatchEvent(
            new CustomEvent("rateLimitExceeded", {
              detail: { retryAfter: parseInt(retryAfter) || 60 },
            })
          );
        }

        if (error.response?.status === 403) {
          // CSRF token might be invalid
          window.dispatchEvent(new CustomEvent("csrfError"));
        }

        return Promise.reject(error);
      }
    );
  }

  // Enhanced method with retry logic
  async makeRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    return withRetry(requestFn, {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 5000,
    });
  }

  // Debounced search method
  private searchDebounceMap = new Map<string, number>();

  async debouncedSearch(query: string, delay: number = 300): Promise<unknown> {
    return new Promise((resolve, reject) => {
      // Clear existing timeout for this query type
      const existingTimeout = this.searchDebounceMap.get("search");
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      // Set new timeout
      const timeout = setTimeout(async () => {
        try {
          const result = await this.makeRequest(() =>
            this.api.get("/search/global", { params: { q: query } })
          );
          resolve(result.data);
        } catch (error) {
          reject(error);
        } finally {
          this.searchDebounceMap.delete("search");
        }
      }, delay);

      this.searchDebounceMap.set("search", timeout);
    });
  }

  // Cached requests
  private cache = new Map<string, { data: unknown; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async getCachedRequest<T>(url: string, params?: unknown): Promise<T> {
    const cacheKey = `${url}:${JSON.stringify(params)}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data as T;
    }

    const response = await this.makeRequest(() =>
      this.api.get(url, { params })
    );

    this.cache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now(),
    });

    return response.data;
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Batch requests
  async batchRequests<T>(requests: (() => Promise<T>)[]): Promise<T[]> {
    const results = await Promise.allSettled(
      requests.map((request) => this.makeRequest(request))
    );

    return results.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value;
      } else {
        console.error(`Batch request ${index} failed:`, result.reason);
        throw result.reason;
      }
    });
  }
}

export default new EnhancedApiService();
