import { useState, useEffect } from "react";
import {
  Megaphone,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import PageHeader from "@/components/PageHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import api from "@/services/api";
import { Announcement } from "@/types";
import { format } from "date-fns";
import { showToast } from "@/utils/toast";

interface AnnouncementStats {
  published: number;
  draft: number;
  totalViews: number;
}

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);
  const [stats, setStats] = useState<AnnouncementStats | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "general",
    priority: "medium",
    imageUrl: "",
    expiresAt: "",
  });

  useEffect(() => {
    fetchAnnouncements();
    fetchStats();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await api.getAnnouncements({});
      setAnnouncements(response.data || []);
    } catch (error) {
      const err = error as Error & {
        response?: { data?: { message?: string } };
      };
      showToast({
        message: err.response?.data?.message || "Failed to fetch announcements",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.getAnnouncementStats();
      setStats(response.data as AnnouncementStats);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleCreateAnnouncement = async () => {
    try {
      await api.createAnnouncement(formData);
      showToast({
        message: "Announcement created successfully",
        type: "success",
      });
      setIsCreateModalOpen(false);
      resetForm();
      fetchAnnouncements();
      fetchStats();
    } catch (error) {
      const err = error as Error & {
        response?: { data?: { message?: string } };
      };
      showToast({
        message: err.response?.data?.message || "Failed to create announcement",
        type: "error",
      });
    }
  };

  const handleUpdateAnnouncement = async () => {
    if (!selectedAnnouncement) return;

    try {
      await api.updateAnnouncement(selectedAnnouncement._id, formData);
      showToast({
        message: "Announcement updated successfully",
        type: "success",
      });
      setIsEditModalOpen(false);
      setSelectedAnnouncement(null);
      resetForm();
      fetchAnnouncements();
    } catch (error) {
      const err = error as Error & {
        response?: { data?: { message?: string } };
      };
      showToast({
        message: err.response?.data?.message || "Failed to update announcement",
        type: "error",
      });
    }
  };

  const handlePublishToggle = async (announcement: Announcement) => {
    try {
      if (announcement.isPublished) {
        await api.unpublishAnnouncement(announcement._id);
        showToast({
          message: "Announcement unpublished successfully",
          type: "success",
        });
      } else {
        await api.publishAnnouncement(announcement._id);
        showToast({
          message: "Announcement published successfully",
          type: "success",
        });
      }
      fetchAnnouncements();
      fetchStats();
    } catch (error) {
      const err = error as Error & {
        response?: { data?: { message?: string } };
      };
      showToast({
        message:
          err.response?.data?.message || "Failed to update announcement status",
        type: "error",
      });
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    try {
      await api.deleteAnnouncement(id);
      showToast({
        message: "Announcement deleted successfully",
        type: "success",
      });
      fetchAnnouncements();
      fetchStats();
    } catch (error) {
      const err = error as Error & {
        response?: { data?: { message?: string } };
      };
      showToast({
        message: err.response?.data?.message || "Failed to delete announcement",
        type: "error",
      });
    }
  };

  const openEditModal = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      category: announcement.category,
      priority: announcement.priority,
      imageUrl: announcement.imageUrl || "",
      expiresAt: announcement.expiresAt
        ? format(new Date(announcement.expiresAt), "yyyy-MM-dd")
        : "",
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      category: "general",
      priority: "medium",
      imageUrl: "",
      expiresAt: "",
    });
  };

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      !filterStatus ||
      (filterStatus === "published" && announcement.isPublished) ||
      (filterStatus === "draft" && !announcement.isPublished);
    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/20 text-red-300 border-red-400/50";
      case "high":
        return "bg-orange-500/20 text-orange-300 border-orange-400/50";
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-400/50";
      default:
        return "bg-blue-500/20 text-blue-300 border-blue-400/50";
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
              title="Manage Announcements"
              description="Create, edit, and publish announcements for residents"
              icon={
                <Megaphone className="h-8 w-8 text-purple-400 animate-pulse" />
              }
            />
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in fade-in duration-700 delay-100">
              <Card className="bg-white/15 backdrop-blur-xl border-2 border-white/30 hover:border-white/50 shadow-2xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.4)] transition-all duration-300 hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-semibold text-white">
                    Published
                  </CardTitle>
                  <Eye className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400">
                    {stats.published}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/15 backdrop-blur-xl border-2 border-white/30 hover:border-white/50 shadow-2xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.4)] transition-all duration-300 hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-semibold text-white">
                    Drafts
                  </CardTitle>
                  <EyeOff className="h-4 w-4 text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-400">
                    {stats.draft}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/15 backdrop-blur-xl border-2 border-white/30 hover:border-white/50 shadow-2xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.4)] transition-all duration-300 hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-semibold text-white">
                    Total Views
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-400">
                    {stats.totalViews}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/15 backdrop-blur-xl border-2 border-white/30 hover:border-white/50 shadow-2xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.4)] transition-all duration-300 hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-semibold text-white">
                    Total
                  </CardTitle>
                  <Megaphone className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-400">
                    {announcements.length}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters and Actions */}
          <Card className="bg-white/15 backdrop-blur-xl border-2 border-white/30 shadow-2xl animate-in fade-in duration-700 delay-200">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col md:flex-row gap-4 flex-1 w-full">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                    <Input
                      placeholder="Search announcements..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/10 backdrop-blur-xl border-2 border-white/20 focus:border-purple-400/50 focus:ring-purple-400/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 rounded-lg border-2 border-white/20 bg-white/10 backdrop-blur-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                  >
                    <option value="" className="bg-slate-900">
                      All Status
                    </option>
                    <option value="published" className="bg-slate-900">
                      Published
                    </option>
                    <option value="draft" className="bg-slate-900">
                      Draft
                    </option>
                  </select>
                </div>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white border-0 shadow-2xl shadow-purple-500/50 transition-all duration-300 hover:scale-105 w-full md:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Announcement
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Announcements List */}
          <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-700 delay-300">
            {filteredAnnouncements.length === 0 ? (
              <Card className="bg-white/15 backdrop-blur-xl border-2 border-white/30 shadow-2xl">
                <CardContent className="text-center py-12">
                  <Megaphone className="h-16 w-16 text-white/40 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No announcements found
                  </h3>
                  <p className="text-sm text-white/70">
                    Create your first announcement to get started
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredAnnouncements.map((announcement, index) => (
                <Card
                  key={announcement._id}
                  className="bg-white/15 backdrop-blur-xl border-2 border-white/30 hover:border-white/50 shadow-2xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.4)] transition-all duration-300 hover:scale-[1.01] animate-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {announcement.imageUrl && (
                        <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 border-2 border-white/20">
                          <img
                            src={announcement.imageUrl}
                            alt={announcement.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <Badge
                                className={`${getPriorityColor(
                                  announcement.priority
                                )} border backdrop-blur-sm font-semibold`}
                              >
                                {announcement.priority.toUpperCase()}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="capitalize bg-white/10 text-white border-white/30 backdrop-blur-sm"
                              >
                                {announcement.category}
                              </Badge>
                              {announcement.isPublished ? (
                                <Badge className="bg-green-500/20 text-green-300 border-green-400/50 border backdrop-blur-sm font-semibold">
                                  Published
                                </Badge>
                              ) : (
                                <Badge className="bg-gray-500/20 text-gray-300 border-gray-400/50 border backdrop-blur-sm font-semibold">
                                  Draft
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                              {announcement.title}
                            </h3>
                            <p className="text-white/85 line-clamp-2">
                              {announcement.content}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-white/20">
                          <div className="flex items-center gap-4 text-sm text-white/80">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-purple-400" />
                              <span>
                                {format(
                                  new Date(announcement.createdAt),
                                  "PPP"
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4 text-purple-400" />
                              <span>{announcement.viewCount || 0} views</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePublishToggle(announcement)}
                              className="bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:bg-white/20 hover:border-white/40 text-white transition-all duration-300"
                            >
                              {announcement.isPublished ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-1" />
                                  Unpublish
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-1" />
                                  Publish
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditModal(announcement)}
                              className="bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:bg-white/20 hover:border-white/40 text-white transition-all duration-300"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDeleteAnnouncement(announcement._id)
                              }
                              className="bg-red-500/20 border-2 border-red-400/50 hover:bg-red-500/30 hover:border-red-400/70 text-red-300 transition-all duration-300"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Create/Edit Modal */}
          <Dialog
            open={isCreateModalOpen || isEditModalOpen}
            onOpenChange={(open) => {
              if (!open) {
                setIsCreateModalOpen(false);
                setIsEditModalOpen(false);
                setSelectedAnnouncement(null);
                resetForm();
              }
            }}
          >
            <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-xl border-2 border-white/30 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-gray-900">
                  {isCreateModalOpen
                    ? "Create Announcement"
                    : "Edit Announcement"}
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  {isCreateModalOpen
                    ? "Create a new announcement for residents"
                    : "Update announcement details"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-900">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Announcement title"
                    className="bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-gray-900">
                    Content
                  </Label>
                  <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    placeholder="Announcement content"
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-gray-900">
                      Category
                    </Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    >
                      <option value="general">General</option>
                      <option value="emergency">Emergency</option>
                      <option value="event">Event</option>
                      <option value="service">Service</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-gray-900">
                      Priority
                    </Label>
                    <select
                      id="priority"
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageUrl" className="text-gray-900">
                    Image URL (optional)
                  </Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    placeholder="/images/ImageURL.jpg"
                    className="bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiresAt" className="text-gray-900">
                    Expiration Date (optional)
                  </Label>
                  <Input
                    id="expiresAt"
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) =>
                      setFormData({ ...formData, expiresAt: e.target.value })
                    }
                    className="bg-white border-2 border-gray-300 text-gray-900"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setIsEditModalOpen(false);
                    setSelectedAnnouncement(null);
                    resetForm();
                  }}
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  onClick={
                    isCreateModalOpen
                      ? handleCreateAnnouncement
                      : handleUpdateAnnouncement
                  }
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white border-0"
                >
                  {isCreateModalOpen ? "Create" : "Update"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AdminAnnouncements;
