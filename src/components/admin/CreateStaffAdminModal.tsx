import React, { useState } from "react";
import { UserPlus, X } from "lucide-react";
import api from "../../services/api";
import { showSuccessToast, showErrorToast } from "../Toast";
import { getErrorMessage } from "../../utils/errorHandler";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phoneNumber: "",
    role: "staff" as "admin" | "staff",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      showErrorToast("Please fix the form errors");
      return;
    }

    setIsSubmitting(true);
    try {
      const { confirmPassword, ...submitData } = formData;
      await api.createStaffAdmin(submitData);
      showSuccessToast(
        `${
          formData.role.charAt(0).toUpperCase() + formData.role.slice(1)
        } account created successfully!`
      );
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        address: "",
        phoneNumber: "",
        role: "staff",
      });
      setErrors({});
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create account:", error);
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

  if (!isOpen) return null;

  return (
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
      onClick={() => !isSubmitting && onClose()}
    >
      <div
        className="card"
        style={{
          maxWidth: "600px",
          width: "100%",
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
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            <UserPlus
              size={24}
              style={{ display: "inline", marginRight: "0.5rem" }}
            />
            Create Staff/Admin Account
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
            }}
          >
            <X size={24} />
          </button>
        </div>

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
              Role *
            </label>
            <select
              className="input"
              value={formData.role}
              onChange={(e) =>
                handleInputChange("role", e.target.value as "admin" | "staff")
              }
              disabled={isSubmitting}
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
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                }}
              >
                First Name *
              </label>
              <input
                className="input"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                disabled={isSubmitting}
              />
              {errors.firstName && (
                <p
                  style={{
                    color: "var(--error)",
                    fontSize: "0.85rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {errors.firstName}
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
                Last Name *
              </label>
              <input
                className="input"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                disabled={isSubmitting}
              />
              {errors.lastName && (
                <p
                  style={{
                    color: "var(--error)",
                    fontSize: "0.85rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Email *
            </label>
            <input
              type="email"
              className="input"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p
                style={{
                  color: "var(--error)",
                  fontSize: "0.85rem",
                  marginTop: "0.25rem",
                }}
              >
                {errors.email}
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
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                }}
              >
                Password *
              </label>
              <input
                type="password"
                className="input"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                disabled={isSubmitting}
              />
              {errors.password && (
                <p
                  style={{
                    color: "var(--error)",
                    fontSize: "0.85rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {errors.password}
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
                Confirm Password *
              </label>
              <input
                type="password"
                className="input"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                disabled={isSubmitting}
              />
              {errors.confirmPassword && (
                <p
                  style={{
                    color: "var(--error)",
                    fontSize: "0.85rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Phone Number *
            </label>
            <input
              type="tel"
              className="input"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              disabled={isSubmitting}
              placeholder="09XXXXXXXXX"
            />
            {errors.phoneNumber && (
              <p
                style={{
                  color: "var(--error)",
                  fontSize: "0.85rem",
                  marginTop: "0.25rem",
                }}
              >
                {errors.phoneNumber}
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
              Address *
            </label>
            <textarea
              className="input"
              rows={3}
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              disabled={isSubmitting}
            />
            {errors.address && (
              <p
                style={{
                  color: "var(--error)",
                  fontSize: "0.85rem",
                  marginTop: "0.25rem",
                }}
              >
                {errors.address}
              </p>
            )}
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Account"}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              style={{ flex: 1 }}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStaffAdminModal;
