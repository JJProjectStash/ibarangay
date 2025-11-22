import React from "react";
import { AuditLog } from "../../types/admin";
import { format } from "date-fns";
import { Activity, User, FileText, Calendar, AlertCircle } from "lucide-react";

interface AuditLogViewerProps {
  logs: AuditLog[];
}

const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ logs }) => {
  const getActionIcon = (targetType: string) => {
    switch (targetType) {
      case "user":
        return <User size={16} />;
      case "service":
        return <FileText size={16} />;
      case "complaint":
        return <AlertCircle size={16} />;
      case "event":
        return <Calendar size={16} />;
      default:
        return <Activity size={16} />;
    }
  };

  const getActionColor = (action: string) => {
    if (action.includes("delete")) return "#ef4444";
    if (action.includes("create")) return "#10b981";
    if (action.includes("update")) return "#3b82f6";
    return "#6366f1";
  };

  if (logs.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "3rem",
          color: "var(--text-secondary)",
        }}
      >
        <Activity size={48} style={{ margin: "0 auto 1rem", opacity: 0.5 }} />
        <p>No audit logs available</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {logs.map((log) => (
        <div
          key={log._id}
          className="card"
          style={{
            padding: "1rem",
            borderLeft: `4px solid ${getActionColor(log.action)}`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
            }}
          >
            <div style={{ display: "flex", gap: "1rem", flex: 1 }}>
              <div
                style={{
                  padding: "0.75rem",
                  background: `${getActionColor(log.action)}15`,
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: getActionColor(log.action),
                }}
              >
                {getActionIcon(log.targetType)}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  <span style={{ fontWeight: "600" }}>{log.userName}</span>
                  <span
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.875rem",
                    }}
                  >
                    {log.action}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {format(new Date(log.createdAt), "MMM dd, yyyy HH:mm:ss")}
                </div>
                {Object.keys(log.details).length > 0 && (
                  <div
                    style={{
                      background: "rgba(0,0,0,0.02)",
                      padding: "0.5rem",
                      borderRadius: "4px",
                      fontSize: "0.875rem",
                      fontFamily: "monospace",
                    }}
                  >
                    {JSON.stringify(log.details, null, 2)}
                  </div>
                )}
              </div>
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
                textAlign: "right",
              }}
            >
              <div>{log.ipAddress || "N/A"}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AuditLogViewer;
