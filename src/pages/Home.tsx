import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
  CheckCircle2,
  Building2,
  ShieldCheck,
} from "lucide-react";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[100px] animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-8 text-center lg:text-left animate-in slide-in-from-left-8 duration-700">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                Digital Barangay Services
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                Your Barangay, <br />
                <span className="gradient-text-primary">
                  Digitally Connected
                </span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Experience seamless access to barangay services, real-time
                updates, and community engagement right at your fingertips.
                Fast, secure, and convenient.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Link to="/services">
                  <Button
                    size="xl"
                    className="w-full sm:w-auto shadow-xl shadow-primary/20 group"
                  >
                    Explore Services
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    size="xl"
                    variant="outline"
                    className="w-full sm:w-auto bg-background/50 backdrop-blur-sm"
                  >
                    Create Account
                  </Button>
                </Link>
              </div>

              <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>24/7 Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>Secure Platform</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>Real-time Updates</span>
                </div>
              </div>
            </div>

            <div className="flex-1 relative animate-in slide-in-from-right-8 duration-700 delay-200">
              <div className="relative z-10">
                {/* Abstract UI Representation */}
                <div className="relative w-full max-w-lg mx-auto aspect-square">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-full blur-3xl -z-10" />

                  {/* Floating Cards Animation */}
                  <Card
                    className="absolute top-10 left-0 w-64 glass-card float"
                    style={{ animationDelay: "0s" }}
                  >
                    <CardHeader className="pb-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2 text-primary">
                        <FileText className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">
                        Clearance Request
                      </CardTitle>
                      <CardDescription>Processing...</CardDescription>
                    </CardHeader>
                  </Card>

                  <Card
                    className="absolute top-1/2 right-0 w-64 glass-card float"
                    style={{ animationDelay: "1.5s" }}
                  >
                    <CardHeader className="pb-2">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-2 text-accent">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">Community Event</CardTitle>
                      <CardDescription>Tomorrow at 9:00 AM</CardDescription>
                    </CardHeader>
                  </Card>

                  <Card
                    className="absolute bottom-10 left-10 w-64 glass-card float"
                    style={{ animationDelay: "0.8s" }}
                  >
                    <CardHeader className="pb-2">
                      <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center mb-2 text-destructive">
                        <AlertTriangle className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">Report Incident</CardTitle>
                      <CardDescription>Submitted successfully</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-muted/30 relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything you need in one place
            </h2>
            <p className="text-lg text-muted-foreground">
              Streamline your interactions with the barangay through our
              comprehensive suite of digital tools designed for efficiency and
              transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FileText className="h-8 w-8" />,
                title: "Document Requests",
                desc: "Request clearances, permits, and certifications online without the long queues.",
                color: "text-blue-500",
                bg: "bg-blue-500/10",
              },
              {
                icon: <AlertTriangle className="h-8 w-8" />,
                title: "Incident Reporting",
                desc: "Report community concerns or emergencies directly to barangay officials.",
                color: "text-red-500",
                bg: "bg-red-500/10",
              },
              {
                icon: <Calendar className="h-8 w-8" />,
                title: "Events & Updates",
                desc: "Stay informed about barangay activities, schedules, and announcements.",
                color: "text-green-500",
                bg: "bg-green-500/10",
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Resident Profiling",
                desc: "Manage your resident information and family records securely.",
                color: "text-purple-500",
                bg: "bg-purple-500/10",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                <CardHeader>
                  <div
                    className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl mb-2">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.desc}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 skew-y-3 transform origin-bottom-right -z-10" />
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2 p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50">
              <div className="text-4xl font-bold text-primary">2,500+</div>
              <div className="text-muted-foreground font-medium">
                Active Residents
              </div>
            </div>
            <div className="space-y-2 p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50">
              <div className="text-4xl font-bold text-primary">15k+</div>
              <div className="text-muted-foreground font-medium">
                Documents Processed
              </div>
            </div>
            <div className="space-y-2 p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50">
              <div className="text-4xl font-bold text-primary">98%</div>
              <div className="text-muted-foreground font-medium">
                Satisfaction Rate
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary to-primary-dark text-white shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1577017040065-650ee4d43339?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay" />
            <div className="relative z-10 px-8 py-16 md:py-24 text-center max-w-4xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold">
                Ready to get started?
              </h2>
              <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
                Join thousands of residents who are already enjoying the
                convenience of digital barangay services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button
                    size="xl"
                    variant="secondary"
                    className="w-full sm:w-auto text-primary font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    Register Now
                  </Button>
                </Link>
                <Link to="/services">
                  <Button
                    size="xl"
                    variant="outline"
                    className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:text-white"
                  >
                    View Services
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
