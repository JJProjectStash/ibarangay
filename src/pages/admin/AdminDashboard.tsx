import React, { useState, useEffect } from "react";
import {
  Users,
  FileText,
  Package,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity,
} from "lucide-react";
import api from "../../services/apiExtensions";
import { DashboardStats, TimeSeriesData } from "../../types";
import { showErrorToast } from "../../components/Toast";
import { getErrorMessage } from "../../utils/errorHandler";
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

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [statsResponse, timeSeriesResponse] = await Promise.all([
        api.getDashboardStats(),
        api.getTimeSeriesData(period, 30),
      ]);

      setStats(statsResponse.data);
      setTimeSeriesData(timeSeriesResponse.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      showErrorToast(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ minHeight: "calc(100vh - 64px)", padding: "2rem" }}
      >
        <div className="spinner" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container" style={{ padding: "2rem 0" }}>
        <div className="alert alert-error">
          <AlertCircle size={20} />
          Failed to load dashboard data. Please try again.
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <Users size={24} />,
      color: "var(--primary-500)",
      bgColor: "var(--primary-50)",
    },
    {
      title: "Total Complaints",
      value: stats.totalComplaints,
      icon: <FileText size={24} />,
      color: "var(--warning-500)",
      bgColor: "var(--warning-50)",
      subtitle: `${stats.pendingComplaints} pending`,
    },
    {
      title: "Service Requests",
      value: stats.totalServices,
      icon: <Package size={24} />,
      color: "var(--info-500)",
      bgColor: "var(--info-50)",
      subtitle: `${stats.pendingServices} pending`,
    },
    {
      title: "Events",
      value: stats.totalEvents,
      icon: <Calendar size={24} />,
      color: "var(--success-500)",
      bgColor: "var(--success-50)",
      subtitle: `${stats.upcomingEvents} upcoming`,
    },
  ];

  const resolutionRate =
    stats.totalComplaints > 0
      ? ((stats.resolvedComplaints / stats.totalComplaints) * 100).toFixed(1)
      : "0";

  return (
    <div style={{ padding: "2rem 0", minHeight: "calc(100vh - 64px)" }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 className="text-3xl font-bold" style={{ marginBottom: "0.5rem" }}>
            Admin Dashboard
          </h1>
          <p className="text-secondary">
            Overview of system statistics and performance
          </p>
        </div>

        {/* Stat Cards */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{ gap: "1.5rem", marginBottom: "2rem" }}
        >
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="card animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p
                    className="text-sm text-secondary"
                    style={{ marginBottom: "0.5rem" }}
                  >
                    {stat.title}
                  </p>
                  <p
                    className="text-3xl font-bold"
                    style={{ marginBottom: "0.25rem" }}
                  >
                    {stat.value}
                  </p>
                  {stat.subtitle && (
                    <p className="text-xs text-tertiary">{stat.subtitle}</p>
                  )}
                </div>
                <div
                  style={{
                    padding: "0.75rem",
                    borderRadius: "var(--radius-lg)",
                    backgroundColor: stat.bgColor,
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2"
          style={{ gap: "1.5rem", marginBottom: "2rem" }}
        >
          {/* Time Series Chart */}
          <div className="card">
            <div
              className="flex items-center justify-between"
              style={{ marginBottom: "1.5rem" }}
            >
              <h2 className="text-xl font-semibold">Activity Trends</h2>
              <select
                className="input"
                value={period}
                onChange={(e) =>
                  setPeriod(e.target.value as "daily" | "weekly" | "monthly")
                }
                style={{ width: "auto", padding: "0.5rem" }}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border-color)"
                />
                <XAxis
                  dataKey="date"
                  stroke="var(--text-secondary)"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="var(--text-secondary)"
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="complaints"
                  stroke="#ff9800"
                  strokeWidth={2}
                  name="Complaints"
                />
                <Line
                  type="monotone"
                  dataKey="services"
                  stroke="#2196f3"
                  strokeWidth={2}
                  name="Services"
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  stroke="#4caf50"
                  strokeWidth={2}
                  name="Resolved"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Resolution Rate */}
          <div className="card">
            <h2
              className="text-xl font-semibold"
              style={{ marginBottom: "1.5rem" }}
            >
              Performance Metrics
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <div
                  className="flex items-center justify-between"
                  style={{ marginBottom: "0.5rem" }}
                >
                  <span className="text-sm text-secondary">
                    Resolution Rate
                  </span>
                  <span className="text-lg font-semibold">
                    {resolutionRate}%
                  </span>
                </div>
                <div
                  style={{
                    height: "8px",
                    backgroundColor: "var(--gray-200)",
                    borderRadius: "var(--radius-full)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${resolutionRate}%`,
                      backgroundColor: "var(--success-500)",
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
              </div>

              <div
                className="grid grid-cols-2 gap-3"
                style={{ marginTop: "1rem" }}
              >
                <div
                  className="card"
                  style={{
                    padding: "1rem",
                    backgroundColor: "var(--success-50)",
                    border: "none",
                  }}
                >
                  <div
                    className="flex items-center gap-2"
                    style={{ marginBottom: "0.5rem" }}
                  >
                    <CheckCircle
                      size={16}
                      style={{ color: "var(--success-700)" }}
                    />
                    <span className="text-xs text-secondary">Resolved</span>
                  </div>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "var(--success-700)" }}
                  >
                    {stats.resolvedComplaints}
                  </p>
                </div>

                <div
                  className="card"
                  style={{
                    padding: "1rem",
                    backgroundColor: "var(--warning-50)",
                    border: "none",
                  }}
                >
                  <div
                    className="flex items-center gap-2"
                    style={{ marginBottom: "0.5rem" }}
                  >
                    <Clock size={16} style={{ color: "var(--warning-700)" }} />
                    <span className="text-xs text-secondary">Pending</span>
                  </div>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "var(--warning-700)" }}
                  >
                    {stats.pendingComplaints}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div
            className="flex items-center gap-2"
            style={{ marginBottom: "1.5rem" }}
          >
            <Activity size={20} />
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </div>
          <div className="flex flex-col gap-3">
            {stats.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity, index) => (
                <div
                  key={activity._id}
                  className="flex items-start gap-3 p-3"
                  style={{
                    backgroundColor: "var(--background-secondary)",
                    borderRadius: "var(--radius-md)",
                    animation: "slideInUp 0.3s ease",
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: "var(--primary-500)",
                      marginTop: "6px",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <p
                      className="font-medium"
                      style={{ marginBottom: "0.25rem" }}
                    >
                      {activity.title}
                    </p>
                    <p className="text-sm text-secondary">
                      {activity.description}
                    </p>
                    <p
                      className="text-xs text-tertiary"
                      style={{ marginTop: "0.25rem" }}
                    >
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`badge badge-${
                      activity.type === "complaint"
                        ? "warning"
                        : activity.type === "service"
                        ? "info"
                        : "success"
                    }`}
                  >
                    {activity.type}
                  </span>
                </div>
              ))
            ) : (
              <p
                className="text-center text-secondary"
                style={{ padding: "2rem" }}
              >
                No recent activity
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
