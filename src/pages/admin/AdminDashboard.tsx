import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Shield,
  UserCheck,
  UserX,
  Activity,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import adminApi from "../../services/adminApi";
import UserManagementTable from "../../components/admin/UserManagementTable";
import CreateStaffAdminModal from "../../components/admin/CreateStaffAdminModal";
import { UserManagement } from "../../types/admin";
import { showToast } from "../../utils/toast";

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<UserManagement[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalStaff: 0,
    totalResidents: 0,
    verifiedUsers: 0,
    unverifiedUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<{ role?: string; isVerified?: boolean }>(
    {}
  );
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const usersResponse = await adminApi.getAllUsers(filter);
      setUsers(usersResponse.data);

      // Calculate stats
      const allUsers = usersResponse.data;
      setStats({
        totalUsers: allUsers.length,
        totalAdmins: allUsers.filter((u: UserManagement) => u.role === "admin")
          .length,
        totalStaff: allUsers.filter((u: UserManagement) => u.role === "staff")
          .length,
        totalResidents: allUsers.filter(
          (u: UserManagement) => u.role === "resident"
        ).length,
        verifiedUsers: allUsers.filter((u: UserManagement) => u.isVerified)
          .length,
        unverifiedUsers: allUsers.filter((u: UserManagement) => !u.isVerified)
          .length,
      });
    } catch (error) {
      const err = error as Error;
      showToast({
        message: err.message || "Failed to fetch users",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      await adminApi.updateUserRole(userId, role);
      showToast({ message: "User role updated successfully", type: "success" });
      fetchData();
    } catch (error) {
      const err = error as Error;
      showToast({
        message: err.message || "Failed to update user role",
        type: "error",
      });
    }
  };

  const handleVerifyUser = async (userId: string) => {
    try {
      await adminApi.verifyUser(userId);
      showToast({ message: "User verified successfully", type: "success" });
      fetchData();
    } catch (error) {
      const err = error as Error;
      showToast({
        message: err.message || "Failed to verify user",
        type: "error",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await adminApi.deleteUser(userId);
      showToast({ message: "User deleted successfully", type: "success" });
      fetchData();
    } catch (error) {
      const err = error as Error;
      showToast({
        message: err.message || "Failed to delete user",
        type: "error",
      });
    }
  };

  const handleCreateSuccess = () => {
    fetchData();
  };

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Loading admin dashboard...</p>
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
          }}
        >
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
            Admin Dashboard
          </h1>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <UserPlus size={20} />
            Create Staff/Admin
          </button>
        </div>

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
                  background: "rgba(99, 102, 241, 0.1)",
                  borderRadius: "8px",
                }}
              >
                <Users size={24} style={{ color: "#6366f1" }} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    marginBottom: "0.25rem",
                  }}
                >
                  Total Users
                </p>
                <p style={{ fontSize: "1.75rem", fontWeight: "bold" }}>
                  {stats.totalUsers}
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
                <Shield size={24} style={{ color: "#ef4444" }} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    marginBottom: "0.25rem",
                  }}
                >
                  Admins
                </p>
                <p style={{ fontSize: "1.75rem", fontWeight: "bold" }}>
                  {stats.totalAdmins}
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
                <Activity size={24} style={{ color: "#3b82f6" }} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    marginBottom: "0.25rem",
                  }}
                >
                  Staff
                </p>
                <p style={{ fontSize: "1.75rem", fontWeight: "bold" }}>
                  {stats.totalStaff}
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
                <UserCheck size={24} style={{ color: "#10b981" }} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    marginBottom: "0.25rem",
                  }}
                >
                  Verified
                </p>
                <p style={{ fontSize: "1.75rem", fontWeight: "bold" }}>
                  {stats.verifiedUsers}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  padding: "0.75rem",
                  background: "rgba(245, 158, 11, 0.1)",
                  borderRadius: "8px",
                }}
              >
                <UserX size={24} style={{ color: "#f59e0b" }} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    marginBottom: "0.25rem",
                  }}
                >
                  Unverified
                </p>
                <p style={{ fontSize: "1.75rem", fontWeight: "bold" }}>
                  {stats.unverifiedUsers}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  padding: "0.75rem",
                  background: "rgba(139, 92, 246, 0.1)",
                  borderRadius: "8px",
                }}
              >
                <TrendingUp size={24} style={{ color: "#8b5cf6" }} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    marginBottom: "0.25rem",
                  }}
                >
                  Residents
                </p>
                <p style={{ fontSize: "1.75rem", fontWeight: "bold" }}>
                  {stats.totalResidents}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div
          className="card"
          style={{ marginBottom: "1.5rem", padding: "1.5rem" }}
        >
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                }}
              >
                Filter by Role:
              </label>
              <select
                className="input"
                value={filter.role || ""}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    role: e.target.value || undefined,
                  }))
                }
                style={{ width: "auto" }}
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                <option value="resident">Resident</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                }}
              >
                Filter by Status:
              </label>
              <select
                className="input"
                value={
                  filter.isVerified === undefined
                    ? ""
                    : filter.isVerified
                    ? "verified"
                    : "unverified"
                }
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    isVerified:
                      e.target.value === ""
                        ? undefined
                        : e.target.value === "verified",
                  }))
                }
                style={{ width: "auto" }}
              >
                <option value="">All Status</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>

            {(filter.role || filter.isVerified !== undefined) && (
              <button
                className="btn btn-secondary"
                onClick={() => setFilter({})}
                style={{ marginTop: "auto" }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* User Management Table */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              marginBottom: "1.5rem",
            }}
          >
            User Management
          </h2>
          <UserManagementTable
            users={users}
            onUpdateRole={handleUpdateRole}
            onVerifyUser={handleVerifyUser}
            onDeleteUser={handleDeleteUser}
          />
        </div>

        {/* Create Staff/Admin Modal */}
        <CreateStaffAdminModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
