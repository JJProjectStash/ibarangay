import { z } from "zod";

/**
 * Zod validation schemas for enterprise-grade validation
 */

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  phoneNumber: z
    .string()
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format")
    .min(10, "Phone number must be at least 10 characters"),
});

export const profileUpdateSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  phoneNumber: z
    .string()
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format")
    .min(10, "Phone number must be at least 10 characters"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

// Complaint Schemas
export const complaintSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must not exceed 200 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must not exceed 2000 characters"),
  category: z.string().min(1, "Category is required"),
  priority: z.enum(["low", "medium", "high"], {
    errorMap: () => ({ message: "Priority must be low, medium, or high" }),
  }),
  attachments: z.array(z.string()).optional(),
});

export const complaintStatusUpdateSchema = z.object({
  status: z.enum(["pending", "in-progress", "resolved", "closed"], {
    errorMap: () => ({ message: "Invalid status" }),
  }),
  response: z.string().optional(),
});

// Service Request Schemas
export const serviceRequestSchema = z.object({
  itemName: z
    .string()
    .min(3, "Item name must be at least 3 characters")
    .max(100, "Item name must not exceed 100 characters"),
  itemType: z.string().min(1, "Item type is required"),
  borrowDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid borrow date",
  }),
  expectedReturnDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid return date",
  }),
  purpose: z
    .string()
    .min(10, "Purpose must be at least 10 characters")
    .max(500, "Purpose must not exceed 500 characters"),
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .positive("Quantity must be positive")
    .max(100, "Quantity must not exceed 100"),
  notes: z.string().max(500, "Notes must not exceed 500 characters").optional(),
});

// Event Schemas
export const eventSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must not exceed 200 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description must not exceed 2000 characters"),
  eventDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid event date",
  }),
  location: z
    .string()
    .min(5, "Location must be at least 5 characters")
    .max(200, "Location must not exceed 200 characters"),
  category: z.string().min(1, "Category is required"),
  maxAttendees: z
    .number()
    .int("Max attendees must be an integer")
    .positive("Max attendees must be positive")
    .optional(),
  imageUrl: z.string().url("Invalid image URL").optional(),
});

// Announcement Schemas
export const announcementSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must not exceed 200 characters"),
  content: z
    .string()
    .min(20, "Content must be at least 20 characters")
    .max(5000, "Content must not exceed 5000 characters"),
  priority: z.enum(["low", "medium", "high"], {
    errorMap: () => ({ message: "Priority must be low, medium, or high" }),
  }),
  category: z.string().min(1, "Category is required"),
  expiresAt: z
    .string()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: "Invalid expiration date",
    })
    .optional(),
  attachments: z.array(z.string()).optional(),
});

// User Management Schemas
export const createStaffAdminSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  phoneNumber: z
    .string()
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format")
    .min(10, "Phone number must be at least 10 characters"),
  role: z.enum(["admin", "staff"], {
    errorMap: () => ({ message: "Role must be admin or staff" }),
  }),
});

// Helper function to validate data with Zod schema
export function validateWithSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
):
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join(".");
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { _general: "Validation failed" } };
  }
}

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ComplaintInput = z.infer<typeof complaintSchema>;
export type ServiceRequestInput = z.infer<typeof serviceRequestSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type AnnouncementInput = z.infer<typeof announcementSchema>;
export type CreateStaffAdminInput = z.infer<typeof createStaffAdminSchema>;
