import { useState, useEffect } from "react";
import {
  AlertCircle,
  Search,
  MessageSquare,
  Clock,
  CheckCircle,
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

const StaffComplaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
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
      if (statusFilter) {
        complaintsData = complaintsData.filter(
          (c) => c.status === statusFilter
        );
      }
      if (priorityFilter) {
        complaintsData = complaintsData.filter(
          (c) => c.priority === priorityFilter
        );
      }
      if (categoryFilter) {
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
      await api.respondToComplaint(selectedComplaint._id, responseText);
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

  const handleExport = async (format: "csv" | "excel") => {
    try {
      const blob = await api.exportComplaints(format, {
        status: statusFilter,
        priority: priorityFilter,
        category: categoryFilter,
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6 page-transition">
      <PageHeader
        title="Complaint Management"
        description="Handle and respond to resident complaints"
        icon={<AlertCircle className="h-8 w-8 text-primary" />}
      />

      <div className="max-w-7xl mx-auto space-y-6 mt-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-card card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Complaints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text-primary">
                {complaints.length}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">
                {statusCounts.pending}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {statusCounts.inProgress}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Resolved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                {statusCounts.resolved}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search complaints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
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
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={() => handleExport("csv")}>
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>

                <Button variant="outline" onClick={() => handleExport("excel")}>
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
          <div className="space-y-4">
            {filteredComplaints.map((complaint) => (
              <Card key={complaint._id} className="glass-card card-hover">
                <CardContent className="pt-6">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">
                          {complaint.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          By {complaint.userId.firstName}{" "}
                          {complaint.userId.lastName} • {complaint.category}
                        </p>
                        <p className="text-sm leading-relaxed mb-3">
                          {complaint.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Badge
                          variant={
                            complaint.priority === "high"
                              ? "destructive"
                              : complaint.priority === "medium"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {complaint.priority.toUpperCase()}
                        </Badge>
                        <StatusBadge status={complaint.status} />
                      </div>
                    </div>

                    {complaint.attachments &&
                      complaint.attachments.length > 0 && (
                        <div className="mb-3">
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

                    {complaint.response && (
                      <div className="mb-3 p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
                        <p className="text-sm font-medium text-primary mb-1">
                          Response:
                        </p>
                        <p className="text-sm">{complaint.response}</p>
                        {complaint.resolvedBy && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Responded by {complaint.resolvedBy.firstName}{" "}
                            {complaint.resolvedBy.lastName}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
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
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {complaint.response ? "Update Response" : "Respond"}
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(complaint._id, "in-progress")
                              }
                            >
                              Set as In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(complaint._id, "resolved")
                              }
                            >
                              Mark as Resolved
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <CardTitle>
                {selectedComplaint.response
                  ? "Update Response"
                  : "Respond to Complaint"}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {selectedComplaint.title}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Response Message
                </label>
                <textarea
                  className="w-full p-3 border rounded-md resize-none"
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
                  className="flex-1"
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
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StaffComplaints;
