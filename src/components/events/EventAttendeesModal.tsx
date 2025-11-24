import React, { useState, useEffect } from "react";
import { Users, X, Download, Mail, Phone, MapPin } from "lucide-react";
import api from "../../services/apiExtensions";
import { showSuccessToast, showErrorToast } from "../Toast";
import { getErrorMessage } from "../../utils/errorHandler";
import { format } from "date-fns";

interface Attendee {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  registeredAt: string;
}

interface EventAttendeesModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
}

const EventAttendeesModal: React.FC<EventAttendeesModalProps> = ({
  isOpen,
  onClose,
  eventId,
  eventTitle,
}) => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalAttendees, setTotalAttendees] = useState(0);
  const [maxAttendees, setMaxAttendees] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen && eventId) {
      fetchAttendees();
    }
  }, [isOpen, eventId]);

  const fetchAttendees = async () => {
    try {
      setIsLoading(true);
      const response = await api.getEventAttendees(eventId);
      const payload = response.data?.data ?? response.data;
      setAttendees(payload.attendees || []);
      setTotalAttendees(payload.totalAttendees || 0);
      setMaxAttendees(payload.maxAttendees ?? null);
    } catch (error) {
      console.error("Failed to fetch attendees:", error);
      showErrorToast(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.exportEventAttendees(eventId);

      // Create a downloadable JSON file
      const dataStr = JSON.stringify(response.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${eventTitle.replace(/\s+/g, "_")}_attendees.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showSuccessToast("Attendee list exported successfully!");
    } catch (error) {
      console.error("Failed to export attendees:", error);
      showErrorToast(getErrorMessage(error));
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          maxWidth: "900px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
            paddingBottom: "1rem",
            borderBottom: "2px solid var(--border)",
          }}
        >
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              <Users
                size={24}
                style={{ display: "inline", marginRight: "0.5rem" }}
              />
              Event Attendees
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                marginTop: "0.25rem",
              }}
            >
              {eventTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
            }}
          >
            <X size={24} />
          </button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
            padding: "1rem",
            background: "var(--background)",
            borderRadius: "8px",
          }}
        >
          <div>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
              Total Registered
            </p>
            <p style={{ fontSize: "1.75rem", fontWeight: "bold" }}>
              {totalAttendees}
              {maxAttendees && ` / ${maxAttendees}`}
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleExport}
            disabled={attendees.length === 0}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Download size={18} />
            Export List
          </button>
        </div>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div className="spinner" />
            <p style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>
              Loading attendees...
            </p>
          </div>
        ) : attendees.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <Users
              size={48}
              style={{
                margin: "0 auto 1rem",
                color: "var(--text-secondary)",
              }}
            />
            <p style={{ color: "var(--text-secondary)" }}>
              No attendees registered yet
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {attendees.map((attendee, index) => (
              <div
                key={attendee.id}
                style={{
                  padding: "1.25rem",
                  background: "var(--background)",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "0.75rem",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {index + 1}. {attendee.fullName}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Registered on{" "}
                      {format(new Date(attendee.registeredAt), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Mail
                      size={16}
                      style={{ color: "var(--text-secondary)" }}
                    />
                    <span style={{ fontSize: "0.9rem" }}>{attendee.email}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Phone
                      size={16}
                      style={{ color: "var(--text-secondary)" }}
                    />
                    <span style={{ fontSize: "0.9rem" }}>
                      {attendee.phoneNumber}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "start",
                      gap: "0.5rem",
                      gridColumn: "1 / -1",
                    }}
                  >
                    <MapPin
                      size={16}
                      style={{
                        color: "var(--text-secondary)",
                        marginTop: "0.2rem",
                      }}
                    />
                    <span style={{ fontSize: "0.9rem" }}>
                      {attendee.address}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventAttendeesModal;
