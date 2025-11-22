import { useState, useEffect } from "react";
import { Megaphone, Search, Calendar, Eye, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import api from "@/services/api";
import { Announcement } from "@/types";
import { format } from "date-fns";
import { showToast } from "@/utils/toast";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await api.getAnnouncements({ isPublished: true });
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

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !categoryFilter || announcement.category === categoryFilter;
    const matchesPriority =
      !priorityFilter || announcement.priority === priorityFilter;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "emergency":
        return "🚨";
      case "event":
        return "📅";
      case "service":
        return "🔧";
      case "maintenance":
        return "⚙️";
      default:
        return "📢";
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setPriorityFilter("");
  };

  const hasActiveFilters = searchTerm || categoryFilter || priorityFilter;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6 page-transition">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader
          title="Announcements"
          description="Stay updated with the latest news and announcements from your barangay"
        />

        {/* Search and Filter */}
        <Card className="glass-card animate-in slide-in-from-top-4 duration-500">
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
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
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              >
                <option value="">All Categories</option>
                <option value="general">General</option>
                <option value="emergency">Emergency</option>
                <option value="event">Event</option>
                <option value="service">Service</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              >
                <option value="">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {hasActiveFilters && (
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <Badge variant="secondary">Search: {searchTerm}</Badge>
                  )}
                  {categoryFilter && (
                    <Badge variant="secondary" className="capitalize">
                      Category: {categoryFilter}
                    </Badge>
                  )}
                  {priorityFilter && (
                    <Badge variant="secondary" className="capitalize">
                      Priority: {priorityFilter}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="hover-lift"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Announcements Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-700 delay-100">
          {filteredAnnouncements.length === 0 ? (
            <div className="col-span-full">
              <EmptyState
                icon={Megaphone}
                title="No announcements found"
                description={
                  hasActiveFilters
                    ? "Try adjusting your filters"
                    : "Check back later for updates from your barangay"
                }
              />
            </div>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <Card
                key={announcement._id}
                className="glass-card card-hover overflow-hidden group"
              >
                {announcement.imageUrl && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={announcement.imageUrl}
                      alt={announcement.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge
                        className={`${getPriorityColor(
                          announcement.priority
                        )} border`}
                      >
                        {announcement.priority.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">
                          {getCategoryIcon(announcement.category)}
                        </span>
                        <Badge variant="outline" className="capitalize">
                          {announcement.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                        {announcement.title}
                      </CardTitle>
                    </div>
                    {!announcement.imageUrl && (
                      <Badge
                        className={`${getPriorityColor(
                          announcement.priority
                        )} border`}
                      >
                        {announcement.priority.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground line-clamp-3">
                    {announcement.content}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>
                        {format(
                          new Date(
                            announcement.publishedAt || announcement.createdAt
                          ),
                          "PPP"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-primary" />
                      <span>{announcement.viewCount || 0} views</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcements;
