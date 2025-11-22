import React, { useState, useEffect } from "react";
import { ClipboardList, AlertCircle, CheckCircle, Clock } from "lucide-react";
import api from "../../services/api";
import RequestManagement from "../../components/staff/RequestManagement";
import { Service, Complaint } from "../../types";
import { showToast } from "../../utils/toast";

const StaffDashboard: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [servicesResponse, complaintsResponse] = await Promise.all([
        api.getServiceRequests(),
        api.getComplaints(),
      ]);

      setServices(servicesResponse.data || []);
      setComplaints(complaintsResponse.data || []);
    } catch (error) {
      const err = error as Error;
      showToast(err.message || "Failed to fetch data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateServiceStatus = async (
    id: string,
    status: string,
    notes?: string
  ) => {
    try {
      await api.updateServiceStatus(id, status, notes);
      showToast("Service request updated successfully", "success");
      fetchData();
    } catch (error) {
      const err = error as Error;
      showToast(err.message || "Failed to update service request", "error");
    }
  };

  const handleUpdateComplaintStatus = async (
    id: string,
    status: string,
    response?: string
  ) => {
    try {
      await api.updateComplaintStatus(id, status, response);
      showToast("Complaint updated successfully", "success");
      fetchData();
    } catch (error) {
      const err = error as Error;
      showToast(err.message || "Failed to update complaint", "error");
    }
  };

  const pendingServices = services.filter((s) => s.status === "pending");
  const pendingComplaints = complaints.filter((c) => c.status === "pending");
  const inProgressComplaints = complaints.filter(
    (c) => c.status === "in-progress"
  );
  const resolvedComplaints = complaints.filter((c) => c.status === "resolved");

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Loading staff dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem 0", minHeight: "calc(100vh - 64px)" }}>
      <div className="container">
        <h1
          style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}
        >
          Staff Dashboard
        </h1>

        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  padding: "0.75rem",
                  background: "rgba(245, 158, 11, 0.1)",
                  borderRadius: "8px",
                }}
              >
                <Clock size={24} style={{ color: "#f59e0b" }} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    marginBottom: "0.25rem",
                  }}
                >
                  Pending Services
                </p>
                <p style={{ fontSize: "1.75rem", fontWeight: "bold" }}>
                  {pendingServices.length}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  padding: "0.75rem",
                  background: "rgba(239, 68, 68, 0.1)",
                  borderRadius: "8px",
                }}
              >
                <AlertCircle size={24} style={{ color: "#ef4444" }} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    marginBottom: "0.25rem",
                  }}
                >
                  Pending Complaints
                </p>
                <p style={{ fontSize: "1.75rem", fontWeight: "bold" }}>
                  {pendingComplaints.length}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  padding: "0.75rem",
                  background: "rgba(59, 130, 246, 0.1)",
                  borderRadius: "8px",
                }}
              >
                <ClipboardList size={24} style={{ color: "#3b82f6" }} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    marginBottom: "0.25rem",
                  }}
                >
                  In Progress
                </p>
                <p style={{ fontSize: "1.75rem", fontWeight: "bold" }}>
                  {inProgressComplaints.length}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  padding: "0.75rem",
                  background: "rgba(16, 185, 129, 0.1)",
                  borderRadius: "8px",
                }}
              >
                <CheckCircle size={24} style={{ color: "#10b981" }} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    marginBottom: "0.25rem",
                  }}
                >
                  Resolved
                </p>
                <p style={{ fontSize: "1.75rem", fontWeight: "bold" }}>
                  {resolvedComplaints.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Request Management */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              marginBottom: "1.5rem",
            }}
          >
            Request Management
          </h2>
          <RequestManagement
            services={services}
            complaints={complaints}
            onUpdateServiceStatus={handleUpdateServiceStatus}
            onUpdateComplaintStatus={handleUpdateComplaintStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
