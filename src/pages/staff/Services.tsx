import { useState, useEffect, useCallback } from "react";
import {
  Wrench,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal,
  Eye,
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [itemTypeFilter, setItemTypeFilter] = useState("all");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null
  );
  const [itemTypes, setItemTypes] = useState<string[]>([]);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getServiceRequests({
        status: statusFilter === "all" ? "" : statusFilter,
        search: searchTerm,
      });
      let requestsData = Array.isArray(response.data) ? response.data : [];

      // Apply item type filter
      if (itemTypeFilter && itemTypeFilter !== "all") {
        requestsData = requestsData.filter(
          (r: ServiceRequest) => r.itemType === itemTypeFilter
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
  }, [statusFilter, searchTerm, itemTypeFilter]);

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
  }, [fetchRequests]);

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    try {
      await api.updateServiceStatus(requestId, newStatus);
      showSuccessToast("Service request updated successfully");
      fetchRequests();
    } catch (error) {
      console.error("Failed to update status:", error);
      showErrorToast(getErrorMessage(error));
    }
  };

  const handleViewDetails = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { class: string; icon: JSX.Element }> = {
      pending: {
        class: "bg-gray-500/20 text-gray-300 border-gray-400/50",
        icon: <Clock size={14} />,
      },
      approved: {
        class: "bg-gray-600/20 text-gray-300 border-gray-500/50",
        icon: <CheckCircle size={14} />,
      },
      rejected: {
        class: "bg-gray-700/20 text-gray-300 border-gray-600/50",
        icon: <XCircle size={14} />,
      },
      borrowed: {
        class: "bg-gray-400/20 text-gray-300 border-gray-300/50",
        icon: <AlertCircle size={14} />,
      },
      returned: {
        class: "bg-gray-500/20 text-gray-300 border-gray-400/50",
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
    <div className="min-h-screen relative">
      {/* Unified Background - Same as Home page */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-black via-gray-900 to-black">
        <div
          className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-gray-700/20 to-gray-500/20 blur-3xl animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-gray-600/20 to-gray-400/20 blur-3xl animate-pulse"
          style={{ animationDuration: "10s", animationDelay: "2s" }}
        />
        <div
          className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-gray-500/15 to-gray-700/15 blur-3xl animate-pulse"
          style={{ animationDuration: "12s", animationDelay: "4s" }}
        />
      </div>

      <div className="relative z-10 p-6 page-transition">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="animate-in slide-in-from-top-4 duration-500 text-white">
            <PageHeader
              title="Service Management"
              description="Manage service requests from residents"
              icon={<Wrench className="h-8 w-8 text-gray-400 animate-pulse" />}
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 animate-in fade-in duration-700 delay-100">
            <Card className="bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-white/40 shadow-2xl hover:shadow-[0_20px_50px_rgba(128,128,128,0.4)] transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-white">
                  Total Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-400">
                  {statusCounts.total}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border-2 border-gray-400/30 hover:border-gray-400/50 shadow-2xl hover:shadow-[0_20px_50px_rgba(128,128,128,0.4)] transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-400">
                  {statusCounts.pending}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border-2 border-gray-500/30 hover:border-gray-500/50 shadow-2xl hover:shadow-[0_20px_50px_rgba(128,128,128,0.4)] transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gray-400" />
                  Approved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-400">
                  {statusCounts.approved}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border-2 border-gray-600/30 hover:border-gray-600/50 shadow-2xl hover:shadow-[0_20px_50px_rgba(128,128,128,0.4)] transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-gray-400" />
                  Rejected
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-400">
                  {statusCounts.rejected}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border-2 border-gray-400/30 hover:border-gray-400/50 shadow-2xl hover:shadow-[0_20px_50px_rgba(128,128,128,0.4)] transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-gray-400" />
                  Borrowed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-400">
                  {statusCounts.borrowed}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border-2 border-gray-500/30 hover:border-gray-500/50 shadow-2xl hover:shadow-[0_20px_50px_rgba(128,128,128,0.4)] transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gray-400" />
                  Returned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-400">
                  {statusCounts.returned}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-white/10 backdrop-blur-xl border-2 border-white/20 shadow-2xl animate-in fade-in duration-700 delay-200">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    placeholder="Search service requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 backdrop-blur-xl border-white/20 focus:border-gray-400/50 focus:ring-gray-400/20 text-white placeholder:text-white/40"
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px] bg-white/10 backdrop-blur-xl border-white/20 text-white">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-white/20">
                      <SelectItem value="all">All Status</SelectItem>
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
                    <SelectTrigger className="w-[140px] bg-white/10 backdrop-blur-xl border-white/20 text-white">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-white/20">
                      <SelectItem value="all">All Types</SelectItem>
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
            <div className="space-y-4 animate-in fade-in duration-700 delay-300">
              {filteredRequests.map((request, index) => {
                const statusBadge = getStatusBadge(request.status);

                return (
                  <Card
                    key={request._id}
                    className="bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-white/40 shadow-2xl hover:shadow-[0_20px_50px_rgba(128,128,128,0.4)] transition-all duration-300 hover:scale-[1.01] group animate-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gray-300 transition-colors">
                            {request.itemName}
                          </h3>
                          <p className="text-sm text-white/80 mb-3 font-medium">
                            By {request.userId.firstName}{" "}
                            {request.userId.lastName} • {request.itemType}
                          </p>
                          <p className="text-sm leading-relaxed mb-3 text-white/90">
                            <strong>Purpose:</strong> {request.purpose}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/90">
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
                          <Badge
                            className={`${statusBadge.class} border backdrop-blur-sm font-semibold`}
                          >
                            <span className="flex items-center gap-1">
                              {statusBadge.icon}
                              {request.status.charAt(0).toUpperCase() +
                                request.status.slice(1)}
                            </span>
                          </Badge>
                        </div>
                      </div>

                      {request.notes && (
                        <div className="mb-3 p-4 bg-gray-500/20 backdrop-blur-sm rounded-lg border-l-4 border-gray-400">
                          <p className="text-sm font-semibold text-gray-300 mb-2">
                            Admin Notes:
                          </p>
                          <p className="text-sm text-white/90">
                            {request.notes}
                          </p>
                        </div>
                      )}

                      {request.rejectionReason && (
                        <div className="mb-3 p-4 bg-gray-700/20 backdrop-blur-sm rounded-lg border-l-4 border-gray-600">
                          <p className="text-sm font-semibold text-gray-400 mb-2">
                            Rejection Reason:
                          </p>
                          <p className="text-sm text-white/90">
                            {request.rejectionReason}
                          </p>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-3 border-t border-white/20">
                        <div className="text-sm text-white/80 font-medium">
                          <span>
                            Submitted:{" "}
                            {format(
                              new Date(request.createdAt),
                              "MMM dd, yyyy"
                            )}
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
                            className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 text-white transition-all duration-300 hover:scale-105"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 text-white transition-all duration-300 hover:scale-105"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-gray-900/95 backdrop-blur-xl border-white/20">
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto bg-gray-900/95 backdrop-blur-xl border-2 border-white/20 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
              <CardHeader className="border-b border-white/20">
                <CardTitle className="text-white">
                  Service Request Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-1 block text-white/90">
                      Item Name
                    </label>
                    <p className="text-sm text-white/70">
                      {selectedRequest.itemName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1 block text-white/90">
                      Item Type
                    </label>
                    <p className="text-sm text-white/70">
                      {selectedRequest.itemType}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1 block text-white/90">
                      Quantity
                    </label>
                    <p className="text-sm text-white/70">
                      {selectedRequest.quantity}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1 block text-white/90">
                      Status
                    </label>
                    <p className="text-sm text-white/70 capitalize">
                      {selectedRequest.status}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1 block text-white/90">
                      Borrow Date
                    </label>
                    <p className="text-sm text-white/70">
                      {format(new Date(selectedRequest.borrowDate), "PPP")}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1 block text-white/90">
                      Expected Return
                    </label>
                    <p className="text-sm text-white/70">
                      {format(
                        new Date(selectedRequest.expectedReturnDate),
                        "PPP"
                      )}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1 block text-white/90">
                    Purpose
                  </label>
                  <p className="text-sm text-white/70">
                    {selectedRequest.purpose}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1 block text-white/90">
                    Requested By
                  </label>
                  <p className="text-sm text-white/70">
                    {selectedRequest.userId.firstName}{" "}
                    {selectedRequest.userId.lastName} (
                    {selectedRequest.userId.email})
                  </p>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => setShowDetailsModal(false)}
                    className="flex-1 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500 hover:from-gray-800 hover:via-gray-700 hover:to-gray-600 text-white"
                  >
                    Close
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

export default StaffServices;
