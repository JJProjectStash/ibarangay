import React, { useState, useEffect } from "react";
import { ClipboardList, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "../../services/api";
import RequestManagement from "../../components/staff/RequestManagement";
import { Service, Complaint } from "../../types";
import { showToast } from "../../utils/toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import { StatCard } from "../../components/StatCard";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6 page-transition">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="animate-in slide-in-from-top-4 duration-500">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Staff Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage service requests and complaints
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-700 delay-100">
          <StatCard
            title="Pending Services"
            value={pendingServices.length}
            icon={Clock}
            color="yellow"
            description="Awaiting processing"
            className="card-hover"
          />
          <StatCard
            title="Pending Complaints"
            value={pendingComplaints.length}
            icon={AlertCircle}
            color="red"
            description="Requires attention"
            className="card-hover"
          />
          <StatCard
            title="In Progress"
            value={inProgressComplaints.length}
            icon={ClipboardList}
            color="blue"
            description="Currently handling"
            className="card-hover"
          />
          <StatCard
            title="Resolved"
            value={resolvedComplaints.length}
            icon={CheckCircle}
            color="green"
            description="Successfully completed"
            className="card-hover"
          />
        </div>

        {/* Request Management */}
        <Card className="glass-card animate-in slide-in-from-bottom-8 duration-700 delay-200">
          <CardHeader>
            <CardTitle>Request Management</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Review and process service requests and complaints
            </p>
          </CardHeader>
          <CardContent>
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
  );
};

export default StaffDashboard;
