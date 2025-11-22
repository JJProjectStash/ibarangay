import { useState, useEffect } from "react";
import { Wrench, Plus, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/PageHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import StatusBadge from "@/components/StatusBadge";
import api from "@/services/api";
import { Service } from "@/types";
import { format } from "date-fns";

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.getServiceRequests();
      setServices(response.data || []);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((service) =>
    service.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6 page-transition">
      <PageHeader
        title="Service Requests"
        description="Request and track barangay services"
        icon={<Wrench className="h-8 w-8 text-primary" />}
        action={
          <Button className="btn-glow hover-lift">
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        }
      />

      <div className="max-w-7xl mx-auto space-y-6 mt-6">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search service requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {filteredServices.map((service) => (
            <Card key={service._id} className="glass-card card-hover">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">
                      {service.itemName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Type: {service.itemType} | Quantity: {service.quantity}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Purpose: {service.purpose}
                    </p>
                  </div>
                  <StatusBadge status={service.status} />
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>
                    Borrow Date: {format(new Date(service.borrowDate), "PPP")}
                  </span>
                  <span>
                    Expected Return:{" "}
                    {format(new Date(service.expectedReturnDate), "PPP")}
                  </span>
                </div>
                <div className="mt-4">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
