import { useState } from "react";
import { Filter, X, Calendar } from "lucide-react";

export interface FilterConfig {
  status?: string[];
  priority?: string[];
  category?: string[];
  dateRange?: { start: string; end: string };
  assignedTo?: string;
  createdBy?: string;
}

interface AdvancedFiltersProps {
  filters: FilterConfig;
  onFiltersChange: (filters: FilterConfig) => void;
  availableCategories?: string[];
  availableStaff?: Array<{ id: string; name: string }>;
}

const AdvancedFilters = ({
  filters,
  onFiltersChange,
  availableCategories = [],
  availableStaff = [],
}: AdvancedFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof FilterConfig, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleArrayFilterToggle = (
    key: "status" | "priority" | "category",
    value: string
  ) => {
    const currentValues = filters[key] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    handleFilterChange(key, newValues.length > 0 ? newValues : undefined);
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) =>
      value !== undefined && (Array.isArray(value) ? value.length > 0 : true)
  );

  return (
    <div className="card mb-4">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Filter size={18} className="me-2" />
            <h6 className="mb-0">Advanced Filters</h6>
            {hasActiveFilters && (
              <span className="badge badge-primary ms-2">Active</span>
            )}
          </div>
          <div className="d-flex gap-2">
            {hasActiveFilters && (
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={clearAllFilters}
              >
                <X size={16} className="me-1" />
                Clear All
              </button>
            )}
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Collapse" : "Expand"}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="card-body">
          <div className="row g-3">
            {/* Status Filter */}
            <div className="col-md-3">
              <label className="form-label fw-semibold">Status</label>
              <div className="d-flex flex-column gap-2">
                {["pending", "in-progress", "resolved", "closed"].map(
                  (status) => (
                    <div key={status} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`status-${status}`}
                        checked={filters.status?.includes(status) || false}
                        onChange={() =>
                          handleArrayFilterToggle("status", status)
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`status-${status}`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </label>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Priority Filter */}
            <div className="col-md-3">
              <label className="form-label fw-semibold">Priority</label>
              <div className="d-flex flex-column gap-2">
                {["low", "medium", "high"].map((priority) => (
                  <div key={priority} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`priority-${priority}`}
                      checked={filters.priority?.includes(priority) || false}
                      onChange={() =>
                        handleArrayFilterToggle("priority", priority)
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`priority-${priority}`}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            {availableCategories.length > 0 && (
              <div className="col-md-3">
                <label className="form-label fw-semibold">Category</label>
                <div
                  className="d-flex flex-column gap-2"
                  style={{ maxHeight: "150px", overflowY: "auto" }}
                >
                  {availableCategories.map((category) => (
                    <div key={category} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`category-${category}`}
                        checked={filters.category?.includes(category) || false}
                        onChange={() =>
                          handleArrayFilterToggle("category", category)
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`category-${category}`}
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Staff Assignment Filter */}
            {availableStaff.length > 0 && (
              <div className="col-md-3">
                <label className="form-label fw-semibold">Assigned To</label>
                <select
                  className="form-select"
                  value={filters.assignedTo || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "assignedTo",
                      e.target.value || undefined
                    )
                  }
                >
                  <option value="">All Staff</option>
                  {availableStaff.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Date Range Filter */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                <Calendar size={16} className="me-1" />
                Date Range
              </label>
              <div className="row g-2">
                <div className="col-6">
                  <input
                    type="date"
                    className="form-control"
                    placeholder="Start Date"
                    value={filters.dateRange?.start || ""}
                    onChange={(e) =>
                      handleFilterChange("dateRange", {
                        ...filters.dateRange,
                        start: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-6">
                  <input
                    type="date"
                    className="form-control"
                    placeholder="End Date"
                    value={filters.dateRange?.end || ""}
                    onChange={(e) =>
                      handleFilterChange("dateRange", {
                        ...filters.dateRange,
                        end: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
