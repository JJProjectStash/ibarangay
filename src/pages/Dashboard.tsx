import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

const Dashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect to role-specific dashboard
      switch (user.role) {
        case "admin":
          navigate("/admin", { replace: true });
          break;
        case "staff":
          navigate("/staff", { replace: true });
          break;
        default:
          // Keep residents on analytics dashboard
          break;
      }
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  // Only residents will see this dashboard
  return <ResidentDashboard />;
};

// Original Dashboard content for residents
const ResidentDashboard: React.FC = () => {
  return (
    <div style={{ padding: "2rem 0", minHeight: "calc(100vh - 64px)" }}>
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>My Dashboard</h1>
        </div>

        <div className="card" style={{ padding: "2rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            Welcome to iBarangay
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
            Use the navigation menu to access services, file complaints, and
            view events.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
              marginTop: "2rem",
            }}
          >
            <a
              href="/services"
              className="card"
              style={{ padding: "1.5rem", textDecoration: "none" }}
            >
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                Services
              </h3>
              <p style={{ color: "var(--text-secondary)" }}>
                Request barangay services and equipment
              </p>
            </a>
            <a
              href="/complaints"
              className="card"
              style={{ padding: "1.5rem", textDecoration: "none" }}
            >
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                Complaints
              </h3>
              <p style={{ color: "var(--text-secondary)" }}>
                File and track your complaints
              </p>
            </a>
            <a
              href="/events"
              className="card"
              style={{ padding: "1.5rem", textDecoration: "none" }}
            >
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                Events
              </h3>
              <p style={{ color: "var(--text-secondary)" }}>
                View and register for barangay events
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
