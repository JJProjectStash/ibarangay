import React from "react";

export const BarangayLogo: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className = "",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#60A5FA", stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: "#3B82F6", stopOpacity: 1 }}
          />
        </linearGradient>
      </defs>
      {/* House shape */}
      <path
        d="M50 10 L90 40 L90 85 L60 85 L60 60 L40 60 L40 85 L10 85 L10 40 Z"
        fill="url(#logoGradient)"
      />
      {/* Door */}
      <rect x="42" y="65" width="16" height="20" fill="white" opacity="0.9" />
      {/* Windows */}
      <rect x="20" y="50" width="12" height="12" fill="white" opacity="0.9" />
      <rect x="68" y="50" width="12" height="12" fill="white" opacity="0.9" />
      {/* Roof detail */}
      <path
        d="M50 10 L90 40 L85 40 L50 15 L15 40 L10 40 Z"
        fill="#1E3A8A"
        opacity="0.3"
      />
    </svg>
  );
};

export const ServiceIcon: React.FC<{ size?: number }> = ({ size = 64 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="45" fill="#3B82F6" opacity="0.1" />
      <path
        d="M30 40 L45 25 L70 25 L70 75 L30 75 Z"
        stroke="#3B82F6"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="40" y1="40" x2="60" y2="40" stroke="#3B82F6" strokeWidth="2" />
      <line x1="40" y1="50" x2="60" y2="50" stroke="#3B82F6" strokeWidth="2" />
      <line x1="40" y1="60" x2="55" y2="60" stroke="#3B82F6" strokeWidth="2" />
    </svg>
  );
};

export const ComplaintIcon: React.FC<{ size?: number }> = ({ size = 64 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="45" fill="#EF4444" opacity="0.1" />
      <path
        d="M25 30 C25 25 28 22 33 22 L67 22 C72 22 75 25 75 30 L75 60 C75 65 72 68 67 68 L40 68 L25 78 Z"
        stroke="#EF4444"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="35" y1="38" x2="65" y2="38" stroke="#EF4444" strokeWidth="2" />
      <line x1="35" y1="48" x2="60" y2="48" stroke="#EF4444" strokeWidth="2" />
      <line x1="35" y1="58" x2="55" y2="58" stroke="#EF4444" strokeWidth="2" />
    </svg>
  );
};

export const EventIcon: React.FC<{ size?: number }> = ({ size = 64 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="45" fill="#10B981" opacity="0.1" />
      <rect
        x="25"
        y="30"
        width="50"
        height="45"
        rx="5"
        stroke="#10B981"
        strokeWidth="3"
        fill="none"
      />
      <line x1="25" y1="42" x2="75" y2="42" stroke="#10B981" strokeWidth="3" />
      <line
        x1="38"
        y1="25"
        x2="38"
        y2="35"
        stroke="#10B981"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="62"
        y1="25"
        x2="62"
        y2="35"
        stroke="#10B981"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="40" cy="55" r="3" fill="#10B981" />
      <circle cx="50" cy="55" r="3" fill="#10B981" />
      <circle cx="60" cy="55" r="3" fill="#10B981" />
      <circle cx="40" cy="65" r="3" fill="#10B981" />
      <circle cx="50" cy="65" r="3" fill="#10B981" />
    </svg>
  );
};

export const NotificationIcon: React.FC<{ size?: number }> = ({
  size = 64,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="45" fill="#F59E0B" opacity="0.1" />
      <path
        d="M50 25 C40 25 35 30 35 40 L35 55 L30 65 L70 65 L65 55 L65 40 C65 30 60 25 50 25 Z"
        stroke="#F59E0B"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M45 65 C45 68 47 72 50 72 C53 72 55 68 55 65"
        stroke="#F59E0B"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="65" cy="35" r="8" fill="#EF4444">
        <animate
          attributeName="r"
          values="8;10;8"
          dur="1.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="1;0.7;1"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
};

export const CheckmarkIcon: React.FC<{ size?: number }> = ({ size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" fill="#10B981" />
      <path
        d="M7 12 L10 15 L17 8"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const LoadingSpinner: React.FC<{ size?: number }> = ({ size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="#3B82F6"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="31.4 31.4"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 25 25"
          to="360 25 25"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
};
