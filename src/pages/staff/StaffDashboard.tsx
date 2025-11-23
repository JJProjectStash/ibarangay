import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  AlertCircle,
  CheckCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "../../services/api";
import RequestManagement from "../../components/staff/RequestManagement";
import { Service, Complaint } from "../../types";
import { showToast } from "../../utils/toast";
import LoadingSpinner from "../../components/LoadingSpinner";

const StaffDashboard: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [servicesResponse, complaintsResponse] = await Promise.all([
        api.getServiceRequests(),
        api.getComplaints(),
      ]);

      setServices(servicesResponse.data || []);
      setComplaints(complaintsResponse.data || []);
    } catch (error) {
      const err = error as Error;
      showToast({
        message: err.message || "Failed to fetch data",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateServiceStatus = async (
    id: string,
    status: string,
    notes?: string
  ) => {
    try {
      await api.updateServiceStatus(id, status, notes);
      showToast({
        message: "Service request updated successfully",
        type: "success",
      });
      fetchData();
    } catch (error) {
      const err = error as Error;
      showToast({
        message: err.message || "Failed to update service request",
        type: "error",
      });
    }
  };

  const handleUpdateComplaintStatus = async (
    id: string,
    status: string,
    response?: string
  ) => {
    try {
      await api.updateComplaintStatus(id, status, response);
      showToast({ message: "Complaint updated successfully", type: "success" });
      fetchData();
    } catch (error) {
      const err = error as Error;
      showToast({
        message: err.message || "Failed to update complaint",
        type: "error",
      });
    }
  };

  const pendingServices = services.filter((s) => s.status === "pending");
  const pendingComplaints = complaints.filter((c) => c.status === "pending");
  const inProgressComplaints = complaints.filter(
    (c) => c.status === "in-progress"
  );
  const resolvedComplaints = complaints.filter((c) => c.status === "resolved");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Pending Services",
      value: pendingServices.length,
      icon: Clock,
      color: "yellow",
      gradient: "from-yellow-500 to-orange-500",
      description: "Awaiting processing",
      bgColor: "bg-yellow-500/20",
      textColor: "text-yellow-400",
      borderColor: "border-yellow-400/30",
    },
    {
      title: "Pending Complaints",
      value: pendingComplaints.length,
      icon: AlertCircle,
      color: "red",
      gradient: "from-red-500 to-pink-500",
      description: "Requires attention",
      bgColor: "bg-red-500/20",
      textColor: "text-red-400",
      borderColor: "border-red-400/30",
    },
    {
      title: "In Progress",
      value: inProgressComplaints.length,
      icon: ClipboardList,
      color: "blue",
      gradient: "from-blue-500 to-cyan-500",
      description: "Currently handling",
      bgColor: "bg-blue-500/20",
      textColor: "text-blue-400",
      borderColor: "border-blue-400/30",
    },
    {
      title: "Resolved",
      value: resolvedComplaints.length,
      icon: CheckCircle,
      color: "green",
      gradient: "from-green-500 to-emerald-500",
      description: "Successfully completed",
      bgColor: "bg-green-500/20",
      textColor: "text-green-400",
      borderColor: "border-green-400/30",
    },
  ];

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
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-200 backdrop-blur-sm mb-3">
              <ClipboardList className="h-4 w-4" />
              Staff Dashboard
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
              Request{" "}
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Management
              </span>
            </h1>
            <p className="text-white/90 text-lg font-medium">
              Manage service requests and complaints
            </p>
          </div>

          {/* Stats Cards - IMPROVED READABILITY */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-700 delay-100">
            {statCards.map((stat, index) => (
              <Card
                key={index}
                className={`bg-white/15 backdrop-blur-xl border-2 ${stat.borderColor} hover:border-white/50 shadow-2xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.4)] transition-all duration-300 hover:scale-105 group relative overflow-hidden`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Gradient overlay on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />
                <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
                  <CardTitle className="text-sm font-semibold text-white">
                    {stat.title}
                  </CardTitle>
                  <div
                    className={`p-2.5 rounded-xl ${stat.bgColor} ${stat.textColor} group-hover:scale-110 transition-transform border ${stat.borderColor}`}
                  >
                    <stat.icon className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className={`text-4xl font-bold ${stat.textColor} mb-1`}>
                    {stat.value}
                  </div>
                  <p className="text-sm text-white/80 font-medium">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Request Management - IMPROVED CONTRAST */}
          <Card className="bg-white/15 backdrop-blur-xl border-2 border-white/30 shadow-2xl animate-in slide-in-from-bottom-8 duration-700 delay-200">
            <CardHeader className="border-b border-white/20">
              <CardTitle className="text-white text-xl flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                Request Management
              </CardTitle>
              <p className="text-sm text-white/80 mt-2 font-medium">
                Review and process service requests and complaints
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <RequestManagement
                services={services}
                complaints={complaints}
                onUpdateServiceStatus={handleUpdateServiceStatus}
                onUpdateComplaintStatus={handleUpdateComplaintStatus}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
