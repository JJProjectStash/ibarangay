import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Bell, Menu, X, LogOut, User } from "lucide-react";
import api from "../services/api";

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
    }
  }, [isAuthenticated]);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.getNotifications(false);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.container}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoText}>Barangay Services</span>
        </Link>

        {/* Desktop Menu */}
        <div style={styles.desktopMenu}>
          {isAuthenticated ? (
            <>
              <Link to="/" style={styles.navLink}>
                Home
              </Link>
              <Link to="/services" style={styles.navLink}>
                Services
              </Link>
              <Link to="/complaints" style={styles.navLink}>
                Complaints
              </Link>
              <Link to="/events" style={styles.navLink}>
                Events
              </Link>

              <Link to="/notifications" style={styles.iconButton}>
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span style={styles.badge}>{unreadCount}</span>
                )}
              </Link>

              <div style={styles.userMenu}>
                <User size={20} />
                <span style={styles.userName}>{user?.firstName}</span>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.navLink}>
                Login
              </Link>
              <Link
                to="/signup"
                className="btn btn-primary"
                style={styles.signupBtn}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          style={styles.mobileMenuBtn}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div style={styles.mobileMenu}>
          {isAuthenticated ? (
            <>
              <Link
                to="/"
                style={styles.mobileLink}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/services"
                style={styles.mobileLink}
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/complaints"
                style={styles.mobileLink}
                onClick={() => setIsMenuOpen(false)}
              >
                Complaints
              </Link>
              <Link
                to="/events"
                style={styles.mobileLink}
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </Link>
              <Link
                to="/notifications"
                style={styles.mobileLink}
                onClick={() => setIsMenuOpen(false)}
              >
                Notifications {unreadCount > 0 && `(${unreadCount})`}
              </Link>
              <button onClick={handleLogout} style={styles.mobileLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={styles.mobileLink}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                style={styles.mobileLink}
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

const styles: Record<string, React.CSSProperties> = {
  nav: {
    background: "var(--primary)",
    color: "white",
    padding: "1rem 0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "white",
  },
  logoText: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  desktopMenu: {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
  },
  navLink: {
    color: "white",
    fontWeight: "500",
    transition: "opacity 0.2s",
    opacity: 0.9,
  },
  iconButton: {
    position: "relative",
    color: "white",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "0.5rem",
    display: "flex",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: "0",
    right: "0",
    background: "var(--error)",
    color: "white",
    borderRadius: "50%",
    width: "18px",
    height: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.7rem",
    fontWeight: "bold",
  },
  userMenu: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.5rem 1rem",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "8px",
  },
  userName: {
    fontWeight: "500",
  },
  logoutBtn: {
    background: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
    padding: "0.25rem",
    display: "flex",
    alignItems: "center",
  },
  signupBtn: {
    background: "white",
    color: "var(--primary)",
  },
  mobileMenuBtn: {
    display: "none",
    background: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
  },
  mobileMenu: {
    display: "none",
    flexDirection: "column",
    gap: "1rem",
    padding: "1rem",
    background: "var(--primary-dark)",
  },
  mobileLink: {
    color: "white",
    padding: "0.5rem",
    fontWeight: "500",
  },
  mobileLogout: {
    background: "var(--error)",
    color: "white",
    border: "none",
    padding: "0.75rem",
    borderRadius: "6px",
    fontWeight: "500",
    cursor: "pointer",
    marginTop: "0.5rem",
  },
};

// Add media query styles
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @media (max-width: 768px) {
    nav > div > div:nth-child(2) {
      display: none !important;
    }
    nav button:last-of-type {
      display: block !important;
    }
    nav > div:last-child {
      display: flex !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Navbar;
