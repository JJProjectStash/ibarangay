import React from "react";

const AnimatedBackground: React.FC = () => {
  return (
    <div style={styles.container}>
      <div style={styles.floatingShapes}>
        <div style={{ ...styles.shape, ...styles.shape1 }} />
        <div style={{ ...styles.shape, ...styles.shape2 }} />
        <div style={{ ...styles.shape, ...styles.shape3 }} />
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    pointerEvents: "none",
    zIndex: 0,
  },
  floatingShapes: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  shape: {
    position: "absolute",
    borderRadius: "50%",
    opacity: 0.08,
    filter: "blur(1px)",
  },
  shape1: {
    width: "280px",
    height: "280px",
    background: "linear-gradient(135deg, #3B82F6, #10B981)",
    top: "15%",
    left: "10%",
    animation: "gentleFloat 25s ease-in-out infinite",
  },
  shape2: {
    width: "180px",
    height: "180px",
    background: "linear-gradient(135deg, #F59E0B, #EF4444)",
    top: "65%",
    right: "15%",
    animation: "gentleFloat 20s ease-in-out infinite 8s",
  },
  shape3: {
    width: "220px",
    height: "220px",
    background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
    bottom: "25%",
    left: "50%",
    animation: "gentleFloat 30s ease-in-out infinite 15s",
  },
};

// Create and inject styles only once
if (!document.querySelector("#animated-background-styles")) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "animated-background-styles";
  styleSheet.textContent = `
    @keyframes gentleFloat {
      0%, 100% {
        transform: translate(0, 0) scale(1);
      }
      25% {
        transform: translate(15px, -15px) scale(1.05);
      }
      50% {
        transform: translate(-10px, -20px) scale(0.95);
      }
      75% {
        transform: translate(-15px, 10px) scale(1.02);
      }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default AnimatedBackground;
