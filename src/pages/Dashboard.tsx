import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Users, Clock, CheckCircle } from "lucide-react";
import api from "../services/api";

const Dashboard: React.FC = () => {
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [staffPerformance, setStaffPerformance] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState("daily");

  const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const [timeSeries, category, staff, trends] = await Promise.all([
        api.getTimeSeriesData(period, 30),
        api.getCategoryAnalytics(),
        api.getStaffPerformance(),
        api.getTrendAnalysis(30),
      ]);

      setTimeSeriesData(timeSeries.data || []);
      setCategoryData(category.data || []);
      setStaffPerformance(staff.data || []);
      setTrendData(trends.data || []);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMetrics = () => {
    const totalComplaints = timeSeriesData.reduce(
      (sum, item) => sum + (item.total || 0),
      0
    );
    const resolvedComplaints = timeSeriesData.reduce(
      (sum, item) => sum + (item.resolved || 0),
      0
    );
    const avgResolutionRate =
      totalComplaints > 0
        ? ((resolvedComplaints / totalComplaints) * 100).toFixed(1)
        : "0";

    return {
      totalComplaints,
      resolvedComplaints,
      avgResolutionRate,
      activeStaff: staffPerformance.length,
    };
  };

  const metrics = calculateMetrics();

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem 0", minHeight: "calc(100vh - 64px)" }}>
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
            Analytics Dashboard
          </h1>
          <select
            className="input"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{ width: "auto" }}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  padding: "0.75rem",
                  background: "rgba(99, 102, 241, 0.1)",
                  borderRadius: "8px",
                }}
              >
                <TrendingUp size={24} style={{ color: "#6366f1" }} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    marginBottom: "0.25rem",
                  }}
                >
                  Total Complaints
                </p>
                <p style={{ fontSize: "1.75rem", fontWeight: "bold" }}>
                  {metrics.totalComplaints}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  padding: "0.75rem",
                  background: "rgba(16, 185, 129, 0.1)",
                  borderRadius: "8px",
                }}
              >
                <CheckCircle size={24} style={{ color: "#10b981" }} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    marginBottom: "0.25rem",
                  }}
                >
                  Resolved
                </p>
                <p style={{ fontSize: "1.75rem", fontWeight: "bold" }}>
                  {metrics.resolvedComplaints}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  padding: "0.75rem",
                  background: "rgba(245, 158, 11, 0.1)",
                  borderRadius: "8px",
                }}
              >
                <Clock size={24} style={{ color: "#f59e0b" }} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    marginBottom: "0.25rem",
                  }}
                >
                  Resolution Rate
                </p>
                <p style={{ fontSize: "1.75rem", fontWeight: "bold" }}>
                  {metrics.avgResolutionRate}%
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  padding: "0.75rem",
                  background: "rgba(139, 92, 246, 0.1)",
                  borderRadius: "8px",
                }}
              >
                <Users size={24} style={{ color: "#8b5cf6" }} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    marginBottom: "0.25rem",
                  }}
                >
                  Active Staff
                </p>
                <p style={{ fontSize: "1.75rem", fontWeight: "bold" }}>
                  {metrics.activeStaff}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {/* Time Series Chart */}
          <div className="card">
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "1.5rem",
              }}
            >
              Complaints Over Time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id.day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#6366f1"
                  strokeWidth={2}
                  name="Total"
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Resolved"
                />
                <Line
                  type="monotone"
                  dataKey="pending"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="Pending"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="card">
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "1.5rem",
              }}
            >
              Category Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {categoryData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Staff Performance */}
          <div className="card">
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "1.5rem",
              }}
            >
              Staff Performance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={staffPerformance.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="staffName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalAssigned" fill="#6366f1" name="Assigned" />
                <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Trend Analysis */}
          <div className="card">
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "1.5rem",
              }}
            >
              Resolution Rate Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period.week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="resolutionRate"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Resolution Rate (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Details Table */}
        <div className="card" style={{ marginTop: "1.5rem" }}>
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              marginBottom: "1.5rem",
            }}
          >
            Category Performance Details
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border)" }}>
                  <th
                    style={{
                      padding: "0.75rem",
                      textAlign: "left",
                      fontWeight: "600",
                    }}
                  >
                    Category
                  </th>
                  <th
                    style={{
                      padding: "0.75rem",
                      textAlign: "center",
                      fontWeight: "600",
                    }}
                  >
                    Total
                  </th>
                  <th
                    style={{
                      padding: "0.75rem",
                      textAlign: "center",
                      fontWeight: "600",
                    }}
                  >
                    Resolved
                  </th>
                  <th
                    style={{
                      padding: "0.75rem",
                      textAlign: "center",
                      fontWeight: "600",
                    }}
                  >
                    Resolution Rate
                  </th>
                  <th
                    style={{
                      padding: "0.75rem",
                      textAlign: "center",
                      fontWeight: "600",
                    }}
                  >
                    Avg Rating
                  </th>
                </tr>
              </thead>
              <tbody>
                {categoryData.map((cat, index) => (
                  <tr
                    key={index}
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <td style={{ padding: "0.75rem" }}>{cat.category}</td>
                    <td style={{ padding: "0.75rem", textAlign: "center" }}>
                      {cat.total}
                    </td>
                    <td style={{ padding: "0.75rem", textAlign: "center" }}>
                      {cat.resolved}
                    </td>
                    <td style={{ padding: "0.75rem", textAlign: "center" }}>
                      {cat.resolutionRate?.toFixed(1)}%
                    </td>
                    <td style={{ padding: "0.75rem", textAlign: "center" }}>
                      {cat.avgRating?.toFixed(1) || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
