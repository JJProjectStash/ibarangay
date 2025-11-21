import React, { useState, useEffect } from "react";
import { Plus, MessageSquare } from "lucide-react";
import api from "../services/api";
import { Complaint } from "../types";
import { format } from "date-fns";

const Complaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await api.getComplaints();
      setComplaints(response.data);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createComplaint(formData);
      setShowModal(false);
      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "medium",
      });
      fetchComplaints();
    } catch (error) {
      console.error("Failed to create complaint:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: "badge-pending",
      "in-progress": "badge-info",
      resolved: "badge-success",
      closed: "badge-error",
    };
    return badges[status] || "badge-info";
  };

  const getPriorityBadge = (priority: string) => {
    const badges: Record<string, string> = {
      low: "badge-info",
      medium: "badge-warning",
      high: "badge-error",
    };
    return badges[priority] || "badge-info";
  };

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>
    );
  }

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
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
            Complaint Center
          </h1>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <Plus size={20} /> New Complaint
          </button>
        </div>

        <div style={{ display: "grid", gap: "1.5rem" }}>
          {complaints.length === 0 ? (
            <div
              className="card"
              style={{ textAlign: "center", padding: "3rem" }}
            >
              <MessageSquare
                size={48}
                style={{
                  margin: "0 auto 1rem",
                  color: "var(--text-secondary)",
                }}
              />
              <p style={{ color: "var(--text-secondary)" }}>
                No complaints submitted yet
              </p>
            </div>
          ) : (
            complaints.map((complaint) => (
              <div key={complaint._id} className="card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "1rem",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {complaint.title}
                    </h3>
                    <p
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "0.9rem",
                      }}
                    >
                      {complaint.category}
                    </p>
                  </div>
                  <div
                    style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                  >
                    <span
                      className={`badge ${getStatusBadge(complaint.status)}`}
                    >
                      {complaint.status.replace("-", " ").toUpperCase()}
                    </span>
                    <span
                      className={`badge ${getPriorityBadge(
                        complaint.priority
                      )}`}
                    >
                      {complaint.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
                <p style={{ marginBottom: "1rem", lineHeight: "1.6" }}>
                  {complaint.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  <span>
                    Submitted:{" "}
                    {format(new Date(complaint.createdAt), "MMM dd, yyyy")}
                  </span>
                  {complaint.resolvedAt && (
                    <span>
                      Resolved:{" "}
                      {format(new Date(complaint.resolvedAt), "MMM dd, yyyy")}
                    </span>
                  )}
                </div>
                {complaint.response && (
                  <div
                    style={{
                      marginTop: "1rem",
                      padding: "1rem",
                      background: "var(--background)",
                      borderRadius: "6px",
                      borderLeft: "4px solid var(--accent)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        marginBottom: "0.5rem",
                        color: "var(--accent)",
                      }}
                    >
                      Response:
                    </p>
                    <p style={{ fontSize: "0.95rem" }}>{complaint.response}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div style={modalStyles.overlay} onClick={() => setShowModal(false)}>
          <div
            className="card"
            style={modalStyles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "1.5rem",
              }}
            >
              Submit Complaint
            </h2>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "500",
                  }}
                >
                  Title
                </label>
                <input
                  className="input"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Brief description of the issue"
                  required
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "500",
                  }}
                >
                  Category
                </label>
                <input
                  className="input"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="e.g., Infrastructure, Sanitation, Noise"
                  required
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "500",
                  }}
                >
                  Priority
                </label>
                <select
                  className="input"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "500",
                  }}
                >
                  Description
                </label>
                <textarea
                  className="input"
                  rows={5}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Provide detailed information about your complaint"
                  required
                />
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Submit Complaint
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const modalStyles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "1rem",
  },
  modal: {
    maxWidth: "600px",
    width: "100%",
    maxHeight: "90vh",
    overflow: "auto",
  },
};

export default Complaints;
