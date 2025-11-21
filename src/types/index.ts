export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "staff" | "resident";
  address: string;
  phoneNumber: string;
  isVerified: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface Service {
  _id: string;
  userId: string | User;
  itemName: string;
  itemType: string;
  borrowDate: string;
  returnDate?: string;
  expectedReturnDate: string;
  status: "pending" | "approved" | "borrowed" | "returned" | "rejected";
  purpose: string;
  quantity: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Complaint {
  _id: string;
  userId: string | User;
  title: string;
  description: string;
  category: string;
  status: "pending" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  attachments?: string[];
  response?: string;
  resolvedBy?: string | User;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  organizer: string | User;
  maxAttendees?: number;
  attendees: string[] | User[];
  category: string;
  imageUrl?: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  isRead: boolean;
  relatedId?: string;
  relatedType?: "service" | "complaint" | "event";
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
