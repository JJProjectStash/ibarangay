import React, { useState, useEffect } from "react";
import { Clock, AlertTriangle } from "lucide-react";

interface RateLimitFeedbackProps {
  isRateLimited: boolean;
  resetTime?: number;
  requestsRemaining?: number;
  requestsLimit?: number;
}

const RateLimitFeedback: React.FC<RateLimitFeedbackProps> = ({
  isRateLimited,
  resetTime,
  requestsRemaining = 0,
  requestsLimit = 100,
}) => {
  const [timeUntilReset, setTimeUntilReset] = useState<number>(0);

  useEffect(() => {
    if (!resetTime || !isRateLimited) return;

    const updateTimer = () => {
      const now = Date.now();
      const timeLeft = Math.max(0, resetTime - now);
      setTimeUntilReset(Math.ceil(timeLeft / 1000));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [resetTime, isRateLimited]);

  if (isRateLimited) {
    const minutes = Math.floor(timeUntilReset / 60);
    const seconds = timeUntilReset % 60;

    return (
      <div className="fixed top-20 right-4 bg-yellow-100 border border-yellow-300 rounded-lg p-4 max-w-sm z-50 shadow-lg">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-yellow-800 mb-1">
              Rate Limit Exceeded
            </h4>
            <p className="text-sm text-yellow-700 mb-2">
              Too many requests. Please wait before trying again.
            </p>
            <div className="flex items-center space-x-2 text-sm text-yellow-600">
              <Clock className="h-4 w-4" />
              <span>
                Reset in: {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show warning when approaching rate limit
  const usagePercentage =
    ((requestsLimit - requestsRemaining) / requestsLimit) * 100;

  if (usagePercentage >= 80) {
    return (
      <div className="fixed top-20 right-4 bg-orange-100 border border-orange-300 rounded-lg p-3 max-w-sm z-40">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <div className="text-sm text-orange-800">
            <span className="font-medium">Rate limit warning:</span>
            <span className="ml-1">{requestsRemaining} requests remaining</span>
          </div>
        </div>
        <div className="mt-2 w-full bg-orange-200 rounded-full h-2">
          <div
            className="bg-orange-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${usagePercentage}%` }}
          />
        </div>
      </div>
    );
  }

  return null;
};

export default RateLimitFeedback;

// Hook to track rate limiting
export const useRateLimit = () => {
  const [rateLimitState, setRateLimitState] = useState({
    isRateLimited: false,
    resetTime: 0,
    requestsRemaining: 100,
    requestsLimit: 100,
  });

  const updateRateLimit = (headers: Record<string, string>) => {
    const remaining = parseInt(headers["x-ratelimit-remaining"] || "100");
    const limit = parseInt(headers["x-ratelimit-limit"] || "100");
    const reset = parseInt(headers["x-ratelimit-reset"] || "0") * 1000; // Convert to milliseconds

    setRateLimitState({
      isRateLimited: remaining === 0,
      resetTime: reset,
      requestsRemaining: remaining,
      requestsLimit: limit,
    });
  };

  const handleRateLimitError = (retryAfter: number) => {
    setRateLimitState((prev) => ({
      ...prev,
      isRateLimited: true,
      resetTime: Date.now() + retryAfter * 1000,
    }));
  };

  return {
    rateLimitState,
    updateRateLimit,
    handleRateLimitError,
  };
};
