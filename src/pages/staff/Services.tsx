import { useState, useEffect } from "react";
import { Wrench, Search, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/PageHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import StatusBadge from "@/components/StatusBadge";
import adminApi from "@/services/adminApi";
import { format } from "date-fns";

interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  resident?: {
    firstName: string;
    lastName: string;
  };
}

const StaffServices = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAllServiceRequests();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch service requests:", error);
    } finally {
      setLoading(false);
    }
  };

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
        description="Manage service requests from residents"
        icon={<Wrench className="h-8 w-8 text-primary" />}
      />

      <div className="max-w-7xl mx-auto space-y-6 mt-6">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search service requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="glass-card card-hover">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">
                      {request.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {request.description}
                    </p>
                  </div>
                  <StatusBadge status={request.status} />
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>
                    Requested by {request.resident?.firstName}{" "}
                    {request.resident?.lastName}
                  </span>
                  <span>{format(new Date(request.createdAt), "PPP")}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm">Update Status</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffServices;
