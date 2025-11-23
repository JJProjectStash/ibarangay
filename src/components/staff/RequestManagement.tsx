import React, { useState } from "react";
import { Service, Complaint } from "../../types";
import { format } from "date-fns";
import {
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  AlertCircle,
  Package,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
      pending: "bg-amber-500/20 text-amber-200 border border-amber-400/40",
      approved:
        "bg-emerald-500/20 text-emerald-200 border border-emerald-400/40",
      rejected: "bg-rose-500/20 text-rose-200 border border-rose-400/40",
      "in-progress": "bg-sky-500/20 text-sky-200 border border-sky-400/40",
      resolved:
        "bg-emerald-500/20 text-emerald-200 border border-emerald-400/40",
    };
    return styles[status] || styles.pending;
  };

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      high: "bg-rose-500/20 text-rose-200 border border-rose-400/40",
      medium: "bg-amber-500/20 text-amber-200 border border-amber-400/40",
      low: "bg-sky-500/20 text-sky-200 border border-sky-400/40",
    };
    return styles[priority] || styles.low;
  };

  return (
    <div>
      {/* Tab Navigation - CLEAN NEUTRAL DESIGN */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setActiveTab("services")}
          className={`group relative flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
            activeTab === "services"
              ? "bg-slate-800/90 text-white border-2 border-slate-700 shadow-lg"
              : "bg-slate-800/50 text-slate-300 border-2 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/70"
          }`}
        >
          <div className="flex items-center justify-center gap-3">
            <Package className="h-5 w-5" />
            <span>Service Requests</span>
            <Badge
              className={`${
                activeTab === "services"
                  ? "bg-slate-700 text-white"
                  : "bg-slate-700/50 text-slate-300"
              } border-0 font-bold`}
            >
              {pendingServices.length}
            </Badge>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("complaints")}
          className={`group relative flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
            activeTab === "complaints"
              ? "bg-slate-800/90 text-white border-2 border-slate-700 shadow-lg"
              : "bg-slate-800/50 text-slate-300 border-2 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/70"
          }`}
        >
          <div className="flex items-center justify-center gap-3">
            <FileText className="h-5 w-5" />
            <span>Complaints</span>
            <Badge
              className={`${
                activeTab === "complaints"
                  ? "bg-slate-700 text-white"
                  : "bg-slate-700/50 text-slate-300"
              } border-0 font-bold`}
            >
              {pendingComplaints.length}
            </Badge>
          </div>
        </button>
      </div>

      {/* Service Requests Tab */}
      {activeTab === "services" && (
        <div className="flex flex-col gap-6">
          {pendingServices.length === 0 ? (
            <div className="text-center py-16 bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-700/50">
              <Clock size={56} className="mx-auto mb-4 text-slate-400" />
              <p className="text-white text-xl font-semibold mb-2">
                No pending service requests
              </p>
              <p className="text-slate-300 font-medium">
                All service requests have been processed
              </p>
            </div>
          ) : (
            pendingServices.map((service, index) => (
              <div
                key={service._id}
                className="bg-slate-800/80 backdrop-blur-sm border-2 border-slate-700/60 rounded-2xl p-8 hover:border-slate-600 hover:bg-slate-800/90 hover:shadow-xl transition-all duration-300 animate-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6 pb-6 border-b border-slate-700/50">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {service.itemName}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-slate-700/80 text-slate-200 border border-slate-600 font-semibold px-3 py-1">
                        {service.itemType}
                      </Badge>
                      <Badge className="bg-slate-700/80 text-slate-200 border border-slate-600 font-semibold px-3 py-1">
                        Qty: {service.quantity}
                      </Badge>
                      <Badge className="bg-slate-700/80 text-slate-200 border border-slate-600 font-semibold px-3 py-1">
                        {format(new Date(service.createdAt), "MMM dd, yyyy")}
                      </Badge>
                    </div>
                  </div>
                  <Badge
                    className={`px-4 py-2 text-sm font-bold whitespace-nowrap ${getStatusBadge(
                      service.status
                    )}`}
                  >
                    {service.status.toUpperCase()}
                  </Badge>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Purpose */}
                  <div className="p-5 bg-slate-900/40 rounded-xl border border-slate-700/50 hover:bg-slate-900/60 transition-colors">
                    <p className="font-bold text-white mb-3 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-slate-400" />
                      Purpose
                    </p>
                    <p className="text-slate-200 leading-relaxed">
                      {service.purpose}
                    </p>
                  </div>

                  {/* Borrow Period */}
                  <div className="p-5 bg-slate-900/40 rounded-xl border border-slate-700/50 hover:bg-slate-900/60 transition-colors">
                    <p className="font-bold text-white mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-400" />
                      Borrow Period
                    </p>
                    <p className="text-slate-200 font-semibold">
                      {format(new Date(service.borrowDate), "MMM dd, yyyy")}
                    </p>
                    <p className="text-slate-400 text-sm mt-1">to</p>
                    <p className="text-slate-200 font-semibold">
                      {format(
                        new Date(service.expectedReturnDate),
                        "MMM dd, yyyy"
                      )}
                    </p>
                  </div>
                </div>

                {/* Response Notes */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 font-bold text-white mb-3">
                    <MessageSquare className="h-5 w-5 text-slate-400" />
                    Response Notes
                  </label>
                  <textarea
                    value={responseText[service._id] || ""}
                    onChange={(e) =>
                      setResponseText((prev) => ({
                        ...prev,
                        [service._id]: e.target.value,
                      }))
                    }
                    placeholder="Add notes for approval/rejection (optional)..."
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-900/40 border-2 border-slate-700/50 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-slate-600 resize-none hover:bg-slate-900/60 transition-colors"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleApproveService(service._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl font-bold transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-95"
                  >
                    <CheckCircle size={20} />
                    Approve Request
                  </button>
                  <button
                    onClick={() => handleRejectService(service._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white rounded-xl font-bold transition-all duration-200 shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/40 hover:scale-[1.02] active:scale-95"
                  >
                    <XCircle size={20} />
                    Reject Request
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Complaints Tab */}
      {activeTab === "complaints" && (
        <div className="flex flex-col gap-6">
          {pendingComplaints.length === 0 ? (
            <div className="text-center py-16 bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-700/50">
              <AlertCircle size={56} className="mx-auto mb-4 text-slate-400" />
              <p className="text-white text-xl font-semibold mb-2">
                No pending complaints
              </p>
              <p className="text-slate-300 font-medium">
                All complaints have been addressed
              </p>
            </div>
          ) : (
            pendingComplaints.map((complaint, index) => (
              <div
                key={complaint._id}
                className="bg-slate-800/80 backdrop-blur-sm border-2 border-slate-700/60 rounded-2xl p-8 hover:border-slate-600 hover:bg-slate-800/90 hover:shadow-xl transition-all duration-300 animate-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6 pb-6 border-b border-slate-700/50">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {complaint.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-slate-700/80 text-slate-200 border border-slate-600 font-semibold capitalize px-3 py-1">
                        {complaint.category}
                      </Badge>
                      <Badge
                        className={`font-bold capitalize px-3 py-1 ${getPriorityBadge(
                          complaint.priority
                        )}`}
                      >
                        {complaint.priority} Priority
                      </Badge>
                      <Badge className="bg-slate-700/80 text-slate-200 border border-slate-600 font-semibold px-3 py-1">
                        {format(new Date(complaint.createdAt), "MMM dd, yyyy")}
                      </Badge>
                    </div>
                  </div>
                  <Badge
                    className={`px-4 py-2 text-sm font-bold whitespace-nowrap ${getStatusBadge(
                      complaint.status
                    )}`}
                  >
                    {complaint.status.toUpperCase()}
                  </Badge>
                </div>

                {/* Description */}
                <div className="mb-6 p-5 bg-slate-900/40 rounded-xl border border-slate-700/50 hover:bg-slate-900/60 transition-colors">
                  <p className="font-bold text-white mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-rose-400" />
                    Complaint Description
                  </p>
                  <p className="text-slate-200 leading-relaxed">
                    {complaint.description}
                  </p>
                </div>

                {/* Response */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 font-bold text-white mb-3">
                    <MessageSquare className="h-5 w-5 text-slate-400" />
                    Your Response
                  </label>
                  <textarea
                    value={responseText[complaint._id] || ""}
                    onChange={(e) =>
                      setResponseText((prev) => ({
                        ...prev,
                        [complaint._id]: e.target.value,
                      }))
                    }
                    placeholder="Add your response to address this complaint..."
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-900/40 border-2 border-slate-700/50 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-slate-600 resize-none hover:bg-slate-900/60 transition-colors"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() =>
                      handleUpdateComplaint(complaint._id, "in-progress")
                    }
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white rounded-xl font-bold transition-all duration-200 shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/40 hover:scale-[1.02] active:scale-95"
                  >
                    <Clock size={20} />
                    Mark In Progress
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateComplaint(complaint._id, "resolved")
                    }
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl font-bold transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-95"
                  >
                    <CheckCircle size={20} />
                    Mark as Resolved
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
