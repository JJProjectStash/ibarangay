import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  FileText,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Shield,
  Zap,
  Clock,
  Users,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ParticleBackground } from "@/components/ParticleBackground";
import { FloatingElements } from "@/components/FloatingElements";

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const services = [
    {
      icon: <FileText className="h-12 w-12" />,
      title: "Borrow & Return",
      description:
        "Request to borrow barangay equipment and facilities with real-time tracking",
      link: "/services",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <AlertTriangle className="h-12 w-12" />,
      title: "Complaint Center",
      description:
        "Submit and track your complaints with instant status updates",
      link: "/complaints",
      gradient: "from-red-500 to-pink-500",
    },
    {
      icon: <Calendar className="h-12 w-12" />,
      title: "Events",
      description:
        "View and register for barangay events and community activities",
      link: "/events",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  const features = [
    {
      icon: <Clock className="h-6 w-6" />,
      title: "24/7 Access",
      description: "Access services anytime, anywhere from any device",
      color: "text-blue-400",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Platform",
      description: "Your data is protected with enterprise-grade encryption",
      color: "text-purple-400",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Real-time Updates",
      description: "Get instant notifications about your requests and events",
      color: "text-pink-400",
    },
  ];

  const stats = [
    {
      value: "1,000+",
      label: "Active Users",
      icon: <Users className="h-6 w-6" />,
    },
    {
      value: "500+",
      label: "Services Completed",
      icon: <CheckCircle className="h-6 w-6" />,
    },
    {
      value: "50+",
      label: "Community Events",
      icon: <Calendar className="h-6 w-6" />,
    },
    {
      value: "24/7",
      label: "Support Available",
      icon: <Clock className="h-6 w-6" />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen relative" id="main-content">
      {/* Unified Background with Particles and Floating Elements */}
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

      {/* Particle Background */}
      <ParticleBackground />

      {/* Floating Elements */}
      <FloatingElements />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-5 py-2.5 text-sm font-medium text-purple-200 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-700 hover:scale-105 transition-transform cursor-pointer"
              style={{ animationDelay: "0ms" }}
            >
              <span className="flex h-2 w-2 rounded-full bg-purple-400 animate-pulse"></span>
              <Sparkles className="h-4 w-4" />
              Digital Barangay Services
            </div>

            {/* Heading */}
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: "100ms" }}
            >
              {isAuthenticated ? (
                <>
                  Welcome back,{" "}
                  <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                    {user?.firstName}!
                  </span>
                </>
              ) : (
                <>
                  Your Barangay, <br className="hidden sm:block" />
                  <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Digitally Connected
                  </span>
                </>
              )}
            </h1>

            {/* Description */}
            <p
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: "200ms" }}
            >
              {isAuthenticated
                ? "Access all barangay services in one place. Fast, secure, and convenient."
                : "Experience seamless access to barangay services, real-time updates, and community engagement right at your fingertips."}
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: "300ms" }}
            >
              <Link to={isAuthenticated ? "/services" : "/signup"}>
                <Button
                  size="lg"
                  className="w-full sm:w-auto px-10 py-7 text-lg font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white border-0 shadow-2xl shadow-purple-500/50 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(139,92,246,0.6)] hover:scale-110 group"
                >
                  {isAuthenticated ? "Explore Services" : "Get Started"}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link to="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto px-10 py-7 text-lg font-bold bg-white/10 backdrop-blur-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 text-white transition-all duration-300 hover:scale-110 hover:shadow-xl"
                  >
                    Login
                  </Button>
                </Link>
              )}
            </div>

            {/* Feature Pills */}
            <div
              className="flex flex-wrap items-center justify-center gap-4 pt-10 animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: "400ms" }}
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white/90 hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-110 cursor-pointer group ${feature.color}`}
                >
                  <div className="group-hover:scale-125 transition-transform">
                    {feature.icon}
                  </div>
                  <span className="font-semibold text-sm">{feature.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-bottom-4 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-purple-400" />
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Our Services
              </h2>
              <Sparkles className="h-8 w-8 text-pink-400" />
            </div>
            <p className="text-xl text-white/80">
              Everything you need for barangay services, all in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <Link
                key={index}
                to={isAuthenticated ? service.link : "/login"}
                className="block group"
              >
                <Card
                  variant="glass"
                  className="h-full border-2 border-white/20 shadow-2xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.4)] transition-all duration-500 hover:scale-105 hover:border-white/50 bg-white/10 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Gradient overlay on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />

                  <CardHeader className="text-center space-y-5 p-8 relative z-10">
                    <div
                      className={`w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-white shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                    >
                      {service.icon}
                    </div>
                    <CardTitle className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-base text-white/80 leading-relaxed">
                      {service.description}
                    </CardDescription>
                    <div className="pt-4 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="flex items-center gap-2 text-purple-400 font-semibold">
                        <span>Learn More</span>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Why Choose Us?
            </h2>
            <p className="text-xl text-white/80">
              Streamline your interactions with comprehensive digital tools
              designed for efficiency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                variant="glass"
                className="border-2 border-white/20 shadow-2xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.4)] transition-all duration-500 hover:scale-105 hover:border-white/50 bg-white/10 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="text-center space-y-5 p-8">
                  <div
                    className={`w-20 h-20 mx-auto rounded-2xl bg-purple-500/20 flex items-center justify-center ${feature.color} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-base text-white/80 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative pb-32 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-2xl max-w-5xl mx-auto group hover:shadow-[0_20px_60px_rgba(139,92,246,0.6)] transition-all duration-500">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative z-10 px-8 py-20 md:py-24 text-center space-y-8">
              <div className="inline-block mb-4">
                <Sparkles className="h-16 w-16 text-white animate-pulse" />
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                {isAuthenticated
                  ? "Explore More Services"
                  : "Ready to Get Started?"}
              </h2>
              <p className="text-xl md:text-2xl text-white/95 max-w-2xl mx-auto leading-relaxed">
                {isAuthenticated
                  ? "Discover all the digital services available to make your barangay experience seamless."
                  : "Join thousands of residents enjoying the convenience of digital barangay services."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Link to={isAuthenticated ? "/services" : "/signup"}>
                  <Button
                    size="lg"
                    className="w-full sm:w-auto px-10 py-7 text-lg font-bold bg-white text-purple-600 hover:bg-white/95 shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_20px_50px_rgba(255,255,255,0.4)]"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    {isAuthenticated ? "View Services" : "Register Now"}
                  </Button>
                </Link>
                {!isAuthenticated && (
                  <Link to="/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto px-10 py-7 text-lg font-bold border-2 border-white/40 bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 hover:border-white/60 transition-all duration-300 hover:scale-110"
                    >
                      Login
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
