import { useState, useEffect } from "react";
import { Shield, Search, Filter, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/PageHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import StatusBadge from "@/components/StatusBadge";
import { adminApi } from "@/services/adminApi";
import { format } from "date-fns";

const AdminBlotter = () => {
  const [blotters, setBlotters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBlotters();
  }, []);

  const fetchBlotters = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAllBlotters();
      setBlotters(data);
    } catch (error) {
      console.error("Failed to fetch blotters:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlotters = blotters.filter((blotter: any) =>
    blotter.incident?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6 page-transition">
      <PageHeader
        title="Blotter Records"
        description="Manage incident reports and blotter records"
        icon={<Shield className="h-8 w-8 text-primary" />}
        action={
          <Button className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" />
            New Record
          </Button>
        }
      />

      <div className="max-w-7xl mx-auto space-y-6 mt-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-card card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text-primary">
                {blotters.length}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">
                {blotters.filter((b: any) => b.status === "active").length}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Resolved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                {blotters.filter((b: any) => b.status === "resolved").length}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                {Math.floor(blotters.length * 0.3)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search blotter records..."
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

        {/* Blotter Records */}
        <div className="space-y-4">
          {filteredBlotters.map((blotter: any) => (
            <Card key={blotter.id} className="glass-card card-hover">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">
                      {blotter.incident}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {blotter.description}
                    </p>
                  </div>
                  <StatusBadge status={blotter.status} />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                  <div>
                    <span className="font-medium">Complainant:</span>{" "}
                    {blotter.complainant}
                  </div>
                  <div>
                    <span className="font-medium">Respondent:</span>{" "}
                    {blotter.respondent}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span>{" "}
                    {format(new Date(blotter.incidentDate), "PPP")}
                  </div>
                  <div>
                    <span className="font-medium">Location:</span>{" "}
                    {blotter.location}
                  </div>
                </div>
                <div className="flex gap-2">
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

export default AdminBlotter;
