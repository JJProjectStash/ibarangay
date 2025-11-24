import React, { useState, useEffect } from "react";
import { Search, Calendar, Eye, AlertCircle } from "lucide-react";
import api from "../services/apiExtensions";
import { Announcement, PaginatedResponse } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";
import { showErrorToast } from "../components/Toast";
import { getErrorMessage } from "../utils/errorHandler";

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10,
  });

  useEffect(() => {
    fetchAnnouncements();
  }, [searchTerm, filterPriority, pagination.page]);

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      const params: {
        status: string;
        priority?: string;
        search?: string;
        page: number;
        limit: number;
      } = {
        status: "published",
        page: pagination.page,
        limit: pagination.limit,
      };

      if (searchTerm) params.search = searchTerm;
      if (filterPriority !== "all") params.priority = filterPriority;

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
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div style={{ padding: "2rem 0", minHeight: "calc(100vh - 64px)" }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 className="text-3xl font-bold" style={{ marginBottom: "0.5rem" }}>
            Announcements
          </h1>
          <p className="text-secondary">
            Stay updated with the latest barangay announcements
          </p>
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
              <div style={{ position: "relative" }}>
                <Search
                  size={18}
                  style={{
                    position: "absolute",
                    left: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-tertiary)",
                  }}
                />
                <input
                  type="text"
                  className="input"
                  placeholder="Search announcements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: "2.5rem" }}
                />
              </div>
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
              {searchTerm || filterPriority !== "all"
                ? "Try adjusting your filters"
                : "Check back later for updates"}
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
                        {new Date(announcement.createdAt).toLocaleDateString()}
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
                </div>

                <div
                  style={{
                    lineHeight: "var(--line-height-relaxed)",
                    color: "var(--text-secondary)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {announcement.content}
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
                    {new Date(announcement.expiresAt).toLocaleDateString()}
                  </div>
                )}

                {announcement.attachments &&
                  announcement.attachments.length > 0 && (
                    <div style={{ marginTop: "1rem" }}>
                      <p
                        className="text-sm text-secondary"
                        style={{ marginBottom: "0.5rem" }}
                      >
                        Attachments:
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          flexWrap: "wrap",
                        }}
                      >
                        {announcement.attachments.map((attachment, idx) => (
                          <a
                            key={idx}
                            href={attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline"
                          >
                            View Attachment {idx + 1}
                          </a>
                        ))}
                      </div>
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
    </div>
  );
};

export default Announcements;
