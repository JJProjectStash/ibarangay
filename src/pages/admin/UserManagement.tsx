import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "../../context/AuthContext";
import ErrorBoundary from "../../components/ErrorBoundary";
import LoadingSpinner from "../../components/LoadingSpinner";
import Navbar from "../../components/Navbar";
import ToastProvider from "../../components/Toast";
import socketService from "../../services/socket";
import { useEffect } from "react";
import Home from "../Home";
import Login from "../Login";
import Signup from "../Signup";
import Services from "../Services";
import Complaints from "../Complaints";
import Events from "../Events";
import Notifications from "../Notifications";
import Dashboard from "../Dashboard";
import Announcements from "../Announcements";
import AdminDashboard from "./AdminDashboard";
import StaffDashboard from "../staff/StaffDashboard";
import UserManagement from "./UserManagement";
import AnnouncementsManagement from "./AnnouncementsManagement";
import Analytics from "./Analytics";
import AuditLogs from "./AuditLogs";
import SystemConfig from "./SystemConfig";
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
              <AnnouncementsManagement />
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
