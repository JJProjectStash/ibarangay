/**
 * Security utilities for enterprise-grade applications
 */

// Content Security Policy configuration
export const CSP_CONFIG = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
  "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  "font-src": ["'self'", "https://fonts.gstatic.com"],
  "img-src": ["'self'", "data:", "https:", "blob:"],
  "connect-src": [
    "'self'",
    "ws:",
    "wss:",
    process.env.VITE_API_BASE_URL || "http://localhost:5000",
  ],
  "media-src": ["'self'"],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'none'"],
  "upgrade-insecure-requests": [],
};

// Generate CSP header string
export function generateCSPHeader(): string {
  return Object.entries(CSP_CONFIG)
    .map(([directive, sources]) => `${directive} ${sources.join(" ")}`)
    .join("; ");
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocols
    .replace(/on\w+=/gi, "") // Remove event handlers
    .trim();
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number format
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[1-9]\d{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-()]/g, ""));
}

// Password strength validation
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length < 8) {
    feedback.push("Password must be at least 8 characters long");
  } else {
    score += 1;
  }

  if (!/[a-z]/.test(password)) {
    feedback.push("Password must contain at least one lowercase letter");
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    feedback.push("Password must contain at least one uppercase letter");
  } else {
    score += 1;
  }

  if (!/\d/.test(password)) {
    feedback.push("Password must contain at least one number");
  } else {
    score += 1;
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    feedback.push("Password must contain at least one special character");
  } else {
    score += 1;
  }

  return {
    isValid: score >= 4,
    score,
    feedback,
  };
}

// XSS protection for dynamic content
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Generate secure random token
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

// Rate limiting helper
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> =
    new Map();

  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);

    if (!attempt || now > attempt.resetTime) {
      this.attempts.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (attempt.count >= this.maxAttempts) {
      return false;
    }

    attempt.count++;
    return true;
  }

  getRemainingAttempts(identifier: string): number {
    const attempt = this.attempts.get(identifier);
    if (!attempt || Date.now() > attempt.resetTime) {
      return this.maxAttempts;
    }
    return Math.max(0, this.maxAttempts - attempt.count);
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

// Secure storage wrapper
export class SecureStorage {
  private static encrypt(data: string, key: string): string {
    // Simple XOR encryption for demo purposes
    // In production, use proper encryption libraries
    let result = "";
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(
        data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return btoa(result);
  }

  private static decrypt(encryptedData: string, key: string): string {
    try {
      const data = atob(encryptedData);
      let result = "";
      for (let i = 0; i < data.length; i++) {
        result += String.fromCharCode(
          data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
      }
      return result;
    } catch {
      return "";
    }
  }

  static setItem(key: string, value: string, encrypt: boolean = true): void {
    try {
      const dataToStore = encrypt ? this.encrypt(value, key) : value;
      localStorage.setItem(key, dataToStore);
    } catch (error) {
      console.error("Failed to store data securely:", error);
    }
  }

  static getItem(key: string, encrypted: boolean = true): string | null {
    try {
      const storedData = localStorage.getItem(key);
      if (!storedData) return null;

      return encrypted ? this.decrypt(storedData, key) : storedData;
    } catch (error) {
      console.error("Failed to retrieve data securely:", error);
      return null;
    }
  }

  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}

// CSRF token management
export class CSRFProtection {
  private static tokenKey = "csrf_token";

  static generateToken(): string {
    const token = generateSecureToken();
    sessionStorage.setItem(this.tokenKey, token);
    return token;
  }

  static getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  static validateToken(token: string): boolean {
    const storedToken = this.getToken();
    return storedToken === token;
  }

  static clearToken(): void {
    sessionStorage.removeItem(this.tokenKey);
  }
}

// Export singleton instances
export const rateLimiter = new RateLimiter();
export const csrfProtection = CSRFProtection;
