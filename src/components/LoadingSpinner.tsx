import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  fullScreen?: boolean;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  fullScreen = false,
  message,
}) => {
  const sizes = {
    small: "24px",
    medium: "40px",
    large: "60px",
  };

  const spinnerStyle: React.CSSProperties = {
    width: sizes[size],
    height: sizes[size],
    border: "3px solid rgba(59, 130, 246, 0.2)",
    borderTop: "3px solid #3B82F6",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  };

  const containerStyle: React.CSSProperties = fullScreen
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        zIndex: 9999,
        gap: "1rem",
      }
    : {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        gap: "1rem",
      };

  const messageStyle: React.CSSProperties = {
    color: "#6B7280",
    fontSize: "0.95rem",
    fontWeight: "500",
  };

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle} />
      {message && <p style={messageStyle}>{message}</p>}
    </div>
  );
};

// Add spin animation
if (
  typeof document !== "undefined" &&
  !document.getElementById("spinner-animation")
) {
  const style = document.createElement("style");
  style.id = "spinner-animation";
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

export default LoadingSpinner;
