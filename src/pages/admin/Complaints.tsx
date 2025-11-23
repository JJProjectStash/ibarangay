import { useState, useEffect } from "react";
import {
  AlertCircle,
  Search,
  MessageSquare,
  Clock,
  CheckCircle,
  Trash2,
  Download,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PageHeader from "@/components/PageHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import adminApi from "@/services/adminApi";
import api from "@/services/api";
import { format } from "date-fns";
import { showSuccessToast, showErrorToast } from "@/components/Toast";
import { getErrorMessage } from "@/utils/errorHandler";

interface Complaint {
  _id: string;
  userId: {
    firstName: string;
    lastName: string;
    email: string;
  };
  title: string;
  description: string;
  category: string;
  status: "pending" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  attachments?: string[];
  response?: string;
  resolvedBy?: {
    firstName: string;
    lastName: string;
  };
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );
  const [responseText, setResponseText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllComplaints();
      let complaintsData = Array.isArray(response) ? response : [];

      // Apply filters
      if (statusFilter && statusFilter !== "all") {
        complaintsData = complaintsData.filter(
          (c) => c.status === statusFilter
        );
      }
      if (priorityFilter && priorityFilter !== "all") {
        complaintsData = complaintsData.filter(
          (c) => c.priority === priorityFilter
        );
      }
      if (categoryFilter && categoryFilter !== "all") {
        complaintsData = complaintsData.filter(
          (c) => c.category === categoryFilter
        );
      }

      setComplaints(complaintsData);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
      showErrorToast(getErrorMessage(error));
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.getComplaintCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchComplaints();
    fetchCategories();
  }, [statusFilter, priorityFilter, categoryFilter]);

  const handleStatusUpdate = async (complaintId: string, newStatus: string) => {
    try {
      await api.updateComplaintStatus(complaintId, newStatus);
      showSuccessToast("Complaint status updated successfully");
      fetchComplaints();
    } catch (error) {
      console.error("Failed to update status:", error);
      showErrorToast(getErrorMessage(error));
    }
  };

  const handleResponseSubmit = async () => {
    if (!selectedComplaint || !responseText.trim()) {
      showErrorToast("Please enter a response");
      return;
    }

    setIsSubmitting(true);
    try {
      // Try the response endpoint first
      try {
        await api.respondToComplaint(selectedComplaint._id, responseText);
      } catch (responseError: any) {
        // If the response endpoint doesn't exist (404), try updating status with response
        if (responseError?.response?.status === 404) {
          console.warn(
            "Response endpoint not found, using status update endpoint"
          );
          await api.updateComplaintStatus(
            selectedComplaint._id,
            "in-progress",
            responseText
          );
        } else {
          throw responseError;
        }
      }

      showSuccessToast("Response sent successfully");
      setShowResponseModal(false);
      setResponseText("");
      setSelectedComplaint(null);
      fetchComplaints();
    } catch (error) {
      console.error("Failed to send response:", error);
      showErrorToast(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
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
        status: statusFilter !== "all" ? statusFilter : undefined,
        priority: priorityFilter !== "all" ? priorityFilter : undefined,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
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

  const filteredComplaints = complaints.filter(
    (complaint) =>
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${complaint.userId.firstName} ${complaint.userId.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const statusCounts = {
    pending: complaints.filter((c) => c.status === "pending").length,
    inProgress: complaints.filter((c) => c.status === "in-progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
    closed: complaints.filter((c) => c.status === "closed").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Unified Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="animate-in slide-in-from-top-4 duration-500">
            <PageHeader
              title="Complaint Management"
              description="Monitor and resolve resident complaints"
              icon={
                <AlertCircle className="h-8 w-8 text-purple-400 animate-pulse" />
              }
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in duration-700 delay-100">
            <Card className="bg-white/15 backdrop-blur-xl border-2 border-white/30 hover:border-white/50 shadow-2xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.4)] transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-white">
                  Total Complaints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-purple-400">
                  {complaints.length}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/15 backdrop-blur-xl border-2 border-yellow-400/30 hover:border-yellow-400/50 shadow-2xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-400" />
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-yellow-400">
                  {statusCounts.pending}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/15 backdrop-blur-xl border-2 border-blue-400/30 hover:border-blue-400/50 shadow-2xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-400" />
                  In Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-400">
                  {statusCounts.inProgress}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/15 backdrop-blur-xl border-2 border-green-400/30 hover:border-green-400/50 shadow-2xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  Resolved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-400">
                  {statusCounts.resolved}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Actions */}
          <Card className="bg-white/15 backdrop-blur-xl border-2 border-white/30 shadow-2xl animate-in fade-in duration-700 delay-200">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    placeholder="Search complaints..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 backdrop-blur-xl border-2 border-white/20 focus:border-purple-400/50 focus:ring-purple-400/20 text-white placeholder:text-white/50"
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px] bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={priorityFilter}
                    onValueChange={setPriorityFilter}
                  >
                    <SelectTrigger className="w-[140px] bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder="All Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger className="w-[140px] bg-white/10 border-white/30 text-white">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedComplaints.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={handleBulkDelete}
                      className="bg-red-500/20 border-red-400/50 text-red-300 hover:bg-red-500/30"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete ({selectedComplaints.length})
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => handleExport("csv")}
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    CSV
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleExport("excel")}
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

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
            <div className="space-y-4 animate-in fade-in duration-700 delay-300">
              {filteredComplaints.map((complaint, index) => (
                <Card
                  key={complaint._id}
                  className="bg-white/15 backdrop-blur-xl border-2 border-white/30 hover:border-white/50 shadow-2xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.4)] transition-all duration-300 hover:scale-[1.01] animate-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="pt-6">
                    <div className="flex gap-4 items-start">
                      <input
                        type="checkbox"
                        checked={selectedComplaints.includes(complaint._id)}
                        onChange={() => toggleSelectComplaint(complaint._id)}
                        className="mt-1"
                      />

                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-1">
                              {complaint.title}
                            </h3>
                            <p className="text-sm text-white/80 mb-2 font-medium">
                              By {complaint.userId.firstName}{" "}
                              {complaint.userId.lastName} • {complaint.category}
                            </p>
                            <p className="text-sm leading-relaxed mb-3 text-white/90">
                              {complaint.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            <Badge
                              className={`${
                                complaint.priority === "high"
                                  ? "bg-red-500/20 text-red-300 border-red-400/50"
                                  : complaint.priority === "medium"
                                  ? "bg-yellow-500/20 text-yellow-300 border-yellow-400/50"
                                  : "bg-blue-500/20 text-blue-300 border-blue-400/50"
                              } border backdrop-blur-sm font-semibold`}
                            >
                              {complaint.priority.toUpperCase()}
                            </Badge>
                            <StatusBadge status={complaint.status} />
                          </div>
                        </div>

                        {complaint.attachments &&
                          complaint.attachments.length > 0 && (
                            <div className="mb-3">
                              <p className="text-sm text-white/80 mb-2 font-medium">
                                Attachments ({complaint.attachments.length})
                              </p>
                              <div className="flex gap-2 flex-wrap">
                                {complaint.attachments.map((_, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs px-2 py-1 bg-white/10 rounded-md text-white/80"
                                  >
                                    📎 File {idx + 1}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                        {complaint.response && (
                          <div className="mb-3 p-3 bg-purple-500/20 rounded-lg border-l-4 border-purple-400">
                            <p className="text-sm font-semibold text-purple-300 mb-1">
                              Response:
                            </p>
                            <p className="text-sm text-white/90">
                              {complaint.response}
                            </p>
                            {complaint.resolvedBy && (
                              <p className="text-xs text-white/70 mt-2">
                                Responded by {complaint.resolvedBy.firstName}{" "}
                                {complaint.resolvedBy.lastName}
                              </p>
                            )}
                          </div>
                        )}

                        <div className="flex justify-between items-center">
                          <div className="text-sm text-white/80 font-medium">
                            <span>
                              Submitted:{" "}
                              {format(
                                new Date(complaint.createdAt),
                                "MMM dd, yyyy"
                              )}
                            </span>
                            {complaint.resolvedAt && (
                              <span className="ml-4">
                                Resolved:{" "}
                                {format(
                                  new Date(complaint.resolvedAt),
                                  "MMM dd, yyyy"
                                )}
                              </span>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedComplaint(complaint);
                                setResponseText(complaint.response || "");
                                setShowResponseModal(true);
                              }}
                              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              {complaint.response
                                ? "Update Response"
                                : "Respond"}
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusUpdate(complaint._id, "pending")
                                  }
                                >
                                  Set as Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusUpdate(
                                      complaint._id,
                                      "in-progress"
                                    )
                                  }
                                >
                                  Set as In Progress
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusUpdate(
                                      complaint._id,
                                      "resolved"
                                    )
                                  }
                                >
                                  Mark as Resolved
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusUpdate(complaint._id, "closed")
                                  }
                                >
                                  Close Complaint
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Response Modal */}
        {showResponseModal && selectedComplaint && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto bg-white/95 backdrop-blur-xl border-2 border-white/30 shadow-2xl">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="text-gray-900">
                  {selectedComplaint.response
                    ? "Update Response"
                    : "Respond to Complaint"}
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {selectedComplaint.title}
                </p>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div>
                  <label className="text-sm font-semibold mb-2 block text-gray-900">
                    Response Message
                  </label>
                  <textarea
                    className="w-full p-3 border-2 border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                    rows={6}
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Enter your response to this complaint..."
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleResponseSubmit}
                    disabled={isSubmitting || !responseText.trim()}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isSubmitting
                      ? "Sending..."
                      : selectedComplaint.response
                      ? "Update Response"
                      : "Send Response"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowResponseModal(false);
                      setResponseText("");
                      setSelectedComplaint(null);
                    }}
                    disabled={isSubmitting}
                    className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComplaints;
