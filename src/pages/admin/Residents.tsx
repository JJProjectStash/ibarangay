import { useState, useEffect } from "react";
import { Users, Search, UserPlus, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/PageHeader";
import UserManagementTable from "@/components/admin/UserManagementTable";
import LoadingSpinner from "@/components/LoadingSpinner";
import adminApi from "@/services/adminApi";

const AdminResidents = () => {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllUsers();
      setResidents(
        response.data.filter((user: any) => user.role === "resident")
      );
    } catch (error) {
      console.error("Failed to fetch residents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      await adminApi.updateUserRole(userId, role);
      fetchResidents();
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  const handleVerifyUser = async (userId: string) => {
    try {
      await adminApi.verifyUser(userId);
      fetchResidents();
    } catch (error) {
      console.error("Failed to verify user:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await adminApi.deleteUser(userId);
      fetchResidents();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const filteredResidents = residents.filter((resident: any) =>
    `${resident.firstName} ${resident.lastName} ${resident.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
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
        title="Resident Management"
        description="Manage and monitor all registered residents"
        icon={<Users className="h-8 w-8 text-primary" />}
      />

      <div className="max-w-7xl mx-auto space-y-6 mt-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-card card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Residents
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text-primary">
                {residents.length}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active This Month
              </CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                {Math.floor(residents.length * 0.8)}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                New This Week
              </CardTitle>
              <UserPlus className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                {Math.floor(residents.length * 0.1)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search residents by name or email..."
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

        {/* Residents Table */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>All Residents</CardTitle>
          </CardHeader>
          <CardContent>
            <UserManagementTable
              users={filteredResidents}
              onUpdateRole={handleUpdateRole}
              onVerifyUser={handleVerifyUser}
              onDeleteUser={handleDeleteUser}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminResidents;
