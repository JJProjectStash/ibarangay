import React, { useState } from "react";
import {
  CheckSquare,
  Square,
  Trash2,
  UserPlus,
  RefreshCw,
  Download,
  X,
} from "lucide-react";
import api from "../services/api";
import { showSuccessToast, showErrorToast } from "./Toast";
import { getErrorMessage } from "../utils/errorHandler";

interface BulkActionsProps {
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onActionComplete: () => void;
  totalItems: number;
  itemType: "complaints" | "services";
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedIds,
  onSelectionChange,
  onActionComplete,
  totalItems,
  itemType,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [staffMembers, setStaffMembers] = useState<any[]>([]);

  const hasSelection = selectedIds.length > 0;
  const isAllSelected = selectedIds.length === totalItems && totalItems > 0;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelectionChange([]);
    } else {
      // This would need to be implemented to select all IDs
      // For now, we'll just clear selection
      onSelectionChange([]);
    }
  };

  const handleBulkStatusUpdate = async () => {
    if (!newStatus) {
      showErrorToast("Please select a status");
      return;
    }

    setIsProcessing(true);
    try {
      await api.bulkUpdateComplaintStatus(selectedIds, newStatus);
      showSuccessToast(
        `Successfully updated ${selectedIds.length} ${itemType}`
      );
      setShowStatusModal(false);
      setNewStatus("");
      onSelectionChange([]);
      onActionComplete();
    } catch (error) {
      console.error("Bulk status update failed:", error);
      showErrorToast(getErrorMessage(error));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkAssign = async () => {
    if (!assignTo) {
      showErrorToast("Please select a staff member");
      return;
    }

    setIsProcessing(true);
    try {
      await api.bulkAssignComplaints(selectedIds, assignTo);
      showSuccessToast(
        `Successfully assigned ${selectedIds.length} ${itemType}`
      );
      setShowAssignModal(false);
      setAssignTo("");
      onSelectionChange([]);
      onActionComplete();
    } catch (error) {
      console.error("Bulk assign failed:", error);
      showErrorToast(getErrorMessage(error));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.length} ${itemType}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsProcessing(true);
    try {
      await api.bulkDeleteComplaints(selectedIds);
      showSuccessToast(
        `Successfully deleted ${selectedIds.length} ${itemType}`
      );
      onSelectionChange([]);
      onActionComplete();
    } catch (error) {
      console.error("Bulk delete failed:", error);
      showErrorToast(getErrorMessage(error));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = async (format: "csv" | "excel") => {
    setIsProcessing(true);
    try {
      const blob = await api.exportComplaints(format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${itemType}_export_${
        new Date().toISOString().split("T")[0]
      }.${format === "csv" ? "csv" : "xlsx"}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showSuccessToast(
        `Successfully exported ${itemType} to ${format.toUpperCase()}`
      );
    } catch (error) {
      console.error("Export failed:", error);
      showErrorToast(getErrorMessage(error));
    } finally {
      setIsProcessing(false);
    }
  };

  if (!hasSelection) {
    return (
      <div
        className="card"
        style={{
          padding: "1rem",
          marginBottom: "1rem",
          backgroundColor: "var(--background-secondary)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleSelectAll}
              disabled={totalItems === 0}
            >
              <Square size={18} />
              Select All
            </button>
            <span className="text-sm text-secondary">
              {totalItems} {itemType} total
            </span>
          </div>
          <div className="flex gap-2">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => handleExport("csv")}
              disabled={isProcessing || totalItems === 0}
            >
              <Download size={16} />
              Export CSV
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => handleExport("excel")}
              disabled={isProcessing || totalItems === 0}
            >
              <Download size={16} />
              Export Excel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="card"
        style={{
          padding: "1rem",
          marginBottom: "1rem",
          backgroundColor: "var(--primary-50)",
          border: "2px solid var(--primary-500)",
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => onSelectionChange([])}
            >
              <X size={18} />
            </button>
            <span className="font-medium">
              {selectedIds.length} {itemType} selected
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setShowStatusModal(true)}
              disabled={isProcessing}
            >
              <RefreshCw size={16} />
              Update Status
            </button>
            {itemType === "complaints" && (
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setShowAssignModal(true)}
                disabled={isProcessing}
              >
                <UserPlus size={16} />
                Assign
              </button>
            )}
            <button
              className="btn btn-danger btn-sm"
              onClick={handleBulkDelete}
              disabled={isProcessing}
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
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
          onClick={() => setShowStatusModal(false)}
        >
          <div
            className="card"
            style={{ maxWidth: "400px", width: "100%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="text-xl font-semibold"
              style={{ marginBottom: "1rem" }}
            >
              Update Status
            </h3>
            <p
              className="text-sm text-secondary"
              style={{ marginBottom: "1rem" }}
            >
              Update status for {selectedIds.length} selected {itemType}
            </p>
            <div style={{ marginBottom: "1.5rem" }}>
              <label className="form-label">New Status</label>
              <select
                className="input"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="">Select status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={handleBulkStatusUpdate}
                disabled={isProcessing}
              >
                {isProcessing ? "Updating..." : "Update"}
              </button>
              <button
                className="btn btn-outline"
                style={{ flex: 1 }}
                onClick={() => setShowStatusModal(false)}
                disabled={isProcessing}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && (
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
          onClick={() => setShowAssignModal(false)}
        >
          <div
            className="card"
            style={{ maxWidth: "400px", width: "100%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="text-xl font-semibold"
              style={{ marginBottom: "1rem" }}
            >
              Assign to Staff
            </h3>
            <p
              className="text-sm text-secondary"
              style={{ marginBottom: "1rem" }}
            >
              Assign {selectedIds.length} selected {itemType} to a staff member
            </p>
            <div style={{ marginBottom: "1.5rem" }}>
              <label className="form-label">Staff Member</label>
              <select
                className="input"
                value={assignTo}
                onChange={(e) => setAssignTo(e.target.value)}
              >
                <option value="">Select staff member</option>
                {staffMembers.map((staff) => (
                  <option key={staff._id} value={staff._id}>
                    {staff.firstName} {staff.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={handleBulkAssign}
                disabled={isProcessing}
              >
                {isProcessing ? "Assigning..." : "Assign"}
              </button>
              <button
                className="btn btn-outline"
                style={{ flex: 1 }}
                onClick={() => setShowAssignModal(false)}
                disabled={isProcessing}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActions;
