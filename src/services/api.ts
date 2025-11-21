import axios, { AxiosInstance, AxiosError } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

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

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    address: string;
    phoneNumber: string;
  }) {
    const response = await this.api.post("/auth/register", data);
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.api.post("/auth/login", { email, password });
    return response.data;
  }

  async getProfile() {
    const response = await this.api.get("/auth/profile");
    return response.data;
  }

  async updateProfile(data: {
    firstName: string;
    lastName: string;
    address: string;
    phoneNumber: string;
  }) {
    const response = await this.api.put("/auth/profile", data);
    return response.data;
  }

  // Service endpoints
  async createServiceRequest(data: {
    itemName: string;
    itemType: string;
    borrowDate: string;
    expectedReturnDate: string;
    purpose: string;
    quantity: number;
    notes?: string;
  }) {
    const response = await this.api.post("/services", data);
    return response.data;
  }

  async getServiceRequests(status?: string) {
    const response = await this.api.get("/services", {
      params: status ? { status } : {},
    });
    return response.data;
  }

  async getServiceRequestById(id: string) {
    const response = await this.api.get(`/services/${id}`);
    return response.data;
  }

  async updateServiceStatus(id: string, status: string, notes?: string) {
    const response = await this.api.put(`/services/${id}/status`, {
      status,
      notes,
    });
    return response.data;
  }

  async deleteServiceRequest(id: string) {
    const response = await this.api.delete(`/services/${id}`);
    return response.data;
  }

  // Complaint endpoints
  async createComplaint(data: {
    title: string;
    description: string;
    category: string;
    priority?: string;
    attachments?: string[];
  }) {
    const response = await this.api.post("/complaints", data);
    return response.data;
  }

  async getComplaints(status?: string, priority?: string) {
    const response = await this.api.get("/complaints", {
      params: { status, priority },
    });
    return response.data;
  }

  async getComplaintById(id: string) {
    const response = await this.api.get(`/complaints/${id}`);
    return response.data;
  }

  async updateComplaintStatus(id: string, status: string, response?: string) {
    const res = await this.api.put(`/complaints/${id}/status`, {
      status,
      response,
    });
    return res.data;
  }

  async deleteComplaint(id: string) {
    const response = await this.api.delete(`/complaints/${id}`);
    return response.data;
  }

  // Event endpoints
  async createEvent(data: {
    title: string;
    description: string;
    eventDate: string;
    location: string;
    category: string;
    maxAttendees?: number;
    imageUrl?: string;
  }) {
    const response = await this.api.post("/events", data);
    return response.data;
  }

  async getEvents(status?: string, category?: string) {
    const response = await this.api.get("/events", {
      params: { status, category },
    });
    return response.data;
  }

  async getEventById(id: string) {
    const response = await this.api.get(`/events/${id}`);
    return response.data;
  }

  async registerForEvent(id: string) {
    const response = await this.api.post(`/events/${id}/register`);
    return response.data;
  }

  async unregisterFromEvent(id: string) {
    const response = await this.api.post(`/events/${id}/unregister`);
    return response.data;
  }

  async updateEvent(id: string, data: Partial<Event>) {
    const response = await this.api.put(`/events/${id}`, data);
    return response.data;
  }

  async deleteEvent(id: string) {
    const response = await this.api.delete(`/events/${id}`);
    return response.data;
  }

  // Notification endpoints
  async getNotifications(isRead?: boolean) {
    const response = await this.api.get("/notifications", {
      params: isRead !== undefined ? { isRead } : {},
    });
    return response.data;
  }

  async markNotificationAsRead(id: string) {
    const response = await this.api.put(`/notifications/${id}/read`);
    return response.data;
  }

  async markAllNotificationsAsRead() {
    const response = await this.api.put("/notifications/read-all");
    return response.data;
  }

  async deleteNotification(id: string) {
    const response = await this.api.delete(`/notifications/${id}`);
    return response.data;
  }
}

export default new ApiService();
