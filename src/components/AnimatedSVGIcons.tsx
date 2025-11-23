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
      className="opacity-80"
    />
    <path
      d="M8 12L11 15L16 9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        strokeDasharray: 20,
        strokeDashoffset: 20,
        animation: "drawCheck 1.2s ease-out forwards 0.3s",
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
      style={{
        transformOrigin: "center",
        animation: "gentleSparkle 3s ease-in-out infinite",
      }}
    />
    <path
      d="M19 4L19.5 6L21.5 6.5L19.5 7L19 9L18.5 7L16.5 6.5L18.5 6L19 4Z"
      fill="currentColor"
      style={{
        transformOrigin: "center",
        animation: "gentleSparkle 3s ease-in-out infinite 1s",
        opacity: 0.7,
      }}
    />
    <path
      d="M5 15L5.5 17L7.5 17.5L5.5 18L5 20L4.5 18L2.5 17.5L4.5 17L5 15Z"
      fill="currentColor"
      style={{
        transformOrigin: "center",
        animation: "gentleSparkle 3s ease-in-out infinite 2s",
        opacity: 0.5,
      }}
    />
    <style>{`
      @keyframes gentleSparkle {
        0%, 100% {
          opacity: 1;
          transform: scale(1);
        }
        50% {
          opacity: 0.6;
          transform: scale(1.1);
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
        animation: "gentleRotate 30s linear infinite",
      }}
    />
    <path
      d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      stroke="currentColor"
      strokeWidth="1.5"
      opacity="0.7"
    />
    <circle
      cx="12"
      cy="12"
      r="2"
      fill="currentColor"
      style={{
        animation: "gentlePulse 2s ease-in-out infinite",
      }}
    />
    <style>{`
      @keyframes gentleRotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      @keyframes gentlePulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }
    `}</style>
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
        transformOrigin: "center",
        animation: "gentleFloat 4s ease-in-out infinite",
      }}
    />
    <style>{`
      @keyframes gentleFloat {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-4px);
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
        animation: "gentlePulse 3s ease-in-out infinite",
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
        animation: "drawCheck 1.2s ease-out forwards 0.5s",
      }}
    />
    <style>{`
      @keyframes gentlePulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.7;
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
        animation: "gentleGlow 2s ease-in-out infinite",
      }}
    />
    <style>{`
      @keyframes gentleGlow {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.7;
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
        animation: "gentleWave 15s ease-in-out infinite",
      }}
    />
    <path
      d="M0,20 C150,80 350,20 600,70 C850,120 1050,20 1200,70 L1200,120 L0,120 Z"
      fill="currentColor"
      fillOpacity="0.05"
      style={{
        animation: "gentleWave 12s ease-in-out infinite reverse",
      }}
    />
    <style>{`
      @keyframes gentleWave {
        0%, 100% {
          transform: translateX(0);
        }
        50% {
          transform: translateX(-25px);
        }
      }
    `}</style>
  </svg>
);

export const FloatingParticles: React.FC = () => {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${15 + Math.random() * 10}s`,
    size: `${3 + Math.random() * 2}px`,
  }));

  return (
    <div className="particles absolute inset-0 pointer-events-none overflow-hidden opacity-60">
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
            background: `hsl(${220 + Math.random() * 60}, 70%, 70%)`,
            animation: `gentleFloat ${particle.duration} ease-in-out infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes gentleFloat {
          0%, 100% {
            transform: translateY(100vh) translateX(0) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: translateY(90vh) translateX(0) scale(1);
          }
          90% {
            opacity: 1;
            transform: translateY(-10vh) translateX(20px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-20vh) translateX(40px) scale(0);
          }
        }
      `}</style>
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
      background: `radial-gradient(circle at 30% 30%, hsla(220, 70%, 70%, 0.3), hsla(220, 70%, 50%, 0.1))`,
      backdropFilter: "blur(20px)",
      boxShadow: `
        inset 0 0 20px hsla(220, 70%, 70%, 0.2),
        0 0 40px hsla(220, 70%, 70%, 0.1)
      `,
      animation: "gentleFloat 8s ease-in-out infinite",
    }}
  >
    <div
      className="absolute inset-0 rounded-full opacity-50"
      style={{
        background:
          "radial-gradient(circle at 70% 70%, transparent 30%, rgba(255, 255, 255, 0.1) 70%)",
        animation: "gentleRotate 25s linear infinite",
      }}
    />
    <style>{`
      @keyframes gentleFloat {
        0%, 100% {
          transform: translateY(0) scale(1);
        }
        50% {
          transform: translateY(-10px) scale(1.02);
        }
      }
      @keyframes gentleRotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `}</style>
  </div>
);
