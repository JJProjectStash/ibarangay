import React from "react";

interface SkeletonLoaderProps {
  type?: "text" | "card" | "list";
  count?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = "card",
  count = 3,
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case "text":
        return (
          <div style={styles.textSkeleton}>
            <div style={{ ...styles.shimmer, width: "100%", height: "20px" }} />
            <div style={{ ...styles.shimmer, width: "80%", height: "20px" }} />
            <div style={{ ...styles.shimmer, width: "60%", height: "20px" }} />
          </div>
        );
      case "card":
        return (
          <div className="card" style={styles.cardSkeleton}>
            <div
              style={{
                ...styles.shimmer,
                width: "60%",
                height: "24px",
                marginBottom: "1rem",
              }}
            />
            <div
              style={{
                ...styles.shimmer,
                width: "100%",
                height: "16px",
                marginBottom: "0.5rem",
              }}
            />
            <div
              style={{
                ...styles.shimmer,
                width: "90%",
                height: "16px",
                marginBottom: "0.5rem",
              }}
            />
            <div style={{ ...styles.shimmer, width: "70%", height: "16px" }} />
          </div>
        );
      case "list":
        return (
          <div style={styles.listItem}>
            <div
              style={{
                ...styles.shimmer,
                width: "40px",
                height: "40px",
                borderRadius: "50%",
              }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  ...styles.shimmer,
                  width: "60%",
                  height: "16px",
                  marginBottom: "0.5rem",
                }}
              />
              <div
                style={{ ...styles.shimmer, width: "80%", height: "14px" }}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} style={styles.container}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    marginBottom: "1rem",
  },
  shimmer: {
    background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
    borderRadius: "4px",
  },
  textSkeleton: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  cardSkeleton: {
    padding: "1.5rem",
  },
  listItem: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    padding: "1rem",
    background: "white",
    borderRadius: "8px",
  },
};

// Add shimmer animation
if (!document.getElementById("shimmer-animation")) {
  const style = document.createElement("style");
  style.id = "shimmer-animation";
  style.textContent = `
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
  document.head.appendChild(style);
}

export default SkeletonLoader;
