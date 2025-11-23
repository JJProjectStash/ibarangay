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
  const [statusFilter, setStatusFilter] = useState("");
  const [itemTypeFilter, setItemTypeFilter] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null
  );
  const [itemTypes, setItemTypes] = useState<string[]>([]);

  const fetchRequests = useCallback(async () => {
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
        class: "bg-yellow-500/20 text-yellow-300 border-yellow-400/50",
        icon: <Clock size={14} />,
      },
      approved: {
        class: "bg-green-500/20 text-green-300 border-green-400/50",
        icon: <CheckCircle size={14} />,
      },
      rejected: {
        class: "bg-red-500/20 text-red-300 border-red-400/50",
        icon: <XCircle size={14} />,
      },
      borrowed: {
        class: "bg-blue-500/20 text-blue-300 border-blue-400/50",
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
      {/* Unified Background - Same as other staff pages */}
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
              title="Service Management"
              description="Manage service requests from residents"
              icon={
                <Wrench className="h-8 w-8 text-purple-400 animate-pulse" />
              }
            />
          </div>

          {/* Stats - IMPROVED READABILITY */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 animate-in fade-in duration-700 delay-100">
            <Card className="bg-white/15 backdrop-blur-xl border-2 border-white/30 hover:border-white/50 shadow-2xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.4)] transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-white">
                  Total Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-purple-400">
                  {statusCounts.total}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/15 backdrop-blur-xl border-2 border-yellow-400/30 hover:border-yellow-400/50 shadow-2xl hover:shadow-[0_20px_50px_rgba(234,179,8,0.4)] transition-all duration-300 hover:scale-105">
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

            <Card className="bg-white/15 backdrop-blur-xl border-2 border-green-400/30 hover:border-green-400/50 shadow-2xl hover:shadow-[0_20px_50px_rgba(34,197,94,0.4)] transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  Approved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-400">
                  {statusCounts.approved}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/15 backdrop-blur-xl border-2 border-red-400/30 hover:border-red-400/50 shadow-2xl hover:shadow-[0_20px_50px_rgba(239,68,68,0.4)] transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-400" />
                  Rejected
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-red-400">
                  {statusCounts.rejected}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/15 backdrop-blur-xl border-2 border-blue-400/30 hover:border-blue-400/50 shadow-2xl hover:shadow-[0_20px_50px_rgba(59,130,246,0.4)] transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-400" />
                  Borrowed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-400">
                  {statusCounts.borrowed}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/15 backdrop-blur-xl border-2 border-gray-400/30 hover:border-gray-400/50 shadow-2xl hover:shadow-[0_20px_50px_rgba(107,114,128,0.4)] transition-all duration-300 hover:scale-105">
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

          {/* Filters - IMPROVED CONTRAST */}
          <Card className="bg-white/15 backdrop-blur-xl border-2 border-white/30 shadow-2xl animate-in fade-in duration-700 delay-200">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    placeholder="Search service requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-purple-400/50"
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px] bg-white/10 border-white/30 text-white">
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
                    <SelectTrigger className="w-[140px] bg-white/10 border-white/30 text-white">
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

          {/* Service Requests List - IMPROVED READABILITY */}
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
                    className="bg-white/15 backdrop-blur-xl border-2 border-white/30 hover:border-white/50 shadow-2xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.4)] transition-all duration-300 hover:scale-[1.01] animate-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">
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
                        <div className="mb-3 p-4 bg-green-500/20 rounded-lg border-l-4 border-green-400">
                          <p className="text-sm font-semibold text-green-300 mb-2">
                            Admin Notes:
                          </p>
                          <p className="text-sm text-white/90">
                            {request.notes}
                          </p>
                        </div>
                      )}

                      {request.rejectionReason && (
                        <div className="mb-3 p-4 bg-red-500/20 rounded-lg border-l-4 border-red-400">
                          <p className="text-sm font-semibold text-red-300 mb-2">
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
                            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Details
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

        {/* Details Modal - IMPROVED CONTRAST */}
        {showDetailsModal && selectedRequest && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto bg-white/95 backdrop-blur-xl border-2 border-white/30 shadow-2xl">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="text-gray-900">
                  Service Request Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-1 block text-gray-900">
                      Item Name
                    </label>
                    <p className="text-sm text-gray-700">
                      {selectedRequest.itemName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1 block text-gray-900">
                      Item Type
                    </label>
                    <p className="text-sm text-gray-700">
                      {selectedRequest.itemType}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1 block text-gray-900">
                      Quantity
                    </label>
                    <p className="text-sm text-gray-700">
                      {selectedRequest.quantity}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1 block text-gray-900">
                      Status
                    </label>
                    <p className="text-sm text-gray-700 capitalize">
                      {selectedRequest.status}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1 block text-gray-900">
                      Borrow Date
                    </label>
                    <p className="text-sm text-gray-700">
                      {format(new Date(selectedRequest.borrowDate), "PPP")}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1 block text-gray-900">
                      Expected Return
                    </label>
                    <p className="text-sm text-gray-700">
                      {format(
                        new Date(selectedRequest.expectedReturnDate),
                        "PPP"
                      )}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1 block text-gray-900">
                    Purpose
                  </label>
                  <p className="text-sm text-gray-700">
                    {selectedRequest.purpose}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1 block text-gray-900">
                    Requested By
                  </label>
                  <p className="text-sm text-gray-700">
                    {selectedRequest.userId.firstName}{" "}
                    {selectedRequest.userId.lastName} (
                    {selectedRequest.userId.email})
                  </p>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => setShowDetailsModal(false)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
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
