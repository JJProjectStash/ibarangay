import { useState, useEffect } from "react";
import { Trash2, Download, UserPlus } from "lucide-react";
import api from "../services/api";
import { showToast } from "../utils/toast";

interface BulkActionsProps {
  selectedIds: string[];
  onActionComplete: () => void;
  onClearSelection: () => void;
  type: "complaints" | "services" | "events";
}

interface StaffMember {
  _id: string;
  firstName: string;
  lastName: string;
  role: string;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedIds,
  onActionComplete,
  onClearSelection,
  type,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [selectedStaff, setSelectedStaff] = useState("");

  useEffect(() => {
    if (showAssignModal && type === "complaints") {
      fetchStaffMembers();
    }
  }, [showAssignModal, type]);

  const fetchStaffMembers = async () => {
    try {
      const response = await api.getAllUsers({ role: "staff" });
      setStaffMembers(response.data);
    } catch (error) {
      console.error("Failed to fetch staff members:", error);
      showToast("Failed to load staff members", "error");
    }
  };

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.length} ${type}?`
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);
      if (type === "complaints") {
        await api.bulkDeleteComplaints(selectedIds);
      }
      showToast(
        `Successfully deleted ${selectedIds.length} ${type}`,
        "success"
      );
      onActionComplete();
      onClearSelection();
    } catch (error) {
      console.error("Bulk delete failed:", error);
      showToast(`Failed to delete ${type}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkAssign = async () => {
    if (!selectedStaff) {
      showToast("Please select a staff member", "error");
      return;
    }

    try {
      setIsLoading(true);
      await api.bulkAssignComplaints(selectedIds, selectedStaff);
      showToast(
        `Successfully assigned ${selectedIds.length} complaints`,
        "success"
      );
      setShowAssignModal(false);
      onActionComplete();
      onClearSelection();
    } catch (error) {
      console.error("Bulk assign failed:", error);
      showToast("Failed to assign complaints", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (format: "csv" | "excel") => {
    try {
      setIsLoading(true);
      const blob = await api.exportComplaints(format, {
        ids: selectedIds,
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}-export.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast(`Exported ${selectedIds.length} ${type}`, "success");
    } catch (error) {
      console.error("Export failed:", error);
      showToast("Failed to export data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedIds.length === 0) {
    return null;
  }

  return (
    <>
      <div
        className="card"
        style={{
          position: "fixed",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          minWidth: "400px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
      >
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>{selectedIds.length}</strong> items selected
            </div>
            <div className="btn-group">
              {type === "complaints" && (
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setShowAssignModal(true)}
                  disabled={isLoading}
                >
                  <UserPlus size={16} className="me-1" />
                  Assign
                </button>
              )}
              <button
                className="btn btn-sm btn-outline-success"
                onClick={() => handleExport("csv")}
                disabled={isLoading}
              >
                <Download size={16} className="me-1" />
                Export CSV
              </button>
              <button
                className="btn btn-sm btn-outline-success"
                onClick={() => handleExport("excel")}
                disabled={isLoading}
              >
                <Download size={16} className="me-1" />
                Export Excel
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={handleBulkDelete}
                disabled={isLoading}
              >
                <Trash2 size={16} className="me-1" />
                Delete
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={onClearSelection}
                disabled={isLoading}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Assign to Staff Member</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAssignModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Select Staff Member</label>
                  <select
                    className="form-select"
                    value={selectedStaff}
                    onChange={(e) => setSelectedStaff(e.target.value)}
                  >
                    <option value="">Choose...</option>
                    {staffMembers.map((staff) => (
                      <option key={staff._id} value={staff._id}>
                        {staff.firstName} {staff.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-muted small">
                  This will assign {selectedIds.length} complaints to the
                  selected staff member.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAssignModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleBulkAssign}
                  disabled={isLoading || !selectedStaff}
                >
                  {isLoading ? "Assigning..." : "Assign"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActions;
