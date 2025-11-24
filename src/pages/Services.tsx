import React, { useState, useEffect } from "react";
import {
  Plus,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Settings,
} from "lucide-react";
import api from "../services/apiExtensions";
import { Service } from "../types";
import { format } from "date-fns";
import { showSuccessToast, showErrorToast } from "../components/Toast";
import { getErrorMessage } from "../utils/errorHandler";
import { validators, getValidationMessage } from "../utils/validators";
import { useAuth } from "../context/AuthContext";

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showItemTypeModal, setShowItemTypeModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [itemTypes, setItemTypes] = useState<string[]>([]);
  const [newItemTypes, setNewItemTypes] = useState<string>("");
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    itemName: "",
    itemType: "",
    borrowDate: "",
    expectedReturnDate: "",
    purpose: "",
    quantity: 1,
    notes: "",
  });

  useEffect(() => {
    fetchServices();
    fetchItemTypes();
  }, []);

  const fetchItemTypes = async () => {
    try {
      const response = await api.getServiceItemTypes();
      setItemTypes(response.data || []);
    } catch (error) {
      console.error("Failed to fetch item types:", error);
    }
  };

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const response = await api.getServiceRequests();
      const servicesData = Array.isArray(response.data) ? response.data : [];
      setServices(servicesData);
    } catch (error) {
      console.error("Failed to fetch services:", error);
      showErrorToast(getErrorMessage(error));
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateItemTypes = async () => {
    try {
      const itemTypeArray = newItemTypes
        .split(",")
        .map((type) => type.trim())
        .filter((type) => type.length > 0);

      if (itemTypeArray.length === 0) {
        showErrorToast("Please enter at least one item type");
        return;
      }

      await api.updateServiceItemTypes(itemTypeArray);
      showSuccessToast("Item types updated successfully!");
      setShowItemTypeModal(false);
      setNewItemTypes("");
      fetchItemTypes();
    } catch (error) {
      console.error("Failed to update item types:", error);
      showErrorToast(getErrorMessage(error));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validators.required(formData.itemName)) {
      newErrors.itemName = getValidationMessage("Item name", "required");
    }

    if (!validators.required(formData.itemType)) {
      newErrors.itemType = getValidationMessage("Item type", "required");
    }

    if (!validators.required(formData.borrowDate)) {
      newErrors.borrowDate = getValidationMessage("Borrow date", "required");
    }

    if (!validators.required(formData.expectedReturnDate)) {
      newErrors.expectedReturnDate = getValidationMessage(
        "Expected return date",
        "required"
      );
    }

    // Validate that expected return date is after borrow date
    if (formData.borrowDate && formData.expectedReturnDate) {
      const borrowDate = new Date(formData.borrowDate);
      const returnDate = new Date(formData.expectedReturnDate);
      if (returnDate <= borrowDate) {
        newErrors.expectedReturnDate =
          "Expected return date must be after borrow date";
      }
    }

    if (!validators.required(formData.purpose)) {
      newErrors.purpose = getValidationMessage("Purpose", "required");
    }

    if (!validators.isPositiveNumber(formData.quantity.toString())) {
      newErrors.quantity = "Quantity must be a positive number";
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
      await api.createServiceRequest(formData);
      showSuccessToast("Service request submitted successfully!");
      setShowModal(false);
      setFormData({
        itemName: "",
        itemType: "",
        borrowDate: "",
        expectedReturnDate: "",
        purpose: "",
        quantity: 1,
        notes: "",
      });
      setErrors({});
      fetchServices();
    } catch (error) {
      console.error("Failed to create service request:", error);
      showErrorToast(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { class: string; icon: JSX.Element }> = {
      pending: {
        class: "badge-pending",
        icon: <Clock size={14} />,
      },
      approved: {
        class: "badge-approved",
        icon: <CheckCircle size={14} />,
      },
      borrowed: {
        class: "badge-info",
        icon: <Package size={14} />,
      },
      returned: {
        class: "badge-success",
        icon: <CheckCircle size={14} />,
      },
      rejected: {
        class: "badge-rejected",
        icon: <XCircle size={14} />,
      },
    };
    return badges[status] || badges.pending;
  };

  const canEditItemTypes = user?.role === "admin" || user?.role === "staff";

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div className="spinner" />
        <p style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>
          Loading services...
        </p>
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
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
            Borrow & Return Services
          </h1>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {canEditItemTypes && (
              <button
                className="btn btn-outline"
                onClick={() => {
                  setNewItemTypes(itemTypes.join(", "));
                  setShowItemTypeModal(true);
                }}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Settings size={18} /> Manage Item Types
              </button>
            )}
            <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              <Plus size={20} /> New Request
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gap: "1.5rem" }}>
          {services.length === 0 ? (
            <div
              className="card"
              style={{ textAlign: "center", padding: "3rem" }}
            >
              <Package
                size={48}
                style={{
                  margin: "0 auto 1rem",
                  color: "var(--text-secondary)",
                }}
              />
              <p style={{ color: "var(--text-secondary)" }}>
                No service requests yet
              </p>
            </div>
          ) : (
            services.map((service) => {
              const statusBadge = getStatusBadge(service.status);
              return (
                <div key={service._id} className="card">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      marginBottom: "1rem",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: "bold",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {service.itemName}
                      </h3>
                      <p
                        style={{
                          color: "var(--text-secondary)",
                          fontSize: "0.9rem",
                        }}
                      >
                        {service.itemType}
                      </p>
                    </div>
                    <span
                      className={`badge ${statusBadge.class}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      {statusBadge.icon}
                      {service.status.charAt(0).toUpperCase() +
                        service.status.slice(1)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "1rem",
                      marginTop: "1rem",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        Quantity
                      </p>
                      <p style={{ fontWeight: "500" }}>{service.quantity}</p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        Borrow Date
                      </p>
                      <p style={{ fontWeight: "500" }}>
                        {format(new Date(service.borrowDate), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        Expected Return
                      </p>
                      <p style={{ fontWeight: "500" }}>
                        {format(
                          new Date(service.expectedReturnDate),
                          "MMM dd, yyyy"
                        )}
                      </p>
                    </div>
                  </div>
                  <div style={{ marginTop: "1rem" }}>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Purpose
                    </p>
                    <p>{service.purpose}</p>
                  </div>
                  {service.notes && (
                    <div
                      style={{
                        marginTop: "1rem",
                        padding: "0.75rem",
                        background: "var(--background)",
                        borderRadius: "6px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        Notes
                      </p>
                      <p style={{ fontSize: "0.9rem" }}>{service.notes}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Item Type Management Modal */}
      {showItemTypeModal && (
        <div
          style={modalStyles.overlay}
          onClick={() => setShowItemTypeModal(false)}
        >
          <div
            className="card"
            style={modalStyles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "1.5rem",
              }}
            >
              Manage Service Item Types
            </h2>
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                }}
              >
                Item Types (comma-separated)
              </label>
              <textarea
                className="input"
                rows={4}
                value={newItemTypes}
                onChange={(e) => setNewItemTypes(e.target.value)}
                placeholder="e.g., equipment, facility, document, other"
              />
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                  marginTop: "0.5rem",
                }}
              >
                Current item types: {itemTypes.join(", ")}
              </p>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={handleUpdateItemTypes}
              >
                Update Item Types
              </button>
              <button
                className="btn btn-outline"
                style={{ flex: 1 }}
                onClick={() => setShowItemTypeModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Service Request Modal */}
      {showModal && (
        <div
          style={modalStyles.overlay}
          onClick={() => !isSubmitting && setShowModal(false)}
        >
          <div
            className="card"
            style={modalStyles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "1.5rem",
              }}
            >
              New Service Request
            </h2>
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
                  Item Name *
                </label>
                <input
                  className="input"
                  value={formData.itemName}
                  onChange={(e) =>
                    handleInputChange("itemName", e.target.value)
                  }
                  disabled={isSubmitting}
                  placeholder="e.g., Folding Chairs, Sound System"
                />
                {errors.itemName && (
                  <p
                    style={{
                      color: "var(--error)",
                      fontSize: "0.85rem",
                      marginTop: "0.25rem",
                    }}
                  >
                    {errors.itemName}
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
                  Item Type *
                </label>
                <select
                  className="input"
                  value={formData.itemType}
                  onChange={(e) =>
                    handleInputChange("itemType", e.target.value)
                  }
                  disabled={isSubmitting}
                >
                  <option value="">Select an item type</option>
                  {itemTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.itemType && (
                  <p
                    style={{
                      color: "var(--error)",
                      fontSize: "0.85rem",
                      marginTop: "0.25rem",
                    }}
                  >
                    {errors.itemType}
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
                    Borrow Date *
                  </label>
                  <input
                    type="date"
                    className="input"
                    value={formData.borrowDate}
                    onChange={(e) =>
                      handleInputChange("borrowDate", e.target.value)
                    }
                    disabled={isSubmitting}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {errors.borrowDate && (
                    <p
                      style={{
                        color: "var(--error)",
                        fontSize: "0.85rem",
                        marginTop: "0.25rem",
                      }}
                    >
                      {errors.borrowDate}
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
                    Expected Return *
                  </label>
                  <input
                    type="date"
                    className="input"
                    value={formData.expectedReturnDate}
                    onChange={(e) =>
                      handleInputChange("expectedReturnDate", e.target.value)
                    }
                    disabled={isSubmitting}
                    min={
                      formData.borrowDate ||
                      new Date().toISOString().split("T")[0]
                    }
                  />
                  {errors.expectedReturnDate && (
                    <p
                      style={{
                        color: "var(--error)",
                        fontSize: "0.85rem",
                        marginTop: "0.25rem",
                      }}
                    >
                      {errors.expectedReturnDate}
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
                  Quantity *
                </label>
                <input
                  type="number"
                  className="input"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) =>
                    handleInputChange("quantity", parseInt(e.target.value) || 1)
                  }
                  disabled={isSubmitting}
                />
                {errors.quantity && (
                  <p
                    style={{
                      color: "var(--error)",
                      fontSize: "0.85rem",
                      marginTop: "0.25rem",
                    }}
                  >
                    {errors.quantity}
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
                  Purpose *
                </label>
                <textarea
                  className="input"
                  rows={3}
                  value={formData.purpose}
                  onChange={(e) => handleInputChange("purpose", e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Describe the purpose of borrowing"
                />
                {errors.purpose && (
                  <p
                    style={{
                      color: "var(--error)",
                      fontSize: "0.85rem",
                      marginTop: "0.25rem",
                    }}
                  >
                    {errors.purpose}
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
                  Notes (Optional)
                </label>
                <textarea
                  className="input"
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Any additional information"
                />
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                  onClick={() => setShowModal(false)}
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

const modalStyles: Record<string, React.CSSProperties> = {
  overlay: {
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
  },
  modal: {
    maxWidth: "600px",
    width: "100%",
    maxHeight: "90vh",
    overflow: "auto",
  },
};

export default Services;
