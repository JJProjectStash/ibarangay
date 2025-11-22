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
import { StatCard } from "../../components/StatCard";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6 page-transition">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in slide-in-from-top-4 duration-500">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage users, roles, and system settings
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="shadow-lg shadow-primary/20 hover-lift"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Create Staff/Admin
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700 delay-100">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            color="indigo"
            description="All registered users"
            className="card-hover"
          />
          <StatCard
            title="Administrators"
            value={stats.totalAdmins}
            icon={Shield}
            color="red"
            description="System administrators"
            className="card-hover"
          />
          <StatCard
            title="Staff Members"
            value={stats.totalStaff}
            icon={Activity}
            color="blue"
            description="Active staff"
            className="card-hover"
          />
          <StatCard
            title="Residents"
            value={stats.totalResidents}
            icon={TrendingUp}
            color="purple"
            description="Registered residents"
            className="card-hover"
          />
          <StatCard
            title="Verified Users"
            value={stats.verifiedUsers}
            icon={UserCheck}
            color="green"
            description="Verified accounts"
            className="card-hover"
          />
          <StatCard
            title="Pending Verification"
            value={stats.unverifiedUsers}
            icon={UserX}
            color="yellow"
            description="Awaiting verification"
            className="card-hover"
          />
        </div>

        {/* Filters */}
        <Card className="glass-card animate-in slide-in-from-bottom-8 duration-700 delay-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Filter Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">
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
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="resident">Resident</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">
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
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
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
                    className="hover-lift"
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
                  <Badge variant="secondary" className="capitalize">
                    Role: {filter.role}
                  </Badge>
                )}
                {filter.isVerified !== undefined && (
                  <Badge variant="secondary">
                    Status: {filter.isVerified ? "Verified" : "Unverified"}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Management Table */}
        <Card className="glass-card animate-in slide-in-from-bottom-8 duration-700 delay-300">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
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
  );
};

export default AdminDashboard;
