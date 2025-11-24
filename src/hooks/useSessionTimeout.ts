import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";

interface UseSessionTimeoutProps {
  warningTime?: number; // Time in seconds to show warning before logout
  sessionDuration?: number; // Total session duration in seconds
}

export const useSessionTimeout = ({
  warningTime = 300, // 5 minutes warning
  sessionDuration = 3600, // 1 hour session
}: UseSessionTimeoutProps = {}) => {
  const { logout, isAuthenticated } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(warningTime);

  const warningTimerRef = useRef<number>();
  const sessionTimerRef = useRef<number>();
  const lastActivityRef = useRef<number>(Date.now());

  const handleLogout = useCallback(() => {
    setShowWarning(false);
    logout();
  }, [logout]);

  const resetTimer = useCallback(() => {
    if (!isAuthenticated) return;

    lastActivityRef.current = Date.now();
    setShowWarning(false);

    // Clear existing timers
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);

    // Set warning timer
    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      setTimeLeft(warningTime);
    }, (sessionDuration - warningTime) * 1000);

    // Set session expiry timer
    sessionTimerRef.current = setTimeout(() => {
      handleLogout();
    }, sessionDuration * 1000);
  }, [isAuthenticated, sessionDuration, warningTime, handleLogout]);

  const extendSession = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  // Track user activity
  useEffect(() => {
    if (!isAuthenticated) return;

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    const handleActivity = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityRef.current;

      // Only reset if significant time has passed to avoid too frequent resets
      if (timeSinceLastActivity > 30000) {
        // 30 seconds
        resetTimer();
      }
    };

    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    // Initialize timer
    resetTimer();

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
    };
  }, [isAuthenticated, resetTimer]);

  // Clean up when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setShowWarning(false);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
    }
  }, [isAuthenticated]);

  return {
    showWarning,
    timeLeft,
    extendSession,
    handleLogout,
  };
};
