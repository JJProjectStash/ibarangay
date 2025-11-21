import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Users } from "lucide-react";
import api from "../services/api";
import { Event } from "../types";
import { format } from "date-fns";
import { useAuth } from "../context/AuthContext";

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.getEvents();
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (eventId: string) => {
    try {
      await api.registerForEvent(eventId);
      fetchEvents();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to register for event");
    }
  };

  const handleUnregister = async (eventId: string) => {
    try {
      await api.unregisterFromEvent(eventId);
      fetchEvents();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to unregister from event");
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
    const badges: Record<string, string> = {
      upcoming: "badge-info",
      ongoing: "badge-warning",
      completed: "badge-success",
      cancelled: "badge-error",
    };
    return badges[status] || "badge-info";
  };

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>
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
            events.map((event) => (
              <div
                key={event._id}
                className="card"
                style={{ display: "flex", flexDirection: "column" }}
              >
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
                    <span className={`badge ${getStatusBadge(event.status)}`}>
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
                    <span style={{ fontSize: "0.9rem" }}>{event.location}</span>
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
                    {isRegistered(event) ? (
                      <button
                        className="btn btn-outline"
                        style={{
                          width: "100%",
                          borderColor: "var(--error)",
                          color: "var(--error)",
                        }}
                        onClick={() => handleUnregister(event._id)}
                      >
                        Unregister
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        style={{ width: "100%" }}
                        onClick={() => handleRegister(event._id)}
                        disabled={
                          event.maxAttendees !== undefined &&
                          event.attendees.length >= event.maxAttendees
                        }
                      >
                        {event.maxAttendees &&
                        event.attendees.length >= event.maxAttendees
                          ? "Event Full"
                          : "Register"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
