import { useState, useEffect } from "react";
import { Save, Plus, Trash2, Settings } from "lucide-react";
import api from "../../services/apiExtensions";
import LoadingSpinner from "../../components/LoadingSpinner";
import { showToast } from "../../utils/toast";

const SystemConfig = () => {
  const [loading, setLoading] = useState(true);
  const [complaintCategories, setComplaintCategories] = useState<string[]>([]);
  const [serviceItemTypes, setServiceItemTypes] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [newItemType, setNewItemType] = useState("");

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const [categoriesRes, itemTypesRes] = await Promise.all([
        api.getComplaintCategories(),
        api.getServiceItemTypes(),
      ]);

      // backend returns { success: boolean, data: [...] }
      setComplaintCategories(categoriesRes.data?.data || []);
      setServiceItemTypes(itemTypesRes.data?.data || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch configuration", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      showToast("Please enter a category name", "error");
      return;
    }

    if (complaintCategories.includes(newCategory.trim())) {
      showToast("Category already exists", "error");
      return;
    }

    setComplaintCategories([...complaintCategories, newCategory.trim()]);
    setNewCategory("");
  };

  const handleRemoveCategory = (category: string) => {
    setComplaintCategories(complaintCategories.filter((c) => c !== category));
  };

  const handleAddItemType = () => {
    if (!newItemType.trim()) {
      showToast("Please enter an item type", "error");
      return;
    }

    if (serviceItemTypes.includes(newItemType.trim())) {
      showToast("Item type already exists", "error");
      return;
    }

    setServiceItemTypes([...serviceItemTypes, newItemType.trim()]);
    setNewItemType("");
  };

  const handleRemoveItemType = (itemType: string) => {
    setServiceItemTypes(serviceItemTypes.filter((t) => t !== itemType));
  };

  const handleSaveCategories = async () => {
    try {
      await api.updateComplaintCategories(complaintCategories);
      showToast("Complaint categories updated successfully", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to update complaint categories", "error");
    }
  };

  const handleSaveItemTypes = async () => {
    try {
      await api.updateServiceItemTypes(serviceItemTypes);
      showToast("Service item types updated successfully", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to update service item types", "error");
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="container-fluid py-4">
      <div className="page-header mb-4">
        <div className="d-flex align-items-center">
          <Settings size={32} className="me-3" />
          <div>
            <h1 className="h3 mb-2">System Configuration</h1>
            <p className="text-muted">
              Manage system settings and configurations
            </p>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Complaint Categories */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Complaint Categories</h5>
              <button
                className="btn btn-sm btn-primary"
                onClick={handleSaveCategories}
              >
                <Save size={16} className="me-1" />
                Save
              </button>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Add New Category</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter category name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleAddCategory();
                      }
                    }}
                  />
                  <button
                    className="btn btn-outline-primary"
                    onClick={handleAddCategory}
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              <div className="list-group">
                {complaintCategories.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    No categories configured
                  </div>
                ) : (
                  complaintCategories.map((category, index) => (
                    <div
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span>{category}</span>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRemoveCategory(category)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {complaintCategories.length > 0 && (
                <div className="mt-3">
                  <small className="text-muted">
                    Total: {complaintCategories.length} categories
                  </small>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Service Item Types */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Service Item Types</h5>
              <button
                className="btn btn-sm btn-primary"
                onClick={handleSaveItemTypes}
              >
                <Save size={16} className="me-1" />
                Save
              </button>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Add New Item Type</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter item type"
                    value={newItemType}
                    onChange={(e) => setNewItemType(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleAddItemType();
                      }
                    }}
                  />
                  <button
                    className="btn btn-outline-primary"
                    onClick={handleAddItemType}
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              <div className="list-group">
                {serviceItemTypes.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    No item types configured
                  </div>
                ) : (
                  serviceItemTypes.map((itemType, index) => (
                    <div
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span>{itemType}</span>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRemoveItemType(itemType)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {serviceItemTypes.length > 0 && (
                <div className="mt-3">
                  <small className="text-muted">
                    Total: {serviceItemTypes.length} item types
                  </small>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">System Information</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="border rounded p-3">
                    <p className="text-muted mb-1">System Version</p>
                    <h5 className="mb-0">v2.0.0</h5>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="border rounded p-3">
                    <p className="text-muted mb-1">Environment</p>
                    <h5 className="mb-0">Production</h5>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="border rounded p-3">
                    <p className="text-muted mb-1">Last Updated</p>
                    <h5 className="mb-0">{new Date().toLocaleDateString()}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Guidelines */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Configuration Guidelines</h5>
            </div>
            <div className="card-body">
              <div className="alert alert-info">
                <h6 className="alert-heading">Important Notes:</h6>
                <ul className="mb-0">
                  <li>
                    Changes to complaint categories and service item types will
                    be reflected immediately across the system.
                  </li>
                  <li>
                    Removing a category or item type that is currently in use
                    may affect existing records.
                  </li>
                  <li>
                    It's recommended to archive rather than delete categories
                    with historical data.
                  </li>
                  <li>
                    Always click the "Save" button after making changes to
                    persist your configuration.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemConfig;
