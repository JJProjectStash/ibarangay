import { useState, useEffect, useCallback } from "react";
import {
  Wrench,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Sparkles,
  Plus,
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

const Services = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [itemTypeFilter, setItemTypeFilter] = useState("all");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null
  );
  const [itemTypes, setItemTypes] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    itemName: "",
    itemType: "",
    borrowDate: "",
    expectedReturnDate: "",
    purpose: "",
    quantity: 1,
  });

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getServiceRequests({
        status: statusFilter === "all" ? "" : statusFilter,
        search: searchTerm,
      });
      let requestsData = Array.isArray(response.data) ? response.data : [];

      // Apply item type filter
      if (itemTypeFilter !== "all") {
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

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createServiceRequest(formData);
      showSuccessToast("Service request created successfully!");
      setShowCreateModal(false);
      setFormData({
        itemName: "",
        itemType: "",
        borrowDate: "",
        expectedReturnDate: "",
        purpose: "",
        quantity: 1,
      });
      fetchRequests();
    } catch (error) {
      console.error("Failed to create request:", error);
      showErrorToast(getErrorMessage(error));
    }
  };

  const handleViewDetails = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        icon: JSX.Element;
      }
    > = {
      pending: {
        variant: "outline",
        icon: <Clock className="h-3 w-3" />,
      },
      approved: {
        variant: "default",
        icon: <CheckCircle className="h-3 w-3" />,
      },
      rejected: {
        variant: "destructive",
        icon: <XCircle className="h-3 w-3" />,
      },
      borrowed: {
        variant: "secondary",
        icon: <AlertCircle className="h-3 w-3" />,
      },
      returned: {
        variant: "secondary",
        icon: <CheckCircle className="h-3 w-3" />,
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
        {/* Animated gradient orbs */}
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
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="animate-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-start gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-gray-400/30 bg-gray-500/10 px-4 py-2 text-sm font-medium text-gray-200 backdrop-blur-sm mb-3">
                  <Wrench className="h-4 w-4" />
                  Borrow & Return Services
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
                  Service{" "}
                  <span className="bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 bg-clip-text text-transparent">
                    Requests
                  </span>
                </h1>
                <p className="text-white/80 text-lg">
                  Borrow barangay equipment and track your requests
                </p>
              </div>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500 hover:from-gray-800 hover:via-gray-700 hover:to-gray-600 text-white border-0 shadow-2xl shadow-gray-500/50 transition-all duration-300 hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 animate-in fade-in duration-700 delay-100">
            {[
              {
                label: "Total",
                value: statusCounts.total,
                icon: Wrench,
                color: "gray-500",
              },
              {
                label: "Pending",
                value: statusCounts.pending,
                icon: Clock,
                color: "gray-400",
              },
              {
                label: "Approved",
                value: statusCounts.approved,
                icon: CheckCircle,
                color: "gray-600",
              },
              {
                label: "Rejected",
                value: statusCounts.rejected,
                icon: XCircle,
                color: "gray-700",
              },
              {
                label: "Borrowed",
                value: statusCounts.borrowed,
                icon: AlertCircle,
                color: "gray-500",
              },
              {
                label: "Returned",
                value: statusCounts.returned,
                icon: CheckCircle,
                color: "gray-400",
              },
            ].map((stat, index) => (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-white/40 shadow-2xl hover:shadow-[0_20px_50px_rgba(128,128,128,0.4)] transition-all duration-300 hover:scale-105 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-medium text-white/70">
                      {stat.label}
                    </CardTitle>
                    <stat.icon className={`h-4 w-4 text-${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <Card className="bg-white/10 backdrop-blur-xl border-2 border-white/20 shadow-2xl animate-in slide-in-from-bottom-8 duration-700 delay-200">
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
              {filteredRequests.map((request) => {
                const statusBadge = getStatusBadge(request.status);

                return (
                  <Card
                    key={request._id}
                    className="bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-white/40 shadow-2xl hover:shadow-[0_20px_50px_rgba(128,128,128,0.4)] transition-all duration-300 hover:scale-[1.02] group"
                  >
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white group-hover:text-gray-300 transition-colors">
                              {request.itemName}
                            </h3>
                            <Badge
                              variant={statusBadge.variant}
                              className="backdrop-blur-sm flex items-center gap-1"
                            >
                              {statusBadge.icon}
                              {request.status.charAt(0).toUpperCase() +
                                request.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-white/70 mb-2">
                            {request.itemType} • Quantity: {request.quantity}
                          </p>
                          <p className="text-sm leading-relaxed text-white/90 mb-3">
                            <strong>Purpose:</strong> {request.purpose}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/80">
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
                      </div>

                      {request.notes && (
                        <div className="mb-3 p-3 bg-gray-500/20 backdrop-blur-sm rounded-lg border-l-4 border-gray-400">
                          <p className="text-sm font-medium text-gray-300 mb-1">
                            Admin Notes:
                          </p>
                          <p className="text-sm text-white/90">
                            {request.notes}
                          </p>
                        </div>
                      )}

                      {request.rejectionReason && (
                        <div className="mb-3 p-3 bg-gray-700/20 backdrop-blur-sm rounded-lg border-l-4 border-gray-600">
                          <p className="text-sm font-medium text-gray-400 mb-1">
                            Rejection Reason:
                          </p>
                          <p className="text-sm text-white/90">
                            {request.rejectionReason}
                          </p>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-3 border-t border-white/20">
                        <div className="text-sm text-white/70">
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

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(request)}
                          className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 text-white transition-all duration-300 hover:scale-105"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create Request Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto bg-gray-900/95 backdrop-blur-xl border-2 border-white/20 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-gray-400" />
                Create Service Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateRequest} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-white/90">
                    Item Name *
                  </label>
                  <Input
                    value={formData.itemName}
                    onChange={(e) =>
                      setFormData({ ...formData, itemName: e.target.value })
                    }
                    placeholder="e.g., Folding Tables"
                    required
                    className="bg-white/10 backdrop-blur-xl border-white/20 focus:border-gray-400/50 focus:ring-gray-400/20 text-white placeholder:text-white/40"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-white/90">
                    Item Type *
                  </label>
                  <select
                    className="w-full p-3 border rounded-md bg-white/10 backdrop-blur-xl border-white/20 text-white focus:border-gray-400/50 focus:ring-gray-400/20"
                    value={formData.itemType}
                    onChange={(e) =>
                      setFormData({ ...formData, itemType: e.target.value })
                    }
                    required
                  >
                    <option value="" className="bg-gray-900">
                      Select item type
                    </option>
                    {itemTypes.map((type) => (
                      <option key={type} value={type} className="bg-gray-900">
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-white/90">
                    Quantity *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: parseInt(e.target.value),
                      })
                    }
                    required
                    className="bg-white/10 backdrop-blur-xl border-white/20 focus:border-gray-400/50 focus:ring-gray-400/20 text-white placeholder:text-white/40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-white/90">
                      Borrow Date *
                    </label>
                    <Input
                      type="date"
                      value={formData.borrowDate}
                      onChange={(e) =>
                        setFormData({ ...formData, borrowDate: e.target.value })
                      }
                      required
                      className="bg-white/10 backdrop-blur-xl border-white/20 focus:border-gray-400/50 focus:ring-gray-400/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-white/90">
                      Return Date *
                    </label>
                    <Input
                      type="date"
                      value={formData.expectedReturnDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expectedReturnDate: e.target.value,
                        })
                      }
                      required
                      className="bg-white/10 backdrop-blur-xl border-white/20 focus:border-gray-400/50 focus:ring-gray-400/20 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-white/90">
                    Purpose *
                  </label>
                  <textarea
                    className="w-full p-3 border rounded-md resize-none bg-white/10 backdrop-blur-xl border-white/20 text-white placeholder:text-white/40 focus:border-gray-400/50 focus:ring-gray-400/20"
                    rows={4}
                    value={formData.purpose}
                    onChange={(e) =>
                      setFormData({ ...formData, purpose: e.target.value })
                    }
                    placeholder="Describe the purpose of borrowing this item"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500 hover:from-gray-800 hover:via-gray-700 hover:to-gray-600 text-white"
                  >
                    Submit Request
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
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

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto bg-gray-900/95 backdrop-blur-xl border-2 border-white/20 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
            <CardHeader>
              <CardTitle className="text-white">
                Service Request Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-white/90">
                    Item Name
                  </label>
                  <p className="text-sm text-white/70">
                    {selectedRequest.itemName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-white/90">
                    Item Type
                  </label>
                  <p className="text-sm text-white/70">
                    {selectedRequest.itemType}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-white/90">
                    Quantity
                  </label>
                  <p className="text-sm text-white/70">
                    {selectedRequest.quantity}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-white/90">
                    Status
                  </label>
                  <p className="text-sm text-white/70">
                    {selectedRequest.status}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-white/90">
                    Borrow Date
                  </label>
                  <p className="text-sm text-white/70">
                    {format(new Date(selectedRequest.borrowDate), "PPP")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-white/90">
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
                <label className="text-sm font-medium text-white/90">
                  Purpose
                </label>
                <p className="text-sm text-white/70">
                  {selectedRequest.purpose}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-white/90">
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
  );
};

export default Services;
