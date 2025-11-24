export interface User {
  _id: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "staff" | "resident";
  address: string;
  phoneNumber: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
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
  rejectionReason?: string;
  approvedBy?: string | User;
  approvedAt?: string;
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
  assignedTo?: string | User;
  resolvedBy?: string | User;
  resolvedAt?: string;
  rating?: number;
  feedback?: string;
  comments?: Comment[];
  escalated?: boolean;
  escalationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  userId: string | User;
  comment: string;
  createdAt: string;
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
  priority: "low" | "medium" | "high";
  isRead: boolean;
  relatedId?: string;
  relatedType?: "service" | "complaint" | "event" | "announcement";
  actionUrl?: string;
  createdAt: string;
}

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  author: string | User;
  priority: "low" | "medium" | "high";
  category: string;
  status: "draft" | "published" | "archived";
  publishedAt?: string;
  expiresAt?: string;
  attachments?: string[];
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  _id: string;
  userId: string | User;
  action: string;
  resource?: string;
  resourceId?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  status: "success" | "failure";
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalComplaints: number;
  totalServices: number;
  totalEvents: number;
  pendingComplaints: number;
  pendingServices: number;
  resolvedComplaints: number;
  upcomingEvents: number;
  recentActivity: Activity[];
}

export interface Activity {
  _id: string;
  type: "complaint" | "service" | "event" | "announcement";
  title: string;
  description: string;
  timestamp: string;
  user?: User;
}

export interface SystemStats {
  users: {
    total: number;
    verified: number;
    unverified: number;
    byRole: {
      admin: number;
      staff: number;
      resident: number;
    };
  };
  complaints: {
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    averageResolutionTime: number;
  };
  services: {
    total: number;
    byStatus: Record<string, number>;
    approvalRate: number;
  };
  events: {
    total: number;
    upcoming: number;
    totalAttendees: number;
  };
  announcements: {
    total: number;
    published: number;
    totalViews: number;
  };
}

export interface AnalyticsData {
  timeSeries: TimeSeriesData[];
  categoryDistribution: CategoryData[];
  staffPerformance: StaffPerformanceData[];
  responseTime: ResponseTimeData;
  trends: TrendData;
}

export interface TimeSeriesData {
  date: string;
  complaints: number;
  services: number;
  events: number;
  resolved: number;
}

export interface CategoryData {
  category: string;
  count: number;
  percentage: number;
}

export interface StaffPerformanceData {
  staffId: string;
  staffName: string;
  assigned: number;
  resolved: number;
  averageResolutionTime: number;
  rating: number;
}

export interface ResponseTimeData {
  average: number;
  median: number;
  min: number;
  max: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
}

export interface TrendData {
  direction: "up" | "down" | "stable";
  percentage: number;
  period: string;
  comparison: {
    current: number;
    previous: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export interface FilterOptions {
  status?: string;
  priority?: string;
  category?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface BulkOperationResult {
  success: boolean;
  processed: number;
  failed: number;
  errors?: string[];
}

export interface ExportOptions {
  format: "csv" | "excel";
  filters?: FilterOptions;
  fields?: string[];
}
