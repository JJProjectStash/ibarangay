import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Menu,
  X,
  LogOut,
  User,
  BarChart3,
  Shield,
  Briefcase,
} from "lucide-react";
import { BarangayLogo } from "./CustomIcons";
import NotificationBell from "./NotificationBell";

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const getRoleBasedDashboard = () => {
    if (!user) return "/dashboard";
    switch (user.role) {
      case "admin":
        return "/admin";
      case "staff":
        return "/staff";
      default:
        return "/dashboard";
    }
  };

  const getRoleBadge = () => {
    if (!user) return null;
    const badges = {
      admin: { icon: Shield, color: "#ef4444", label: "Admin" },
      staff: { icon: Briefcase, color: "#3b82f6", label: "Staff" },
      resident: { icon: User, color: "#10b981", label: "Resident" },
    };
    const badge = badges[user.role];
    const Icon = badge.icon;
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.25rem",
          padding: "0.25rem 0.75rem",
          background: `${badge.color}20`,
          color: badge.color,
          borderRadius: "12px",
          fontSize: "0.75rem",
          fontWeight: "600",
        }}
      >
        <Icon size={14} />
        {badge.label}
      </span>
    );
  };

  return (
    <nav style={{ ...styles.nav, ...(scrolled ? styles.navScrolled : {}) }}>
      <div className="container" style={styles.container}>
        <Link to="/" style={styles.logo}>
          <BarangayLogo size={36} />
          <span style={styles.logoText}>iBarangay</span>
        </Link>

        {/* Desktop Menu */}
        <div style={styles.desktopMenu}>
          {isAuthenticated ? (
            <>
              <Link
                to="/"
                style={{
                  ...styles.navLink,
                  ...(isActive("/") ? styles.navLinkActive : {}),
                }}
              >
                Home
              </Link>
              <Link
                to={getRoleBasedDashboard()}
                style={{
                  ...styles.navLink,
                  ...(isActive(getRoleBasedDashboard())
                    ? styles.navLinkActive
                    : {}),
                }}
              >
                <BarChart3 size={18} style={{ marginRight: "0.25rem" }} />
                Dashboard
              </Link>
              {user?.role === "resident" && (
                <>
                  <Link
                    to="/services"
                    style={{
                      ...styles.navLink,
                      ...(isActive("/services") ? styles.navLinkActive : {}),
                    }}
                  >
                    Services
                  </Link>
                  <Link
                    to="/complaints"
                    style={{
                      ...styles.navLink,
                      ...(isActive("/complaints") ? styles.navLinkActive : {}),
                    }}
                  >
                    Complaints
                  </Link>
                  <Link
                    to="/events"
                    style={{
                      ...styles.navLink,
                      ...(isActive("/events") ? styles.navLinkActive : {}),
                    }}
                  >
                    Events
                  </Link>
                </>
              )}

              <NotificationBell />

              <div style={styles.userMenu}>
                <div style={styles.userAvatar}>
                  <User size={18} />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.125rem",
                  }}
                >
                  <span style={styles.userName}>{user?.firstName}</span>
                  {getRoleBadge()}
                </div>
                <button
                  onClick={handleLogout}
                  style={styles.logoutBtn}
                  title="Logout"
                >
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
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div style={styles.mobileMenu} className="slide-in-right">
          {isAuthenticated ? (
            <>
              <div
                style={{
                  padding: "0.75rem",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
                  {user?.firstName} {user?.lastName}
                </div>
                {getRoleBadge()}
              </div>
              <Link
                to="/"
                style={styles.mobileLink}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to={getRoleBasedDashboard()}
                style={styles.mobileLink}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              {user?.role === "resident" && (
                <>
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
                </>
              )}
              <Link
                to="/notifications"
                style={styles.mobileLink}
                onClick={() => setIsMenuOpen(false)}
              >
                Notifications
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
    transition: "all 0.3s ease",
  },
  navScrolled: {
    padding: "0.75rem 0",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    fontSize: "1.4rem",
    fontWeight: "bold",
    color: "white",
    transition: "transform 0.2s ease",
  },
  logoText: {
    display: "flex",
    alignItems: "center",
  },
  desktopMenu: {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
  },
  navLink: {
    color: "white",
    fontWeight: "500",
    transition: "all 0.2s",
    opacity: 0.85,
    position: "relative",
    padding: "0.5rem 0",
    display: "flex",
    alignItems: "center",
  },
  navLinkActive: {
    opacity: 1,
    fontWeight: "600",
  },
  userMenu: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.5rem 1rem",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    transition: "all 0.2s ease",
  },
  userAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  userName: {
    fontWeight: "600",
  },
  logoutBtn: {
    background: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
    padding: "0.25rem",
    display: "flex",
    alignItems: "center",
    transition: "transform 0.2s ease",
  },
  signupBtn: {
    background: "white",
    color: "var(--primary)",
    padding: "0.6rem 1.5rem",
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
    padding: "1.5rem",
    background: "rgba(30, 58, 138, 0.98)",
    backdropFilter: "blur(10px)",
  },
  mobileLink: {
    color: "white",
    padding: "0.75rem",
    fontWeight: "500",
    borderRadius: "8px",
    transition: "background 0.2s ease",
  },
  mobileLogout: {
    background: "var(--error)",
    color: "white",
    border: "none",
    padding: "0.75rem",
    borderRadius: "8px",
    fontWeight: "500",
    cursor: "pointer",
    marginTop: "0.5rem",
    transition: "all 0.2s ease",
  },
};

// Add enhanced animations and hover effects
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  nav a[style*="navLink"]:hover {
    opacity: 1 !important;
  }
  
  nav a[style*="navLink"]::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: white;
    transition: width 0.3s ease;
  }
  
  nav a[style*="navLink"]:hover::after,
  nav a[style*="navLinkActive"]::after {
    width: 100%;
  }
  
  nav a[style*="logo"]:hover {
    transform: scale(1.05);
  }
  
  nav div[style*="userMenu"]:hover {
    background: rgba(255,255,255,0.25);
  }
  
  nav button[style*="logoutBtn"]:hover {
    transform: scale(1.2);
  }
  
  nav a[style*="mobileLink"]:hover {
    background: rgba(255,255,255,0.1);
  }
  
  nav button[style*="mobileLogout"]:hover {
    background: #DC2626;
    transform: translateY(-2px);
  }
  
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
