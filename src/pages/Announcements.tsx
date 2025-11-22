import { useState, useEffect } from "react";
import { Megaphone, Search, Calendar, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/PageHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import api from "@/services/api";
import { Announcement } from "@/types";
import { format } from "date-fns";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await api.getAnnouncements({ isPublished: true });
      setAnnouncements(response.data || []);
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAnnouncements = announcements.filter((announcement) =>
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        title="Announcements"
        description="Stay updated with the latest barangay news and announcements"
        icon={<Megaphone className="h-8 w-8 text-primary" />}
      />

      <div className="max-w-7xl mx-auto space-y-6 mt-6">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6">
          {filteredAnnouncements.map((announcement) => (
            <Card key={announcement._id} className="glass-card card-hover">
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
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        className={getPriorityColor(announcement.priority)}
                      >
                        {announcement.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {announcement.category}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {announcement.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {announcement.content}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-3 border-t border-border/50">
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
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Announcements;
