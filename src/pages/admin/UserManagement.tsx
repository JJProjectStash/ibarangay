import { useState, useEffect } from "react";
import { Search, Filter, Plus, Trash2, CheckCircle, XCircle } from "lucide-react";
import api from "../../services/apiExtensions";
import { User, PaginatedResponse } from "../../types";
import LoadingSpinner from "../../components/LoadingSpinner";
import CreateStaffAdminModal from "../../components/admin/CreateStaffAdminModal";
import { showToast } from "../../utils/toast";

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, roleFilter, verifiedFilter, pagination.page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: pagination.page,
        limit: 20,
      };

      if (searchTerm) params.search = searchTerm;
      if (roleFilter !== "all") params.role = roleFilter;
      if (verifiedFilter !== "all")
        params.verified = verifiedFilter === "verified";

      const res = await api.getUsers(params);
      const response: PaginatedResponse<User> = res.data;
      setUsers(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async (userId: string) => {
    try {
      await api.verifyUser(userId);
      showToast("User verified successfully", "success");
      fetchUsers();
    } catch (err) {
      console.error(err);
      showToast("Failed to verify user", "error");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.deleteUser(userId);
      showToast("User deleted successfully", "success");
      fetchUsers();
    } catch (err) {
      console.error(err);
      showToast("Failed to delete user", "error");
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await api.updateUserRole(userId, newRole);
      showToast("User role updated successfully", "success");
      fetchUsers();
    } catch (err) {
      console.error(err);
      showToast("Failed to update user role", "error");
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: "badge-danger",
      staff: "badge-warning",
      resident: "badge-info",
    };
    return colors[role as keyof typeof colors] || "badge-secondary";
  };

  if (loading && users.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="container-fluid py-4">
      <div className="page-header mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h3 mb-2">User Management</h1>
            <p className="text-muted">Manage system users and permissions</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={20} className="me-2" />
            Create Staff/Admin
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
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                <option value="resident">Resident</option>
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={verifiedFilter}
                onChange={(e) => setVerifiedFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearchTerm("");
                  setRoleFilter("all");
                  setVerifiedFilter("all");
                }}
              >
                <Filter size={18} className="me-2" />
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="card-body">
          {users.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No users found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div>
                            <div className="fw-semibold">
                              {user.firstName} {user.lastName}
                            </div>
                            {user.address && (
                              <small className="text-muted">
                                {user.address}
                              </small>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <select
                          className={`form-select form-select-sm ${getRoleBadge(
                            user.role
                          )}`}
                          value={user.role}
                          onChange={(e) =>
                            handleUpdateRole(user._id, e.target.value)
                          }
                          style={{ width: "120px" }}
                        >
                          <option value="resident">Resident</option>
                          <option value="staff">Staff</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        {user.isVerified ? (
                          <span className="badge badge-success">
                            <CheckCircle size={14} className="me-1" />
                            Verified
                          </span>
                        ) : (
                          <span className="badge badge-warning">
                            <XCircle size={14} className="me-1" />
                            Unverified
                          </span>
                        )}
                      </td>
                      <td>
                        <small>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </small>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          {!user.isVerified && (
                            <button
                              className="btn btn-outline-success"
                              onClick={() => handleVerifyUser(user._id)}
                              title="Verify User"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDeleteUser(user._id)}
                            title="Delete User"
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

      {/* Create Staff/Admin Modal */}
      {showCreateModal && (
        <CreateStaffAdminModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
};

export default UserManagement;
