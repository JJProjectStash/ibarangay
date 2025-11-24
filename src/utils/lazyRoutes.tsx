import React, { Suspense } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

// Lazy load all admin and staff components for better performance
export const AdminDashboard = React.lazy(
  () => import("../pages/admin/AdminDashboard")
);
export const UserManagement = React.lazy(
  () => import("../pages/admin/UserManagement")
);
export const AnnouncementManagement = React.lazy(
  () => import("../pages/admin/AnnouncementManagement")
);
export const Analytics = React.lazy(() => import("../pages/admin/Analytics"));
export const AuditLogs = React.lazy(() => import("../pages/admin/AuditLogs"));
export const SystemConfig = React.lazy(
  () => import("../pages/admin/SystemConfig")
);
export const AutomationSettings = React.lazy(
  () => import("../pages/admin/AutomationSettings")
);
export const StaffDashboard = React.lazy(
  () => import("../pages/staff/StaffDashboard")
);

// Lazy load other heavy components
export const Events = React.lazy(() => import("../pages/Events"));
export const Complaints = React.lazy(() => import("../pages/Complaints"));
export const Services = React.lazy(() => import("../pages/Services"));

// Higher-order component for lazy loading with suspense
export const withSuspense = (
  Component: React.LazyExoticComponent<React.ComponentType<any>>
) => {
  return (props: any) => (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

// Pre-configured lazy components with suspense
export const LazyAdminDashboard = withSuspense(AdminDashboard);
export const LazyUserManagement = withSuspense(UserManagement);
export const LazyAnnouncementManagement = withSuspense(AnnouncementManagement);
export const LazyAnalytics = withSuspense(Analytics);
export const LazyAuditLogs = withSuspense(AuditLogs);
export const LazySystemConfig = withSuspense(SystemConfig);
export const LazyAutomationSettings = withSuspense(AutomationSettings);
export const LazyStaffDashboard = withSuspense(StaffDashboard);
export const LazyEvents = withSuspense(Events);
export const LazyComplaints = withSuspense(Complaints);
export const LazyServices = withSuspense(Services);
