import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

class AdminApiService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  constructor() {
    // Request interceptor to add token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  // User Management
  async getAllUsers(params?: {
    role?: string;
    isVerified?: boolean;
    page?: number;
    limit?: number;
  }) {
    const response = await this.api.get("/auth/users", { params });
    return response.data;
  }

  async updateUserRole(userId: string, role: string) {
    const response = await this.api.put(`/auth/users/${userId}/role`, { role });
    return response.data;
  }

  async verifyUser(userId: string) {
    const response = await this.api.patch(`/auth/users/${userId}/verify`);
    return response.data;
  }

  async deleteUser(userId: string) {
    const response = await this.api.delete(`/auth/users/${userId}`);
    return response.data;
  }

  // System Statistics
  async getSystemStats() {
    const response = await this.api.get("/admin/stats");
    return response.data;
  }

  // Audit Logs (mock for now - backend needs to implement)
  async getAuditLogs() {
    // Mock implementation - replace with actual API call when backend is ready
    return {
      success: true,
      data: [],
      pagination: {
        total: 0,
        page: 1,
        pages: 0,
        limit: 10,
      },
    };
  }

  // Staff Management
  async getStaffMembers() {
    const response = await this.api.get("/auth/users", {
      params: { role: "staff" },
    });
    return response.data;
  }

  async assignComplaintToStaff(complaintId: string, staffId: string) {
    const response = await this.api.put(`/complaints/${complaintId}/assign`, {
      assignedTo: staffId,
    });
    return response.data;
  }
}

export default new AdminApiService();
