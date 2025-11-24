import { useState, useEffect } from "react";
import { Search, Filter, Trash2 } from "lucide-react";
import api from "../../services/api";
import { AuditLog, PaginatedResponse, User } from "../../types";
import LoadingSpinner from "../../components/LoadingSpinner";
import { showToast } from "../../utils/toast";

const AuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [searchTerm, actionFilter, startDate, endDate, pagination.page]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: pagination.page,
        limit: 20,
      };

      if (searchTerm) params.search = searchTerm;
      if (actionFilter) params.action = actionFilter;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response: PaginatedResponse<AuditLog> = await api.getAuditLogs(
        params
      );
      setLogs(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch audit logs", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.getAuditLogStats();
      setStats(response.data);
    } catch (err) {
      console.error(err);
      console.error(err);
    }
  };

  const handleCleanup = async () => {
    if (
      !window.confirm(
        "Delete audit logs older than 90 days? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await api.deleteOldAuditLogs(90);
      showToast("Old audit logs deleted successfully", "success");
      fetchLogs();
      fetchStats();
    } catch (err) {
      console.error(err);
      showToast("Failed to delete old logs", "error");
    }
  };

  const getActionBadge = (action: string) => {
    const actionTypes: Record<string, string> = {
      create: "badge-success",
      update: "badge-info",
      delete: "badge-danger",
      login: "badge-primary",
      logout: "badge-secondary",
      approve: "badge-success",
      reject: "badge-danger",
      assign: "badge-warning",
    };

    const actionType = action.toLowerCase().split("_")[0];
    return actionTypes[actionType] || "badge-secondary";
  };

  const getStatusBadge = (status: string) => {
    return status === "success" ? "badge-success" : "badge-danger";
  };

  const getUserName = (user: string | User) => {
    if (typeof user === "string") return "Unknown User";
    return `${user.firstName} ${user.lastName}`;
  };

  if (loading && logs.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="container-fluid py-4">
      <div className="page-header mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h3 mb-2">Audit Logs</h1>
            <p className="text-muted">
              System activity and security audit trail
            </p>
          </div>
          <button className="btn btn-danger" onClick={handleCleanup}>
            <Trash2 size={20} className="me-2" />
            Cleanup Old Logs
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <p className="text-muted mb-1">Total Logs</p>
                <h3 className="mb-0">{stats.totalLogs || 0}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <p className="text-muted mb-1">Today's Activity</p>
                <h3 className="mb-0">{stats.todayLogs || 0}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <p className="text-muted mb-1">Failed Actions</p>
                <h3 className="mb-0 text-danger">{stats.failedActions || 0}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <p className="text-muted mb-1">Unique Users</p>
                <h3 className="mb-0">{stats.uniqueUsers || 0}</h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <div className="input-group">
                <span className="input-group-text">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
              >
                <option value="">All Actions</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
              </select>
            </div>
            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start Date"
              />
            </div>
            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End Date"
              />
            </div>
            <div className="col-md-3">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearchTerm("");
                  setActionFilter("");
                  setStartDate("");
                  setEndDate("");
                }}
              >
                <Filter size={18} className="me-2" />
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="card">
        <div className="card-body">
          {logs.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No audit logs found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>User</th>
                    <th>Action</th>
                    <th>Resource</th>
                    <th>Status</th>
                    <th>IP Address</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id}>
                      <td>
                        <small>
                          {new Date(log.createdAt).toLocaleString()}
                        </small>
                      </td>
                      <td>
                        <div className="fw-semibold">
                          {getUserName(log.userId)}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${getActionBadge(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td>
                        {log.resource && (
                          <div>
                            <small className="text-muted">{log.resource}</small>
                            {log.resourceId && (
                              <div>
                                <small className="font-monospace">
                                  {log.resourceId.substring(0, 8)}...
                                </small>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadge(log.status)}`}>
                          {log.status}
                        </span>
                      </td>
                      <td>
                        <small className="font-monospace">
                          {log.ipAddress || "N/A"}
                        </small>
                      </td>
                      <td>
                        <small className="text-muted">
                          {log.details
                            ? log.details.substring(0, 50) + "..."
                            : "No details"}
                        </small>
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
                    { length: Math.min(pagination.pages, 5) },
                    (_, i) => {
                      const page = i + 1;
                      return (
                        <li
                          key={page}
                          className={`page-item ${
                            pagination.page === page ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() =>
                              setPagination({ ...pagination, page })
                            }
                          >
                            {page}
                          </button>
                        </li>
                      );
                    }
                  )}
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
    </div>
  );
};

export default AuditLogs;
