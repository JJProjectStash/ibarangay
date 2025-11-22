import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Package,
  MessageSquare,
  Calendar,
  ArrowRight,
  Sparkles,
} from "lucide-react";

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
          // Keep residents on analytics dashboard
          break;
      }
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  // Only residents will see this dashboard
  return <ResidentDashboard />;
};

// Original Dashboard content for residents
const ResidentDashboard: React.FC = () => {
  const quickLinks = [
    {
      title: "Services",
      description: "Request barangay services and equipment",
      icon: Package,
      link: "/services",
      color: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-100 text-blue-600",
    },
    {
      title: "Complaints",
      description: "File and track your complaints",
      icon: MessageSquare,
      link: "/complaints",
      color: "from-red-500 to-red-600",
      iconBg: "bg-red-100 text-red-600",
    },
    {
      title: "Events",
      description: "View and register for barangay events",
      icon: Calendar,
      link: "/events",
      color: "from-green-500 to-green-600",
      iconBg: "bg-green-100 text-green-600",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="container">
        <div className="mb-8 space-y-4 animate-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Welcome to your dashboard</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            My Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Access all your barangay services in one place
          </p>
        </div>

        <Card className="mb-8 border-0 shadow-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
          <CardContent className="relative p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Welcome to iBarangay
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed max-w-2xl">
              Use the navigation menu or quick links below to access services,
              file complaints, and view events. We're here to make your barangay
              experience seamless and efficient.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickLinks.map((link, index) => (
            <a key={index} href={link.link} className="group block">
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${link.color}`} />
                <CardHeader className="space-y-4">
                  <div
                    className={`w-14 h-14 rounded-xl ${link.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <link.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2 group-hover:text-blue-600 transition-colors">
                      {link.title}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {link.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Access now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

        <Card className="mt-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Getting Started</CardTitle>
            <CardDescription className="text-base">
              Here are some tips to help you navigate the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Request Services
                </h4>
                <p className="text-gray-600">
                  Browse available services and submit requests for equipment or
                  facilities you need.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Track Your Requests
                </h4>
                <p className="text-gray-600">
                  Monitor the status of your service requests and complaints in
                  real-time.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-yellow-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Stay Updated
                </h4>
                <p className="text-gray-600">
                  Check notifications regularly for updates on your requests and
                  upcoming events.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
