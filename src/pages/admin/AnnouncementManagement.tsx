import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  AlertCircle,
  Upload,
  X,
} from "lucide-react";
import api from "../../services/apiExtensions";
import { Announcement, PaginatedResponse } from "../../types";
import { showSuccessToast, showErrorToast } from "../../components/Toast";
import { getErrorMessage } from "../../utils/errorHandler";
import { format } from "date-fns";
import SkeletonLoader from "../../components/SkeletonLoader";

const AnnouncementManagement: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10,
  });

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "medium" as "low" | "medium" | "high",
    category: "",
    expiresAt: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  useEffect(() => {
    fetchAnnouncements();
  }, [filterStatus, filterPriority, searchTerm, pagination.page]);

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (filterStatus !== "all") params.status = filterStatus;
      if (filterPriority !== "all") params.priority = filterPriority;
      if (searchTerm) params.search = searchTerm;

      const res = await api.getAnnouncements(params);
      const response: PaginatedResponse<Announcement> = res.data;
      setAnnouncements(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
      showErrorToast(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    } else if (formData.content.length < 20) {
      newErrors.content = "Content must be at least 20 characters";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (formData.expiresAt) {
      const expiryDate = new Date(formData.expiresAt);
      if (expiryDate <= new Date()) {
        newErrors.expiresAt = "Expiry date must be in the future";
      }
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
      const attachments: string[] = [];
      if (uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          try {
            const uploadResponse = await api.uploadAnnouncementFile(file);
            if (uploadResponse.data?.filePath) {
              attachments.push(uploadResponse.data.filePath);
            }
          } catch (uploadError) {
            console.error("Failed to upload file:", file.name, uploadError);
            showErrorToast(`Failed to upload ${file.name}`);
          }
        }
      }

      const payload = {
        ...formData,
        attachments,
        expiresAt: formData.expiresAt || undefined,
      };

      if (editingId) {
        await api.updateAnnouncement(editingId, payload);
        showSuccessToast("Announcement updated successfully!");
      } else {
        await api.createAnnouncement(payload);
        showSuccessToast("Announcement created successfully!");
      }

      handleCloseModal();
      fetchAnnouncements();
    } catch (error) {
      console.error("Failed to save announcement:", error);
      showErrorToast(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingId(announcement._id);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      category: announcement.category,
      expiresAt: announcement.expiresAt
        ? format(new Date(announcement.expiresAt), "yyyy-MM-dd")
        : "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) {
      return;
    }

    try {
      await api.deleteAnnouncement(id);
      showSuccessToast("Announcement deleted successfully!");
      fetchAnnouncements();
    } catch (error) {
      console.error("Failed to delete announcement:", error);
      showErrorToast(getErrorMessage(error));
    }
  };

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    try {
      if (isPublished) {
        await api.unpublishAnnouncement(id);
        showSuccessToast("Announcement unpublished");
      } else {
        await api.publishAnnouncement(id);
        showSuccessToast("Announcement published");
      }
      fetchAnnouncements();
    } catch (error) {
      console.error("Failed to toggle publish status:", error);
      showErrorToast(getErrorMessage(error));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      title: "",
      content: "",
      priority: "medium",
      category: "",
      expiresAt: "",
    });
    setUploadedFiles([]);
    setErrors({});
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "var(--error-500)";
      case "medium":
        return "var(--warning-500)";
      case "low":
        return "var(--info-500)";
      default:
        return "var(--gray-500)";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return "badge-error";
      case "medium":
        return "badge-warning";
      case "low":
        return "badge-info";
      default:
        return "badge-secondary";
    }
  };

  if (isLoading && announcements.length === 0) {
    return (
      <div style={{ padding: "2rem 0" }}>
        <div className="container">
          <SkeletonLoader count={5} height="120px" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem 0", minHeight: "calc(100vh - 64px)" }}>
      <div className="container">
        {/* Header */}
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
          <div>
            <h1
              className="text-3xl font-bold"
              style={{ marginBottom: "0.5rem" }}
            >
              Announcement Management
            </h1>
            <p className="text-secondary">
              Create and manage barangay announcements
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Plus size={20} /> New Announcement
          </button>
        </div>

        {/* Filters */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            <div>
              <label className="form-label">Search</label>
              <input
                type="text"
                className="input"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Status</label>
              <select
                className="input"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="form-label">Priority</label>
              <select
                className="input"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Announcements List */}
        {announcements.length === 0 ? (
          <div
            className="card"
            style={{ padding: "3rem", textAlign: "center" }}
          >
            <AlertCircle
              size={48}
              style={{ margin: "0 auto 1rem", color: "var(--text-tertiary)" }}
            />
            <h3
              className="text-xl font-semibold"
              style={{ marginBottom: "0.5rem" }}
            >
              No announcements found
            </h3>
            <p className="text-secondary">
              {searchTerm || filterStatus !== "all" || filterPriority !== "all"
                ? "Try adjusting your filters"
                : "Create your first announcement to get started"}
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {announcements.map((announcement, index) => (
              <div
                key={announcement._id}
                className="card card-interactive animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "1rem",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          width: "4px",
                          height: "24px",
                          backgroundColor: getPriorityColor(
                            announcement.priority
                          ),
                          borderRadius: "var(--radius-full)",
                        }}
                      />
                      <h2 className="text-xl font-semibold">
                        {announcement.title}
                      </h2>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        flexWrap: "wrap",
                        marginBottom: "1rem",
                      }}
                    >
                      <span
                        className={`badge ${
                          announcement.status === "published"
                            ? "badge-success"
                            : "badge-secondary"
                        }`}
                      >
                        {announcement.status}
                      </span>
                      <span
                        className={`badge ${getPriorityBadge(
                          announcement.priority
                        )}`}
                      >
                        {announcement.priority} priority
                      </span>
                      <span className="badge badge-info">
                        {announcement.category}
                      </span>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          fontSize: "var(--font-size-sm)",
                          color: "var(--text-tertiary)",
                        }}
                      >
                        <Calendar size={14} />
                        {format(
                          new Date(announcement.createdAt),
                          "MMM dd, yyyy"
                        )}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          fontSize: "var(--font-size-sm)",
                          color: "var(--text-tertiary)",
                        }}
                      >
                        <Eye size={14} />
                        {announcement.views} views
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() =>
                        handleTogglePublish(
                          announcement._id,
                          announcement.status === "published"
                        )
                      }
                      title={
                        announcement.status === "published"
                          ? "Unpublish"
                          : "Publish"
                      }
                    >
                      {announcement.status === "published" ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => handleEdit(announcement)}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => handleDelete(announcement._id)}
                      style={{ color: "var(--error-500)" }}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    lineHeight: "var(--line-height-relaxed)",
                    color: "var(--text-secondary)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {announcement.content.length > 200
                    ? `${announcement.content.substring(0, 200)}...`
                    : announcement.content}
                </div>

                {announcement.expiresAt && (
                  <div
                    style={{
                      marginTop: "1rem",
                      padding: "0.75rem",
                      backgroundColor: "var(--warning-50)",
                      borderRadius: "var(--radius-md)",
                      fontSize: "var(--font-size-sm)",
                      color: "var(--warning-700)",
                    }}
                  >
                    <strong>Expires:</strong>{" "}
                    {format(new Date(announcement.expiresAt), "MMM dd, yyyy")}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "2rem",
              gap: "0.5rem",
            }}
          >
            <button
              className="btn btn-secondary"
              onClick={() =>
                setPagination({ ...pagination, page: pagination.page - 1 })
              }
              disabled={pagination.page === 1}
            >
              Previous
            </button>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0 1rem",
                color: "var(--text-secondary)",
              }}
            >
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              className="btn btn-secondary"
              onClick={() =>
                setPagination({ ...pagination, page: pagination.page + 1 })
              }
              disabled={pagination.page === pagination.pages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div
          style={{
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
          }}
          onClick={() => !isSubmitting && handleCloseModal()}
        >
          <div
            className="card"
            style={{
              maxWidth: "700px",
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "1.5rem",
              }}
            >
              {editingId ? "Edit Announcement" : "Create Announcement"}
            </h2>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div>
                <label className="form-label">Title *</label>
                <input
                  className="input"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Announcement title"
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
                <label className="form-label">Content *</label>
                <textarea
                  className="input"
                  rows={8}
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  placeholder="Announcement content"
                  disabled={isSubmitting}
                />
                {errors.content && (
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
                    <AlertCircle size={14} /> {errors.content}
                  </p>
                )}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <label className="form-label">Priority *</label>
                  <select
                    className="input"
                    value={formData.priority}
                    onChange={(e) =>
                      handleInputChange(
                        "priority",
                        e.target.value as "low" | "medium" | "high"
                      )
                    }
                    disabled={isSubmitting}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Category *</label>
                  <input
                    className="input"
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    placeholder="e.g., Community, Health, Safety"
                    disabled={isSubmitting}
                  />
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
              </div>

              <div>
                <label className="form-label">Expiry Date (Optional)</label>
                <input
                  type="date"
                  className="input"
                  value={formData.expiresAt}
                  onChange={(e) =>
                    handleInputChange("expiresAt", e.target.value)
                  }
                  min={format(new Date(), "yyyy-MM-dd")}
                  disabled={isSubmitting}
                />
                {errors.expiresAt && (
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
                    <AlertCircle size={14} /> {errors.expiresAt}
                  </p>
                )}
              </div>

              <div>
                <label className="form-label">Attachments (Optional)</label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                  id="file-upload"
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="file-upload"
                  className="btn btn-outline"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                  }}
                >
                  <Upload size={18} /> Choose Files
                </label>
                {uploadedFiles.length > 0 && (
                  <div style={{ marginTop: "0.5rem" }}>
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0.5rem",
                          background: "var(--background-secondary)",
                          borderRadius: "var(--radius-md)",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <span style={{ fontSize: "0.875rem" }}>
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--error-500)",
                          }}
                          disabled={isSubmitting}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingId
                    ? "Update Announcement"
                    : "Create Announcement"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                  onClick={handleCloseModal}
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

export default AnnouncementManagement;
