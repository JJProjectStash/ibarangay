import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AnimatedBackground from "../components/AnimatedBackground";
import {
  ServiceIcon,
  ComplaintIcon,
  EventIcon,
  NotificationIcon,
} from "../components/CustomIcons";
import {
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Clock,
  Sparkles,
} from "lucide-react";

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  const services = [
    {
      icon: <ServiceIcon size={64} />,
      title: "Borrow & Return",
      description:
        "Request to borrow barangay equipment and facilities with ease",
      link: "/services",
      color: "#3B82F6",
      gradient: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
    },
    {
      icon: <ComplaintIcon size={64} />,
      title: "Complaint Center",
      description: "Submit and track your complaints and concerns efficiently",
      link: "/complaints",
      color: "#EF4444",
      gradient: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
    },
    {
      icon: <EventIcon size={64} />,
      title: "Events",
      description: "View and register for barangay events and activities",
      link: "/events",
      color: "#10B981",
      gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    },
    {
      icon: <NotificationIcon size={64} />,
      title: "Notifications",
      description: "Stay updated with important announcements and updates",
      link: "/notifications",
      color: "#F59E0B",
      gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    },
  ];

  const features = [
    {
      icon: CheckCircle,
      title: "Quick & Easy",
      description:
        "Access barangay services anytime, anywhere. No need to visit the office for simple requests.",
      color: "blue",
    },
    {
      icon: TrendingUp,
      title: "Track Your Requests",
      description:
        "Monitor the status of your service requests and complaints in real-time with detailed updates.",
      color: "green",
    },
    {
      icon: Clock,
      title: "Stay Informed",
      description:
        "Get instant notifications about events, announcements, and updates from your barangay.",
      color: "yellow",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600 text-white py-20 md:py-32 overflow-hidden">
        <AnimatedBackground />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">
                Welcome to the Future of Community Services
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Barangay Services
              <br />
              <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              {isAuthenticated
                ? `Hello, ${user?.firstName}! Access all barangay services in one convenient place.`
                : "Your one-stop platform for all barangay services and information"}
            </p>

            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl font-semibold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-200"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-blue-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Our Services
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need for barangay services, all in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Link
                key={index}
                to={isAuthenticated ? service.link : "/login"}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: service.color }}
                />

                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="transform group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                  <div
                    className="flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: service.color }}
                  >
                    Learn more
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center space-y-4 group">
                <div
                  className={`mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br ${
                    feature.color === "blue"
                      ? "from-blue-400 to-blue-600"
                      : feature.color === "green"
                      ? "from-green-400 to-green-600"
                      : "from-yellow-400 to-yellow-600"
                  } flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}
                >
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600 text-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { number: "1000+", label: "Active Users" },
              { number: "500+", label: "Services Completed" },
              { number: "50+", label: "Events Hosted" },
              { number: "24/7", label: "Available Support" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center space-y-2 group cursor-pointer"
              >
                <div className="text-4xl md:text-5xl font-bold group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-lg text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="space-y-4">
              <h4 className="text-xl font-bold">iBarangay Services</h4>
              <p className="text-gray-400 leading-relaxed">
                Making community services accessible to everyone
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-bold">Quick Links</h4>
              <div className="flex flex-col space-y-2">
                <Link
                  to="/services"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Services
                </Link>
                <Link
                  to="/events"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Events
                </Link>
                <Link
                  to="/complaints"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Complaints
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-bold">Contact</h4>
              <p className="text-gray-400">barangay@example.com</p>
              <p className="text-gray-400">+63 123 456 7890</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2024 iBarangay Online Services. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
