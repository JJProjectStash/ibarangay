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
  Users,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import { EnhancedCard } from "@/components/EnhancedCard";
import { EnhancedStatCard } from "@/components/EnhancedStatCard";
import {
  ServiceIcon,
  ComplaintIcon,
  EventIcon,
  NotificationIcon,
} from "@/components/CustomIcons";
import {
  AnimatedCheckIcon,
  AnimatedSparkleIcon,
  AnimatedGlobeIcon,
  AnimatedRocketIcon,
  AnimatedShieldIcon,
  AnimatedLightningIcon,
  FloatingParticles,
  GlassOrb,
} from "@/components/AnimatedSVGIcons";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const services = [
    {
      icon: <ServiceIcon size={48} />,
      title: "Borrow & Return",
      description: "Request to borrow barangay equipment and facilities",
      link: "/services",
      color: "#3B82F6",
      gradient: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
    },
    {
      icon: <ComplaintIcon size={48} />,
      title: "Complaint Center",
      description: "Submit and track your complaints and concerns",
      link: "/complaints",
      color: "#EF4444",
      gradient: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
    },
    {
      icon: <EventIcon size={48} />,
      title: "Events",
      description: "View and register for barangay events and activities",
      link: "/events",
      color: "#10B981",
      gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    },
    {
      icon: <NotificationIcon size={48} />,
      title: "Notifications",
      description: "Stay updated with important announcements",
      link: "/notifications",
      color: "#F59E0B",
      gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Animated Background */}
        <AnimatedBackground />

        {/* Floating Particles */}
        <FloatingParticles />

        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div
            className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px]"
            style={{ animation: "floatOrb1 20s ease-in-out infinite" }}
          />
          <div
            className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[100px]"
            style={{ animation: "floatOrb2 25s ease-in-out infinite" }}
          />
          <div className="absolute top-[30%] left-[20%] opacity-30">
            <GlassOrb className="w-24 h-24" color="primary" />
          </div>
          <div className="absolute bottom-[20%] right-[15%] opacity-20">
            <GlassOrb className="w-32 h-32" color="accent" />
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-8 text-center lg:text-left animate-in slide-in-from-left-8 duration-700">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm glass-button">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                <AnimatedSparkleIcon className="w-4 h-4 mr-2" />
                Digital Barangay Services
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                {isAuthenticated ? (
                  <>
                    Welcome back, <br />
                    <span className="gradient-text-primary inline-block animate-in slide-in-from-bottom-4 delay-200">
                      {user?.firstName}!
                    </span>
                  </>
                ) : (
                  <>
                    Your Barangay, <br />
                    <span className="gradient-text-primary inline-block animate-in slide-in-from-bottom-4 delay-200">
                      Digitally Connected
                    </span>
                  </>
                )}
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-in slide-in-from-bottom-4 delay-300">
                {isAuthenticated
                  ? "Access all barangay services in one place. Fast, secure, and convenient."
                  : "Experience seamless access to barangay services, real-time updates, and community engagement right at your fingertips."}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 animate-in slide-in-from-bottom-4 delay-400">
                <Link to={isAuthenticated ? "/services" : "/signup"}>
                  <Button
                    size="xl"
                    className="w-full sm:w-auto shadow-xl shadow-primary/20 group btn-glow relative overflow-hidden"
                  >
                    <AnimatedRocketIcon className="w-5 h-5 mr-2" />
                    {isAuthenticated ? "Explore Services" : "Get Started"}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                {!isAuthenticated && (
                  <Link to="/login">
                    <Button
                      size="xl"
                      variant="outline"
                      className="w-full sm:w-auto glass-button"
                    >
                      Login
                    </Button>
                  </Link>
                )}
              </div>

              <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 text-sm text-muted-foreground animate-in slide-in-from-bottom-4 delay-500">
                <div className="flex items-center gap-2 hover-lift cursor-pointer">
                  <AnimatedCheckIcon className="h-5 w-5 text-primary" />
                  <span>24/7 Access</span>
                </div>
                <div className="flex items-center gap-2 hover-lift cursor-pointer">
                  <AnimatedShieldIcon className="h-5 w-5 text-primary" />
                  <span>Secure Platform</span>
                </div>
                <div className="flex items-center gap-2 hover-lift cursor-pointer">
                  <AnimatedLightningIcon className="h-5 w-5 text-primary" />
                  <span>Real-time Updates</span>
                </div>
              </div>
            </div>

            <div className="flex-1 relative animate-in slide-in-from-right-8 duration-700 delay-200">
              <div className="relative z-10">
                {/* Abstract UI Representation using Custom Icons */}
                <div className="relative w-full max-w-lg mx-auto aspect-square">
                  <div
                    className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse"
                    style={{ animationDuration: "4s" }}
                  />

                  {/* Floating Cards Animation with Custom Icons */}
                  <Card
                    className="absolute top-10 left-0 w-64 glass-card float card-3d hover-glow cursor-pointer"
                    style={{ animationDelay: "0s" }}
                  >
                    <CardHeader className="pb-2">
                      <div className="mb-2 flex items-center justify-center">
                        <ServiceIcon size={48} />
                      </div>
                      <CardTitle className="text-lg">Service Request</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                        </span>
                        Processing...
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <Card
                    className="absolute top-1/2 right-0 w-64 glass-card float card-3d hover-glow cursor-pointer"
                    style={{ animationDelay: "1.5s" }}
                  >
                    <CardHeader className="pb-2">
                      <div className="mb-2 flex items-center justify-center">
                        <EventIcon size={48} />
                      </div>
                      <CardTitle className="text-lg">Community Event</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <AnimatedGlobeIcon className="h-4 w-4" />
                        Tomorrow at 9:00 AM
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <Card
                    className="absolute bottom-10 left-10 w-64 glass-card float card-3d hover-glow cursor-pointer"
                    style={{ animationDelay: "0.8s" }}
                  >
                    <CardHeader className="pb-2">
                      <div className="mb-2 flex items-center justify-center">
                        <ComplaintIcon size={48} />
                      </div>
                      <CardTitle className="text-lg">Report Incident</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <AnimatedCheckIcon className="h-4 w-4 text-green-500" />
                        Submitted successfully
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-muted/30 relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-in slide-in-from-bottom-4">
            <div className="inline-flex items-center gap-2 mb-4">
              <AnimatedSparkleIcon className="w-8 h-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold">Our Services</h2>
              <AnimatedSparkleIcon className="w-8 h-8 text-accent" />
            </div>
            <p className="text-lg text-muted-foreground">
              Everything you need for barangay services, all in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Link
                key={index}
                to={isAuthenticated ? service.link : "/login"}
                className="block"
              >
                <EnhancedCard
                  hover={true}
                  gradient={true}
                  className="border-none shadow-lg group overflow-hidden animate-in slide-in-from-bottom-4 h-full"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 group-hover:rotate-12" />
                  <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-all duration-500 group-hover:rotate-6">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-base leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                    <div className="mt-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </EnhancedCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid using EnhancedCard */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-in slide-in-from-bottom-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-muted-foreground">
              Streamline your interactions with the barangay through our
              comprehensive suite of digital tools designed for efficiency and
              transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <FileText className="h-8 w-8" />,
                title: "Quick & Easy",
                desc: "Access barangay services anytime, anywhere. No need to visit the office for simple requests.",
                color: "text-blue-500",
                bg: "bg-blue-500/10",
                delay: "0ms",
              },
              {
                icon: <AlertTriangle className="h-8 w-8" />,
                title: "Track Your Requests",
                desc: "Monitor the status of your service requests and complaints in real-time.",
                color: "text-red-500",
                bg: "bg-red-500/10",
                delay: "100ms",
              },
              {
                icon: <Calendar className="h-8 w-8" />,
                title: "Stay Informed",
                desc: "Get instant notifications about events, announcements, and updates from your barangay.",
                color: "text-green-500",
                bg: "bg-green-500/10",
                delay: "200ms",
              },
            ].map((feature, index) => (
              <EnhancedCard
                key={index}
                hover={true}
                gradient={true}
                className="border-none shadow-lg group overflow-hidden animate-in slide-in-from-bottom-4"
                style={{ animationDelay: feature.delay }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 group-hover:rotate-12" />
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 p-6">
                  <div
                    className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-500 group-hover:rotate-6 shadow-lg`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {feature.desc}
                  </p>
                </div>
              </EnhancedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section using EnhancedStatCard */}
      <section className="py-24 relative overflow-hidden bg-muted/30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 skew-y-3 transform origin-bottom-right -z-10" />
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <EnhancedStatCard
              title="Active Users"
              value="1,000+"
              icon={Users}
              description="Growing community"
              trend={{ value: 12, isPositive: true }}
              color="blue"
              className="animate-in slide-in-from-bottom-4"
            />
            <EnhancedStatCard
              title="Services Completed"
              value="500+"
              icon={FileText}
              description="This year"
              trend={{ value: 8, isPositive: true }}
              color="green"
              className="animate-in slide-in-from-bottom-4 delay-100"
            />
            <EnhancedStatCard
              title="Events Hosted"
              value="50+"
              icon={Calendar}
              description="Community events"
              trend={{ value: 5, isPositive: true }}
              color="purple"
              className="animate-in slide-in-from-bottom-4 delay-200"
            />
            <EnhancedStatCard
              title="Support Available"
              value="24/7"
              icon={TrendingUp}
              description="Always here"
              trend={{ value: 100, isPositive: true }}
              color="orange"
              className="animate-in slide-in-from-bottom-4 delay-300"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden gradient-bg-primary text-white shadow-2xl animate-in slide-in-from-bottom-4">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1577017040065-650ee4d43339?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay" />

            {/* Animated Background Elements */}
            <div className="absolute top-10 left-10 opacity-20">
              <GlassOrb className="w-40 h-40" color="accent" />
            </div>
            <div className="absolute bottom-10 right-10 opacity-20">
              <GlassOrb className="w-32 h-32" color="secondary" />
            </div>

            <div className="relative z-10 px-8 py-16 md:py-24 text-center max-w-4xl mx-auto space-y-8">
              <div className="inline-block mb-4">
                <AnimatedRocketIcon className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold animate-in slide-in-from-bottom-4 delay-100">
                {isAuthenticated
                  ? "Explore More Services"
                  : "Ready to get started?"}
              </h2>
              <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto animate-in slide-in-from-bottom-4 delay-200">
                {isAuthenticated
                  ? "Discover all the digital services available to make your barangay experience seamless."
                  : "Join thousands of residents who are already enjoying the convenience of digital barangay services."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in slide-in-from-bottom-4 delay-300">
                <Link to={isAuthenticated ? "/services" : "/signup"}>
                  <Button
                    size="xl"
                    variant="secondary"
                    className="w-full sm:w-auto text-primary font-bold shadow-lg hover:shadow-xl transition-all btn-glow"
                  >
                    <AnimatedSparkleIcon className="w-5 h-5 mr-2" />
                    {isAuthenticated ? "View Services" : "Register Now"}
                  </Button>
                </Link>
                {!isAuthenticated && (
                  <Link to="/login">
                    <Button
                      size="xl"
                      variant="outline"
                      className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:text-white glass-button"
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
