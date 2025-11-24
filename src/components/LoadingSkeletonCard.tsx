import React from "react";

interface LoadingSkeletonCardProps {
  count?: number;
  variant?: "list" | "grid" | "table";
}

const LoadingSkeletonCard: React.FC<LoadingSkeletonCardProps> = ({
  count = 3,
  variant = "list",
}) => {
  const renderListSkeleton = () => (
    <div className="card animate-pulse" style={{ marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", gap: "1rem", alignItems: "start" }}>
        {/* Checkbox skeleton */}
        <div
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "4px",
            backgroundColor: "var(--gray-200)",
          }}
        />

        <div style={{ flex: 1 }}>
          {/* Title skeleton */}
          <div
            style={{
              height: "24px",
              width: "60%",
              backgroundColor: "var(--gray-200)",
              borderRadius: "4px",
              marginBottom: "0.75rem",
            }}
          />

          {/* Badges skeleton */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                height: "24px",
                width: "80px",
                backgroundColor: "var(--gray-200)",
                borderRadius: "12px",
              }}
            />
            <div
              style={{
                height: "24px",
                width: "80px",
                backgroundColor: "var(--gray-200)",
                borderRadius: "12px",
              }}
            />
            <div
              style={{
                height: "24px",
                width: "100px",
                backgroundColor: "var(--gray-200)",
                borderRadius: "12px",
              }}
            />
          </div>

          {/* Description skeleton */}
          <div style={{ marginBottom: "1rem" }}>
            <div
              style={{
                height: "16px",
                width: "100%",
                backgroundColor: "var(--gray-200)",
                borderRadius: "4px",
                marginBottom: "0.5rem",
              }}
            />
            <div
              style={{
                height: "16px",
                width: "90%",
                backgroundColor: "var(--gray-200)",
                borderRadius: "4px",
                marginBottom: "0.5rem",
              }}
            />
            <div
              style={{
                height: "16px",
                width: "75%",
                backgroundColor: "var(--gray-200)",
                borderRadius: "4px",
              }}
            />
          </div>

          {/* Footer skeleton */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                height: "14px",
                width: "120px",
                backgroundColor: "var(--gray-200)",
                borderRadius: "4px",
              }}
            />
            <div
              style={{
                height: "14px",
                width: "100px",
                backgroundColor: "var(--gray-200)",
                borderRadius: "4px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderGridSkeleton = () => (
    <div
      className="card animate-pulse"
      style={{
        padding: "1.5rem",
      }}
    >
      {/* Image skeleton */}
      <div
        style={{
          height: "200px",
          width: "100%",
          backgroundColor: "var(--gray-200)",
          borderRadius: "8px",
          marginBottom: "1rem",
        }}
      />

      {/* Title skeleton */}
      <div
        style={{
          height: "20px",
          width: "80%",
          backgroundColor: "var(--gray-200)",
          borderRadius: "4px",
          marginBottom: "0.75rem",
        }}
      />

      {/* Description skeleton */}
      <div
        style={{
          height: "14px",
          width: "100%",
          backgroundColor: "var(--gray-200)",
          borderRadius: "4px",
          marginBottom: "0.5rem",
        }}
      />
      <div
        style={{
          height: "14px",
          width: "60%",
          backgroundColor: "var(--gray-200)",
          borderRadius: "4px",
          marginBottom: "1rem",
        }}
      />

      {/* Button skeleton */}
      <div
        style={{
          height: "36px",
          width: "100%",
          backgroundColor: "var(--gray-200)",
          borderRadius: "6px",
        }}
      />
    </div>
  );

  const renderTableSkeleton = () => (
    <div className="card" style={{ overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--border)" }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <th key={i} style={{ padding: "1rem", textAlign: "left" }}>
                <div
                  className="animate-pulse"
                  style={{
                    height: "16px",
                    width: "80px",
                    backgroundColor: "var(--gray-200)",
                    borderRadius: "4px",
                  }}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: count }).map((_, rowIndex) => (
            <tr
              key={rowIndex}
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <td key={i} style={{ padding: "1rem" }}>
                  <div
                    className="animate-pulse"
                    style={{
                      height: "14px",
                      width: i === 1 ? "120px" : "80px",
                      backgroundColor: "var(--gray-200)",
                      borderRadius: "4px",
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderSkeleton = () => {
    switch (variant) {
      case "grid":
        return renderGridSkeleton();
      case "table":
        return renderTableSkeleton();
      default:
        return renderListSkeleton();
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </>
  );
};

export default LoadingSkeletonCard;
