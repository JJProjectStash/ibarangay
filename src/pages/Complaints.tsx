import React, { useState, useEffect } from "react";
import {
  Plus,
  MessageSquare,
  Filter,
  Download,
  Trash2,
  AlertCircle,
  Settings,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import api from "../services/api";
import socketService from "../services/socket";
import { Complaint } from "../types";
import { format } from "date-fns";
import FileUpload from "../components/FileUpload";
import { showSuccessToast, showErrorToast } from "../components/Toast";
import { getErrorMessage } from "../utils/errorHandler";
import { validators, getValidationMessage } from "../utils/validators";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";

const Complaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategories, setNewCategories] = useState<string>("");
  const { token, user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
  });

  useEffect(() => {
    fetchComplaints();
    fetchCategories();

    // Connect socket if authenticated
    if (token) {
      socketService.connect(token);

      // Setup real-time listeners
      socketService.onComplaintCreated((data) => {
        setComplaints((prev) => [data.complaint, ...prev]);
        showSuccessToast("New complaint created!");
      });

      socketService.onComplaintUpdated((data) => {
        setComplaints((prev) =>
          prev.map((c) => (c._id === data.complaint._id ? data.complaint : c))
        );
        showSuccessToast("Complaint updated!");
      });

      socketService.onComplaintStatusChanged((data) => {
        setComplaints((prev) =>
          prev.map((c) => (c._id === data.complaint._id ? data.complaint : c))
        );
        showSuccessToast(
          `Complaint status changed to ${data.complaint.status}`
        );
      });

      return () => {
        socketService.offComplaintCreated();
        socketService.offComplaintUpdated();
        socketService.offComplaintStatusChanged();
      };
    }
  }, [token]);

  useEffect(() => {
    fetchComplaints();
  }, [filterStatus, filterPriority]);

  const fetchCategories = async () => {
    try {
      const response = await api.getComplaintCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      const response = await api.getComplaints(filterStatus, filterPriority);
      const complaintsData = Array.isArray(response.data) ? response.data : [];
      setComplaints(complaintsData);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
      showErrorToast(getErrorMessage(error));
      setComplaints([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCategories = async () => {
    try {
      const categoryArray = newCategories
        .split(",")
        .map((cat) => cat.trim())
        .filter((cat) => cat.length > 0);

      if (categoryArray.length === 0) {
        showErrorToast("Please enter at least one category");
        return;
      }

      await api.updateComplaintCategories(categoryArray);
      showSuccessToast("Categories updated successfully!");
      setShowCategoryModal(false);
      setNewCategories("");
      fetchCategories();
    } catch (error) {
      console.error("Failed to update categories:", error);
      showErrorToast(getErrorMessage(error));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validators.required(formData.title)) {
      newErrors.title = getValidationMessage("Title", "required");
    } else if (!validators.minLength(formData.title, 5)) {
      newErrors.title = getValidationMessage("Title", "minLength", 5);
    }

    if (!validators.required(formData.category)) {
      newErrors.category = getValidationMessage("Category", "required");
    }

    if (!validators.required(formData.description)) {
      newErrors.description = getValidationMessage("Description", "required");
    } else if (!validators.minLength(formData.description, 10)) {
      newErrors.description = getValidationMessage(
        "Description",
        "minLength",
        10
      );
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
      // Upload files first
      const attachments: string[] = [];
      if (uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          try {
            const uploadResponse = await api.uploadComplaintFile(file);
            if (uploadResponse.data?.filePath) {
              attachments.push(uploadResponse.data.filePath);
            }
          } catch (uploadError) {
            console.error("Failed to upload file:", file.name, uploadError);
            showErrorToast(`Failed to upload ${file.name}`);
          }
        }
      }

      // Create complaint with attachments
      await api.createComplaint({
        ...formData,
        attachments,
      });

      setShowModal(false);
      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "medium",
      });
      setUploadedFiles([]);
      setErrors({});
      showSuccessToast("Complaint submitted successfully!");
      fetchComplaints();
    } catch (error) {
      console.error("Failed to create complaint:", error);
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

  const handleBulkDelete = async () => {
    if (selectedComplaints.length === 0) return;

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedComplaints.length} complaint(s)?`
      )
    ) {
      return;
    }

    try {
      await api.bulkDeleteComplaints(selectedComplaints);
      showSuccessToast(
        `${selectedComplaints.length} complaint(s) deleted successfully`
      );
      setSelectedComplaints([]);
      fetchComplaints();
    } catch (error) {
      console.error("Failed to delete complaints:", error);
      showErrorToast(getErrorMessage(error));
    }
  };

  const handleExport = async (format: "csv" | "excel") => {
    try {
      const blob = await api.exportComplaints(format, {
        status: filterStatus,
        priority: filterPriority,
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `complaints-${Date.now()}.${
        format === "csv" ? "csv" : "xlsx"
      }`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showSuccessToast(`Complaints exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error("Failed to export complaints:", error);
      showErrorToast(getErrorMessage(error));
    }
  };

  const toggleSelectComplaint = (id: string) => {
    setSelectedComplaints((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        label: string;
      }
    > = {
      pending: { variant: "outline", label: "Pending" },
      "in-progress": { variant: "secondary", label: "In Progress" },
      resolved: { variant: "default", label: "Resolved" },
      closed: { variant: "destructive", label: "Closed" },
    };
    return badges[status] || badges.pending;
  };

  const getPriorityBadge = (priority: string) => {
    const badges: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        label: string;
      }
    > = {
      low: { variant: "secondary", label: "Low" },
      medium: { variant: "outline", label: "Medium" },
      high: { variant: "destructive", label: "High" },
    };
    return badges[priority] || badges.medium;
  };

  const canEditCategories = user?.role === "admin" || user?.role === "staff";

  const filteredComplaints = complaints.filter(
    (complaint) =>
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6 page-transition">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="animate-in slide-in-from-top-4 duration-500">
          <div className="flex justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2 flex items-center gap-3">
                <AlertCircle className="h-8 w-8 text-primary" />
                Complaint Center
              </h1>
              <p className="text-muted-foreground text-lg">
                Submit and track your complaints and concerns
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {canEditCategories && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewCategories(categories.join(", "));
                    setShowCategoryModal(true);
                  }}
                  className="hover-lift"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Categories
                </Button>
              )}
              {selectedComplaints.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleBulkDelete}
                  className="hover-lift"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete ({selectedComplaints.length})
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => handleExport("csv")}
                className="hover-lift"
              >
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport("excel")}
                className="hover-lift"
              >
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button
                onClick={() => setShowModal(true)}
                className="btn-glow hover-lift shadow-lg shadow-primary/20"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Complaint
              </Button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search complaints..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select
                    className="w-full p-2 border rounded-md bg-background"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="pt-6">
                <select
                  className="w-full p-2 border rounded-md bg-background"
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                >
                  <option value="">All Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Complaints List */}
        {filteredComplaints.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No complaints found"
            description={
              searchTerm
                ? "Try adjusting your search terms"
                : "No complaints submitted yet"
            }
          />
        ) : (
          <div className="space-y-4 animate-in fade-in duration-700 delay-100">
            {filteredComplaints.map((complaint) => {
              const statusBadge = getStatusBadge(complaint.status);
              const priorityBadge = getPriorityBadge(complaint.priority);
              return (
                <Card key={complaint._id} className="glass-card card-hover">
                  <CardHeader>
                    <div className="flex gap-4 items-start">
                      <input
                        type="checkbox"
                        checked={selectedComplaints.includes(complaint._id)}
                        onChange={() => toggleSelectComplaint(complaint._id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <CardTitle className="text-xl">
                            {complaint.title}
                          </CardTitle>
                          <div className="flex gap-2">
                            <Badge variant={statusBadge.variant}>
                              {statusBadge.label}
                            </Badge>
                            <Badge variant={priorityBadge.variant}>
                              {priorityBadge.label}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {complaint.category}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-relaxed">
                      {complaint.description}
                    </p>

                    {complaint.attachments &&
                      complaint.attachments.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Attachments ({complaint.attachments.length})
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            {complaint.attachments.map((_, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-1 bg-muted rounded-md"
                              >
                                📎 File {idx + 1}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>
                        Submitted:{" "}
                        {format(new Date(complaint.createdAt), "MMM dd, yyyy")}
                      </span>
                      {complaint.resolvedAt && (
                        <span>
                          Resolved:{" "}
                          {format(
                            new Date(complaint.resolvedAt),
                            "MMM dd, yyyy"
                          )}
                        </span>
                      )}
                    </div>

                    {complaint.response && (
                      <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
                        <p className="text-sm font-medium text-primary mb-1">
                          Response:
                        </p>
                        <p className="text-sm">{complaint.response}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Category Management Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-auto">
            <CardHeader>
              <CardTitle>Manage Complaint Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Categories (comma-separated)
                </label>
                <textarea
                  className="w-full p-3 border rounded-md resize-none"
                  rows={4}
                  value={newCategories}
                  onChange={(e) => setNewCategories(e.target.value)}
                  placeholder="e.g., infrastructure, sanitation, security, noise"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Current categories: {categories.join(", ")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateCategories} className="flex-1">
                  Update Categories
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Complaint Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <CardTitle>Submit Complaint</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Brief description of the issue"
                    disabled={isSubmitting}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.title}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Category *
                  </label>
                  <select
                    className="w-full p-3 border rounded-md"
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    disabled={isSubmitting}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.category}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Priority *
                  </label>
                  <select
                    className="w-full p-3 border rounded-md"
                    value={formData.priority}
                    onChange={(e) =>
                      handleInputChange("priority", e.target.value)
                    }
                    disabled={isSubmitting}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Description *
                  </label>
                  <textarea
                    className="w-full p-3 border rounded-md resize-none"
                    rows={5}
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Provide detailed information about your complaint"
                    disabled={isSubmitting}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.description}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Attachments (Optional)
                  </label>
                  <FileUpload
                    onFilesSelected={setUploadedFiles}
                    maxFiles={5}
                    maxSizeMB={5}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Complaint"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowModal(false)}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Complaints;
