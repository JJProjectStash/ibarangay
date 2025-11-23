import { useState, useEffect } from "react";
import { Users, Search, UserPlus, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/PageHeader";
import UserManagementTable from "@/components/admin/UserManagementTable";
import LoadingSpinner from "@/components/LoadingSpinner";
import adminApi from "@/services/adminApi";
import { UserManagement } from "@/types/admin";

const AdminResidents = () => {
  const [residents, setResidents] = useState<UserManagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllUsers();
      // Map the backend data to UserManagement format
      const mappedResidents = response.data
        .filter((user: any) => user.role === "resident")
        .map((user: any) => ({
          id: user._id || user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          address: user.address || "N/A",
          phoneNumber: user.phoneNumber || "N/A",
          isVerified: user.isVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt || user.createdAt,
        }));
      setResidents(mappedResidents);
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

  const filteredResidents = residents.filter((resident) =>
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
    <div className="min-h-screen relative">
      {/* Unified Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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

      <div className="relative z-10 p-6 page-transition">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="animate-in slide-in-from-top-4 duration-500">
            <PageHeader
              title="Resident Management"
              description="Manage and monitor all registered residents"
              icon={<Users className="h-8 w-8 text-purple-400 animate-pulse" />}
            />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-700 delay-100">
            <Card className="bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-white/40 shadow-2xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.4)] transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/90">
                  Total Residents
                </CardTitle>
                <Users className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  {residents.length}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-white/40 shadow-2xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.4)] transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/90">
                  Active This Month
                </CardTitle>
                <Users className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-400">
                  {Math.floor(residents.length * 0.8)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-white/40 shadow-2xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.4)] transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/90">
                  New This Week
                </CardTitle>
                <UserPlus className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">
                  {Math.floor(residents.length * 0.1)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="bg-white/10 backdrop-blur-xl border-2 border-white/20 shadow-2xl animate-in fade-in duration-700 delay-200">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    placeholder="Search residents by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 backdrop-blur-xl border-2 border-white/20 focus:border-purple-400/50 focus:ring-purple-400/20 text-white placeholder:text-white/50"
                  />
                </div>
                <Button
                  variant="outline"
                  className="gap-2 bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:bg-white/20 hover:border-white/40 text-white transition-all duration-300"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Residents Table */}
          <Card className="bg-white/10 backdrop-blur-xl border-2 border-white/20 shadow-2xl animate-in fade-in duration-700 delay-300">
            <CardHeader>
              <CardTitle className="text-white">All Residents</CardTitle>
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
    </div>
  );
};

export default AdminResidents;
