import React, { useState } from "react";
import { Download, Trash2, UserPlus } from "lucide-react";
import api from "../services/apiExtensions";
import { toast } from "../utils/toast";

interface BulkActionsProps {
  selectedIds: string[];
  onActionComplete: () => void;
  type: "complaints" | "services";
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedIds,
  onActionComplete,
  type,
}) => {
  const [isAssigning, setIsAssigning] = useState(false);
  const [showStaffSelect, setShowStaffSelect] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [staffList, setStaffList] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const loadStaffList = async () => {
    try {
      const response = await api.getAllUsers({ role: "staff" });
      setStaffList(response.data.users || []);
    } catch (error) {
      toast.error("Failed to load staff list");
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} ${type}?`)) return;

    try {
      if (type === "complaints") {
        await api.bulkDeleteComplaints(selectedIds);
      } else {
        // Implement bulk delete for services if needed
        toast.error("Bulk delete for services not implemented");
        return;
      }

      toast.success(`${selectedIds.length} ${type} deleted successfully`);
      onActionComplete();
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to delete ${type}`);
    }
  };

  const handleBulkAssign = async () => {
    if (!selectedStaff) {
      toast.error("Please select a staff member");
      return;
    }

    setIsAssigning(true);
    try {
      await api.bulkAssignComplaints(selectedIds, selectedStaff);
      toast.success(`${selectedIds.length} ${type} assigned successfully`);
      setShowStaffSelect(false);
      setSelectedStaff("");
      onActionComplete();
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to assign ${type}`);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleExport = async (format: "csv" | "excel") => {
    setIsExporting(true);
    try {
      const res = await api.exportComplaints(format, {
        ids: selectedIds,
      });

      const blob = res.data;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}-export-${Date.now()}.${
        format === "csv" ? "csv" : "xlsx"
      }`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`${type} exported successfully`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to export ${type}`);
    } finally {
      setIsExporting(false);
    }
  };

  const openStaffSelect = () => {
    loadStaffList();
    setShowStaffSelect(true);
  };

  if (selectedIds.length === 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-blue-900">
          {selectedIds.length} {type} selected
        </span>

        <div className="flex gap-2">
          <button
            onClick={openStaffSelect}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <UserPlus className="w-4 h-4" />
            Assign
          </button>

          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>

          <div className="relative">
            <button
              onClick={() => handleExport("csv")}
              disabled={isExporting}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          <button
            onClick={() => handleExport("excel")}
            disabled={isExporting}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
        </div>
      </div>

      {showStaffSelect && (
        <div className="mt-4 flex items-center gap-2">
          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select staff member...</option>
            {staffList.map((staff) => (
              <option key={staff._id} value={staff._id}>
                {staff.name} ({staff.email})
              </option>
            ))}
          </select>

          <button
            onClick={handleBulkAssign}
            disabled={isAssigning || !selectedStaff}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isAssigning ? "Assigning..." : "Confirm"}
          </button>

          <button
            onClick={() => {
              setShowStaffSelect(false);
              setSelectedStaff("");
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default BulkActions;
