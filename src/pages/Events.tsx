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
import { Event, User } from "../types";
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
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err.response?.data?.message || getErrorMessage(error));
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
      const err = error as { response?: { data?: { message?: string } } };
      showErrorToast(err.response?.data?.message || getErrorMessage(error));
    } finally {
      setProcessingEventId(null);
    }
  };

  const handleViewAttendees = (eventId: string, eventTitle: string) => {
    setSelectedEvent({ id: eventId, title: eventTitle });
  };

  const isRegistered = (event: Event) => {
    if (!user) return false;
    return event.attendees.some((attendee) => {
      if (typeof attendee === "string") {
        return attendee === user.id;
      } else {
        const userAttendee = attendee as User;
        return userAttendee.id === user.id;
      }
    });
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6 page-transition">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="animate-in slide-in-from-top-4 duration-500">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Barangay Events
          </h1>
          <p className="text-muted-foreground text-lg">
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
                  className="glass-card card-hover overflow-hidden group flex flex-col"
                >
                  {event.imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge variant={statusBadge.variant}>
                          {statusBadge.label}
                        </Badge>
                      </div>
                      {registered && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-green-500 text-white">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Registered
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {event.title}
                      </CardTitle>
                      {!event.imageUrl && (
                        <Badge variant={statusBadge.variant}>
                          {statusBadge.label}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                      {event.description}
                    </p>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>
                          {format(new Date(event.eventDate), "MMM dd, yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>
                          {format(new Date(event.eventDate), "h:mm a")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4 text-primary" />
                        <span>
                          {attendeeCount} registered
                          {event.maxAttendees && ` / ${event.maxAttendees} max`}
                        </span>
                      </div>
                    </div>

                    {spotsRemaining !== null &&
                      spotsRemaining <= 5 &&
                      spotsRemaining > 0 && (
                        <div className="flex items-center gap-2 p-2 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-lg text-sm">
                          <Sparkles className="h-4 w-4" />
                          <span>
                            Only {spotsRemaining} spot
                            {spotsRemaining !== 1 ? "s" : ""} left!
                          </span>
                        </div>
                      )}

                    <div className="flex gap-2 pt-2 border-t">
                      {user &&
                        (user.role === "admin" || user.role === "staff") && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleViewAttendees(event._id, event.title)
                            }
                            className="flex-1 hover-lift"
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
                              className="flex-1 hover-lift"
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
                                (spotsRemaining !== null && spotsRemaining <= 0)
                              }
                              className="flex-1 hover-lift shadow-lg shadow-primary/20"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              {processingEventId === event._id
                                ? "Processing..."
                                : spotsRemaining !== null && spotsRemaining <= 0
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
  );
};

export default Events;
