import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import Navbar from "./components/Navbar";
import ToastProvider from "./components/Toast";
import socketService from "./services/socket";
import { useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Services from "./pages/Services";
import Complaints from "./pages/Complaints";
import Events from "./pages/Events";
import Notifications from "./pages/Notifications";
import Dashboard from "./pages/Dashboard";
import Announcements from "./pages/Announcements";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StaffDashboard from "./pages/staff/StaffDashboard";
import UserManagement from "./pages/admin/UserManagement";
import AnnouncementManagement from "./pages/admin/AnnouncementManagement";
import Analytics from "./pages/admin/Analytics";
import AuditLogs from "./pages/admin/AuditLogs";
import SystemConfig from "./pages/admin/SystemConfig";
import AutomationSettings from "./pages/admin/AutomationSettings";
import "./styles/design-system.css";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const RoleBasedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: Array<"admin" | "staff" | "resident">;
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && token) {
      // Connect to WebSocket when user is authenticated
      socketService.connect(token);

      return () => {
        // Disconnect when component unmounts or user logs out
        socketService.disconnect();
      };
    }
  }, [isAuthenticated, token]);

  return (
    <>
      <Navbar />
      <ToastProvider />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/services"
          element={
            <PrivateRoute>
              <Services />
            </PrivateRoute>
          }
        />
        <Route
          path="/complaints"
          element={
            <PrivateRoute>
              <Complaints />
            </PrivateRoute>
          }
        />
        <Route
          path="/events"
          element={
            <PrivateRoute>
              <Events />
            </PrivateRoute>
          }
        />
        <Route
          path="/announcements"
          element={
            <PrivateRoute>
              <Announcements />
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <Notifications />
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <UserManagement />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/admin/announcements"
          element={
            <RoleBasedRoute allowedRoles={["admin", "staff"]}>
              <AnnouncementManagement />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <RoleBasedRoute allowedRoles={["admin", "staff"]}>
              <Analytics />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/admin/audit-logs"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <AuditLogs />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/admin/config"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <SystemConfig />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/admin/automation"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <AutomationSettings />
            </RoleBasedRoute>
          }
        />

        {/* Staff Routes */}
        <Route
          path="/staff"
          element={
            <RoleBasedRoute allowedRoles={["staff"]}>
              <StaffDashboard />
            </RoleBasedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
