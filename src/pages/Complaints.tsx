import React, { useState, useEffect } from "react";
import {
  Plus,
  MessageSquare,
  Download,
  Trash2,
  AlertCircle,
  Settings,
  Search,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SelectField } from "@/components/ui/select-field";
import api from "../services/api";
import socketService from "../services/socket";
import { Complaint } from "../types";
import { format } from "date-fns";
import FileUpload from "../components/FileUpload";
import { showSuccessToast, showErrorToast } from "../components/Toast";
import { getErrorMessage } from "../utils/errorHandler";
import { validators, getValidationMessage } from "../utils/validators";
import { useAuth } from "../context/AuthContext";
import EmptyState from "../components/EmptyState";
import { SkeletonCard } from "../components/SkeletonCard";

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
        variant:
          | "default"
          | "secondary"
          | "destructive"
          | "outline"
          | "pending"
          | "in-progress"
          | "completed"
          | "closed";
        label: string;
      }
    > = {
      pending: { variant: "pending", label: "Pending" },
      "in-progress": { variant: "in-progress", label: "In Progress" },
      resolved: { variant: "completed", label: "Resolved" },
      closed: { variant: "closed", label: "Closed" },
    };
    return badges[status] || badges.pending;
  };

  const getPriorityBadge = (priority: string) => {
    const badges: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "warning" | "info";
        label: string;
      }
    > = {
      low: { variant: "info", label: "Low" },
      medium: { variant: "secondary", label: "Medium" },
      high: { variant: "warning", label: "High" },
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
      <div className="min-h-screen relative">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div
            className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl animate-pulse"
            style={{ animationDuration: "8s" }}
          />
          <div
            className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-3xl animate-pulse"
            style={{ animationDuration: "10s", animationDelay: "2s" }}
          />
        </div>
        <div className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="space-y-4">
              <div className="h-12 w-64 bg-white/20 rounded-lg animate-pulse" />
              <div className="h-6 w-96 bg-white/10 rounded-lg animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Unified Background - Same as Home page */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated gradient orbs */}
        <div
          className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-3xl animate-pulse"
          style={{ animationDuration: "10s", animationDelay: "2s" }}
        />
        <div
          className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-pink-500/15 to-purple-500/15 blur-3xl animate-pulse"
          style={{ animationDuration: "12s", animationDelay: "4s" }}
        />
      </div>

      <div className="relative z-10 p-6 page-transition">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="animate-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-start gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 backdrop-blur-sm mb-3">
                  <AlertCircle className="h-4 w-4" />
                  Complaint Center
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
                  Report{" "}
                  <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Issues
                  </span>
                </h1>
                <p className="text-white/80 text-lg">
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
                    className="bg-white/10 backdrop-blur-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 text-white transition-all duration-300 hover:scale-105"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Categories
                  </Button>
                )}
                {selectedComplaints.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={handleBulkDelete}
                    className="bg-white/10 backdrop-blur-xl border-2 border-white/30 hover:bg-red-500/20 hover:border-red-400/50 text-white transition-all duration-300 hover:scale-105"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete ({selectedComplaints.length})
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => handleExport("csv")}
                  className="bg-white/10 backdrop-blur-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 text-white transition-all duration-300 hover:scale-105"
                >
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExport("excel")}
                  className="bg-white/10 backdrop-blur-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 text-white transition-all duration-300 hover:scale-105"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </Button>
                <Button
                  onClick={() => setShowModal(true)}
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white border-0 shadow-2xl shadow-purple-500/50 transition-all duration-300 hover:scale-105"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Complaint
                </Button>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-white/10 backdrop-blur-xl border-2 border-white/20 shadow-2xl">
                <CardContent className="pt-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                    <Input
                      placeholder="Search complaints..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/10 backdrop-blur-xl border-white/20 focus:border-purple-400/50 focus:ring-purple-400/20 text-white placeholder:text-white/40"
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-xl border-2 border-white/20 shadow-2xl">
                <CardContent className="pt-6">
                  <SelectField
                    value={filterStatus}
                    onValueChange={setFilterStatus}
                    options={[
                      { value: "all", label: "All Status" },
                      { value: "pending", label: "Pending" },
                      { value: "in-progress", label: "In Progress" },
                      { value: "resolved", label: "Resolved" },
                      { value: "closed", label: "Closed" },
                    ]}
                    placeholder="Filter by status"
                  />
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-xl border-2 border-white/20 shadow-2xl">
                <CardContent className="pt-6">
                  <SelectField
                    value={filterPriority}
                    onValueChange={setFilterPriority}
                    options={[
                      { value: "all", label: "All Priority" },
                      { value: "low", label: "Low" },
                      { value: "medium", label: "Medium" },
                      { value: "high", label: "High" },
                    ]}
                    placeholder="Filter by priority"
                  />
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
                  ? "Try adjusting your search terms or filters"
                  : "No complaints have been submitted yet. Click 'New Complaint' to submit your first complaint."
              }
              action={
                !searchTerm
                  ? {
                      label: "Submit Complaint",
                      onClick: () => setShowModal(true),
                    }
                  : undefined
              }
            />
          ) : (
            <div className="space-y-4 animate-in fade-in duration-700 delay-100">
              {filteredComplaints.map((complaint) => {
                const statusBadge = getStatusBadge(complaint.status);
                const priorityBadge = getPriorityBadge(complaint.priority);
                return (
                  <Card
                    key={complaint._id}
                    className="bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-white/40 shadow-2xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.4)] transition-all duration-300 hover:scale-[1.02] group"
                  >
                    <CardHeader>
                      <div className="flex gap-4 items-start">
                        <input
                          type="checkbox"
                          checked={selectedComplaints.includes(complaint._id)}
                          onChange={() => toggleSelectComplaint(complaint._id)}
                          className="mt-1 w-4 h-4 rounded border-white/30 bg-white/10 text-purple-500 focus:ring-purple-500/50"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start gap-4 mb-2">
                            <CardTitle className="text-xl text-white group-hover:text-purple-300 transition-colors">
                              {complaint.title}
                            </CardTitle>
                            <div className="flex gap-2">
                              <Badge
                                variant={statusBadge.variant}
                                showIcon
                                className="backdrop-blur-sm"
                              >
                                {statusBadge.label}
                              </Badge>
                              <Badge
                                variant={priorityBadge.variant}
                                showIcon
                                className="backdrop-blur-sm"
                              >
                                {priorityBadge.label}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-white/80">
                            {complaint.category}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm leading-relaxed text-white/90">
                        {complaint.description}
                      </p>

                      {complaint.attachments &&
                        complaint.attachments.length > 0 && (
                          <div>
                            <p className="text-sm text-white/80 mb-2">
                              Attachments ({complaint.attachments.length})
                            </p>
                            <div className="flex gap-2 flex-wrap">
                              {complaint.attachments.map((_, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs px-2 py-1 bg-white/10 backdrop-blur-sm rounded-md text-white/80"
                                >
                                  📎 File {idx + 1}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                      <div className="flex justify-between items-center text-sm text-white/80">
                        <span>
                          Submitted:{" "}
                          {format(
                            new Date(complaint.createdAt),
                            "MMM dd, yyyy"
                          )}
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
                        <div className="p-3 bg-purple-500/20 backdrop-blur-sm rounded-lg border-l-4 border-purple-400">
                          <p className="text-sm font-medium text-purple-300 mb-1">
                            Response:
                          </p>
                          <p className="text-sm text-white/90">
                            {complaint.response}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Category Management Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <Card className="w-full max-w-md max-h-[90vh] overflow-auto bg-slate-900/95 backdrop-blur-xl border-2 border-white/20 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                Manage Complaint Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-white/90">
                  Categories (comma-separated)
                </label>
                <textarea
                  className="w-full p-3 border rounded-md resize-none bg-white/10 backdrop-blur-xl border-white/20 text-white placeholder:text-white/40 focus:border-purple-400/50 focus:ring-purple-400/20"
                  rows={4}
                  value={newCategories}
                  onChange={(e) => setNewCategories(e.target.value)}
                  placeholder="e.g., infrastructure, sanitation, security, noise"
                />
                <p className="text-xs text-white/70 mt-2">
                  Current categories: {categories.join(", ")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleUpdateCategories}
                  className="flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white"
                >
                  Update Categories
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 text-white"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto bg-slate-900/95 backdrop-blur-xl border-2 border-white/20 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                Submit Complaint
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-white/90 flex items-center gap-1">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Brief description of the issue"
                    disabled={isSubmitting}
                    className="bg-white/10 backdrop-blur-xl border-white/20 focus:border-purple-400/50 focus:ring-purple-400/20 text-white placeholder:text-white/40"
                  />
                  {errors.title && (
                    <p className="text-red-300 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.title}
                    </p>
                  )}
                </div>
                <SelectField
                  label="Category"
                  required
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                  options={[
                    ...categories.map((cat) => ({
                      value: cat,
                      label: cat.charAt(0).toUpperCase() + cat.slice(1),
                    })),
                  ]}
                  placeholder="Select a category"
                  disabled={isSubmitting}
                  error={errors.category}
                />
                <SelectField
                  label="Priority"
                  required
                  value={formData.priority}
                  onValueChange={(value) =>
                    handleInputChange("priority", value)
                  }
                  options={[
                    { value: "low", label: "Low" },
                    { value: "medium", label: "Medium" },
                    { value: "high", label: "High" },
                  ]}
                  disabled={isSubmitting}
                />
                <div>
                  <label className="text-sm font-medium mb-2 block text-white/90 flex items-center gap-1">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    className="w-full p-3 border rounded-md resize-none bg-white/10 backdrop-blur-xl border-white/20 text-white placeholder:text-white/40 focus:border-purple-400/50 focus:ring-purple-400/20"
                    rows={5}
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Provide detailed information about your complaint"
                    disabled={isSubmitting}
                  />
                  {errors.description && (
                    <p className="text-red-300 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.description}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-white/90">
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
                    className="flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Complaint"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowModal(false)}
                    disabled={isSubmitting}
                    className="flex-1 bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 text-white"
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
