import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Calendar,
  AlertTriangle,
  Clock,
  ChevronRight,
  Activity,
  Building2,
  Users,
  TrendingUp,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "@/services/api";
import { useState } from "react";

const Dashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect to role-specific dashboard
      switch (user.role) {
        case "admin":
          navigate("/admin", { replace: true });
          break;
        case "staff":
          navigate("/staff", { replace: true });
          break;
        default:
          // Keep residents on this dashboard
          break;
      }
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Only residents will see this dashboard
  return <ResidentDashboard />;
};

// Original Dashboard content for residents
const ResidentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardStats, setDashboardStats] = useState({
    activeRequests: 0,
    upcomingEvents: 0,
    pendingReports: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.getDashboardStats();
      if (response.data) {
        setDashboardStats({
          activeRequests: response.data.activeRequests || 0,
          upcomingEvents: response.data.upcomingEvents || 0,
          pendingReports: response.data.pendingReports || 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const activityData = [
    { name: "Mon", requests: 4 },
    { name: "Tue", requests: 3 },
    { name: "Wed", requests: 2 },
    { name: "Thu", requests: 6 },
    { name: "Fri", requests: 8 },
    { name: "Sat", requests: 5 },
    { name: "Sun", requests: 4 },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "Request",
      title: "Barangay Clearance",
      status: "Processing",
      date: "2 hours ago",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      id: 2,
      type: "Event",
      title: "Community Clean-up Drive",
      status: "Registered",
      date: "1 day ago",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      id: 3,
      type: "System",
      title: "Profile Updated",
      status: "Completed",
      date: "3 days ago",
      icon: <Activity className="h-4 w-4" />,
    },
  ];

  const popularServices = [
    {
      title: "Barangay Clearance",
      desc: "Get your clearance online",
      icon: FileText,
      color: "text-blue-400",
      bg: "bg-blue-500/20",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Business Permit",
      desc: "Apply for business permit",
      icon: Building2,
      color: "text-purple-400",
      bg: "bg-purple-500/20",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Indigency",
      desc: "Certificate of Indigency",
      icon: FileText,
      color: "text-green-400",
      bg: "bg-green-500/20",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Residency",
      desc: "Proof of Residency",
      icon: Users,
      color: "text-orange-400",
      bg: "bg-orange-500/20",
      gradient: "from-orange-500 to-red-500",
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in slide-in-from-top-4 duration-500">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-200 backdrop-blur-sm mb-3">
                <Sparkles className="h-4 w-4" />
                Resident Dashboard
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {user?.firstName}!
                </span>
              </h1>
              <p className="text-white/80 text-lg">
                Here's what's happening in your barangay.
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/services">
                <Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white border-0 shadow-2xl shadow-purple-500/50 transition-all duration-300 hover:scale-105">
                  <FileText className="mr-2 h-4 w-4" />
                  New Request
                </Button>
              </Link>
              <Link to="/complaints">
                <Button
                  variant="outline"
                  className="bg-white/10 backdrop-blur-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 text-white transition-all duration-300 hover:scale-105"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Report Issue
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-700 delay-100">
            <Card className="bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-white/40 shadow-2xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.4)] transition-all duration-300 hover:scale-105 group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/90">
                  Active Requests
                </CardTitle>
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                  <FileText className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-1">
                  {loading ? "..." : dashboardStats.activeRequests}
                </div>
                <p className="text-xs text-white/70">+1 from last week</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-white/40 shadow-2xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.4)] transition-all duration-300 hover:scale-105 group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/90">
                  Upcoming Events
                </CardTitle>
                <div className="p-2 rounded-xl bg-green-500/20 text-green-400 group-hover:scale-110 transition-transform">
                  <Calendar className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-1">
                  {loading ? "..." : dashboardStats.upcomingEvents}
                </div>
                <p className="text-xs text-white/70">Next: Town Hall</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-white/40 shadow-2xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.4)] transition-all duration-300 hover:scale-105 group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/90">
                  Pending Reports
                </CardTitle>
                <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-1">
                  {loading ? "..." : dashboardStats.pendingReports}
                </div>
                <p className="text-xs text-white/70">All clear</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 duration-700 delay-200">
            {/* Activity Chart */}
            <Card className="lg:col-span-2 bg-white/10 backdrop-blur-xl border-2 border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  Request Activity
                </CardTitle>
                <CardDescription className="text-white/70">
                  Overview of your interactions over the last week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="rgba(255,255,255,0.1)"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "rgba(255,255,255,0.7)",
                          fontSize: 12,
                        }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "rgba(255,255,255,0.7)",
                          fontSize: 12,
                        }}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(139,92,246,0.1)" }}
                        contentStyle={{
                          backgroundColor: "rgba(30,27,75,0.95)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          borderRadius: "12px",
                          backdropFilter: "blur(12px)",
                          color: "white",
                        }}
                      />
                      <Bar
                        dataKey="requests"
                        fill="url(#colorGradient)"
                        radius={[8, 8, 0, 0]}
                        barSize={40}
                      />
                      <defs>
                        <linearGradient
                          id="colorGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#a855f7"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="100%"
                            stopColor="#3b82f6"
                            stopOpacity={0.8}
                          />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity Feed */}
            <Card className="bg-white/10 backdrop-blur-xl border-2 border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Clock className="h-5 w-5 text-purple-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 group"
                    >
                      <div className="mt-1 p-2 rounded-full bg-white/10 group-hover:bg-purple-500/20 transition-all duration-300 text-white/80">
                        {activity.icon}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none text-white">
                          {activity.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-white/60">
                          <span>{activity.type}</span>
                          <span>•</span>
                          <span>{activity.date}</span>
                        </div>
                      </div>
                      <div className="text-xs font-medium px-2 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
                        {activity.status}
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    className="w-full text-xs text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
                  >
                    View all activity <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Links / Services Preview */}
          <div className="space-y-4 animate-in fade-in duration-700 delay-300">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-purple-400" />
                Popular Services
              </h2>
              <Link to="/services">
                <Button
                  variant="ghost"
                  className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
                >
                  View all <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularServices.map((service, i) => (
                <Link to="/services" key={i}>
                  <Card className="h-full bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-white/40 shadow-2xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.4)] transition-all duration-300 hover:scale-105 group relative overflow-hidden">
                    {/* Gradient overlay on hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    />
                    <CardHeader className="p-4 relative z-10">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${service.bg} ${service.color} group-hover:scale-110 transition-transform duration-300`}
                        >
                          <service.icon className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <CardTitle className="text-base text-white">
                            {service.title}
                          </CardTitle>
                          <CardDescription className="text-xs text-white/70">
                            {service.desc}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <Card className="bg-white/10 backdrop-blur-xl border-2 border-purple-400/30 shadow-2xl animate-in scale-in duration-700 delay-400">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-purple-500/20">
                    <CheckCircle2 className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white">
                      Need assistance?
                    </h3>
                    <p className="text-sm text-white/70">
                      Our team is here to help you with any questions
                    </p>
                  </div>
                </div>
                <Link to="/complaints">
                  <Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white border-0 shadow-2xl shadow-purple-500/50 transition-all duration-300 hover:scale-105">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
