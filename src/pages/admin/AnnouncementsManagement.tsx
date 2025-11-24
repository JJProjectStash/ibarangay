import { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit, Trash2, Eye, Send } from "lucide-react";
import api from "../../services/api";
import { Announcement, PaginatedResponse } from "../../types";
import LoadingSpinner from "../../components/LoadingSpinner";
import { showToast } from "../../utils/toast";

const AnnouncementsManagement = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<Announcement | null>(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "medium" as "low" | "medium" | "high",
    category: "",
    expiresAt: "",
  });

  useEffect(() => {
    fetchAnnouncements();
  }, [searchTerm, statusFilter, priorityFilter, pagination.page]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: pagination.page,
        limit: 10,
      };

      if (searchTerm) params.search = searchTerm;
      if (statusFilter !== "all") params.status = statusFilter;
      if (priorityFilter !== "all") params.priority = priorityFilter;

      const response: PaginatedResponse<Announcement> =
        await api.getAnnouncements(params);
      setAnnouncements(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch announcements", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAnnouncement) {
        await api.updateAnnouncement(editingAnnouncement._id, formData);
        showToast("Announcement updated successfully", "success");
      } else {
        await api.createAnnouncement(formData);
        showToast("Announcement created successfully", "success");
      }
      setShowModal(false);
      resetForm();
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      showToast("Failed to save announcement", "error");
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await api.publishAnnouncement(id);
      showToast("Announcement published successfully", "success");
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      showToast("Failed to publish announcement", "error");
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      await api.unpublishAnnouncement(id);
      showToast("Announcement unpublished successfully", "success");
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      showToast("Failed to unpublish announcement", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this announcement?"))
      return;

    try {
      await api.deleteAnnouncement(id);
      showToast("Announcement deleted successfully", "success");
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      showToast("Failed to delete announcement", "error");
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      category: announcement.category,
      expiresAt: announcement.expiresAt
        ? announcement.expiresAt.split("T")[0]
        : "",
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      priority: "medium",
      category: "",
      expiresAt: "",
    });
    setEditingAnnouncement(null);
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: "badge-info",
      medium: "badge-warning",
      high: "badge-danger",
    };
    return colors[priority as keyof typeof colors] || "badge-secondary";
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      draft: "badge-secondary",
      published: "badge-success",
      archived: "badge-dark",
    };
    return colors[status as keyof typeof colors] || "badge-secondary";
  };

  if (loading && announcements.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="container-fluid py-4">
      <div className="page-header mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h3 mb-2">Announcements Management</h1>
            <p className="text-muted">
              Create and manage barangay announcements
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            <Plus size={20} className="me-2" />
            New Announcement
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search announcements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setPriorityFilter("all");
                }}
              >
                <Filter size={18} className="me-2" />
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="card">
        <div className="card-body">
          {announcements.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No announcements found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Views</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {announcements.map((announcement) => (
                    <tr key={announcement._id}>
                      <td>
                        <div className="fw-semibold">{announcement.title}</div>
                        <small className="text-muted">
                          {announcement.content.substring(0, 60)}...
                        </small>
                      </td>
                      <td>{announcement.category}</td>
                      <td>
                        <span
                          className={`badge ${getPriorityBadge(
                            announcement.priority
                          )}`}
                        >
                          {announcement.priority}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${getStatusBadge(
                            announcement.status
                          )}`}
                        >
                          {announcement.status}
                        </span>
                      </td>
                      <td>
                        <Eye size={16} className="me-1" />
                        {announcement.views}
                      </td>
                      <td>
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => handleEdit(announcement)}
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          {announcement.status === "draft" ? (
                            <button
                              className="btn btn-outline-success"
                              onClick={() => handlePublish(announcement._id)}
                              title="Publish"
                            >
                              <Send size={16} />
                            </button>
                          ) : announcement.status === "published" ? (
                            <button
                              className="btn btn-outline-warning"
                              onClick={() => handleUnpublish(announcement._id)}
                              title="Unpublish"
                            >
                              <Send size={16} />
                            </button>
                          ) : null}
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(announcement._id)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <nav>
                <ul className="pagination">
                  <li
                    className={`page-item ${
                      pagination.page === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() =>
                        setPagination({
                          ...pagination,
                          page: pagination.page - 1,
                        })
                      }
                    >
                      Previous
                    </button>
                  </li>
                  {Array.from(
                    { length: pagination.pages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <li
                      key={page}
                      className={`page-item ${
                        pagination.page === page ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setPagination({ ...pagination, page })}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${
                      pagination.page === pagination.pages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() =>
                        setPagination({
                          ...pagination,
                          page: pagination.page + 1,
                        })
                      }
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingAnnouncement
                    ? "Edit Announcement"
                    : "New Announcement"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Content *</label>
                    <textarea
                      className="form-control"
                      rows={6}
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Priority *</label>
                      <select
                        className="form-select"
                        value={formData.priority}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            priority: e.target.value as any,
                          })
                        }
                        required
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Category *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Expires At</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.expiresAt}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            expiresAt: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingAnnouncement ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsManagement;
