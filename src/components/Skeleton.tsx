import React from "react";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  ariaLabel?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = "1rem",
  className = "",
  ariaLabel = "Loading content",
}) => {
  const style: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    borderRadius: "8px",
  };

  return (
    <div
      role="status"
      aria-label={ariaLabel}
      className={`skeleton ${className}`}
      style={style}
    />
  );
};

export default Skeleton;
