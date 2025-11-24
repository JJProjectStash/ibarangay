import React, { useState, useEffect } from "react";
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  AlertCircle,
  Info,
  CheckCircle,
  Calendar,
  User,
  Eye,
} from "lucide-react";
import api from "../services/api";
import { Announcement } from "../types";
import { format } from "date-fns";
import { showSuccessToast, showErrorToast } from "../components/Toast";
import { getErrorMessage } from "../utils/errorHandler";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const canManage = user?.role === "admin" || user?.role === "staff";

  useEffect(() => {
    fetchAnnouncements();
  }, [filterPriority, filterCategory]);

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      const response = await api.getAnnouncements({
        status: "published",
        priority: filterPriority || undefined,
        search: searchTerm || undefined,
      });
      const announcementsData = Array.isArray(response.data)
        ? response.data
        : [];
      setAnnouncements(announcementsData);
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
      showErrorToast(getErrorMessage(error));
      setAnnouncements([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchAnnouncements();
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle size={16} />;
      case "medium":
        return <Info size={16} />;
      case "low":
        return <CheckCircle size={16} />;
      default:
        return <Info size={16} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "badge-error";
      case "medium":
        return "badge-warning";
      case "low":
        return "badge-info";
      default:
        return "badge-info";
    }
  };

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ padding: "2rem", minHeight: "calc(100vh - 64px)" }}
      >
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem 0", minHeight: "calc(100vh - 64px)" }}>
      <div className="container">
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{ marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}
        >
          <div>
            <h1
              className="text-3xl font-bold"
              style={{ marginBottom: "0.5rem" }}
            >
              <Megaphone
                size={32}
                style={{ display: "inline", marginRight: "0.5rem" }}
              />
              Announcements
            </h1>
            <p className="text-secondary">
              Stay updated with the latest barangay news and announcements
            </p>
          </div>
          {canManage && (
            <button
              className="btn btn-primary"
              onClick={() => navigate("/admin/announcements")}
            >
              <Plus size={20} /> Manage Announcements
            </button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <div
            className="grid grid-cols-1 md:grid-cols-3"
            style={{ gap: "1rem" }}
          >
            <div className="md:col-span-2">
              <div className="flex gap-2">
                <div style={{ flex: 1, position: "relative" }}>
                  <Search
                    size={18}
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--text-secondary)",
                    }}
                  />
                  <input
                    type="text"
                    className="input"
                    placeholder="Search announcements..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    style={{ paddingLeft: "2.5rem" }}
                  />
                </div>
                <button className="btn btn-primary" onClick={handleSearch}>
                  Search
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <select
                className="input"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Announcements List */}
        <div className="flex flex-col gap-4">
          {announcements.length === 0 ? (
            <div
              className="card"
              style={{ textAlign: "center", padding: "3rem" }}
            >
              <Megaphone
                size={48}
                style={{
                  margin: "0 auto 1rem",
                  color: "var(--text-secondary)",
                }}
              />
              <p className="text-secondary">No announcements available</p>
            </div>
          ) : (
            announcements.map((announcement, index) => (
              <div
                key={announcement._id}
                className="card card-interactive animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className="flex items-start justify-between"
                  style={{ marginBottom: "1rem" }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      className="flex items-center gap-2"
                      style={{ marginBottom: "0.5rem" }}
                    >
                      <h3 className="text-xl font-semibold">
                        {announcement.title}
                      </h3>
                      <span
                        className={`badge ${getPriorityColor(
                          announcement.priority
                        )}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        {getPriorityIcon(announcement.priority)}
                        {announcement.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-secondary">
                      <span className="flex items-center gap-1">
                        <User size={14} />
                        {typeof announcement.author === "object"
                          ? `${announcement.author.firstName} ${announcement.author.lastName}`
                          : "Admin"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {format(
                          new Date(
                            announcement.publishedAt || announcement.createdAt
                          ),
                          "MMM dd, yyyy"
                        )}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {announcement.views} views
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="text-secondary"
                  style={{
                    marginBottom: "1rem",
                    lineHeight: "1.6",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {announcement.content.length > 300
                    ? `${announcement.content.substring(0, 300)}...`
                    : announcement.content}
                </div>

                {announcement.category && (
                  <div style={{ marginBottom: "0.5rem" }}>
                    <span className="badge badge-info">
                      {announcement.category}
                    </span>
                  </div>
                )}

                {announcement.expiresAt && (
                  <p className="text-xs text-tertiary">
                    Expires on:{" "}
                    {format(new Date(announcement.expiresAt), "MMM dd, yyyy")}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcements;
