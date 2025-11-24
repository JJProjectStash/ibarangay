import React from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateEnhancedProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  illustration?: "search" | "empty" | "error" | "success";
}

const EmptyStateEnhanced: React.FC<EmptyStateEnhancedProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  illustration = "empty",
}) => {
  const getIllustrationColor = () => {
    switch (illustration) {
      case "search":
        return "var(--info-500)";
      case "error":
        return "var(--error-500)";
      case "success":
        return "var(--success-500)";
      default:
        return "var(--gray-400)";
    }
  };

  return (
    <div
      className="card animate-fade-in"
      style={{
        padding: "4rem 2rem",
        textAlign: "center",
        maxWidth: "500px",
        margin: "0 auto",
      }}
    >
      {/* Icon with animated background */}
      <div
        style={{
          position: "relative",
          display: "inline-block",
          marginBottom: "2rem",
        }}
      >
        <div
          className="pulse-animation"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            backgroundColor: `${getIllustrationColor()}20`,
          }}
        />
        <div
          style={{
            position: "relative",
            width: "80px",
            height: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            backgroundColor: `${getIllustrationColor()}15`,
            margin: "0 auto",
          }}
        >
          <Icon size={40} style={{ color: getIllustrationColor() }} />
        </div>
      </div>

      {/* Content */}
      <h3
        className="text-2xl font-bold"
        style={{
          marginBottom: "0.75rem",
          color: "var(--text-primary)",
        }}
      >
        {title}
      </h3>
      <p
        className="text-secondary"
        style={{
          marginBottom: "2rem",
          lineHeight: "1.6",
          fontSize: "1rem",
        }}
      >
        {description}
      </p>

      {/* Actions */}
      {(actionLabel || secondaryActionLabel) && (
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {actionLabel && onAction && (
            <button
              className="btn btn-primary btn-hover-lift"
              onClick={onAction}
              style={{
                minWidth: "140px",
              }}
            >
              {actionLabel}
            </button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <button
              className="btn btn-outline btn-hover-lift"
              onClick={onSecondaryAction}
              style={{
                minWidth: "140px",
              }}
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        .pulse-animation {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        .btn-hover-lift {
          transition: all 0.3s ease;
        }

        .btn-hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .btn-hover-lift:active {
          transform: translateY(0);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default EmptyStateEnhanced;
