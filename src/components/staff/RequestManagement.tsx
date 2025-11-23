import React, { useState } from "react";
import { Service, Complaint } from "../../types";
import { format } from "date-fns";
import { CheckCircle, XCircle, Clock, MessageSquare } from "lucide-react";

interface RequestManagementProps {
  services: Service[];
  complaints: Complaint[];
  onUpdateServiceStatus: (id: string, status: string, notes?: string) => void;
  onUpdateComplaintStatus: (
    id: string,
    status: string,
    response?: string
  ) => void;
}

const RequestManagement: React.FC<RequestManagementProps> = ({
  services,
  complaints,
  onUpdateServiceStatus,
  onUpdateComplaintStatus,
}) => {
  const [activeTab, setActiveTab] = useState<"services" | "complaints">(
    "services"
  );
  const [responseText, setResponseText] = useState<Record<string, string>>({});

  const pendingServices = services.filter((s) => s.status === "pending");
  const pendingComplaints = complaints.filter((c) => c.status === "pending");

  const handleApproveService = (id: string) => {
    const notes = responseText[id] || "";
    onUpdateServiceStatus(id, "approved", notes);
    setResponseText((prev) => ({ ...prev, [id]: "" }));
  };

  const handleRejectService = (id: string) => {
    const notes = responseText[id] || "Request rejected";
    onUpdateServiceStatus(id, "rejected", notes);
    setResponseText((prev) => ({ ...prev, [id]: "" }));
  };

  const handleUpdateComplaint = (id: string, status: string) => {
    const response = responseText[id] || "";
    onUpdateComplaintStatus(id, status, response);
    setResponseText((prev) => ({ ...prev, [id]: "" }));
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-500/20 text-yellow-300 border border-yellow-400/50",
      approved: "bg-green-500/20 text-green-300 border border-green-400/50",
      rejected: "bg-red-500/20 text-red-300 border border-red-400/50",
      "in-progress": "bg-blue-500/20 text-blue-300 border border-blue-400/50",
      resolved: "bg-green-500/20 text-green-300 border border-green-400/50",
    };
    return styles[status] || styles.pending;
  };

  return (
    <div>
      {/* Tab Navigation - IMPROVED CONTRAST */}
      <div className="flex gap-4 mb-6 border-b-2 border-white/20">
        <button
          onClick={() => setActiveTab("services")}
          className={`px-6 py-3 font-semibold transition-all duration-200 border-b-3 ${
            activeTab === "services"
              ? "border-purple-400 text-white bg-white/10"
              : "border-transparent text-white/70 hover:text-white hover:bg-white/5"
          }`}
        >
          Service Requests ({pendingServices.length})
        </button>
        <button
          onClick={() => setActiveTab("complaints")}
          className={`px-6 py-3 font-semibold transition-all duration-200 border-b-3 ${
            activeTab === "complaints"
              ? "border-purple-400 text-white bg-white/10"
              : "border-transparent text-white/70 hover:text-white hover:bg-white/5"
          }`}
        >
          Complaints ({pendingComplaints.length})
        </button>
      </div>

      {/* Service Requests Tab */}
      {activeTab === "services" && (
        <div className="flex flex-col gap-4">
          {pendingServices.length === 0 ? (
            <div className="text-center py-12">
              <Clock size={48} className="mx-auto mb-4 text-white/40" />
              <p className="text-white/70 text-lg font-medium">
                No pending service requests
              </p>
            </div>
          ) : (
            pendingServices.map((service) => (
              <div
                key={service._id}
                className="bg-white/10 backdrop-blur-xl border-2 border-white/30 rounded-xl p-6 hover:border-white/50 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {service.itemName}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-white/80 font-medium">
                      <span>
                        Type:{" "}
                        <span className="text-white">{service.itemType}</span>
                      </span>
                      <span>
                        Quantity:{" "}
                        <span className="text-white">{service.quantity}</span>
                      </span>
                      <span>
                        Requested:{" "}
                        <span className="text-white">
                          {format(new Date(service.createdAt), "MMM dd, yyyy")}
                        </span>
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap ${getStatusBadge(
                      service.status
                    )}`}
                  >
                    {service.status.charAt(0).toUpperCase() +
                      service.status.slice(1)}
                  </span>
                </div>

                {/* Purpose */}
                <div className="mb-4 p-4 bg-white/5 rounded-lg border border-white/20">
                  <p className="font-semibold text-white mb-2">Purpose:</p>
                  <p className="text-white/90 leading-relaxed">
                    {service.purpose}
                  </p>
                </div>

                {/* Borrow Period */}
                <div className="mb-4 p-4 bg-white/5 rounded-lg border border-white/20">
                  <p className="font-semibold text-white mb-2">
                    Borrow Period:
                  </p>
                  <p className="text-white/90">
                    {format(new Date(service.borrowDate), "MMM dd, yyyy")} -{" "}
                    {format(
                      new Date(service.expectedReturnDate),
                      "MMM dd, yyyy"
                    )}
                  </p>
                </div>

                {/* Response Notes */}
                <div className="mb-4">
                  <label className="flex items-center gap-2 font-semibold text-white mb-2">
                    <MessageSquare size={16} />
                    Response Notes:
                  </label>
                  <textarea
                    value={responseText[service._id] || ""}
                    onChange={(e) =>
                      setResponseText((prev) => ({
                        ...prev,
                        [service._id]: e.target.value,
                      }))
                    }
                    placeholder="Add notes for approval/rejection..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/30 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-vertical"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApproveService(service._id)}
                    className="flex items-center gap-2 px-6 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-300 border-2 border-green-400/50 hover:border-green-400 rounded-lg font-semibold transition-all duration-200"
                  >
                    <CheckCircle size={18} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectService(service._id)}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 border-2 border-red-400/50 hover:border-red-400 rounded-lg font-semibold transition-all duration-200"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Complaints Tab */}
      {activeTab === "complaints" && (
        <div className="flex flex-col gap-4">
          {pendingComplaints.length === 0 ? (
            <div className="text-center py-12">
              <Clock size={48} className="mx-auto mb-4 text-white/40" />
              <p className="text-white/70 text-lg font-medium">
                No pending complaints
              </p>
            </div>
          ) : (
            pendingComplaints.map((complaint) => (
              <div
                key={complaint._id}
                className="bg-white/10 backdrop-blur-xl border-2 border-white/30 rounded-xl p-6 hover:border-white/50 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {complaint.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-white/80 font-medium">
                      <span>
                        Category:{" "}
                        <span className="text-white">{complaint.category}</span>
                      </span>
                      <span>
                        Priority:{" "}
                        <span className="text-white capitalize">
                          {complaint.priority}
                        </span>
                      </span>
                      <span>
                        Submitted:{" "}
                        <span className="text-white">
                          {format(
                            new Date(complaint.createdAt),
                            "MMM dd, yyyy"
                          )}
                        </span>
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap ${getStatusBadge(
                      complaint.status
                    )}`}
                  >
                    {complaint.status.charAt(0).toUpperCase() +
                      complaint.status.slice(1)}
                  </span>
                </div>

                {/* Description */}
                <div className="mb-4 p-4 bg-white/5 rounded-lg border border-white/20">
                  <p className="font-semibold text-white mb-2">Description:</p>
                  <p className="text-white/90 leading-relaxed">
                    {complaint.description}
                  </p>
                </div>

                {/* Response */}
                <div className="mb-4">
                  <label className="flex items-center gap-2 font-semibold text-white mb-2">
                    <MessageSquare size={16} />
                    Response:
                  </label>
                  <textarea
                    value={responseText[complaint._id] || ""}
                    onChange={(e) =>
                      setResponseText((prev) => ({
                        ...prev,
                        [complaint._id]: e.target.value,
                      }))
                    }
                    placeholder="Add response to the complaint..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/30 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-vertical"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      handleUpdateComplaint(complaint._id, "in-progress")
                    }
                    className="flex items-center gap-2 px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-2 border-blue-400/50 hover:border-blue-400 rounded-lg font-semibold transition-all duration-200"
                  >
                    <Clock size={18} />
                    In Progress
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateComplaint(complaint._id, "resolved")
                    }
                    className="flex items-center gap-2 px-6 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-300 border-2 border-green-400/50 hover:border-green-400 rounded-lg font-semibold transition-all duration-200"
                  >
                    <CheckCircle size={18} />
                    Resolve
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default RequestManagement;
