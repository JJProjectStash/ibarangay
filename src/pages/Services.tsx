import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  FileText,
  Building2,
  Users,
  Gavel,
  ArrowRight,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-toastify";

// Mock Data
const servicesData = [
  {
    id: 1,
    title: "Barangay Clearance",
    description:
      "Official document certifying that you are a law-abiding resident of the barangay with no derogatory record.",
    category: "Documents",
    processingTime: "1-2 Days",
    fee: "₱50.00",
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: 2,
    title: "Certificate of Indigency",
    description:
      "Certification issued to less fortunate residents for medical, financial, or scholarship assistance.",
    category: "Social Services",
    processingTime: "1 Day",
    fee: "Free",
    icon: Users,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    id: 3,
    title: "Business Permit",
    description:
      "Clearance required for operating a business within the barangay jurisdiction.",
    category: "Business",
    processingTime: "2-3 Days",
    fee: "₱500.00",
    icon: Building2,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    id: 4,
    title: "Barangay ID",
    description:
      "Official identification card for bonafide residents of the barangay.",
    category: "Identification",
    processingTime: "1 Day",
    fee: "₱100.00",
    icon: FileText,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    id: 5,
    title: "Complaint Filing",
    description: "File a formal complaint for mediation or blotter purposes.",
    category: "Legal",
    processingTime: "Immediate",
    fee: "Free",
    icon: Gavel,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    id: 6,
    title: "Residency Certificate",
    description:
      "Proof of residency for bank opening, employment, or other legal purposes.",
    category: "Documents",
    processingTime: "1 Day",
    fee: "₱50.00",
    icon: FileText,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
];

const categories = [
  "All",
  "Documents",
  "Social Services",
  "Business",
  "Identification",
  "Legal",
];

const Services = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredServices = servicesData.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRequest = (serviceTitle: string) => {
    toast.info(`Requesting ${serviceTitle}... (This is a demo)`);
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 animate-in slide-in-from-top-4 duration-500">
        <div className="space-y-2 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight">Our Services</h1>
          <p className="text-muted-foreground text-lg">
            Access a wide range of barangay services online. Fast, secure, and
            convenient processing for all residents.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              className="pl-9 bg-background/50 backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-8 animate-in fade-in duration-700 delay-100">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="rounded-full transition-all"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 duration-700 delay-200">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <Card
              key={service.id}
              className="card-hover flex flex-col h-full border-muted/60 hover:border-primary/30 overflow-hidden group"
            >
              <div className={`h-2 w-full ${service.bg.replace("/10", "")}`} />
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`p-3 rounded-xl ${service.bg} ${service.color} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <service.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className="font-normal">
                    {service.category}
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {service.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-2">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      Processing:{" "}
                      <span className="font-medium text-foreground">
                        {service.processingTime}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>
                      Fee:{" "}
                      <span className="font-medium text-foreground">
                        {service.fee}
                      </span>
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-4 border-t bg-muted/10">
                <Button
                  className="w-full group-hover:shadow-lg group-hover:shadow-primary/20 transition-all"
                  onClick={() => handleRequest(service.title)}
                >
                  Request Now
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="p-4 rounded-full bg-muted">
                <Search className="h-8 w-8 opacity-50" />
              </div>
              <p>No services found matching your criteria.</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
              >
                Clear filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
