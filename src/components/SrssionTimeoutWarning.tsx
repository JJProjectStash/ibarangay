import React, { useState, useEffect } from "react";
import { AlertTriangle, Clock } from "lucide-react";

interface SessionTimeoutWarningProps {
  isVisible: boolean;
  timeLeft: number;
  onExtend: () => void;
  onLogout: () => void;
}

const SessionTimeoutWarning: React.FC<SessionTimeoutWarningProps> = ({
  isVisible,
  timeLeft,
  onExtend,
  onLogout,
}) => {
  const [countdown, setCountdown] = useState(timeLeft);

  useEffect(() => {
    setCountdown(timeLeft);
  }, [timeLeft]);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, onLogout]);

  if (!isVisible) return null;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">
            Session Timeout Warning
          </h3>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-3">
            Your session will expire soon due to inactivity. You will be
            automatically logged out in:
          </p>

          <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4">
            <Clock className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-2xl font-mono font-bold text-red-600">
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onExtend}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Extend Session
          </button>
          <button
            onClick={onLogout}
            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
          >
            Logout Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutWarning;
