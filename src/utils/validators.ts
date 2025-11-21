/**
 * Validation utility functions
 */

export const validators = {
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  phoneNumber: (value: string): boolean => {
    const phoneRegex = /^[0-9+\-\s()]+$/;
    return phoneRegex.test(value) && value.length >= 10;
  },

  password: (value: string): boolean => {
    return value.length >= 6;
  },

  required: (value: string): boolean => {
    return value.trim().length > 0;
  },

  minLength: (value: string, min: number): boolean => {
    return value.trim().length >= min;
  },

  maxLength: (value: string, max: number): boolean => {
    return value.trim().length <= max;
  },

  isNumber: (value: string): boolean => {
    return !isNaN(Number(value)) && value.trim() !== "";
  },

  isPositiveNumber: (value: string): boolean => {
    return validators.isNumber(value) && Number(value) > 0;
  },

  isDate: (value: string): boolean => {
    const date = new Date(value);
    return date instanceof Date && !isNaN(date.getTime());
  },

  isFutureDate: (value: string): boolean => {
    const date = new Date(value);
    const now = new Date();
    return validators.isDate(value) && date > now;
  },
};

/**
 * Get validation error message
 */
export function getValidationMessage(
  field: string,
  rule: string,
  value?: any
): string {
  const messages: Record<string, string> = {
    required: `${field} is required`,
    email: `Please enter a valid email address`,
    phoneNumber: `Please enter a valid phone number`,
    password: `Password must be at least 6 characters`,
    minLength: `${field} must be at least ${value} characters`,
    maxLength: `${field} must not exceed ${value} characters`,
    isNumber: `${field} must be a number`,
    isPositiveNumber: `${field} must be a positive number`,
    isDate: `Please enter a valid date`,
    isFutureDate: `${field} must be a future date`,
  };

  return messages[rule] || `Invalid ${field}`;
}
