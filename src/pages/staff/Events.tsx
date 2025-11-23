import { useState, useEffect } from "react";
import { Calendar, Search, MapPin, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/PageHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import adminApi from "@/services/adminApi";
import { format, isValid, parseISO } from "date-fns";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  createdAt: string;
}

const StaffEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAllEvents();
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  // Safe date formatting function with null/undefined check
  const formatEventDate = (dateString: string | null | undefined) => {
    try {
      if (!dateString) {
        return "Date not set";
      }
      const date = parseISO(dateString);
      if (isValid(date)) {
        return format(date, "PPP");
      }
      return "Invalid date";
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
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
      </div>

      <div className="relative z-10 p-6 page-transition">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="animate-in slide-in-from-top-4 duration-500">
            <PageHeader
              title="Event Management"
              description="Manage and organize community events"
              icon={
                <Calendar className="h-8 w-8 text-purple-400 animate-pulse" />
              }
            />
          </div>

          {/* Search and Actions */}
          <Card className="bg-white/15 backdrop-blur-xl border-2 border-white/30 shadow-2xl animate-in fade-in duration-700 delay-100">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                  <Input
                    placeholder="Search events by title, description, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-purple-400/50 focus:ring-purple-400/20"
                  />
                </div>
                <Button className="bg-purple-500 hover:bg-purple-600 text-white border-0 font-semibold">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="text-white/80 text-sm font-medium animate-in fade-in duration-700 delay-200">
            Showing {filteredEvents.length} of {events.length} events
          </div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <div className="animate-in fade-in duration-700 delay-300">
              <EmptyState
                icon={Calendar}
                title={searchTerm ? "No events found" : "No events yet"}
                description={
                  searchTerm
                    ? "Try adjusting your search terms"
                    : "Create your first event to get started"
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-700 delay-300">
              {filteredEvents.map((event, index) => (
                <Card
                  key={event._id}
                  className="bg-white/15 backdrop-blur-xl border-2 border-white/30 hover:border-white/50 shadow-2xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.4)] transition-all duration-300 hover:scale-[1.02] group animate-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardHeader className="border-b border-white/20">
                    <CardTitle className="text-white text-xl group-hover:text-purple-300 transition-colors">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <p className="text-white/90 leading-relaxed min-h-[60px]">
                      {event.description}
                    </p>

                    <div className="space-y-3 pt-4 border-t border-white/20">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-400/50">
                          <Calendar className="h-4 w-4 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-xs text-white/70 font-medium">
                            Event Date
                          </p>
                          <p className="text-white font-semibold">
                            {formatEventDate(event.date)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/50">
                          <MapPin className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs text-white/70 font-medium">
                            Location
                          </p>
                          <p className="text-white font-semibold">
                            {event.location}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 font-semibold"
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-purple-500/20 border-purple-400/50 text-purple-300 hover:bg-purple-500/30 hover:border-purple-400 font-semibold"
                      >
                        Edit Event
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffEvents;
