import api from "./api";
import {
  authService,
  dashboardService,
  announcementService,
  adminService,
  complaintService,
  serviceService,
  eventService,
  bulkService,
  searchService,
  notificationService,
  uploadService,
} from "./api";

// Extend the axios instance with all service methods
const extendedApi = Object.assign(api, {
  // Auth methods
  login: authService.login,
  register: authService.register,
  logout: authService.logout,
  getProfile: authService.getProfile,
  updateProfile: authService.updateProfile,
  changePassword: authService.changePassword,
  getCsrfToken: authService.getCsrfToken,

  // Dashboard methods
  getDashboardStats: dashboardService.getStats,
  getRecentActivities: dashboardService.getRecentActivities,
  getTimeSeriesData: dashboardService.getTimeSeriesData,
  getCategoryAnalytics: dashboardService.getCategoryDistribution,
  getStaffPerformance: dashboardService.getStaffPerformance,
  getTrendAnalysis: (days: number) =>
    dashboardService.getTimeSeriesData("complaints", `${days}d`),
  getResponseTimeAnalytics: () => dashboardService.getStats(),

  // Announcement methods
  getAnnouncements: announcementService.getAll,
  getAnnouncementById: announcementService.getById,
  createAnnouncement: announcementService.create,
  updateAnnouncement: announcementService.update,
  deleteAnnouncement: announcementService.delete,
  publishAnnouncement: announcementService.togglePublish,
  unpublishAnnouncement: announcementService.togglePublish,
  uploadAnnouncementFile: (file: File) => uploadService.uploadFile(file),

  // Admin/User methods
  getAllUsers: adminService.getAllUsers,
  getUsers: adminService.getAllUsers,
  getUserById: adminService.getUserById,
  createUser: adminService.createUser,
  createStaffAdmin: adminService.createUser,
  updateUser: adminService.updateUser,
  deleteUser: adminService.deleteUser,
  verifyUser: adminService.verifyUser,
  updateUserRole: adminService.assignRole,
  bulkUpdateUsers: adminService.bulkUpdateUsers,

  // Audit logs
  getAuditLogs: adminService.getAuditLogs,
  getAuditLogStats: () => adminService.getAuditLogs(),
  deleteOldAuditLogs: (days: number) =>
    api.delete(`/admin/audit-logs/cleanup?days=${days}`),

  // Complaint methods
  getComplaints: complaintService.getAll,
  getComplaintById: complaintService.getById,
  createComplaint: complaintService.create,
  updateComplaint: complaintService.update,
  deleteComplaint: complaintService.delete,
  updateComplaintStatus: complaintService.updateStatus,
  assignComplaint: complaintService.assign,
  escalateComplaint: (id: string, reason: string) =>
    api.post(`/complaints/${id}/escalate`, { reason }),
  uploadComplaintFile: (file: File) => uploadService.uploadFile(file),
  getComplaintCategories: () => api.get("/complaints/categories"),
  updateComplaintCategories: (categories: any[]) =>
    api.put("/complaints/categories", { categories }),

  // Bulk operations
  bulkDeleteComplaints: bulkService.deleteComplaints,
  bulkAssignComplaints: bulkService.assignComplaints,
  exportComplaints: (format: string, params?: any) =>
    bulkService.exportComplaints({ ...params, format }),

  // Service methods
  getServiceRequests: serviceService.getAll,
  getServiceById: serviceService.getById,
  createServiceRequest: serviceService.create,
  updateService: serviceService.update,
  deleteService: serviceService.delete,
  updateServiceStatus: serviceService.updateStatus,
  assignService: serviceService.assign,
  getServiceItemTypes: () => api.get("/services/item-types"),
  updateServiceItemTypes: (types: any[]) =>
    api.put("/services/item-types", { types }),

  // Event methods
  getEvents: eventService.getAll,
  getEventById: eventService.getById,
  createEvent: eventService.create,
  updateEvent: eventService.update,
  deleteEvent: eventService.delete,
  registerForEvent: eventService.register,
  unregisterFromEvent: eventService.unregister,
  getEventAttendees: (id: string) => api.get(`/events/${id}/attendees`),
  exportEventAttendees: (id: string) =>
    api.get(`/events/${id}/attendees/export`, { responseType: "blob" }),

  // Search methods
  globalSearch: searchService.globalSearch,

  // Notification methods
  getNotifications: notificationService.getAll,
  markNotificationAsRead: notificationService.markAsRead,
  markAllNotificationsAsRead: notificationService.markAllAsRead,
  deleteNotification: notificationService.delete,
  getUnreadCount: notificationService.getUnreadCount,
});

export default extendedApi;
