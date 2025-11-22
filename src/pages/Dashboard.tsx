import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
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
import { EnhancedStatCard } from "@/components/EnhancedStatCard";
import api from "@/services/api";

const Dashboard = () => {
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
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Business Permit",
      desc: "Apply for business permit",
      icon: Building2,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Indigency",
      desc: "Certificate of Indigency",
      icon: FileText,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Residency",
      desc: "Proof of Residency",
      icon: Users,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6 page-transition">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in slide-in-from-top-4 duration-500">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Welcome back, {user?.firstName}! Here's what's happening in your
              barangay.
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/services">
              <Button className="shadow-lg shadow-primary/20 hover-lift">
                <FileText className="mr-2 h-4 w-4" />
                New Request
              </Button>
            </Link>
            <Link to="/complaints">
              <Button
                variant="outline"
                className="border-destructive/50 text-destructive hover:bg-destructive/10 hover-lift"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Report Issue
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-700 delay-100">
          <EnhancedStatCard
            title="Active Requests"
            value={loading ? "..." : dashboardStats.activeRequests}
            icon={FileText}
            color="blue"
            description="+1 from last week"
            className="card-hover"
          />
          <EnhancedStatCard
            title="Upcoming Events"
            value={loading ? "..." : dashboardStats.upcomingEvents}
            icon={Calendar}
            color="green"
            description="Next: Town Hall"
            className="card-hover"
          />
          <EnhancedStatCard
            title="Pending Reports"
            value={loading ? "..." : dashboardStats.pendingReports}
            icon={AlertTriangle}
            color="orange"
            description="All clear"
            className="card-hover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 duration-700 delay-200">
          {/* Activity Chart */}
          <Card className="lg:col-span-2 glass-card shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Request Activity
              </CardTitle>
              <CardDescription>
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
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "hsl(var(--muted-foreground))",
                        fontSize: 12,
                      }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "hsl(var(--muted-foreground))",
                        fontSize: 12,
                      }}
                    />
                    <Tooltip
                      cursor={{ fill: "hsl(var(--muted)/0.2)" }}
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                        boxShadow: "var(--shadow-md)",
                      }}
                    />
                    <Bar
                      dataKey="requests"
                      fill="hsl(var(--primary))"
                      radius={[8, 8, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Feed */}
          <Card className="glass-card shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
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
                    <div className="mt-1 p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                      {activity.icon}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{activity.type}</span>
                        <span>•</span>
                        <span>{activity.date}</span>
                      </div>
                    </div>
                    <div className="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                      {activity.status}
                    </div>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  className="w-full text-xs text-muted-foreground hover:text-primary"
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
            <h2 className="text-2xl font-semibold tracking-tight">
              Popular Services
            </h2>
            <Link to="/services">
              <Button variant="ghost" className="hover-lift">
                View all <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularServices.map((service, i) => (
              <Link to="/services" key={i}>
                <Card className="card-interactive h-full border-muted/50 hover:border-primary/50 glass-card">
                  <CardHeader className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${service.bg} ${service.color} group-hover:scale-110 transition-transform duration-300`}
                      >
                        <service.icon className={`h-5 w-5`} />
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-base">
                          {service.title}
                        </CardTitle>
                        <CardDescription className="text-xs">
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
        <Card className="glass-card border-primary/20 animate-in scale-in duration-700 delay-400">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Need assistance?</h3>
                  <p className="text-sm text-muted-foreground">
                    Our team is here to help you with any questions
                  </p>
                </div>
              </div>
              <Link to="/complaints">
                <Button className="shadow-lg shadow-primary/20 hover-lift">
                  Contact Support
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
