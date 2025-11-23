import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Layout from "./components/Layout";
import RoleGuard from "./components/RoleGuard";
import ErrorBoundary from "./components/ErrorBoundary";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Services from "./pages/Services";
import Events from "./pages/Events";
import Complaints from "./pages/Complaints";
import Notifications from "./pages/Notifications";
import Dashboard from "./pages/Dashboard";
import Announcements from "./pages/Announcements";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminResidents from "./pages/admin/Residents";
import AdminServices from "./pages/admin/Services";
import AdminEvents from "./pages/admin/Events";
import AdminComplaints from "./pages/admin/Complaints";
import AdminAnnouncements from "./pages/admin/Announcements";

// Staff Pages
import StaffDashboard from "./pages/staff/Dashboard";
import StaffServices from "./pages/staff/Services";
import StaffEvents from "./pages/staff/Events";
import StaffComplaints from "./pages/staff/Complaints";
import StaffAnnouncements from "./pages/staff/Announcements";

// Context
import { AuthProvider } from "./context/AuthContext";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/services" element={<Services />} />
            <Route path="/events" element={<Events />} />
            <Route path="/announcements" element={<Announcements />} />

            {/* Protected Resident Routes */}
            <Route
              path="/complaints"
              element={
                <RoleGuard allowedRoles={["resident"]}>
                  <Complaints />
                </RoleGuard>
              }
            />
            <Route
              path="/notifications"
              element={
                <RoleGuard allowedRoles={["resident", "admin", "staff"]}>
                  <Notifications />
                </RoleGuard>
              }
            />
            <Route
              path="/dashboard"
              element={
                <RoleGuard allowedRoles={["resident"]}>
                  <Dashboard />
                </RoleGuard>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <RoleGuard allowedRoles={["admin"]}>
                  <AdminDashboard />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/residents"
              element={
                <RoleGuard allowedRoles={["admin"]}>
                  <AdminResidents />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/services"
              element={
                <RoleGuard allowedRoles={["admin"]}>
                  <AdminServices />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/events"
              element={
                <RoleGuard allowedRoles={["admin"]}>
                  <AdminEvents />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/complaints"
              element={
                <RoleGuard allowedRoles={["admin"]}>
                  <AdminComplaints />
                </RoleGuard>
              }
            />
            <Route
              path="/admin/announcements"
              element={
                <RoleGuard allowedRoles={["admin"]}>
                  <AdminAnnouncements />
                </RoleGuard>
              }
            />

            {/* Staff Routes */}
            <Route
              path="/staff"
              element={
                <RoleGuard allowedRoles={["staff"]}>
                  <StaffDashboard />
                </RoleGuard>
              }
            />
            <Route
              path="/staff/services"
              element={
                <RoleGuard allowedRoles={["staff"]}>
                  <StaffServices />
                </RoleGuard>
              }
            />
            <Route
              path="/staff/events"
              element={
                <RoleGuard allowedRoles={["staff"]}>
                  <StaffEvents />
                </RoleGuard>
              }
            />
            <Route
              path="/staff/complaints"
              element={
                <RoleGuard allowedRoles={["staff"]}>
                  <StaffComplaints />
                </RoleGuard>
              }
            />
            <Route
              path="/staff/announcements"
              element={
                <RoleGuard allowedRoles={["staff"]}>
                  <StaffAnnouncements />
                </RoleGuard>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
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
    </ErrorBoundary>
  );
};

export default App;
