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
  ChevronDown,
  Settings,
} from "lucide-react";
import { BarangayLogo } from "./CustomIcons";
import NotificationBell from "./NotificationBell";

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setShowUserDropdown(false);
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
          gap: "0.375rem",
          padding: "0.375rem 0.75rem",
          background: `${badge.color}15`,
          color: badge.color,
          borderRadius: "16px",
          fontSize: "0.75rem",
          fontWeight: "600",
          letterSpacing: "0.025em",
          border: `1.5px solid ${badge.color}30`,
        }}
      >
        <Icon size={13} strokeWidth={2.5} />
        {badge.label}
      </span>
    );
  };

  const getAdminLinks = () => {
    if (user?.role === "admin") {
      return [
        { to: "/admin/users", label: "User Management", icon: User },
        {
          to: "/admin/announcements",
          label: "Manage Announcements",
          icon: null,
        },
        { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
        { to: "/admin/audit-logs", label: "Audit Logs", icon: null },
        { to: "/admin/config", label: "System Config", icon: Settings },
        { to: "/admin/automation", label: "Automation", icon: null },
      ];
    } else if (user?.role === "staff") {
      return [
        {
          to: "/admin/announcements",
          label: "Manage Announcements",
          icon: null,
        },
        { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      ];
    }
    return [];
  };

  return (
    <nav style={{ ...styles.nav, ...(scrolled ? styles.navScrolled : {}) }}>
      <div className="container" style={styles.container}>
        <Link to="/" style={styles.logo}>
          <BarangayLogo size={40} />
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
                <BarChart3 size={18} style={{ marginRight: "0.375rem" }} />
                Dashboard
              </Link>
              <Link
                to="/announcements"
                style={{
                  ...styles.navLink,
                  ...(isActive("/announcements") ? styles.navLinkActive : {}),
                }}
              >
                Announcements
              </Link>
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

              {/* Admin/Staff Dropdown Menu */}
              {(user?.role === "staff" || user?.role === "admin") &&
                getAdminLinks().length > 0 && (
                  <div
                    style={styles.dropdownContainer}
                    onMouseEnter={() => setShowAdminDropdown(true)}
                    onMouseLeave={() => setShowAdminDropdown(false)}
                  >
                    <button
                      style={{
                        ...styles.adminDropdownBtn,
                        ...(showAdminDropdown
                          ? styles.adminDropdownBtnActive
                          : {}),
                      }}
                      onClick={() => setShowAdminDropdown(!showAdminDropdown)}
                    >
                      <Shield size={18} />
                      <span>Admin</span>
                      <ChevronDown
                        size={16}
                        style={{
                          transition: "transform 0.2s ease",
                          transform: showAdminDropdown
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      />
                    </button>

                    {showAdminDropdown && (
                      <div style={styles.adminDropdown} className="fade-in">
                        {getAdminLinks().map((link, index) => (
                          <Link
                            key={link.to}
                            to={link.to}
                            style={{
                              ...styles.dropdownLink,
                              ...(isActive(link.to)
                                ? styles.dropdownLinkActive
                                : {}),
                              ...(index === getAdminLinks().length - 1
                                ? { borderBottom: "none" }
                                : {}),
                            }}
                            onClick={() => setShowAdminDropdown(false)}
                          >
                            {link.icon && (
                              <link.icon
                                size={16}
                                style={{ marginRight: "0.5rem" }}
                              />
                            )}
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              <div style={styles.divider} />

              <NotificationBell />

              {/* User Menu with Dropdown */}
              <div
                style={styles.userMenuContainer}
                onMouseEnter={() => setShowUserDropdown(true)}
                onMouseLeave={() => setShowUserDropdown(false)}
              >
                <button
                  style={{
                    ...styles.userMenu,
                    ...(showUserDropdown ? styles.userMenuActive : {}),
                  }}
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                  <div style={styles.userAvatar}>
                    <User size={18} />
                  </div>
                  <div style={styles.userInfo}>
                    <span style={styles.userName}>{user?.firstName}</span>
                    {getRoleBadge()}
                  </div>
                  <ChevronDown
                    size={18}
                    style={{
                      transition: "transform 0.2s ease",
                      transform: showUserDropdown
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      opacity: 0.8,
                    }}
                  />
                </button>

                {showUserDropdown && (
                  <div style={styles.userDropdown} className="fade-in">
                    <div style={styles.dropdownHeader}>
                      <div style={styles.dropdownUserName}>
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div style={styles.dropdownUserEmail}>{user?.email}</div>
                    </div>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
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
              <div style={styles.mobileUserHeader}>
                <div style={styles.mobileUserAvatar}>
                  <User size={24} />
                </div>
                <div style={styles.mobileUserInfo}>
                  <div style={styles.mobileUserName}>
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div style={styles.mobileUserEmail}>{user?.email}</div>
                  <div style={{ marginTop: "0.5rem" }}>{getRoleBadge()}</div>
                </div>
              </div>

              <div style={styles.mobileDivider} />

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
                <BarChart3 size={18} style={{ marginRight: "0.5rem" }} />
                Dashboard
              </Link>
              <Link
                to="/announcements"
                style={styles.mobileLink}
                onClick={() => setIsMenuOpen(false)}
              >
                Announcements
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

              {user?.role === "resident" && (
                <Link
                  to="/help"
                  style={styles.mobileLink}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Help
                </Link>
              )}

              {/* Admin/Staff Section in Mobile */}
              {(user?.role === "staff" || user?.role === "admin") &&
                getAdminLinks().length > 0 && (
                  <>
                    <div style={styles.mobileSectionTitle}>
                      <Shield size={14} style={{ marginRight: "0.375rem" }} />
                      {user.role === "admin" ? "Admin Tools" : "Staff Tools"}
                    </div>
                    {getAdminLinks().map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        style={styles.mobileLink}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.icon && (
                          <link.icon
                            size={16}
                            style={{ marginRight: "0.5rem" }}
                          />
                        )}
                        {link.label}
                      </Link>
                    ))}
                  </>
                )}

              <div style={styles.mobileDivider} />

              <Link
                to="/notifications"
                style={styles.mobileLink}
                onClick={() => setIsMenuOpen(false)}
              >
                Notifications
              </Link>
              <button onClick={handleLogout} style={styles.mobileLogout}>
                <LogOut size={18} />
                <span>Logout</span>
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
    background: "linear-gradient(135deg, #1E3A8A 0%, #1e40af 100%)",
    color: "white",
    padding: "1rem 0",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  navScrolled: {
    padding: "0.75rem 0",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
    background:
      "linear-gradient(135deg, rgba(30, 58, 138, 0.98) 0%, rgba(30, 64, 175, 0.98) 100%)",
    backdropFilter: "blur(16px)",
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1.5rem",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "0.875rem",
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "white",
    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    textDecoration: "none",
    letterSpacing: "-0.025em",
  },
  logoText: {
    display: "flex",
    alignItems: "center",
  },
  desktopMenu: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
  },
  navLink: {
    color: "white",
    fontWeight: "500",
    transition: "all 0.2s ease",
    opacity: 0.9,
    position: "relative",
    padding: "0.625rem 0.875rem",
    display: "flex",
    alignItems: "center",
    borderRadius: "10px",
    fontSize: "0.9rem",
    textDecoration: "none",
    whiteSpace: "nowrap",
  },
  navLinkActive: {
    opacity: 1,
    fontWeight: "600",
    background: "rgba(255, 255, 255, 0.18)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  divider: {
    width: "1px",
    height: "24px",
    background: "rgba(255, 255, 255, 0.25)",
    margin: "0 0.375rem",
  },
  dropdownContainer: {
    position: "relative",
  },
  adminDropdownBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.625rem 0.875rem",
    background: "rgba(255, 255, 255, 0.1)",
    border: "1.5px solid rgba(255, 255, 255, 0.2)",
    color: "white",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontSize: "0.9rem",
    fontWeight: "500",
    whiteSpace: "nowrap",
  },
  adminDropdownBtnActive: {
    background: "rgba(255, 255, 255, 0.18)",
    borderColor: "rgba(255, 255, 255, 0.35)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  adminDropdown: {
    position: "absolute",
    top: "calc(100% + 0.25rem)",
    left: 0,
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 16px 48px rgba(0, 0, 0, 0.18), 0 0 1px rgba(0, 0, 0, 0.12)",
    minWidth: "260px",
    overflow: "hidden",
    border: "1px solid rgba(0, 0, 0, 0.08)",
    zIndex: 1001,
  },
  dropdownLink: {
    display: "flex",
    alignItems: "center",
    padding: "0.875rem 1.25rem",
    color: "#334155",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.15s ease",
    borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
    cursor: "pointer",
  },
  dropdownLinkActive: {
    background:
      "linear-gradient(90deg, rgba(30, 58, 138, 0.08) 0%, transparent 100%)",
    color: "#1E3A8A",
    fontWeight: "600",
    borderLeft: "3px solid #1E3A8A",
    paddingLeft: "1.125rem",
  },
  userMenuContainer: {
    position: "relative",
  },
  userMenu: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.5rem 1rem",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(12px)",
    borderRadius: "12px",
    transition: "all 0.2s ease",
    border: "1.5px solid rgba(255, 255, 255, 0.2)",
    cursor: "pointer",
    color: "white",
  },
  userMenuActive: {
    background: "rgba(255, 255, 255, 0.18)",
    borderColor: "rgba(255, 255, 255, 0.35)",
  },
  userAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.2))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid rgba(255, 255, 255, 0.35)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    alignItems: "flex-start",
  },
  userName: {
    fontWeight: "600",
    fontSize: "0.9375rem",
    letterSpacing: "-0.01em",
  },
  userDropdown: {
    position: "absolute",
    top: "calc(100% + 0.25rem)",
    right: 0,
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 16px 48px rgba(0, 0, 0, 0.18), 0 0 1px rgba(0, 0, 0, 0.12)",
    minWidth: "300px",
    overflow: "hidden",
    border: "1px solid rgba(0, 0, 0, 0.08)",
    zIndex: 1001,
  },
  dropdownHeader: {
    padding: "1.5rem 1.25rem",
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
  },
  dropdownUserName: {
    fontWeight: "600",
    fontSize: "1.0625rem",
    color: "#1F2937",
    marginBottom: "0.375rem",
    letterSpacing: "-0.01em",
  },
  dropdownUserEmail: {
    fontSize: "0.875rem",
    color: "#6B7280",
    fontWeight: "500",
  },
  logoutBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "1rem 1.25rem",
    background: "transparent",
    border: "none",
    color: "#ef4444",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontSize: "0.9375rem",
  },
  signupBtn: {
    background: "white",
    color: "#1E3A8A",
    padding: "0.625rem 1.75rem",
    borderRadius: "10px",
    fontWeight: "600",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    transition: "all 0.2s ease",
    textDecoration: "none",
    display: "inline-block",
  },
  mobileMenuBtn: {
    display: "none",
    background: "rgba(255, 255, 255, 0.15)",
    border: "1.5px solid rgba(255, 255, 255, 0.25)",
    color: "white",
    cursor: "pointer",
    padding: "0.625rem",
    borderRadius: "10px",
    transition: "all 0.2s ease",
  },
  mobileMenu: {
    display: "none",
    flexDirection: "column",
    gap: "0.5rem",
    padding: "1.5rem",
    background: "rgba(30, 58, 138, 0.98)",
    backdropFilter: "blur(16px)",
    borderTop: "1px solid rgba(255, 255, 255, 0.15)",
  },
  mobileUserHeader: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1rem",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    marginBottom: "0.5rem",
  },
  mobileUserAvatar: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2.5px solid rgba(255, 255, 255, 0.3)",
  },
  mobileUserInfo: {
    flex: 1,
  },
  mobileUserName: {
    fontWeight: "600",
    fontSize: "1rem",
    marginBottom: "0.25rem",
    color: "white",
  },
  mobileUserEmail: {
    fontSize: "0.875rem",
    opacity: 0.85,
    color: "rgba(255, 255, 255, 0.85)",
  },
  mobileDivider: {
    height: "1px",
    background: "rgba(255, 255, 255, 0.15)",
    margin: "0.75rem 0",
  },
  mobileSectionTitle: {
    fontSize: "0.75rem",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "rgba(255, 255, 255, 0.6)",
    padding: "0.75rem 0.875rem 0.375rem",
    marginTop: "0.5rem",
    display: "flex",
    alignItems: "center",
  },
  mobileLink: {
    color: "white",
    padding: "0.875rem 1rem",
    fontWeight: "500",
    borderRadius: "10px",
    transition: "all 0.2s ease",
    textDecoration: "none",
    fontSize: "0.9375rem",
    display: "flex",
    alignItems: "center",
  },
  mobileLogout: {
    background: "rgba(239, 68, 68, 0.15)",
    color: "#fca5a5",
    border: "1.5px solid rgba(239, 68, 68, 0.3)",
    padding: "0.875rem 1rem",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "0.75rem",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.625rem",
    fontSize: "0.9375rem",
  },
};

// Enhanced animations and hover effects
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slide-in-right {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .fade-in {
    animation: fade-in 0.2s ease;
  }

  .slide-in-right {
    animation: slide-in-right 0.3s ease;
  }

  nav a[style*="navLink"]:hover {
    opacity: 1 !important;
    background: rgba(255, 255, 255, 0.18) !important;
    transform: translateY(-1px);
  }
  
  nav a[style*="logo"]:hover {
    transform: scale(1.05);
    filter: brightness(1.1);
  }
  
  nav button[style*="adminDropdownBtn"]:hover {
    background: rgba(255, 255, 255, 0.18) !important;
    border-color: rgba(255, 255, 255, 0.35) !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  nav a[style*="dropdownLink"]:hover {
    background: linear-gradient(90deg, rgba(30, 58, 138, 0.06) 0%, transparent 100%) !important;
    padding-left: 1.5rem !important;
    color: #1E3A8A !important;
  }
  
  nav button[style*="userMenu"]:hover {
    background: rgba(255, 255, 255, 0.18) !important;
    border-color: rgba(255, 255, 255, 0.35) !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  nav button[style*="logoutBtn"]:hover {
    background: linear-gradient(90deg, rgba(239, 68, 68, 0.1) 0%, transparent 100%) !important;
    color: #dc2626 !important;
  }
  
  nav a[style*="signupBtn"]:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
    background: #f8fafc !important;
  }
  
  nav button[style*="mobileMenuBtn"]:hover {
    background: rgba(255, 255, 255, 0.25) !important;
    border-color: rgba(255, 255, 255, 0.35) !important;
    transform: scale(1.05);
  }
  
  nav a[style*="mobileLink"]:hover {
    background: rgba(255, 255, 255, 0.15) !important;
    transform: translateX(6px);
  }
  
  nav button[style*="mobileLogout"]:hover {
    background: rgba(239, 68, 68, 0.25) !important;
    border-color: rgba(239, 68, 68, 0.5) !important;
    color: #fff !important;
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    nav > div > div:nth-child(2) {
      display: none !important;
    }
    nav > div > button {
      display: block !important;
    }
    nav > div + div {
      display: flex !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Navbar;
