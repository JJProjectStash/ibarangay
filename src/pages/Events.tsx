import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Users, CheckCircle, XCircle } from "lucide-react";
import api from "../services/api";
import { Event } from "../types";
import { format } from "date-fns";
import { useAuth } from "../context/AuthContext";
import { showSuccessToast, showErrorToast } from "../components/Toast";
import { getErrorMessage } from "../utils/errorHandler";
import EventAttendeesModal from "../components/events/EventAttendeesModal";

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
    } catch (error: any) {
      console.error("Failed to register for event:", error);
      showErrorToast(error.response?.data?.message || getErrorMessage(error));
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
    } catch (error: any) {
      console.error("Failed to unregister from event:", error);
      showErrorToast(error.response?.data?.message || getErrorMessage(error));
    } finally {
      setProcessingEventId(null);
    }
  };

  const handleViewAttendees = (eventId: string, eventTitle: string) => {
    setSelectedEvent({ id: eventId, title: eventTitle });
  };

  const isRegistered = (event: Event) => {
    if (!user) return false;
    return event.attendees.some((attendee: any) =>
      typeof attendee === "string"
        ? attendee === user.id
        : attendee._id === user.id
    );
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { class: string; icon: JSX.Element }> = {
      upcoming: {
        class: "badge-info",
        icon: <Calendar size={14} />,
      },
      ongoing: {
        class: "badge-warning",
        icon: <Calendar size={14} />,
      },
      completed: {
        class: "badge-success",
        icon: <CheckCircle size={14} />,
      },
      cancelled: {
        class: "badge-error",
        icon: <XCircle size={14} />,
      },
    };
    return badges[status] || badges.upcoming;
  };

  const isEventFull = (event: Event) => {
    return (
      event.maxAttendees !== undefined &&
      event.attendees.length >= event.maxAttendees
    );
  };

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div className="spinner" />
        <p style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>
          Loading events...
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem 0", minHeight: "calc(100vh - 64px)" }}>
      <div className="container">
        <h1
          style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}
        >
          Barangay Events
        </h1>

        {events.length === 0 ? (
          <div
            className="card"
            style={{ padding: "3rem", textAlign: "center" }}
          >
            <Calendar
              size={64}
              style={{ margin: "0 auto 1rem", color: "var(--text-secondary)" }}
            />
            <p style={{ fontSize: "1.25rem", color: "var(--text-secondary)" }}>
              No events available at the moment
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {events.map((event) => {
              const registered = isRegistered(event);
              const statusBadge = getStatusBadge(event.status);
              const attendeeCount = event.attendees.length;
              const spotsRemaining = event.maxAttendees
                ? event.maxAttendees - attendeeCount
                : null;

              return (
                <div key={event._id} className="card" style={{ padding: "0" }}>
                  {event.imageUrl && (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "12px 12px 0 0",
                      }}
                    />
                  )}
                  <div style={{ padding: "1.5rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        marginBottom: "1rem",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: "600",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {event.title}
                      </h3>
                      <span
                        className={statusBadge.class}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "12px",
                          fontSize: "0.875rem",
                          fontWeight: "600",
                        }}
                      >
                        {statusBadge.icon}
                        {event.status.charAt(0).toUpperCase() +
                          event.status.slice(1)}
                      </span>
                    </div>

                    <p
                      style={{
                        color: "var(--text-secondary)",
                        marginBottom: "1rem",
                        lineHeight: "1.6",
                      }}
                    >
                      {event.description}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        <Calendar size={18} />
                        <span style={{ fontSize: "0.875rem" }}>
                          {format(new Date(event.eventDate), "MMM dd, yyyy")}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        <MapPin size={18} />
                        <span style={{ fontSize: "0.875rem" }}>
                          {event.location}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        <Users size={18} />
                        <span style={{ fontSize: "0.875rem" }}>
                          {attendeeCount} registered
                          {event.maxAttendees && ` / ${event.maxAttendees} max`}
                        </span>
                      </div>
                    </div>

                    {spotsRemaining !== null &&
                      spotsRemaining <= 5 &&
                      spotsRemaining > 0 && (
                        <div
                          style={{
                            padding: "0.5rem",
                            background: "rgba(245, 158, 11, 0.1)",
                            color: "#f59e0b",
                            borderRadius: "6px",
                            fontSize: "0.875rem",
                            marginBottom: "1rem",
                            textAlign: "center",
                          }}
                        >
                          Only {spotsRemaining} spot
                          {spotsRemaining !== 1 ? "s" : ""} left!
                        </div>
                      )}

                    <div
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                        marginTop: "1rem",
                      }}
                    >
                      {user &&
                        (user.role === "admin" || user.role === "staff") && (
                          <button
                            className="btn btn-outline"
                            onClick={() =>
                              handleViewAttendees(event._id, event.title)
                            }
                            style={{
                              flex: 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <Users size={18} />
                            View Attendees
                          </button>
                        )}
                      {event.status === "upcoming" && (
                        <>
                          {registered ? (
                            <button
                              className="btn"
                              onClick={() => handleUnregister(event._id)}
                              disabled={processingEventId === event._id}
                              style={{
                                flex: 1,
                                background: "rgba(239, 68, 68, 0.1)",
                                color: "#ef4444",
                                border: "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.5rem",
                              }}
                            >
                              <XCircle size={18} />
                              {processingEventId === event._id
                                ? "Processing..."
                                : "Unregister"}
                            </button>
                          ) : (
                            <button
                              className="btn btn-primary"
                              onClick={() => handleRegister(event._id)}
                              disabled={
                                processingEventId === event._id ||
                                (spotsRemaining !== null && spotsRemaining <= 0)
                              }
                              style={{
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.5rem",
                              }}
                            >
                              <CheckCircle size={18} />
                              {processingEventId === event._id
                                ? "Processing..."
                                : spotsRemaining !== null && spotsRemaining <= 0
                                ? "Event Full"
                                : "Register"}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
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
