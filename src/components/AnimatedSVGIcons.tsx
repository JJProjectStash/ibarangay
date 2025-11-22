import React from "react";

export const AnimatedCheckIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="2"
      className="animate-pulse"
      style={{ animationDuration: "2s" }}
    />
    <path
      d="M8 12L11 15L16 9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-in"
      style={{
        strokeDasharray: 20,
        strokeDashoffset: 20,
        animation: "drawCheck 1s ease forwards 0.5s",
      }}
    />
    <style>{`
      @keyframes drawCheck {
        to {
          stroke-dashoffset: 0;
        }
      }
    `}</style>
  </svg>
);

export const AnimatedSparkleIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
      fill="currentColor"
      className="animate-pulse"
      style={{
        transformOrigin: "center",
        animation: "sparkle 2s ease-in-out infinite",
      }}
    />
    <path
      d="M19 4L19.5 6L21.5 6.5L19.5 7L19 9L18.5 7L16.5 6.5L18.5 6L19 4Z"
      fill="currentColor"
      style={{
        transformOrigin: "center",
        animation: "sparkle 2s ease-in-out infinite 0.5s",
      }}
    />
    <path
      d="M5 15L5.5 17L7.5 17.5L5.5 18L5 20L4.5 18L2.5 17.5L4.5 17L5 15Z"
      fill="currentColor"
      style={{
        transformOrigin: "center",
        animation: "sparkle 2s ease-in-out infinite 1s",
      }}
    />
    <style>{`
      @keyframes sparkle {
        0%, 100% {
          opacity: 1;
          transform: scale(1) rotate(0deg);
        }
        50% {
          opacity: 0.5;
          transform: scale(1.2) rotate(180deg);
        }
      }
    `}</style>
  </svg>
);

export const AnimatedGlobeIcon: React.FC<{ className?: string }> = ({
  className = "w-8 h-8",
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="1.5"
      style={{
        transformOrigin: "center",
        animation: "rotate 20s linear infinite",
      }}
    />
    <path
      d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      stroke="currentColor"
      strokeWidth="1.5"
      style={{
        transformOrigin: "center",
        animation: "rotate 20s linear infinite reverse",
      }}
    />
    <circle
      cx="12"
      cy="12"
      r="2"
      fill="currentColor"
      className="animate-pulse"
    />
  </svg>
);

export const AnimatedRocketIcon: React.FC<{ className?: string }> = ({
  className = "w-8 h-8",
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="currentColor"
      fillOpacity="0.2"
      style={{
        transformOrigin: "center bottom",
        animation: "rocketLaunch 3s ease-in-out infinite",
      }}
    />
    <circle
      cx="12"
      cy="20"
      r="1"
      fill="currentColor"
      style={{ animation: "exhaust 0.5s ease-in-out infinite" }}
    />
    <circle
      cx="12"
      cy="22"
      r="0.5"
      fill="currentColor"
      style={{ animation: "exhaust 0.5s ease-in-out infinite 0.2s" }}
    />
    <style>{`
      @keyframes rocketLaunch {
        0%, 100% {
          transform: translateY(0) rotate(0deg);
        }
        50% {
          transform: translateY(-10px) rotate(-5deg);
        }
      }
      @keyframes exhaust {
        0%, 100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        50% {
          opacity: 0.3;
          transform: translateY(5px) scale(1.5);
        }
      }
    `}</style>
  </svg>
);

export const AnimatedShieldIcon: React.FC<{ className?: string }> = ({
  className = "w-8 h-8",
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L4 6V11C4 16 8 20 12 22C16 20 20 16 20 11V6L12 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="currentColor"
      fillOpacity="0.1"
      style={{
        transformOrigin: "center",
        animation: "shieldPulse 2s ease-in-out infinite",
      }}
    />
    <path
      d="M9 12L11 14L15 10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        strokeDasharray: 20,
        strokeDashoffset: 20,
        animation: "drawCheck 1s ease forwards 0.5s",
      }}
    />
    <style>{`
      @keyframes shieldPulse {
        0%, 100% {
          opacity: 1;
          transform: scale(1);
        }
        50% {
          opacity: 0.8;
          transform: scale(1.05);
        }
      }
      @keyframes drawCheck {
        to {
          stroke-dashoffset: 0;
        }
      }
    `}</style>
  </svg>
);

export const AnimatedLightningIcon: React.FC<{ className?: string }> = ({
  className = "w-8 h-8",
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="currentColor"
      fillOpacity="0.2"
      style={{
        animation: "lightning 1.5s ease-in-out infinite",
      }}
    />
    <style>{`
      @keyframes lightning {
        0%, 100% {
          opacity: 1;
          filter: drop-shadow(0 0 0px currentColor);
        }
        50% {
          opacity: 0.6;
          filter: drop-shadow(0 0 10px currentColor);
        }
      }
    `}</style>
  </svg>
);

export const AnimatedWaveIcon: React.FC<{ className?: string }> = ({
  className = "w-full h-20",
}) => (
  <svg
    className={className}
    viewBox="0 0 1200 120"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0,0 C150,100 350,0 600,50 C850,100 1050,0 1200,50 L1200,120 L0,120 Z"
      fill="currentColor"
      fillOpacity="0.1"
      style={{
        animation: "wave 10s ease-in-out infinite",
      }}
    />
    <path
      d="M0,20 C150,80 350,20 600,70 C850,120 1050,20 1200,70 L1200,120 L0,120 Z"
      fill="currentColor"
      fillOpacity="0.05"
      style={{
        animation: "wave 8s ease-in-out infinite reverse",
      }}
    />
    <style>{`
      @keyframes wave {
        0%, 100% {
          transform: translateX(0);
        }
        50% {
          transform: translateX(-50px);
        }
      }
    `}</style>
  </svg>
);

export const FloatingParticles: React.FC = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 10}s`,
    duration: `${10 + Math.random() * 10}s`,
    size: `${2 + Math.random() * 4}px`,
  }));

  return (
    <div className="particles absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle absolute rounded-full"
          style={{
            left: particle.left,
            width: particle.size,
            height: particle.size,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
            background: `hsl(${250 + Math.random() * 70}, 95%, 65%)`,
          }}
        />
      ))}
    </div>
  );
};

export const GlassOrb: React.FC<{ className?: string; color?: string }> = ({
  className = "w-32 h-32",
  color = "primary",
}) => (
  <div
    className={`${className} rounded-full relative`}
    style={{
      background: `radial-gradient(circle at 30% 30%, hsla(var(--${color}-light), 0.4), hsla(var(--${color}), 0.2))`,
      backdropFilter: "blur(40px)",
      boxShadow: `
        inset 0 0 40px hsla(var(--${color}), 0.3),
        0 0 60px hsla(var(--${color}), 0.2)
      `,
      animation:
        "float 6s ease-in-out infinite, morphBlob 15s ease-in-out infinite",
    }}
  >
    <div
      className="absolute inset-0 rounded-full"
      style={{
        background:
          "radial-gradient(circle at 70% 70%, transparent 30%, rgba(255, 255, 255, 0.1) 70%)",
        animation: "rotate 20s linear infinite",
      }}
    />
  </div>
);
