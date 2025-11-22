import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Users, CheckCircle, XCircle } from "lucide-react";
import api from "../services/api";
import { Event } from "../types";
import { format } from "date-fns";
import { useAuth } from "../context/AuthContext";
import { showSuccessToast, showErrorToast } from "../components/Toast";
import { getErrorMessage } from "../utils/errorHandler";

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingEventId, setProcessingEventId] = useState<string | null>(
    null
  );
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await api.getEvents();
      setEvents(response.data || []);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      showErrorToast(getErrorMessage(error));
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {events.length === 0 ? (
            <div
              className="card"
              style={{
                textAlign: "center",
                padding: "3rem",
                gridColumn: "1 / -1",
              }}
            >
              <Calendar
                size={48}
                style={{
                  margin: "0 auto 1rem",
                  color: "var(--text-secondary)",
                }}
              />
              <p style={{ color: "var(--text-secondary)" }}>
                No events scheduled
              </p>
            </div>
          ) : (
            events.map((event) => {
              const statusBadge = getStatusBadge(event.status);
              const registered = isRegistered(event);
              const eventFull = isEventFull(event);
              const isProcessing = processingEventId === event._id;

              return (
                <div
                  key={event._id}
                  className="card"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  {event.imageUrl && (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        marginBottom: "1rem",
                      }}
                    />
                  )}
                  <div style={{ marginBottom: "1rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: "bold",
                          flex: 1,
                        }}
                      >
                        {event.title}
                      </h3>
                      <span
                        className={`badge ${statusBadge.class}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        {statusBadge.icon}
                        {event.status.toUpperCase()}
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
                  </div>

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
                      <Calendar size={16} />
                      <span style={{ fontSize: "0.9rem" }}>
                        {format(new Date(event.eventDate), "MMMM dd, yyyy")}
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
                      <MapPin size={16} />
                      <span style={{ fontSize: "0.9rem" }}>
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
                      <Users size={16} />
                      <span style={{ fontSize: "0.9rem" }}>
                        {event.attendees.length}{" "}
                        {event.maxAttendees && `/ ${event.maxAttendees}`}{" "}
                        attendees
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "0.75rem",
                      background: "var(--background)",
                      borderRadius: "6px",
                      marginBottom: "1rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: "500",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Category: {event.category}
                    </span>
                  </div>

                  {event.status === "upcoming" && (
                    <div style={{ marginTop: "auto" }}>
                      {registered ? (
                        <button
                          className="btn btn-outline"
                          style={{
                            width: "100%",
                            borderColor: "var(--error)",
                            color: "var(--error)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem",
                          }}
                          onClick={() => handleUnregister(event._id)}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            "Processing..."
                          ) : (
                            <>
                              <CheckCircle size={18} /> Registered - Click to
                              Unregister
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary"
                          style={{ width: "100%" }}
                          onClick={() => handleRegister(event._id)}
                          disabled={eventFull || isProcessing}
                        >
                          {isProcessing
                            ? "Processing..."
                            : eventFull
                            ? "Event Full"
                            : "Register"}
                        </button>
                      )}
                    </div>
                  )}
                  {event.status === "completed" && (
                    <div
                      style={{
                        marginTop: "auto",
                        padding: "0.75rem",
                        background: "var(--background)",
                        borderRadius: "6px",
                        textAlign: "center",
                        color: "var(--text-secondary)",
                      }}
                    >
                      This event has been completed
                    </div>
                  )}
                  {event.status === "cancelled" && (
                    <div
                      style={{
                        marginTop: "auto",
                        padding: "0.75rem",
                        background: "rgba(239, 68, 68, 0.1)",
                        borderRadius: "6px",
                        textAlign: "center",
                        color: "#dc2626",
                      }}
                    >
                      This event has been cancelled
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
