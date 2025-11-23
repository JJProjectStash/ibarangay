import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Layout from "./components/Layout";
import RoleGuard from "./components/RoleGuard";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import LazyRoute from "./components/LazyWrapper";
import { CommandPalette } from "./components/CommandPalette";
import { SkipToContent } from "./components/SkipToContent";
import { MobileNav } from "./components/MobileNav";

// Context
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

// Lazy load all pages for better performance
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Services = lazy(() => import("./pages/Services"));
const Events = lazy(() => import("./pages/Events"));
const Complaints = lazy(() => import("./pages/Complaints"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Announcements = lazy(() => import("./pages/Announcements"));

// Admin Pages
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminResidents = lazy(() => import("./pages/admin/Residents"));
const AdminServices = lazy(() => import("./pages/admin/Services"));
const AdminEvents = lazy(() => import("./pages/admin/Events"));
const AdminComplaints = lazy(() => import("./pages/admin/Complaints"));
const AdminAnnouncements = lazy(() => import("./pages/admin/Announcements"));

// Staff Pages
const StaffDashboard = lazy(() => import("./pages/staff/Dashboard"));
const StaffServices = lazy(() => import("./pages/staff/Services"));
const StaffEvents = lazy(() => import("./pages/staff/Events"));
const StaffComplaints = lazy(() => import("./pages/staff/Complaints"));
const StaffAnnouncements = lazy(() => import("./pages/staff/Announcements"));

// Loading fallback component
const PageLoadingFallback = () => (
  <div className="min-h-screen relative">
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
    <div className="relative z-10 flex items-center justify-center min-h-screen">
      <LoadingSpinner size="large" />
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <SkipToContent />
          <CommandPalette />
          <Routes>
            <Route element={<Layout />}>
              {/* Public Routes */}
              <Route
                path="/"
                element={
                  <LazyRoute skeleton>
                    <Home />
                  </LazyRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <Login />
                  </Suspense>
                }
              />
              <Route
                path="/signup"
                element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <Signup />
                  </Suspense>
                }
              />
              <Route
                path="/services"
                element={
                  <LazyRoute skeleton>
                    <Services />
                  </LazyRoute>
                }
              />
              <Route
                path="/events"
                element={
                  <LazyRoute skeleton>
                    <Events />
                  </LazyRoute>
                }
              />
              <Route
                path="/announcements"
                element={
                  <LazyRoute skeleton>
                    <Announcements />
                  </LazyRoute>
                }
              />

              {/* Protected Resident Routes */}
              <Route
                path="/complaints"
                element={
                  <RoleGuard allowedRoles={["resident"]}>
                    <LazyRoute skeleton>
                      <Complaints />
                    </LazyRoute>
                  </RoleGuard>
                }
              />
              <Route
                path="/notifications"
                element={
                  <RoleGuard allowedRoles={["resident", "admin", "staff"]}>
                    <LazyRoute skeleton>
                      <Notifications />
                    </LazyRoute>
                  </RoleGuard>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <RoleGuard allowedRoles={["resident"]}>
                    <LazyRoute skeleton>
                      <Dashboard />
                    </LazyRoute>
                  </RoleGuard>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <RoleGuard allowedRoles={["admin"]}>
                    <LazyRoute skeleton>
                      <AdminDashboard />
                    </LazyRoute>
                  </RoleGuard>
                }
              />
              <Route
                path="/admin/residents"
                element={
                  <RoleGuard allowedRoles={["admin"]}>
                    <LazyRoute skeleton>
                      <AdminResidents />
                    </LazyRoute>
                  </RoleGuard>
                }
              />
              <Route
                path="/admin/services"
                element={
                  <RoleGuard allowedRoles={["admin"]}>
                    <LazyRoute skeleton>
                      <AdminServices />
                    </LazyRoute>
                  </RoleGuard>
                }
              />
              <Route
                path="/admin/events"
                element={
                  <RoleGuard allowedRoles={["admin"]}>
                    <LazyRoute skeleton>
                      <AdminEvents />
                    </LazyRoute>
                  </RoleGuard>
                }
              />
              <Route
                path="/admin/complaints"
                element={
                  <RoleGuard allowedRoles={["admin"]}>
                    <LazyRoute skeleton>
                      <AdminComplaints />
                    </LazyRoute>
                  </RoleGuard>
                }
              />
              <Route
                path="/admin/announcements"
                element={
                  <RoleGuard allowedRoles={["admin"]}>
                    <LazyRoute skeleton>
                      <AdminAnnouncements />
                    </LazyRoute>
                  </RoleGuard>
                }
              />

              {/* Staff Routes */}
              <Route
                path="/staff"
                element={
                  <RoleGuard allowedRoles={["staff"]}>
                    <LazyRoute skeleton>
                      <StaffDashboard />
                    </LazyRoute>
                  </RoleGuard>
                }
              />
              <Route
                path="/staff/services"
                element={
                  <RoleGuard allowedRoles={["staff"]}>
                    <LazyRoute skeleton>
                      <StaffServices />
                    </LazyRoute>
                  </RoleGuard>
                }
              />
              <Route
                path="/staff/events"
                element={
                  <RoleGuard allowedRoles={["staff"]}>
                    <LazyRoute skeleton>
                      <StaffEvents />
                    </LazyRoute>
                  </RoleGuard>
                }
              />
              <Route
                path="/staff/complaints"
                element={
                  <RoleGuard allowedRoles={["staff"]}>
                    <LazyRoute skeleton>
                      <StaffComplaints />
                    </LazyRoute>
                  </RoleGuard>
                }
              />
              <Route
                path="/staff/announcements"
                element={
                  <RoleGuard allowedRoles={["staff"]}>
                    <LazyRoute skeleton>
                      <StaffAnnouncements />
                    </LazyRoute>
                  </RoleGuard>
                }
              />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
          <MobileNav />
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
