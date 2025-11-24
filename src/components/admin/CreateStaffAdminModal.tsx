import React, { useState } from "react";
import { X } from "lucide-react";
import api from "../../services/apiExtensions";
import { showToast } from "../../utils/toast";

interface CreateStaffAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateStaffAdminModal: React.FC<CreateStaffAdminModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    address: "",
    phoneNumber: "",
    role: "staff" as "admin" | "staff",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      await api.createStaffAdmin(formData);
      showToast(
        `${
          formData.role === "admin" ? "Admin" : "Staff"
        } account created successfully`,
        "success"
      );
      onSuccess();
      onClose();
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        address: "",
        phoneNumber: "",
        role: "staff",
      });
    } catch (err) {
      console.error(err);
      showToast("Failed to create account", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          maxWidth: "600px",
          width: "100%",
          margin: "1rem",
          maxHeight: "90vh",
          overflow: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2 className="text-2xl font-bold">Create Staff/Admin Account</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label className="form-label">Role *</label>
              <select
                className="input"
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as "admin" | "staff",
                  })
                }
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div>
                <label className="form-label">First Name *</label>
                <input
                  type="text"
                  className={`input ${errors.firstName ? "input-error" : ""}`}
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
                {errors.firstName && (
                  <p className="form-error">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="form-label">Last Name *</label>
                <input
                  type="text"
                  className={`input ${errors.lastName ? "input-error" : ""}`}
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
                {errors.lastName && (
                  <p className="form-error">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="form-label">Email *</label>
              <input
                type="email"
                className={`input ${errors.email ? "input-error" : ""}`}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div>
              <label className="form-label">Password *</label>
              <input
                type="password"
                className={`input ${errors.password ? "input-error" : ""}`}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              {errors.password && (
                <p className="form-error">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                className={`input ${errors.phoneNumber ? "input-error" : ""}`}
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
              />
              {errors.phoneNumber && (
                <p className="form-error">{errors.phoneNumber}</p>
              )}
            </div>

            <div>
              <label className="form-label">Address *</label>
              <textarea
                className={`input ${errors.address ? "input-error" : ""}`}
                rows={3}
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
              {errors.address && <p className="form-error">{errors.address}</p>}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              justifyContent: "flex-end",
              marginTop: "1.5rem",
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStaffAdminModal;
