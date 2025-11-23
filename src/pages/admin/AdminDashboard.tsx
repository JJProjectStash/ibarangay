import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Shield,
  UserCheck,
  UserX,
  Activity,
  TrendingUp,
  UserPlus,
  Filter,
  X,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import adminApi from "../../services/adminApi";
import UserManagementTable from "../../components/admin/UserManagementTable";
import CreateStaffAdminModal from "../../components/admin/CreateStaffAdminModal";
import { UserManagement } from "../../types/admin";
import { showToast } from "../../utils/toast";
import LoadingSpinner from "../../components/LoadingSpinner";

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<UserManagement[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalStaff: 0,
    totalResidents: 0,
    verifiedUsers: 0,
    unverifiedUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<{ role?: string; isVerified?: boolean }>(
    {}
  );
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const usersResponse = await adminApi.getAllUsers(filter);
      setUsers(usersResponse.data);

      // Calculate stats
      const allUsers = usersResponse.data;
      setStats({
        totalUsers: allUsers.length,
        totalAdmins: allUsers.filter((u: UserManagement) => u.role === "admin")
          .length,
        totalStaff: allUsers.filter((u: UserManagement) => u.role === "staff")
          .length,
        totalResidents: allUsers.filter(
          (u: UserManagement) => u.role === "resident"
        ).length,
        verifiedUsers: allUsers.filter((u: UserManagement) => u.isVerified)
          .length,
        unverifiedUsers: allUsers.filter((u: UserManagement) => !u.isVerified)
          .length,
      });
    } catch (error) {
      const err = error as Error;
      showToast({
        message: err.message || "Failed to fetch users",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      await adminApi.updateUserRole(userId, role);
      showToast({ message: "User role updated successfully", type: "success" });
      fetchData();
    } catch (error) {
      const err = error as Error;
      showToast({
        message: err.message || "Failed to update user role",
        type: "error",
      });
    }
  };

  const handleVerifyUser = async (userId: string) => {
    try {
      await adminApi.verifyUser(userId);
      showToast({ message: "User verified successfully", type: "success" });
      fetchData();
    } catch (error) {
      const err = error as Error;
      showToast({
        message: err.message || "Failed to verify user",
        type: "error",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await adminApi.deleteUser(userId);
      showToast({ message: "User deleted successfully", type: "success" });
      fetchData();
    } catch (error) {
      const err = error as Error;
      showToast({
        message: err.message || "Failed to delete user",
        type: "error",
      });
    }
  };

  const handleCreateSuccess = () => {
    fetchData();
  };

  const clearFilters = () => {
    setFilter({});
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "indigo",
      gradient: "from-indigo-500 to-blue-500",
      description: "All registered users",
    },
    {
      title: "Administrators",
      value: stats.totalAdmins,
      icon: Shield,
      color: "red",
      gradient: "from-red-500 to-pink-500",
      description: "System administrators",
    },
    {
      title: "Staff Members",
      value: stats.totalStaff,
      icon: Activity,
      color: "blue",
      gradient: "from-blue-500 to-cyan-500",
      description: "Active staff",
    },
    {
      title: "Residents",
      value: stats.totalResidents,
      icon: TrendingUp,
      color: "purple",
      gradient: "from-purple-500 to-pink-500",
      description: "Registered residents",
    },
    {
      title: "Verified Users",
      value: stats.verifiedUsers,
      icon: UserCheck,
      color: "green",
      gradient: "from-green-500 to-emerald-500",
      description: "Verified accounts",
    },
    {
      title: "Pending Verification",
      value: stats.unverifiedUsers,
      icon: UserX,
      color: "yellow",
      gradient: "from-yellow-500 to-orange-500",
      description: "Awaiting verification",
    },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Unified Background - Same as Home page */}
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

      <div className="relative z-10 p-6 page-transition">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in slide-in-from-top-4 duration-500">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 backdrop-blur-sm mb-3">
                <Shield className="h-4 w-4" />
                Admin Dashboard
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
                System{" "}
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Management
                </span>
              </h1>
              <p className="text-white/80 text-lg">
                Manage users, roles, and system settings
              </p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white border-0 shadow-2xl shadow-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Create Staff/Admin
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700 delay-100">
            {statCards.map((stat, index) => (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-white/40 shadow-2xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.4)] transition-all duration-300 hover:scale-105 group relative overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Gradient overlay on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />
                <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-white/90">
                    {stat.title}
                  </CardTitle>
                  <div
                    className={`p-2 rounded-xl bg-${stat.color}-500/20 text-${stat.color}-400 group-hover:scale-110 transition-transform`}
                  >
                    <stat.icon className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <p className="text-xs text-white/70">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <Card className="bg-white/10 backdrop-blur-xl border-2 border-white/20 shadow-2xl animate-in slide-in-from-bottom-8 duration-700 delay-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Filter className="h-5 w-5 text-purple-400" />
                Filter Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block text-white/90">
                    Filter by Role
                  </label>
                  <Select
                    value={filter.role || "all"}
                    onValueChange={(value) =>
                      setFilter((prev) => ({
                        ...prev,
                        role: value === "all" ? undefined : value,
                      }))
                    }
                  >
                    <SelectTrigger className="bg-white/10 backdrop-blur-xl border-2 border-white/20 text-white hover:border-white/40 transition-all">
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900/95 backdrop-blur-xl border-white/20 text-white">
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="resident">Resident</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block text-white/90">
                    Filter by Status
                  </label>
                  <Select
                    value={
                      filter.isVerified === undefined
                        ? "all"
                        : filter.isVerified
                        ? "verified"
                        : "unverified"
                    }
                    onValueChange={(value) =>
                      setFilter((prev) => ({
                        ...prev,
                        isVerified:
                          value === "all" ? undefined : value === "verified",
                      }))
                    }
                  >
                    <SelectTrigger className="bg-white/10 backdrop-blur-xl border-2 border-white/20 text-white hover:border-white/40 transition-all">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900/95 backdrop-blur-xl border-white/20 text-white">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="unverified">Unverified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(filter.role || filter.isVerified !== undefined) && (
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="bg-white/10 backdrop-blur-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 text-white transition-all duration-300 hover:scale-105"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>

              {(filter.role || filter.isVerified !== undefined) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {filter.role && (
                    <Badge
                      variant="secondary"
                      className="capitalize bg-purple-500/20 text-purple-200 border-purple-400/30"
                    >
                      Role: {filter.role}
                    </Badge>
                  )}
                  {filter.isVerified !== undefined && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-500/20 text-blue-200 border-blue-400/30"
                    >
                      Status: {filter.isVerified ? "Verified" : "Unverified"}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Management Table */}
          <Card className="bg-white/10 backdrop-blur-xl border-2 border-white/20 shadow-2xl animate-in slide-in-from-bottom-8 duration-700 delay-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                User Management
              </CardTitle>
              <p className="text-sm text-white/70 mt-1">
                Manage user roles, verification status, and accounts
              </p>
            </CardHeader>
            <CardContent>
              <UserManagementTable
                users={users}
                onUpdateRole={handleUpdateRole}
                onVerifyUser={handleVerifyUser}
                onDeleteUser={handleDeleteUser}
              />
            </CardContent>
          </Card>

          {/* Create Staff/Admin Modal */}
          <CreateStaffAdminModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSuccess={handleCreateSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
