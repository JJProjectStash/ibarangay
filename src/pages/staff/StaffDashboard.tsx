import { useState, useEffect } from "react";
import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "../../services/apiExtensions";
import { Complaint, Service } from "../../types";
import LoadingSpinner from "../../components/LoadingSpinner";
import { showToast } from "../../utils/toast";
import { useAuth } from "../../context/AuthContext";

interface DashboardStats {
  assignedToMe?: number;
  inProgress?: number;
  resolvedToday?: number;
  pendingServices?: number;
}

interface PerformanceData {
  name: string;
  value: number;
}

const StaffDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [assignedComplaints, setAssignedComplaints] = useState<Complaint[]>([]);
  const [pendingServices, setPendingServices] = useState<Service[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, complaintsRes, servicesRes, performanceRes] =
        await Promise.all([
          api.getDashboardStats(),
          api.getComplaints({ status: "in-progress", limit: 5 }),
          api.getServiceRequests({ status: "pending", limit: 5 }),
          api.getStaffPerformance(),
        ]);

      setStats(statsRes.data);
      setAssignedComplaints(complaintsRes.data);
      setPendingServices(servicesRes.data);

      // Find current staff performance
      const staffPerf = performanceRes.data.find(
        (s: { staffId: string; assigned: number; resolved: number }) =>
          s.staffId === user?.id
      );
      if (staffPerf) {
        setPerformanceData([
          { name: "Assigned", value: staffPerf.assigned },
          { name: "Resolved", value: staffPerf.resolved },
          { name: "Pending", value: staffPerf.assigned - staffPerf.resolved },
        ]);
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch dashboard data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateComplaintStatus = async (id: string, status: string) => {
    try {
      await api.updateComplaintStatus(id, status);
      showToast("Complaint status updated successfully", "success");
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      showToast("Failed to update complaint status", "error");
    }
  };

  const handleUpdateServiceStatus = async (id: string, status: string) => {
    try {
      await api.updateServiceStatus(id, status);
      showToast("Service request status updated successfully", "success");
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      showToast("Failed to update service status", "error");
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: "badge-info",
      medium: "badge-warning",
      high: "badge-danger",
    };
    return colors[priority as keyof typeof colors] || "badge-secondary";
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "badge-warning",
      "in-progress": "badge-info",
      resolved: "badge-success",
      closed: "badge-secondary",
      approved: "badge-success",
      rejected: "badge-danger",
    };
    return colors[status as keyof typeof colors] || "badge-secondary";
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="container-fluid py-4">
      <div className="page-header mb-4">
        <h1 className="h3 mb-2">Staff Dashboard</h1>
        <p className="text-muted">
          Welcome back, {user?.firstName}! Here's your work overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1">Assigned to Me</p>
                  <h3 className="mb-0">{stats?.assignedToMe || 0}</h3>
                </div>
                <div className="icon-box bg-primary-subtle">
                  <FileText size={24} className="text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1">In Progress</p>
                  <h3 className="mb-0">{stats?.inProgress || 0}</h3>
                </div>
                <div className="icon-box bg-warning-subtle">
                  <Clock size={24} className="text-warning" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1">Resolved Today</p>
                  <h3 className="mb-0">{stats?.resolvedToday || 0}</h3>
                </div>
                <div className="icon-box bg-success-subtle">
                  <CheckCircle size={24} className="text-success" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1">Pending Services</p>
                  <h3 className="mb-0">{stats?.pendingServices || 0}</h3>
                </div>
                <div className="icon-box bg-info-subtle">
                  <AlertCircle size={24} className="text-info" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Assigned Complaints */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">My Assigned Complaints</h5>
            </div>
            <div className="card-body">
              {assignedComplaints.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  No complaints assigned to you
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {assignedComplaints.map((complaint) => (
                    <div key={complaint._id} className="list-group-item px-0">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{complaint.title}</h6>
                          <p className="text-muted small mb-2">
                            {complaint.description.substring(0, 80)}...
                          </p>
                          <div className="d-flex gap-2">
                            <span
                              className={`badge ${getPriorityBadge(
                                complaint.priority
                              )}`}
                            >
                              {complaint.priority}
                            </span>
                            <span
                              className={`badge ${getStatusBadge(
                                complaint.status
                              )}`}
                            >
                              {complaint.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex gap-2 mt-2">
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() =>
                            handleUpdateComplaintStatus(
                              complaint._id,
                              "resolved"
                            )
                          }
                        >
                          Mark Resolved
                        </button>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() =>
                            (window.location.href = `/complaints?id=${complaint._id}`)
                          }
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pending Service Requests */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Pending Service Requests</h5>
            </div>
            <div className="card-body">
              {pendingServices.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  No pending service requests
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {pendingServices.map((service) => (
                    <div key={service._id} className="list-group-item px-0">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{service.itemName}</h6>
                          <p className="text-muted small mb-2">
                            Type: {service.itemType} | Quantity:{" "}
                            {service.quantity}
                          </p>
                          <p className="text-muted small mb-2">
                            Purpose: {service.purpose}
                          </p>
                          <span
                            className={`badge ${getStatusBadge(
                              service.status
                            )}`}
                          >
                            {service.status}
                          </span>
                        </div>
                      </div>
                      <div className="d-flex gap-2 mt-2">
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() =>
                            handleUpdateServiceStatus(service._id, "approved")
                          }
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            handleUpdateServiceStatus(service._id, "rejected")
                          }
                        >
                          Reject
                        </button>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() =>
                            (window.location.href = `/services?id=${service._id}`)
                          }
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">My Performance</h5>
            </div>
            <div className="card-body">
              {performanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-4 text-muted">
                  No performance data available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
