export interface AuditLog {
  _id: string;
  userId: string;
  userName: string;
  action: string;
  targetType: "user" | "service" | "complaint" | "event";
  targetId: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface UserManagement {
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

export interface RoleUpdateRequest {
  userId: string;
  newRole: "admin" | "staff" | "resident";
  reason?: string;
}

export interface SystemStats {
  totalUsers: number;
  totalAdmins: number;
  totalStaff: number;
  totalResidents: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  totalServices: number;
  totalComplaints: number;
  totalEvents: number;
  pendingApprovals: number;
}
