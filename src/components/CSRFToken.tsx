import React, { useEffect, useState } from "react";
import api from "../services/apiExtensions";
import { Shield, AlertCircle } from "lucide-react";

interface CSRFTokenProps {
  onTokenReceived?: (token: string) => void;
}

const CSRFToken: React.FC<CSRFTokenProps> = ({ onTokenReceived }) => {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        setIsLoading(true);
        setError("");

        // Use the axios client (apiExtensions) which points to /api/v1 by default
        // and will be proxied by Vite during development to avoid CORS issues.
        const res = await api.getCsrfToken();
        const token = res.data?.csrfToken;

        // Store token in meta tag for axios interceptor
        let metaTag = document.querySelector(
          'meta[name="csrf-token"]'
        ) as HTMLMetaElement;
        if (!metaTag) {
          metaTag = document.createElement("meta");
          metaTag.name = "csrf-token";
          document.head.appendChild(metaTag);
        }
        metaTag.content = token;

        onTokenReceived?.(token);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch CSRF token"
        );
        console.error("CSRF token fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCSRFToken();

    // Refresh token every 30 minutes
    const interval = setInterval(fetchCSRFToken, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [onTokenReceived]);

  // This component doesn't render anything visible in normal operation
  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 bg-blue-100 border border-blue-300 rounded-lg p-3 flex items-center space-x-2 z-40">
        <Shield className="h-4 w-4 text-blue-600 animate-spin" />
        <span className="text-sm text-blue-800">Securing connection...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 border border-red-300 rounded-lg p-3 flex items-center space-x-2 z-40">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <span className="text-sm text-red-800">Security token error</span>
      </div>
    );
  }

  return null;
};

export default CSRFToken;
