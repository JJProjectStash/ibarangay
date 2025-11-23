import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "../services/api";
import { Event } from "../types";
import { format } from "date-fns";
import { useAuth } from "../context/AuthContext";
import { showSuccessToast, showErrorToast } from "../components/Toast";
import { getErrorMessage } from "../utils/errorHandler";
import EventAttendeesModal from "../components/events/EventAttendeesModal";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingEventId, setProcessingEventId] = useState<string | null>(
    null
  );
  const [selectedEvent, setSelectedEvent] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await api.getEvents();
      const eventsData = Array.isArray(response.data) ? response.data : [];
      setEvents(eventsData);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      showErrorToast(getErrorMessage(error));
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (eventId: string) => {
    if (!user) {
      showErrorToast("Please login to register for events");
      return;
    }

    setProcessingEventId(eventId);
    try {
      await api.registerForEvent(eventId);
      showSuccessToast("Successfully registered for the event!");
      fetchEvents();
    } catch (error: unknown) {
      console.error("Failed to register for event:", error);
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message || getErrorMessage(error)
          : getErrorMessage(error);
      showErrorToast(errorMessage);
    } finally {
      setProcessingEventId(null);
    }
  };

  const handleUnregister = async (eventId: string) => {
    if (!user) {
      showErrorToast("Please login first");
      return;
    }

    if (
      !window.confirm("Are you sure you want to unregister from this event?")
    ) {
      return;
    }

    setProcessingEventId(eventId);
    try {
      await api.unregisterFromEvent(eventId);
      showSuccessToast("Successfully unregistered from the event");
      fetchEvents();
    } catch (error: unknown) {
      console.error("Failed to unregister from event:", error);
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message || getErrorMessage(error)
          : getErrorMessage(error);
      showErrorToast(errorMessage);
    } finally {
      setProcessingEventId(null);
    }
  };

  const handleViewAttendees = (eventId: string, eventTitle: string) => {
    setSelectedEvent({ id: eventId, title: eventTitle });
  };

  // Fixed isRegistered function - restored working logic from commit 771bfd6
  const isRegistered = (event: Event) => {
    if (!user) return false;
    return event.attendees.some((attendee: unknown) =>
      typeof attendee === "string"
        ? attendee === user.id
        : (attendee as { _id: string })._id === user.id
    );
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<
      string,
      { variant: "default" | "secondary" | "destructive"; label: string }
    > = {
      upcoming: { variant: "default", label: "Upcoming" },
      ongoing: { variant: "secondary", label: "Ongoing" },
      completed: { variant: "secondary", label: "Completed" },
      cancelled: { variant: "destructive", label: "Cancelled" },
    };
    return badges[status] || badges.upcoming;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Unified Background - Same as Home page */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Animated gradient orbs */}
        <div
          className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-gray-700/20 to-gray-500/20 blur-3xl animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-gray-600/20 to-gray-400/20 blur-3xl animate-pulse"
          style={{ animationDuration: "10s", animationDelay: "2s" }}
        />
        <div
          className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-gray-500/15 to-gray-700/15 blur-3xl animate-pulse"
          style={{ animationDuration: "12s", animationDelay: "4s" }}
        />
      </div>

      <div className="relative z-10 p-6 page-transition">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="animate-in slide-in-from-top-4 duration-500">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-400/30 bg-gray-500/10 px-4 py-2 text-sm font-medium text-gray-200 backdrop-blur-sm mb-3">
              <Calendar className="h-4 w-4" />
              Community Events
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
              Barangay{" "}
              <span className="bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 bg-clip-text text-transparent">
                Events
              </span>
            </h1>
            <p className="text-white/80 text-lg">
              Join community events and stay connected with your neighbors
            </p>
          </div>

          {events.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No events available"
              description="Check back later for upcoming community events"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700 delay-100">
              {events.map((event) => {
                const registered = isRegistered(event);
                const statusBadge = getStatusBadge(event.status);
                const attendeeCount = event.attendees.length;
                const spotsRemaining = event.maxAttendees
                  ? event.maxAttendees - attendeeCount
                  : null;

                return (
                  <Card
                    key={event._id}
                    className="bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-white/40 shadow-2xl hover:shadow-[0_20px_50px_rgba(128,128,128,0.4)] transition-all duration-300 hover:scale-105 group flex flex-col overflow-hidden"
                  >
                    {event.imageUrl && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge
                            variant={statusBadge.variant}
                            className="backdrop-blur-sm"
                          >
                            {statusBadge.label}
                          </Badge>
                        </div>
                        {registered && (
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-gray-600 text-white backdrop-blur-sm">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Registered
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-xl text-white group-hover:text-gray-300 transition-colors">
                          {event.title}
                        </CardTitle>
                        {!event.imageUrl && (
                          <Badge
                            variant={statusBadge.variant}
                            className="backdrop-blur-sm"
                          >
                            {statusBadge.label}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-white/70 line-clamp-2 mt-2">
                        {event.description}
                      </p>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>
                            {format(new Date(event.eventDate), "MMM dd, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>
                            {format(new Date(event.eventDate), "h:mm a")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>
                            {attendeeCount} registered
                            {event.maxAttendees &&
                              ` / ${event.maxAttendees} max`}
                          </span>
                        </div>
                      </div>

                      {spotsRemaining !== null &&
                        spotsRemaining <= 5 &&
                        spotsRemaining > 0 && (
                          <div className="flex items-center gap-2 p-2 bg-gray-500/10 backdrop-blur-sm text-gray-300 rounded-lg text-sm border border-gray-400/30">
                            <Sparkles className="h-4 w-4" />
                            <span>
                              Only {spotsRemaining} spot
                              {spotsRemaining !== 1 ? "s" : ""} left!
                            </span>
                          </div>
                        )}

                      <div className="flex gap-2 pt-2 border-t border-white/20">
                        {user &&
                          (user.role === "admin" || user.role === "staff") && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleViewAttendees(event._id, event.title)
                              }
                              className="flex-1 bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 text-white transition-all duration-300 hover:scale-105"
                            >
                              <Users className="h-4 w-4 mr-2" />
                              Attendees
                            </Button>
                          )}
                        {event.status === "upcoming" && (
                          <>
                            {registered ? (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleUnregister(event._id)}
                                disabled={processingEventId === event._id}
                                className="flex-1 transition-all duration-300 hover:scale-105"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                {processingEventId === event._id
                                  ? "Processing..."
                                  : "Unregister"}
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handleRegister(event._id)}
                                disabled={
                                  processingEventId === event._id ||
                                  (spotsRemaining !== null &&
                                    spotsRemaining <= 0)
                                }
                                className="flex-1 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500 hover:from-gray-800 hover:via-gray-700 hover:to-gray-600 text-white border-0 shadow-lg shadow-gray-500/50 transition-all duration-300 hover:scale-105"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                {processingEventId === event._id
                                  ? "Processing..."
                                  : spotsRemaining !== null &&
                                    spotsRemaining <= 0
                                  ? "Event Full"
                                  : "Register"}
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Event Attendees Modal */}
          {selectedEvent && (
            <EventAttendeesModal
              isOpen={true}
              onClose={() => setSelectedEvent(null)}
              eventId={selectedEvent.id}
              eventTitle={selectedEvent.title}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
