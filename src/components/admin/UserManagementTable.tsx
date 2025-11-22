import React, { useState } from "react";
import { UserManagement } from "../../types/admin";
import { Shield, CheckCircle, XCircle, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";

interface UserManagementTableProps {
  users: UserManagement[];
  onUpdateRole: (userId: string, role: string) => void;
  onVerifyUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onUpdate?: () => void;
}

const UserManagementTable: React.FC<UserManagementTableProps> = ({
  users,
  onUpdateRole,
  onVerifyUser,
  onDeleteUser,
  onUpdate,
}) => {
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");

  const handleRoleChange = (userId: string, currentRole: string) => {
    setEditingUserId(userId);
    setSelectedRole(currentRole);
  };

  const handleSaveRole = (userId: string) => {
    onUpdateRole(userId, selectedRole);
    setEditingUserId(null);
    if (onUpdate) onUpdate();
  };

  const getRoleBadgeStyle = (role: string) => {
    const styles: Record<string, React.CSSProperties> = {
      admin: {
        background: "rgba(239, 68, 68, 0.1)",
        color: "#ef4444",
        padding: "0.25rem 0.75rem",
        borderRadius: "12px",
        fontSize: "0.875rem",
        fontWeight: "600",
      },
      staff: {
        background: "rgba(59, 130, 246, 0.1)",
        color: "#3b82f6",
        padding: "0.25rem 0.75rem",
        borderRadius: "12px",
        fontSize: "0.875rem",
        fontWeight: "600",
      },
      resident: {
        background: "rgba(16, 185, 129, 0.1)",
        color: "#10b981",
        padding: "0.25rem 0.75rem",
        borderRadius: "12px",
        fontSize: "0.875rem",
        fontWeight: "600",
      },
    };
    return styles[role] || styles.resident;
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--border)" }}>
            <th
              style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}
            >
              User
            </th>
            <th
              style={{ padding: "1rem", textAlign: "left", fontWeight: "600" }}
            >
              Email
            </th>
            <th
              style={{
                padding: "1rem",
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              Role
            </th>
            <th
              style={{
                padding: "1rem",
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              Status
            </th>
            <th
              style={{
                padding: "1rem",
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              Joined
            </th>
            <th
              style={{
                padding: "1rem",
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              style={{
                borderBottom: "1px solid var(--border)",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0,0,0,0.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <td style={{ padding: "1rem" }}>
                <div>
                  <div style={{ fontWeight: "600" }}>
                    {user.firstName} {user.lastName}
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {user.phoneNumber}
                  </div>
                </div>
              </td>
              <td style={{ padding: "1rem" }}>{user.email}</td>
              <td style={{ padding: "1rem", textAlign: "center" }}>
                {editingUserId === user.id ? (
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      justifyContent: "center",
                    }}
                  >
                    <select
                      className="input"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      style={{ width: "auto", padding: "0.25rem 0.5rem" }}
                    >
                      <option value="resident">Resident</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleSaveRole(user.id)}
                      style={{
                        padding: "0.25rem 0.75rem",
                        fontSize: "0.875rem",
                      }}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setEditingUserId(null)}
                      style={{
                        padding: "0.25rem 0.75rem",
                        fontSize: "0.875rem",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <span style={getRoleBadgeStyle(user.role)}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                    <button
                      onClick={() => handleRoleChange(user.id, user.role)}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: "0.25rem",
                        display: "flex",
                        alignItems: "center",
                      }}
                      title="Edit role"
                    >
                      <Edit
                        size={16}
                        style={{ color: "var(--text-secondary)" }}
                      />
                    </button>
                  </div>
                )}
              </td>
              <td style={{ padding: "1rem", textAlign: "center" }}>
                {user.isVerified ? (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      color: "#10b981",
                    }}
                  >
                    <CheckCircle size={16} />
                    Verified
                  </span>
                ) : (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      color: "#f59e0b",
                    }}
                  >
                    <XCircle size={16} />
                    Unverified
                  </span>
                )}
              </td>
              <td
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  fontSize: "0.875rem",
                }}
              >
                {format(new Date(user.createdAt), "MMM dd, yyyy")}
              </td>
              <td style={{ padding: "1rem" }}>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    justifyContent: "center",
                  }}
                >
                  {!user.isVerified && (
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        onVerifyUser(user.id);
                        if (onUpdate) onUpdate();
                      }}
                      style={{
                        padding: "0.5rem 0.75rem",
                        fontSize: "0.875rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                      title="Verify user"
                    >
                      <Shield size={16} />
                      Verify
                    </button>
                  )}
                  <button
                    className="btn"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete ${user.firstName} ${user.lastName}?`
                        )
                      ) {
                        onDeleteUser(user.id);
                        if (onUpdate) onUpdate();
                      }
                    }}
                    style={{
                      padding: "0.5rem 0.75rem",
                      fontSize: "0.875rem",
                      background: "rgba(239, 68, 68, 0.1)",
                      color: "#ef4444",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                    title="Delete user"
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
  );
};

export default UserManagementTable;
