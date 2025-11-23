import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

// Performance monitoring
import { measureWebVitals, performanceMonitor } from "./utils/performance";

// Initialize performance monitoring in development
if (import.meta.env.DEV) {
  measureWebVitals();

  // Log performance metrics every 30 seconds in development
  setInterval(() => {
    performanceMonitor.reportAll();
  }, 30000);
}

// Service Worker registration for caching (production only)
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

// Error boundary for unhandled errors
window.addEventListener("error", (event) => {
  console.error("Global error:", event.error);
  // In production, you might want to send this to an error tracking service
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
  // In production, you might want to send this to an error tracking service
});

// Memory monitoring in development
if (import.meta.env.DEV && "memory" in performance) {
  setInterval(() => {
    const memory = (performance as any).memory;
    if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
      console.warn("High memory usage detected:", {
        used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)} MB`,
        limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)} MB`,
      });
    }
  }, 60000); // Check every minute
}

// Preload critical resources
const preloadCriticalResources = () => {
  // Preload critical fonts
  const fontLink = document.createElement("link");
  fontLink.rel = "preload";
  fontLink.as = "font";
  fontLink.type = "font/woff2";
  fontLink.crossOrigin = "anonymous";
  fontLink.href = "/fonts/inter-var.woff2"; // Adjust path as needed
  document.head.appendChild(fontLink);

  // Preload critical images
  const heroImage = new Image();
  heroImage.src = "/images/HeroImage.jpg"; // Adjust path as needed
};

// Initialize app
const initializeApp = () => {
  const root = ReactDOM.createRoot(document.getElementById("root")!);

  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
};

// Start the application
preloadCriticalResources();
initializeApp();

// Export for debugging in development
if (import.meta.env.DEV) {
  (window as any).__PERFORMANCE_MONITOR__ = performanceMonitor;
}
