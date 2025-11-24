import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import EnhancedErrorBoundary from "./components/EnhancedErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import Navbar from "./components/Navbar";
import ToastProvider from "./components/Toast";
import SessionTimeoutWarning from "./components/SessionTimeoutWarning";
import CSRFToken from "./components/CSRFToken";
import RateLimitFeedback, {
  useRateLimit,
} from "./components/RateLimitFeedback";
import { useSessionTimeout } from "./hooks/useSessionTimeout";
import socketService from "./services/socket";
import { useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Notifications from "./pages/Notifications";
import Dashboard from "./pages/Dashboard";
import Announcements from "./pages/Announcements";
import Help from "./pages/Help";

// Lazy loaded components for better performance
import {
  LazyAdminDashboard,
  LazyUserManagement,
  LazyAnnouncementManagement,
  LazyAnalytics,
  LazyAuditLogs,
  LazySystemConfig,
  LazyAutomationSettings,
  LazyStaffDashboard,
  LazyEvents,
  LazyComplaints,
  LazyServices,
} from "./utils/lazyRoutes";

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

function AppContent() {
  const { token, isAuthenticated } = useAuth();
  const { rateLimitState, updateRateLimit, handleRateLimitError } =
    useRateLimit();
  const { showWarning, timeLeft, extendSession, handleLogout } =
    useSessionTimeout({
      warningTime: 300, // 5 minutes warning
      sessionDuration: 3600, // 1 hour session
    });

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

  // Listen for rate limit events
  useEffect(() => {
    const handleRateLimitEvent = (event: CustomEvent) => {
      updateRateLimit(event.detail);
    };

    const handleRateLimitExceeded = (event: CustomEvent) => {
      handleRateLimitError(event.detail.retryAfter);
    };

    window.addEventListener("rateLimit", handleRateLimitEvent as EventListener);
    window.addEventListener(
      "rateLimitExceeded",
      handleRateLimitExceeded as EventListener
    );

    return () => {
      window.removeEventListener(
        "rateLimit",
        handleRateLimitEvent as EventListener
      );
      window.removeEventListener(
        "rateLimitExceeded",
        handleRateLimitExceeded as EventListener
      );
    };
  }, [updateRateLimit, handleRateLimitError]);

  return (
    <>
      <CSRFToken />
      <Navbar />
      <ToastProvider />
      <RateLimitFeedback {...rateLimitState} />
      <SessionTimeoutWarning
        isVisible={showWarning}
        timeLeft={timeLeft}
        onExtend={extendSession}
        onLogout={handleLogout}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/help" element={<Help />} />

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
              <LazyServices />
            </PrivateRoute>
          }
        />
        <Route
          path="/complaints"
          element={
            <PrivateRoute>
              <LazyComplaints />
            </PrivateRoute>
          }
        />
        <Route
          path="/events"
          element={
            <PrivateRoute>
              <LazyEvents />
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

        {/* Admin Routes - Lazy Loaded */}
        <Route
          path="/admin"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <LazyAdminDashboard />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <LazyUserManagement />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/admin/announcements"
          element={
            <RoleBasedRoute allowedRoles={["admin", "staff"]}>
              <LazyAnnouncementManagement />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <RoleBasedRoute allowedRoles={["admin", "staff"]}>
              <LazyAnalytics />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/admin/audit-logs"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <LazyAuditLogs />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/admin/config"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <LazySystemConfig />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/admin/automation"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <LazyAutomationSettings />
            </RoleBasedRoute>
          }
        />

        {/* Staff Routes - Lazy Loaded */}
        <Route
          path="/staff"
          element={
            <RoleBasedRoute allowedRoles={["staff"]}>
              <LazyStaffDashboard />
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
    <EnhancedErrorBoundary>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </EnhancedErrorBoundary>
  );
}

export default App;
