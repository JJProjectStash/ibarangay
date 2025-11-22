import React from "react";
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
  Bell,
  Activity,
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
  LineChart,
  Line,
} from "recharts";

const Dashboard = () => {
  const { user } = useAuth();

  // Mock Data
  const stats = [
    {
      title: "Active Requests",
      value: "3",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      change: "+1 from last week",
      bg: "bg-blue-100",
    },
    {
      title: "Upcoming Events",
      value: "2",
      icon: <Calendar className="h-5 w-5 text-green-600" />,
      change: "Next: Town Hall",
      bg: "bg-green-100",
    },
    {
      title: "Pending Reports",
      value: "0",
      icon: <AlertTriangle className="h-5 w-5 text-orange-600" />,
      change: "All clear",
      bg: "bg-orange-100",
    },
  ];

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

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in slide-in-from-top-4 duration-500">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName}! Here's what's happening in your
            barangay.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/services">
            <Button className="shadow-lg shadow-primary/20">
              <FileText className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </Link>
          <Link to="/complaints">
            <Button
              variant="outline"
              className="border-destructive/50 text-destructive hover:bg-destructive/10"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Report Issue
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="card-hover border-none shadow-md overflow-hidden relative"
          >
            <div
              className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-20 ${stat.bg.replace(
                "100",
                "500"
              )}`}
            />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <Card className="lg:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle>Request Activity</CardTitle>
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
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 group">
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
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Popular Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Barangay Clearance",
              desc: "Get your clearance online",
              icon: FileText,
              color: "text-blue-500",
            },
            {
              title: "Business Permit",
              desc: "Apply for business permit",
              icon: Building2,
              color: "text-purple-500",
            },
            {
              title: "Indigency",
              desc: "Certificate of Indigency",
              icon: FileText,
              color: "text-green-500",
            },
            {
              title: "Residency",
              desc: "Proof of Residency",
              icon: Users,
              color: "text-orange-500",
            },
          ].map((service, i) => (
            <Link to="/services" key={i}>
              <Card className="card-interactive h-full border-muted/50 hover:border-primary/50">
                <CardHeader className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg bg-muted ${service.color} bg-opacity-10`}
                    >
                      <service.icon className={`h-5 w-5 ${service.color}`} />
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
    </div>
  );
};

// Helper icons needed for the component
import { Building2, Users } from "lucide-react";

export default Dashboard;
