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
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
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
        title="Manage Announcements"
        description="Create, edit, and publish announcements for residents"
      />

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <Card className="glass-card card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Published
              </CardTitle>
              <Eye className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.published}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Drafts
              </CardTitle>
              <EyeOff className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.draft}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Views
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.totalViews}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total
              </CardTitle>
              <Megaphone className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {announcements.length}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Actions */}
      <Card className="glass-card mt-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search announcements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass-input"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-glow hover-lift w-full md:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Announcement
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Announcements List */}
      <div className="grid grid-cols-1 gap-6 mt-6">
        {filteredAnnouncements.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="text-center py-12">
              <Megaphone className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                No announcements found
              </h3>
              <p className="text-sm text-muted-foreground">
                Create your first announcement to get started
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <Card
              key={announcement._id}
              className="glass-card card-hover overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {announcement.imageUrl && (
                    <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
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
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            className={getPriorityColor(announcement.priority)}
                          >
                            {announcement.priority.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {announcement.category}
                          </Badge>
                          {announcement.isPublished ? (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              Published
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
                              Draft
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          {announcement.title}
                        </h3>
                        <p className="text-muted-foreground line-clamp-2">
                          {announcement.content}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(new Date(announcement.createdAt), "PPP")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{announcement.viewCount || 0} views</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePublishToggle(announcement)}
                          className="hover-lift"
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
                          className="hover-lift"
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
                          className="text-destructive hover:text-destructive hover-lift"
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
        <DialogContent className="max-w-2xl glass-card">
          <DialogHeader>
            <DialogTitle>
              {isCreateModalOpen ? "Create Announcement" : "Edit Announcement"}
            </DialogTitle>
            <DialogDescription>
              {isCreateModalOpen
                ? "Create a new announcement for residents"
                : "Update announcement details"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Announcement title"
                className="glass-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Announcement content"
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary glass-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="general">General</option>
                  <option value="emergency">Emergency</option>
                  <option value="event">Event</option>
                  <option value="service">Service</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL (optional)</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                placeholder="/images/ImageURL.jpg"
                className="glass-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiresAt">Expiration Date (optional)</Label>
              <Input
                id="expiresAt"
                type="date"
                value={formData.expiresAt}
                onChange={(e) =>
                  setFormData({ ...formData, expiresAt: e.target.value })
                }
                className="glass-input"
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
            >
              Cancel
            </Button>
            <Button
              onClick={
                isCreateModalOpen
                  ? handleCreateAnnouncement
                  : handleUpdateAnnouncement
              }
              className="btn-glow"
            >
              {isCreateModalOpen ? "Create" : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAnnouncements;
