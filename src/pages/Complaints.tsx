import React, { useState, useEffect } from "react";
import {
  Plus,
  MessageSquare,
  Filter,
  Download,
  Trash2,
  AlertCircle,
  Settings,
} from "lucide-react";
import api from "../services/apiExtensions";
import socketService from "../services/socket";
import { Complaint } from "../types";
import { format } from "date-fns";
import FileUpload from "../components/FileUpload";
import { showSuccessToast, showErrorToast } from "../components/Toast";
import { getErrorMessage } from "../utils/errorHandler";
import { validators, getValidationMessage } from "../utils/validators";
import { useAuth } from "../context/AuthContext";

const Complaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategories, setNewCategories] = useState<string>("");
  const { token, user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
  });

  useEffect(() => {
    fetchComplaints();
    fetchCategories();

    // Connect socket if authenticated
    if (token) {
      socketService.connect(token);

      // Setup real-time listeners
      socketService.onComplaintCreated((data) => {
        setComplaints((prev) => [data.complaint, ...prev]);
        showSuccessToast("New complaint created!");
      });

      socketService.onComplaintUpdated((data) => {
        setComplaints((prev) =>
          prev.map((c) => (c._id === data.complaint._id ? data.complaint : c))
        );
        showSuccessToast("Complaint updated!");
      });

      socketService.onComplaintStatusChanged((data) => {
        setComplaints((prev) =>
          prev.map((c) => (c._id === data.complaint._id ? data.complaint : c))
        );
        showSuccessToast(
          `Complaint status changed to ${data.complaint.status}`
        );
      });

      return () => {
        socketService.offComplaintCreated();
        socketService.offComplaintUpdated();
        socketService.offComplaintStatusChanged();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, filterPriority]);

  const fetchCategories = async () => {
    try {
      const response = await api.getComplaintCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      const params: { status?: string; priority?: string } = {};
      if (filterStatus) params.status = filterStatus;
      if (filterPriority) params.priority = filterPriority;

      const response = await api.getComplaints(params);
      const complaintsData = Array.isArray(response.data) ? response.data : [];
      setComplaints(complaintsData);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
      showErrorToast(getErrorMessage(error));
      setComplaints([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCategories = async () => {
    try {
      const categoryArray = newCategories
        .split(",")
        .map((cat) => cat.trim())
        .filter((cat) => cat.length > 0);

      if (categoryArray.length === 0) {
        showErrorToast("Please enter at least one category");
        return;
      }

      await api.updateComplaintCategories(categoryArray);
      showSuccessToast("Categories updated successfully!");
      setShowCategoryModal(false);
      setNewCategories("");
      fetchCategories();
    } catch (error) {
      console.error("Failed to update categories:", error);
      showErrorToast(getErrorMessage(error));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validators.required(formData.title)) {
      newErrors.title = getValidationMessage("Title", "required");
    } else if (!validators.minLength(formData.title, 5)) {
      newErrors.title = getValidationMessage("Title", "minLength", 5);
    }

    if (!validators.required(formData.category)) {
      newErrors.category = getValidationMessage("Category", "required");
    }

    if (!validators.required(formData.description)) {
      newErrors.description = getValidationMessage("Description", "required");
    } else if (!validators.minLength(formData.description, 10)) {
      newErrors.description = getValidationMessage(
        "Description",
        "minLength",
        10
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showErrorToast("Please fix the form errors");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload files first
      const attachments: string[] = [];
      if (uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          try {
            const uploadResponse = await api.uploadComplaintFile(file);
            if (uploadResponse.data?.filePath) {
              attachments.push(uploadResponse.data.filePath);
            }
          } catch (uploadError) {
            console.error("Failed to upload file:", file.name, uploadError);
            showErrorToast(`Failed to upload ${file.name}`);
          }
        }
      }

      // Create complaint with attachments
      await api.createComplaint({
        ...formData,
        attachments,
      });

      setShowModal(false);
      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "medium",
      });
      setUploadedFiles([]);
      setErrors({});
      showSuccessToast("Complaint submitted successfully!");
      fetchComplaints();
    } catch (error) {
      console.error("Failed to create complaint:", error);
      showErrorToast(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedComplaints.length === 0) return;

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedComplaints.length} complaint(s)?`
      )
    ) {
      return;
    }

    try {
      await api.bulkDeleteComplaints(selectedComplaints);
      showSuccessToast(
        `${selectedComplaints.length} complaint(s) deleted successfully`
      );
      setSelectedComplaints([]);
      fetchComplaints();
    } catch (error) {
      console.error("Failed to delete complaints:", error);
      showErrorToast(getErrorMessage(error));
    }
  };

  const handleExport = async (format: "csv" | "excel") => {
    try {
      const res = await api.exportComplaints(format, {
        status: filterStatus,
        priority: filterPriority,
      });
      const blob = res.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `complaints-${Date.now()}.${
        format === "csv" ? "csv" : "xlsx"
      }`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showSuccessToast(`Complaints exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error("Failed to export complaints:", error);
      showErrorToast(getErrorMessage(error));
    }
  };

  const toggleSelectComplaint = (id: string) => {
    setSelectedComplaints((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
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

  const canEditCategories = user?.role === "admin" || user?.role === "staff";

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div className="spinner" />
        <p style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>
          Loading complaints...
        </p>
      </div>
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
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
            Complaint Center
          </h1>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {canEditCategories && (
              <button
                className="btn btn-outline"
                onClick={() => {
                  setNewCategories(categories.join(", "));
                  setShowCategoryModal(true);
                }}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Settings size={18} /> Manage Categories
              </button>
            )}
            {selectedComplaints.length > 0 && (
              <button
                className="btn btn-outline"
                onClick={handleBulkDelete}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Trash2 size={18} /> Delete ({selectedComplaints.length})
              </button>
            )}
            <button
              className="btn btn-outline"
              onClick={() => handleExport("csv")}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Download size={18} /> CSV
            </button>
            <button
              className="btn btn-outline"
              onClick={() => handleExport("excel")}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Download size={18} /> Excel
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              <Plus size={20} /> New Complaint
            </button>
          </div>
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Filter size={18} />
            <select
              className="input"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ width: "auto" }}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <select
            className="input"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            style={{ width: "auto" }}
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
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
                No complaints found
              </p>
            </div>
          ) : (
            complaints.map((complaint) => (
              <div key={complaint._id} className="card">
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "start",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedComplaints.includes(complaint._id)}
                    onChange={() => toggleSelectComplaint(complaint._id)}
                    style={{ marginTop: "0.25rem" }}
                  />
                  <div style={{ flex: 1 }}>
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
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          className={`badge ${getStatusBadge(
                            complaint.status
                          )}`}
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
                    {complaint.attachments &&
                      complaint.attachments.length > 0 && (
                        <div style={{ marginBottom: "1rem" }}>
                          <p
                            style={{
                              fontSize: "0.85rem",
                              color: "var(--text-secondary)",
                              marginBottom: "0.5rem",
                            }}
                          >
                            Attachments ({complaint.attachments.length})
                          </p>
                          <div
                            style={{
                              display: "flex",
                              gap: "0.5rem",
                              flexWrap: "wrap",
                            }}
                          >
                            {complaint.attachments.map((_, idx) => (
                              <span
                                key={idx}
                                style={{
                                  fontSize: "0.85rem",
                                  padding: "0.25rem 0.5rem",
                                  background: "var(--background)",
                                  borderRadius: "4px",
                                }}
                              >
                                📎 File {idx + 1}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
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
                          {format(
                            new Date(complaint.resolvedAt),
                            "MMM dd, yyyy"
                          )}
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
                        <p style={{ fontSize: "0.95rem" }}>
                          {complaint.response}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Category Management Modal */}
      {showCategoryModal && (
        <div
          style={modalStyles.overlay}
          onClick={() => setShowCategoryModal(false)}
        >
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
              Manage Complaint Categories
            </h2>
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                }}
              >
                Categories (comma-separated)
              </label>
              <textarea
                className="input"
                rows={4}
                value={newCategories}
                onChange={(e) => setNewCategories(e.target.value)}
                placeholder="e.g., infrastructure, sanitation, security, noise"
              />
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                  marginTop: "0.5rem",
                }}
              >
                Current categories: {categories.join(", ")}
              </p>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={handleUpdateCategories}
              >
                Update Categories
              </button>
              <button
                className="btn btn-outline"
                style={{ flex: 1 }}
                onClick={() => setShowCategoryModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Complaint Modal */}
      {showModal && (
        <div
          style={modalStyles.overlay}
          onClick={() => !isSubmitting && setShowModal(false)}
        >
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
                  Title *
                </label>
                <input
                  className="input"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Brief description of the issue"
                  disabled={isSubmitting}
                />
                {errors.title && (
                  <p
                    style={{
                      color: "var(--error)",
                      fontSize: "0.85rem",
                      marginTop: "0.25rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <AlertCircle size={14} /> {errors.title}
                  </p>
                )}
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "500",
                  }}
                >
                  Category *
                </label>
                <select
                  className="input"
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  disabled={isSubmitting}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p
                    style={{
                      color: "var(--error)",
                      fontSize: "0.85rem",
                      marginTop: "0.25rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <AlertCircle size={14} /> {errors.category}
                  </p>
                )}
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "500",
                  }}
                >
                  Priority *
                </label>
                <select
                  className="input"
                  value={formData.priority}
                  onChange={(e) =>
                    handleInputChange("priority", e.target.value)
                  }
                  disabled={isSubmitting}
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
                  Description *
                </label>
                <textarea
                  className="input"
                  rows={5}
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Provide detailed information about your complaint"
                  disabled={isSubmitting}
                />
                {errors.description && (
                  <p
                    style={{
                      color: "var(--error)",
                      fontSize: "0.85rem",
                      marginTop: "0.25rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <AlertCircle size={14} /> {errors.description}
                  </p>
                )}
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "500",
                  }}
                >
                  Attachments (Optional)
                </label>
                <FileUpload
                  onFilesSelected={setUploadedFiles}
                  maxFiles={5}
                  maxSizeMB={5}
                />
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Complaint"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
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
