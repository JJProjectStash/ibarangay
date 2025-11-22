import { useState, useEffect } from "react";
import { AlertCircle, Plus, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/PageHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import StatusBadge from "@/components/StatusBadge";
import api from "@/services/api";
import { Complaint } from "@/types";
import { format } from "date-fns";

const Complaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await api.getComplaints();
      setComplaints(response.data || []);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = complaints.filter((complaint) =>
    complaint.title.toLowerCase().includes(searchTerm.toLowerCase())
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
        title="My Complaints"
        description="Track and manage your submitted complaints"
        icon={<AlertCircle className="h-8 w-8 text-primary" />}
        action={
          <Button className="btn-glow hover-lift">
            <Plus className="h-4 w-4 mr-2" />
            New Complaint
          </Button>
        }
      />

      <div className="max-w-7xl mx-auto space-y-6 mt-6">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {filteredComplaints.map((complaint) => (
            <Card key={complaint._id} className="glass-card card-hover">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">
                      {complaint.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {complaint.description}
                    </p>
                  </div>
                  <StatusBadge status={complaint.status} />
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Category: {complaint.category}</span>
                  <span>{format(new Date(complaint.createdAt), "PPP")}</span>
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

export default Complaints;
