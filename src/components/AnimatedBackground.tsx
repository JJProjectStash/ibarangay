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
    opacity: 0.1,
  },
  shape1: {
    width: "300px",
    height: "300px",
    background: "linear-gradient(135deg, #3B82F6, #10B981)",
    top: "10%",
    left: "10%",
    animation: "float 20s ease-in-out infinite",
  },
  shape2: {
    width: "200px",
    height: "200px",
    background: "linear-gradient(135deg, #F59E0B, #EF4444)",
    top: "60%",
    right: "15%",
    animation: "float 15s ease-in-out infinite 5s",
  },
  shape3: {
    width: "250px",
    height: "250px",
    background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
    bottom: "20%",
    left: "50%",
    animation: "float 18s ease-in-out infinite 10s",
  },
};

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes float {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(30px, -30px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
  }
`;
document.head.appendChild(styleSheet);

export default AnimatedBackground;
