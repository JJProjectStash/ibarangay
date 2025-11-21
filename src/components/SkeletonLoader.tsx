import React from "react";

interface SkeletonLoaderProps {
  count?: number;
  height?: string;
  width?: string;
  borderRadius?: string;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  count = 1,
  height = "20px",
  width = "100%",
  borderRadius = "4px",
  className = "",
}) => {
  const skeletonStyle: React.CSSProperties = {
    height,
    width,
    borderRadius,
    background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
    marginBottom: count > 1 ? "0.5rem" : "0",
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} style={skeletonStyle} className={className} />
      ))}
    </>
  );
};

// Add shimmer animation
if (
  typeof document !== "undefined" &&
  !document.getElementById("shimmer-animation")
) {
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
