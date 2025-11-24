import axios, { AxiosInstance, AxiosError} from "axios";

// Use a relative API base by default so dev server proxies (Vite) handle
// requests and avoid CORS issues when running on different dev ports.
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "/api/v1";

/**
 * Axios instance with default configuration
 */
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/**
 * Request interceptor to add auth token
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor for error handling
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH SERVICES ====================

export const authService = {
  login: (credentials: { email: string; password: string }) =>
    api.post("/auth/login", credentials),

  register: (userData: any) => api.post("/auth/register", userData),

  logout: () => api.post("/auth/logout"),

  getProfile: () => api.get("/auth/profile"),

  updateProfile: (data: any) => api.put("/auth/profile", data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put("/auth/change-password", data),

  getCsrfToken: () => api.get("/auth/csrf-token"),
};

// ==================== DASHBOARD SERVICES ====================

export const dashboardService = {
  getStats: () => api.get("/dashboard/stats"),

  getRecentActivities: (limit = 10) =>
    api.get(`/dashboard/activities?limit=${limit}`),

  getTimeSeriesData: (type = "complaints", period = "7d") =>
    api.get(`/dashboard/time-series?type=${type}&period=${period}`),

  getCategoryDistribution: (type = "complaints") =>
    api.get(`/dashboard/category-distribution?type=${type}`),

  getStaffPerformance: () => api.get("/dashboard/staff-performance"),
};

// ==================== ANNOUNCEMENT SERVICES ====================

export const announcementService = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    priority?: string;
    search?: string;
  }) => api.get("/announcements", { params }),

  getById: (id: string) => api.get(`/announcements/${id}`),

  create: (data: any) => api.post("/announcements", data),

  update: (id: string, data: any) => api.put(`/announcements/${id}`, data),

  delete: (id: string) => api.delete(`/announcements/${id}`),

  togglePublish: (id: string) => api.patch(`/announcements/${id}/publish`),

  togglePin: (id: string) => api.patch(`/announcements/${id}/pin`),
};

// ==================== ADMIN SERVICES ====================

export const adminService = {
  // User Management
  getAllUsers: (params?: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
    search?: string;
    sortBy?: string;
    order?: string;
  }) => api.get("/admin/users", { params }),

  getUserById: (id: string) => api.get(`/admin/users/${id}`),

  createUser: (data: any) => api.post("/admin/users", data),

  updateUser: (id: string, data: any) => api.put(`/admin/users/${id}`, data),

  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),

  toggleUserStatus: (id: string) =>
    api.patch(`/admin/users/${id}/toggle-status`),

  verifyUser: (id: string) => api.patch(`/admin/users/${id}/verify`),

  assignRole: (id: string, role: string) =>
    api.patch(`/admin/users/${id}/role`, { role }),

  bulkUpdateUsers: (userIds: string[], updates: any) =>
    api.post("/admin/users/bulk-update", { userIds, updates }),

  // Audit Logs
  getAuditLogs: (params?: { page?: number; limit?: number }) =>
    api.get("/admin/audit-logs", { params }),
};

// ==================== COMPLAINT SERVICES ====================

export const complaintService = {
  getAll: (params?: any) => api.get("/complaints", { params }),

  getById: (id: string) => api.get(`/complaints/${id}`),

  create: (data: any) => api.post("/complaints", data),

  update: (id: string, data: any) => api.put(`/complaints/${id}`, data),

  delete: (id: string) => api.delete(`/complaints/${id}`),

  updateStatus: (id: string, status: string) =>
    api.patch(`/complaints/${id}/status`, { status }),

  assign: (id: string, assignedTo: string) =>
    api.patch(`/complaints/${id}/assign`, { assignedTo }),

  addComment: (id: string, comment: string) =>
    api.post(`/complaints/${id}/comments`, { comment }),
};

// ==================== SERVICE SERVICES ====================

export const serviceService = {
  getAll: (params?: any) => api.get("/services", { params }),

  getById: (id: string) => api.get(`/services/${id}`),

  create: (data: any) => api.post("/services", data),

  update: (id: string, data: any) => api.put(`/services/${id}`, data),

  delete: (id: string) => api.delete(`/services/${id}`),

  updateStatus: (id: string, status: string) =>
    api.patch(`/services/${id}/status`, { status }),

  assign: (id: string, assignedTo: string) =>
    api.patch(`/services/${id}/assign`, { assignedTo }),
};

// ==================== EVENT SERVICES ====================

export const eventService = {
  getAll: (params?: any) => api.get("/events", { params }),

  getById: (id: string) => api.get(`/events/${id}`),

  create: (data: any) => api.post("/events", data),

  update: (id: string, data: any) => api.put(`/events/${id}`, data),

  delete: (id: string) => api.delete(`/events/${id}`),

  register: (id: string) => api.post(`/events/${id}/register`),

  unregister: (id: string) => api.delete(`/events/${id}/register`),
};

// ==================== BULK OPERATIONS SERVICES ====================

export const bulkService = {
  // Complaints
  updateComplaintsStatus: (complaintIds: string[], status: string) =>
    api.post("/bulk/complaints/status", { complaintIds, status }),

  assignComplaints: (complaintIds: string[], assignedTo: string) =>
    api.post("/bulk/complaints/assign", { complaintIds, assignedTo }),

  deleteComplaints: (complaintIds: string[]) =>
    api.post("/bulk/complaints/delete", { complaintIds }),

  exportComplaints: (params?: any) =>
    api.get("/bulk/complaints/export", {
      params,
      responseType: "blob",
    }),

  // Services
  updateServicesStatus: (serviceIds: string[], status: string) =>
    api.post("/bulk/services/status", { serviceIds, status }),

  assignServices: (serviceIds: string[], assignedTo: string) =>
    api.post("/bulk/services/assign", { serviceIds, assignedTo }),

  exportServices: (params?: any) =>
    api.get("/bulk/services/export", {
      params,
      responseType: "blob",
    }),
};

// ==================== SEARCH SERVICES ====================

export const searchService = {
  globalSearch: (query: string, type?: string) =>
    api.get("/search/global", { params: { q: query, type } }),

  filterComplaints: (params: any) =>
    api.get("/search/complaints/filter", { params }),

  filterServices: (params: any) =>
    api.get("/search/services/filter", { params }),
};

// ==================== NOTIFICATION SERVICES ====================

export const notificationService = {
  getAll: (params?: { page?: number; limit?: number; unreadOnly?: boolean }) =>
    api.get("/notifications", { params }),

  markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),

  markAllAsRead: () => api.patch("/notifications/read-all"),

  delete: (id: string) => api.delete(`/notifications/${id}`),

  getUnreadCount: () => api.get("/notifications/unread-count"),
};

// ==================== FILE UPLOAD SERVICE ====================

export const uploadService = {
  uploadFile: (file: File, onUploadProgress?: (progressEvent: any) => void) => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  },

  uploadMultiple: (
    files: File[],
    onUploadProgress?: (progressEvent: any) => void
  ) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    return api.post("/upload/multiple", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  },
};

export default api;
