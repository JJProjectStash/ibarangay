import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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
import api from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import { showToast } from "../../utils/toast";

interface TimeSeriesData {
  date: string;
  complaints: number;
  services: number;
  events: number;
  resolved: number;
}

interface CategoryData {
  category: string;
  count: number;
  percentage: number;
}

interface StaffPerformance {
  staffId: string;
  staffName: string;
  assigned: number;
  resolved: number;
  averageResolutionTime: number;
  rating: number;
}

interface Trends {
  complaints?: { current: number; direction: string; percentage: number };
  resolutionRate?: { current: number; direction: string; percentage: number };
  responseTime?: { direction: string; percentage: number };
  activeUsers?: { current: number; direction: string; percentage: number };
}

interface ResponseTime {
  average: number;
  byPriority?: { high: number; medium: number; low: number };
}

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [days, setDays] = useState(30);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [staffPerformance, setStaffPerformance] = useState<StaffPerformance[]>(
    []
  );
  const [trends, setTrends] = useState<Trends | null>(null);
  const [responseTime, setResponseTime] = useState<ResponseTime | null>(null);

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, days]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [timeSeriesRes, categoryRes, staffRes, trendsRes, responseTimeRes] =
        await Promise.all([
          api.getTimeSeriesData(period, days),
          api.getCategoryAnalytics(),
          api.getStaffPerformance(),
          api.getTrendAnalysis(days),
          api.getResponseTimeAnalytics(),
        ]);

      setTimeSeriesData(timeSeriesRes.data);
      setCategoryData(categoryRes.data);
      setStaffPerformance(staffRes.data);
      setTrends(trendsRes.data);
      setResponseTime(responseTimeRes.data);
    } catch (err) {
      console.error(err);
      console.error("Failed to fetch analytics:", err);
      showToast("Failed to fetch analytics data", "error");
    } finally {
      setLoading(false);
    }
  };

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
  ];

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="container-fluid py-4">
      <div className="page-header mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h3 mb-2">Analytics Dashboard</h1>
            <p className="text-muted">
              Comprehensive system analytics and insights
            </p>
          </div>
          <div className="d-flex gap-2">
            <select
              className="form-select"
              value={period}
              onChange={(e) =>
                setPeriod(e.target.value as "daily" | "weekly" | "monthly")
              }
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <select
              className="form-select"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trend Cards */}
      {trends && (
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted mb-1">Total Complaints</p>
                    <h3 className="mb-0">{trends.complaints?.current || 0}</h3>
                  </div>
                  <div
                    className={`badge ${
                      trends.complaints?.direction === "up"
                        ? "badge-success"
                        : "badge-danger"
                    }`}
                  >
                    {trends.complaints?.direction === "up" ? (
                      <TrendingUp size={16} />
                    ) : (
                      <TrendingDown size={16} />
                    )}
                    {trends.complaints?.percentage || 0}%
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
                    <p className="text-muted mb-1">Resolution Rate</p>
                    <h3 className="mb-0">
                      {trends.resolutionRate?.current || 0}%
                    </h3>
                  </div>
                  <div
                    className={`badge ${
                      trends.resolutionRate?.direction === "up"
                        ? "badge-success"
                        : "badge-danger"
                    }`}
                  >
                    {trends.resolutionRate?.direction === "up" ? (
                      <TrendingUp size={16} />
                    ) : (
                      <TrendingDown size={16} />
                    )}
                    {trends.resolutionRate?.percentage || 0}%
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
                    <p className="text-muted mb-1">Avg Response Time</p>
                    <h3 className="mb-0">{responseTime?.average || 0}h</h3>
                  </div>
                  <div
                    className={`badge ${
                      trends.responseTime?.direction === "down"
                        ? "badge-success"
                        : "badge-danger"
                    }`}
                  >
                    {trends.responseTime?.direction === "down" ? (
                      <TrendingDown size={16} />
                    ) : (
                      <TrendingUp size={16} />
                    )}
                    {trends.responseTime?.percentage || 0}%
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
                    <p className="text-muted mb-1">Active Users</p>
                    <h3 className="mb-0">{trends.activeUsers?.current || 0}</h3>
                  </div>
                  <div
                    className={`badge ${
                      trends.activeUsers?.direction === "up"
                        ? "badge-success"
                        : "badge-danger"
                    }`}
                  >
                    {trends.activeUsers?.direction === "up" ? (
                      <TrendingUp size={16} />
                    ) : (
                      <TrendingDown size={16} />
                    )}
                    {trends.activeUsers?.percentage || 0}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Time Series Chart */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Activity Over Time</h5>
        </div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="complaints"
                stroke="#FF8042"
                name="Complaints"
              />
              <Line
                type="monotone"
                dataKey="services"
                stroke="#0088FE"
                name="Services"
              />
              <Line
                type="monotone"
                dataKey="events"
                stroke="#00C49F"
                name="Events"
              />
              <Line
                type="monotone"
                dataKey="resolved"
                stroke="#82CA9D"
                name="Resolved"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Category Distribution */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Complaint Categories</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: CategoryData) =>
                      `${entry.category}: ${entry.percentage}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {categoryData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Response Time by Priority */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Response Time by Priority</h5>
            </div>
            <div className="card-body">
              {responseTime && (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      {
                        priority: "High",
                        time: responseTime.byPriority?.high || 0,
                      },
                      {
                        priority: "Medium",
                        time: responseTime.byPriority?.medium || 0,
                      },
                      {
                        priority: "Low",
                        time: responseTime.byPriority?.low || 0,
                      },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="priority" />
                    <YAxis
                      label={{
                        value: "Hours",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip />
                    <Bar dataKey="time" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Staff Performance */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Staff Performance</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Staff Member</th>
                  <th>Assigned</th>
                  <th>Resolved</th>
                  <th>Resolution Rate</th>
                  <th>Avg Resolution Time</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {staffPerformance.map((staff) => (
                  <tr key={staff.staffId}>
                    <td>{staff.staffName}</td>
                    <td>{staff.assigned}</td>
                    <td>{staff.resolved}</td>
                    <td>
                      <div className="progress" style={{ height: "20px" }}>
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{
                            width: `${
                              (staff.resolved / staff.assigned) * 100
                            }%`,
                          }}
                        >
                          {Math.round((staff.resolved / staff.assigned) * 100)}%
                        </div>
                      </div>
                    </td>
                    <td>{staff.averageResolutionTime.toFixed(1)}h</td>
                    <td>
                      <span className="badge badge-warning">
                        ⭐ {staff.rating.toFixed(1)}
                      </span>
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

export default Analytics;
