import React, { useState } from "react";
import { Service, Complaint } from "../../types";
import { format } from "date-fns";
import { CheckCircle, XCircle, Clock, MessageSquare } from "lucide-react";

interface RequestManagementProps {
  services: Service[];
  complaints: Complaint[];
  onUpdateServiceStatus: (id: string, status: string, notes?: string) => void;
  onUpdateComplaintStatus: (
    id: string,
    status: string,
    response?: string
  ) => void;
}

const RequestManagement: React.FC<RequestManagementProps> = ({
  services,
  complaints,
  onUpdateServiceStatus,
  onUpdateComplaintStatus,
}) => {
  const [activeTab, setActiveTab] = useState<"services" | "complaints">(
    "services"
  );
  const [responseText, setResponseText] = useState<Record<string, string>>({});

  const pendingServices = services.filter((s) => s.status === "pending");
  const pendingComplaints = complaints.filter((c) => c.status === "pending");

  const handleApproveService = (id: string) => {
    const notes = responseText[id] || "";
    onUpdateServiceStatus(id, "approved", notes);
    setResponseText((prev) => ({ ...prev, [id]: "" }));
  };

  const handleRejectService = (id: string) => {
    const notes = responseText[id] || "Request rejected";
    onUpdateServiceStatus(id, "rejected", notes);
    setResponseText((prev) => ({ ...prev, [id]: "" }));
  };

  const handleUpdateComplaint = (id: string, status: string) => {
    const response = responseText[id] || "";
    onUpdateComplaintStatus(id, status, response);
    setResponseText((prev) => ({ ...prev, [id]: "" }));
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, React.CSSProperties> = {
      pending: { background: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" },
      approved: { background: "rgba(16, 185, 129, 0.1)", color: "#10b981" },
      rejected: { background: "rgba(239, 68, 68, 0.1)", color: "#ef4444" },
      "in-progress": {
        background: "rgba(59, 130, 246, 0.1)",
        color: "#3b82f6",
      },
      resolved: { background: "rgba(16, 185, 129, 0.1)", color: "#10b981" },
    };
    return styles[status] || styles.pending;
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1.5rem",
          borderBottom: "2px solid var(--border)",
        }}
      >
        <button
          onClick={() => setActiveTab("services")}
          style={{
            padding: "1rem 1.5rem",
            background: "transparent",
            border: "none",
            borderBottom:
              activeTab === "services"
                ? "3px solid var(--primary)"
                : "3px solid transparent",
            color:
              activeTab === "services"
                ? "var(--primary)"
                : "var(--text-secondary)",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Service Requests ({pendingServices.length})
        </button>
        <button
          onClick={() => setActiveTab("complaints")}
          style={{
            padding: "1rem 1.5rem",
            background: "transparent",
            border: "none",
            borderBottom:
              activeTab === "complaints"
                ? "3px solid var(--primary)"
                : "3px solid transparent",
            color:
              activeTab === "complaints"
                ? "var(--primary)"
                : "var(--text-secondary)",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Complaints ({pendingComplaints.length})
        </button>
      </div>

      {activeTab === "services" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {pendingServices.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                color: "var(--text-secondary)",
              }}
            >
              <Clock
                size={48}
                style={{ margin: "0 auto 1rem", opacity: 0.5 }}
              />
              <p>No pending service requests</p>
            </div>
          ) : (
            pendingServices.map((service) => (
              <div
                key={service._id}
                className="card"
                style={{ padding: "1.5rem" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "600",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {service.itemName}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        fontSize: "0.875rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      <span>Type: {service.itemType}</span>
                      <span>Quantity: {service.quantity}</span>
                      <span>
                        Requested:{" "}
                        {format(new Date(service.createdAt), "MMM dd, yyyy")}
                      </span>
                    </div>
                  </div>
                  <span
                    style={{
                      ...getStatusBadge(service.status),
                      padding: "0.5rem 1rem",
                      borderRadius: "12px",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      height: "fit-content",
                    }}
                  >
                    {service.status.charAt(0).toUpperCase() +
                      service.status.slice(1)}
                  </span>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <p style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                    Purpose:
                  </p>
                  <p style={{ color: "var(--text-secondary)" }}>
                    {service.purpose}
                  </p>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <p style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                    Borrow Period:
                  </p>
                  <p style={{ color: "var(--text-secondary)" }}>
                    {format(new Date(service.borrowDate), "MMM dd, yyyy")} -{" "}
                    {format(
                      new Date(service.expectedReturnDate),
                      "MMM dd, yyyy"
                    )}
                  </p>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontWeight: "600",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <MessageSquare
                      size={16}
                      style={{ display: "inline", marginRight: "0.25rem" }}
                    />
                    Response Notes:
                  </label>
                  <textarea
                    className="input"
                    value={responseText[service._id] || ""}
                    onChange={(e) =>
                      setResponseText((prev) => ({
                        ...prev,
                        [service._id]: e.target.value,
                      }))
                    }
                    placeholder="Add notes for approval/rejection..."
                    rows={3}
                    style={{ width: "100%", resize: "vertical" }}
                  />
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleApproveService(service._id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <CheckCircle size={18} />
                    Approve
                  </button>
                  <button
                    className="btn"
                    onClick={() => handleRejectService(service._id)}
                    style={{
                      background: "rgba(239, 68, 68, 0.1)",
                      color: "#ef4444",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <XCircle size={18} />
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "complaints" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {pendingComplaints.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                color: "var(--text-secondary)",
              }}
            >
              <Clock
                size={48}
                style={{ margin: "0 auto 1rem", opacity: 0.5 }}
              />
              <p>No pending complaints</p>
            </div>
          ) : (
            pendingComplaints.map((complaint) => (
              <div
                key={complaint._id}
                className="card"
                style={{ padding: "1.5rem" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "600",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {complaint.title}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        fontSize: "0.875rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      <span>Category: {complaint.category}</span>
                      <span>Priority: {complaint.priority}</span>
                      <span>
                        Submitted:{" "}
                        {format(new Date(complaint.createdAt), "MMM dd, yyyy")}
                      </span>
                    </div>
                  </div>
                  <span
                    style={{
                      ...getStatusBadge(complaint.status),
                      padding: "0.5rem 1rem",
                      borderRadius: "12px",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      height: "fit-content",
                    }}
                  >
                    {complaint.status.charAt(0).toUpperCase() +
                      complaint.status.slice(1)}
                  </span>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <p style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                    Description:
                  </p>
                  <p style={{ color: "var(--text-secondary)" }}>
                    {complaint.description}
                  </p>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontWeight: "600",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <MessageSquare
                      size={16}
                      style={{ display: "inline", marginRight: "0.25rem" }}
                    />
                    Response:
                  </label>
                  <textarea
                    className="input"
                    value={responseText[complaint._id] || ""}
                    onChange={(e) =>
                      setResponseText((prev) => ({
                        ...prev,
                        [complaint._id]: e.target.value,
                      }))
                    }
                    placeholder="Add response to the complaint..."
                    rows={3}
                    style={{ width: "100%", resize: "vertical" }}
                  />
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      handleUpdateComplaint(complaint._id, "in-progress")
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Clock size={18} />
                    In Progress
                  </button>
                  <button
                    className="btn"
                    onClick={() =>
                      handleUpdateComplaint(complaint._id, "resolved")
                    }
                    style={{
                      background: "rgba(16, 185, 129, 0.1)",
                      color: "#10b981",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <CheckCircle size={18} />
                    Resolve
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default RequestManagement;
