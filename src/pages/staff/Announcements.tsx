import { useState, useEffect } from "react";
import { Megaphone, Search, Calendar, Eye, Filter, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import api from "@/services/api";
import { Announcement } from "@/types";
import { format } from "date-fns";

const StaffAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch = announcement.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPriority =
      !selectedPriority || announcement.priority === selectedPriority;
    const matchesCategory =
      !selectedCategory || announcement.category === selectedCategory;
    return matchesSearch && matchesPriority && matchesCategory;
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

  const priorities = ["urgent", "high", "medium", "low"];
  const categories = [
    ...new Set(announcements.map((a) => a.category)),
  ] as string[];

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
      </div>

      <div className="relative z-10 p-6 page-transition">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="animate-in slide-in-from-top-4 duration-500">
            <PageHeader
              title="Announcements"
              description="Stay updated with the latest barangay news and important announcements"
              icon={
                <Megaphone className="h-8 w-8 text-purple-400 animate-pulse" />
              }
            />
          </div>

          {/* Search and Filters - IMPROVED CONTRAST */}
          <Card className="bg-white/15 backdrop-blur-xl border-2 border-white/30 shadow-2xl animate-in fade-in duration-700 delay-100">
            <CardContent className="pt-6 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                <Input
                  placeholder="Search announcements by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 backdrop-blur-xl border-white/30 focus:border-purple-400/50 focus:ring-purple-400/20 text-white placeholder:text-white/50"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                {/* Priority Filter */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Filter className="h-4 w-4 text-white/70" />
                    <span className="text-sm font-semibold text-white">
                      Priority
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {priorities.map((priority) => (
                      <Button
                        key={priority}
                        size="sm"
                        variant={
                          selectedPriority === priority ? "default" : "outline"
                        }
                        onClick={() =>
                          setSelectedPriority(
                            selectedPriority === priority ? null : priority
                          )
                        }
                        className={`capitalize font-medium ${
                          selectedPriority === priority
                            ? "bg-purple-500 hover:bg-purple-600 text-white border-0"
                            : "bg-white/10 hover:bg-white/20 text-white border-white/30"
                        }`}
                      >
                        {priority}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Filter className="h-4 w-4 text-white/70" />
                    <span className="text-sm font-semibold text-white">
                      Category
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        size="sm"
                        variant={
                          selectedCategory === category ? "default" : "outline"
                        }
                        onClick={() =>
                          setSelectedCategory(
                            selectedCategory === category ? null : category
                          )
                        }
                        className={`capitalize font-medium ${
                          selectedCategory === category
                            ? "bg-purple-500 hover:bg-purple-600 text-white border-0"
                            : "bg-white/10 hover:bg-white/20 text-white border-white/30"
                        }`}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedPriority || selectedCategory || searchTerm) && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSelectedPriority(null);
                    setSelectedCategory(null);
                    setSearchTerm("");
                  }}
                  className="text-white/80 hover:text-white hover:bg-white/10 font-medium"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear all filters
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="text-white/80 text-sm font-medium animate-in fade-in duration-700 delay-200">
            Showing {filteredAnnouncements.length} of {announcements.length}{" "}
            announcements
          </div>

          {/* Announcements Grid - IMPROVED READABILITY */}
          <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-700 delay-300">
            {filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map((announcement, index) => (
                <Card
                  key={announcement._id}
                  className="bg-white/15 backdrop-blur-xl border-2 border-white/30 hover:border-white/50 shadow-2xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.4)] transition-all duration-300 hover:scale-[1.01] group animate-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {announcement.imageUrl && (
                        <div className="w-full md:w-64 h-48 rounded-xl overflow-hidden flex-shrink-0 border-2 border-white/30 group-hover:border-white/50 transition-all duration-300">
                          <img
                            src={announcement.imageUrl}
                            alt={announcement.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            className={`${getPriorityColor(
                              announcement.priority
                            )} border backdrop-blur-sm font-semibold`}
                          >
                            {announcement.priority.toUpperCase()}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="capitalize bg-white/10 text-white border-white/30 backdrop-blur-sm font-medium"
                          >
                            {announcement.category}
                          </Badge>
                        </div>
                        <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                          {announcement.title}
                        </h3>
                        <p className="text-white/90 leading-relaxed">
                          {announcement.content}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-white/70 pt-4 border-t border-white/30">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-purple-400" />
                            <span className="font-medium">
                              {format(new Date(announcement.createdAt), "PPP")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-purple-400" />
                            <span className="font-medium">
                              {announcement.viewCount || 0} views
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-white/15 backdrop-blur-xl border-2 border-white/30 shadow-2xl">
                <CardContent className="p-12 text-center">
                  <Megaphone className="h-16 w-16 text-white/40 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No announcements found
                  </h3>
                  <p className="text-white/70 font-medium">
                    Try adjusting your search or filters
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffAnnouncements;
