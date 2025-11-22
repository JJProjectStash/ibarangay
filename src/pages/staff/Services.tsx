import React, { useState, useEffect } from "react";
import {
  Wrench,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
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
import EmptyState from "@/components/EmptyState";
import api from "@/services/api";
import { format } from "date-fns";
import { showSuccessToast, showErrorToast } from "@/components/Toast";
import { getErrorMessage } from "@/utils/errorHandler";

interface ServiceRequest {
  _id: string;
  userId: {
    firstName: string;
    lastName: string;
    email: string;
  };
  itemName: string;
  itemType: string;
  borrowDate: string;
  expectedReturnDate: string;
  purpose: string;
  quantity: number;
  status: "pending" | "approved" | "rejected" | "borrowed" | "returned";
  notes?: string;
  rejectionReason?: string;
  approvedBy?: {
    firstName: string;
    lastName: string;
  };
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const StaffServices = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [itemTypeFilter, setItemTypeFilter] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null
  );
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itemTypes, setItemTypes] = useState<string[]>([]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.getServiceRequests({
        status: statusFilter,
        search: searchTerm,
      });
      let requestsData = Array.isArray(response.data) ? response.data : [];

      // Apply item type filter
      if (itemTypeFilter) {
        requestsData = requestsData.filter(
          (r) => r.itemType === itemTypeFilter
        );
      }

      setRequests(requestsData);
    } catch (error) {
      console.error("Failed to fetch service requests:", error);
      showErrorToast(getErrorMessage(error));
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchItemTypes = async () => {
    try {
      const response = await api.getServiceItemTypes();
      setItemTypes(response.data || []);
    } catch (error) {
      console.error("Failed to fetch item types:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchItemTypes();
  }, [statusFilter, itemTypeFilter, fetchRequests]);

  const handleStatusUpdate = async (
    requestId: string,
    newStatus: string,
    notes?: string
  ) => {
    try {
      setIsSubmitting(true);
      await api.updateServiceStatus(requestId, newStatus, notes);
      showSuccessToast("Service request updated successfully");
      fetchRequests();
      setShowNotesModal(false);
      setNotes("");
      setSelectedRequest(null);
    } catch (error) {
      console.error("Failed to update status:", error);
      showErrorToast(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetails = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleAddNotes = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setNotes(request.notes || "");
    setShowNotesModal(true);
  };

  const handleSubmitNotes = () => {
    if (selectedRequest) {
      handleStatusUpdate(selectedRequest._id, selectedRequest.status, notes);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { class: string; icon: JSX.Element }> = {
      pending: {
        class: "bg-yellow-100 text-yellow-800",
        icon: <Clock size={14} />,
      },
      approved: {
        class: "bg-green-100 text-green-800",
        icon: <CheckCircle size={14} />,
      },
      rejected: {
        class: "bg-red-100 text-red-800",
        icon: <XCircle size={14} />,
      },
      borrowed: {
        class: "bg-blue-100 text-blue-800",
        icon: <AlertCircle size={14} />,
      },
      returned: {
        class: "bg-gray-100 text-gray-800",
        icon: <CheckCircle size={14} />,
      },
    };
    return badges[status] || badges.pending;
  };

  const filteredRequests = requests.filter(
    (request) =>
      request.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${request.userId.firstName} ${request.userId.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const statusCounts = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
    borrowed: requests.filter((r) => r.status === "borrowed").length,
    returned: requests.filter((r) => r.status === "returned").length,
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
        title="Service Requests"
        description="Manage service requests from residents"
        icon={<Wrench className="h-8 w-8 text-primary" />}
      />

      <div className="max-w-7xl mx-auto space-y-6 mt-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Card className="glass-card card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text-primary">
                {statusCounts.total}
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
              <div className="text-3xl font-bold text-yellow-600">
                {statusCounts.pending}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {statusCounts.approved}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Rejected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {statusCounts.rejected}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Borrowed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {statusCounts.borrowed}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Returned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-600">
                {statusCounts.returned}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search service requests..."
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
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="borrowed">Borrowed</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={itemTypeFilter}
                  onValueChange={setItemTypeFilter}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    {itemTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Requests List */}
        {filteredRequests.length === 0 ? (
          <EmptyState
            icon={Wrench}
            title="No service requests found"
            description={
              searchTerm
                ? "Try adjusting your search terms"
                : "No service requests submitted yet"
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => {
              const statusBadge = getStatusBadge(request.status);

              return (
                <Card key={request._id} className="glass-card card-hover">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">
                          {request.itemName}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          By {request.userId.firstName}{" "}
                          {request.userId.lastName} • {request.itemType}
                        </p>
                        <p className="text-sm leading-relaxed mb-3">
                          <strong>Purpose:</strong> {request.purpose}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <strong>Quantity:</strong> {request.quantity}
                          </div>
                          <div>
                            <strong>Borrow Date:</strong>{" "}
                            {format(
                              new Date(request.borrowDate),
                              "MMM dd, yyyy"
                            )}
                          </div>
                          <div>
                            <strong>Return Date:</strong>{" "}
                            {format(
                              new Date(request.expectedReturnDate),
                              "MMM dd, yyyy"
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Badge className={statusBadge.class}>
                          <span className="flex items-center gap-1">
                            {statusBadge.icon}
                            {request.status.charAt(0).toUpperCase() +
                              request.status.slice(1)}
                          </span>
                        </Badge>
                      </div>
                    </div>

                    {request.notes && (
                      <div className="mb-3 p-3 bg-muted/50 rounded-lg border-l-4 border-blue-500">
                        <p className="text-sm font-medium text-blue-700 mb-1">
                          Notes:
                        </p>
                        <p className="text-sm">{request.notes}</p>
                      </div>
                    )}

                    {request.rejectionReason && (
                      <div className="mb-3 p-3 bg-muted/50 rounded-lg border-l-4 border-red-500">
                        <p className="text-sm font-medium text-red-700 mb-1">
                          Rejection Reason:
                        </p>
                        <p className="text-sm">{request.rejectionReason}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        <span>
                          Submitted:{" "}
                          {format(new Date(request.createdAt), "MMM dd, yyyy")}
                        </span>
                        {request.approvedAt && (
                          <span className="ml-4">
                            Approved:{" "}
                            {format(
                              new Date(request.approvedAt),
                              "MMM dd, yyyy"
                            )}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(request)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddNotes(request)}
                        >
                          Add Notes
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
                                handleStatusUpdate(request._id, "borrowed")
                              }
                            >
                              Mark as Borrowed
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(request._id, "returned")
                              }
                            >
                              Mark as Returned
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <CardTitle>Service Request Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Item Name</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.itemName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Item Type</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.itemType}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Quantity</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.quantity}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.status}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Borrow Date</label>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(selectedRequest.borrowDate), "PPP")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Expected Return</label>
                  <p className="text-sm text-muted-foreground">
                    {format(
                      new Date(selectedRequest.expectedReturnDate),
                      "PPP"
                    )}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Purpose</label>
                <p className="text-sm text-muted-foreground">
                  {selectedRequest.purpose}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Requested By</label>
                <p className="text-sm text-muted-foreground">
                  {selectedRequest.userId.firstName}{" "}
                  {selectedRequest.userId.lastName} (
                  {selectedRequest.userId.email})
                </p>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notes Modal */}
      {showNotesModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <CardTitle>Add Notes</CardTitle>
              <p className="text-sm text-muted-foreground">
                {selectedRequest.itemName} by {selectedRequest.userId.firstName}{" "}
                {selectedRequest.userId.lastName}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Notes</label>
                <textarea
                  className="w-full p-3 border rounded-md resize-none"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes for this request..."
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmitNotes}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Saving..." : "Save Notes"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowNotesModal(false);
                    setNotes("");
                    setSelectedRequest(null);
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

export default StaffServices;
