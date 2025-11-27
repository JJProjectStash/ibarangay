import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search, HelpCircle } from "lucide-react";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.content} className="fade-in">
        {/* 404 Illustration */}
        <div style={styles.illustrationWrapper}>
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={styles.illustration}
          >
            <circle cx="100" cy="100" r="80" fill="#EEF2FF" />
            <path
              d="M60 100c0-22.091 17.909-40 40-40s40 17.909 40 40"
              stroke="#3B82F6"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <circle cx="80" cy="90" r="8" fill="#1E3A8A" />
            <circle cx="120" cy="90" r="8" fill="#1E3A8A" />
            <path
              d="M75 120c0 13.807 11.193 25 25 25s25-11.193 25-25"
              stroke="#1E3A8A"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Error Code */}
        <h1 style={styles.errorCode} className="gradient-text">
          404
        </h1>

        {/* Error Message */}
        <h2 style={styles.title}>Page Not Found</h2>
        <p style={styles.description}>
          Oops! The page you're looking for doesn't exist or has been moved.
          <br />
          Don't worry, we'll help you get back on track.
        </p>

        {/* Action Buttons */}
        <div style={styles.actions}>
          <button
            onClick={() => navigate(-1)}
            style={styles.secondaryBtn}
            className="btn-secondary-404"
          >
            <ArrowLeft size={20} />
            <span>Go Back</span>
          </button>
          <Link to="/" style={styles.primaryBtn} className="btn-primary-404">
            <Home size={20} />
            <span>Home Page</span>
          </Link>
        </div>

        {/* Quick Links */}
        <div style={styles.quickLinks}>
          <h3 style={styles.quickLinksTitle}>Quick Links</h3>
          <div style={styles.linkGrid}>
            <Link
              to="/dashboard"
              style={styles.quickLink}
              className="quick-link"
            >
              <div style={styles.linkIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3"
                    y="3"
                    width="7"
                    height="7"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <rect
                    x="14"
                    y="3"
                    width="7"
                    height="7"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <rect
                    x="3"
                    y="14"
                    width="7"
                    height="7"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <rect
                    x="14"
                    y="14"
                    width="7"
                    height="7"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <span>Dashboard</span>
            </Link>
            <Link
              to="/services"
              style={styles.quickLink}
              className="quick-link"
            >
              <div style={styles.linkIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 7h-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM10 5h4v2h-4V5z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span>Services</span>
            </Link>
            <Link to="/events" style={styles.quickLink} className="quick-link">
              <div style={styles.linkIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3"
                    y="6"
                    width="18"
                    height="15"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M3 10h18M8 3v6M16 3v6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span>Events</span>
            </Link>
            <Link to="/help" style={styles.quickLink} className="quick-link">
              <div style={styles.linkIcon}>
                <HelpCircle size={24} />
              </div>
              <span>Help Center</span>
            </Link>
          </div>
        </div>

        {/* Search Suggestion */}
        <div style={styles.searchSuggestion}>
          <Search size={20} style={{ color: "#6B7280" }} />
          <span style={styles.searchText}>
            Looking for something specific? Try searching from the home page.
          </span>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .gradient-text {
          background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 50%, #10B981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .btn-primary-404 {
          position: relative;
          overflow: hidden;
        }

        .btn-primary-404::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .btn-primary-404:hover::before {
          width: 300px;
          height: 300px;
        }

        .btn-primary-404:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4) !important;
        }

        .btn-secondary-404:hover {
          background: var(--primary) !important;
          color: white !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(30, 58, 138, 0.3) !important;
        }

        .quick-link {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .quick-link:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1) !important;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
        }

        .quick-link:hover > div {
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%) !important;
          color: white !important;
          transform: scale(1.1);
        }

        @media (max-width: 768px) {
          .quick-link {
            padding: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "calc(100vh - 64px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    background: "var(--background)",
  },
  content: {
    maxWidth: "600px",
    width: "100%",
    textAlign: "center",
  },
  illustrationWrapper: {
    marginBottom: "2rem",
    animation: "float 3s ease-in-out infinite",
  },
  illustration: {
    filter: "drop-shadow(0 10px 30px rgba(59, 130, 246, 0.2))",
  },
  errorCode: {
    fontSize: "8rem",
    fontWeight: "900",
    lineHeight: 1,
    marginBottom: "1rem",
    letterSpacing: "-0.05em",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "var(--text-primary)",
    marginBottom: "1rem",
    letterSpacing: "-0.02em",
  },
  description: {
    fontSize: "1.125rem",
    color: "var(--text-secondary)",
    marginBottom: "3rem",
    lineHeight: "1.7",
  },
  actions: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    marginBottom: "3rem",
    flexWrap: "wrap",
  },
  primaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.875rem 2rem",
    background: "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)",
    color: "white",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "1rem",
    textDecoration: "none",
    boxShadow: "0 4px 16px rgba(59, 130, 246, 0.3)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "none",
    cursor: "pointer",
  },
  secondaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.875rem 2rem",
    background: "transparent",
    color: "var(--primary)",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "1rem",
    textDecoration: "none",
    border: "2px solid var(--primary)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
  },
  quickLinks: {
    marginBottom: "2rem",
  },
  quickLinksTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "var(--text-primary)",
    marginBottom: "1.5rem",
  },
  linkGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "1rem",
  },
  quickLink: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.75rem",
    padding: "1.5rem 1rem",
    background: "var(--surface)",
    borderRadius: "12px",
    textDecoration: "none",
    color: "var(--text-primary)",
    fontWeight: "500",
    fontSize: "0.9375rem",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    border: "1px solid var(--border)",
  },
  linkIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#3B82F6",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  searchSuggestion: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    padding: "1rem 1.5rem",
    background: "linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)",
    borderRadius: "12px",
    border: "1px solid var(--border)",
  },
  searchText: {
    fontSize: "0.9375rem",
    color: "var(--text-secondary)",
    fontWeight: "500",
  },
};

export default NotFound;
