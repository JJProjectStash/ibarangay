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
  Bell,
  Megaphone,
  MessageSquare,
  Calendar,
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
    if (!badge) return null;
    const Icon = badge.icon;
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.375rem",
          padding: "0.25rem 0.625rem",
          background: `${badge.color}15`,
          color: badge.color,
          borderRadius: "6px",
          fontSize: "0.6875rem",
          fontWeight: "600",
          letterSpacing: "0.025em",
          border: `1px solid ${badge.color}30`,
        }}
      >
        {Icon && <Icon size={11} strokeWidth={2.5} />}
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
          icon: Megaphone,
        },
        { to: "/admin/audit-logs", label: "Audit Logs", icon: Shield },
        { to: "/admin/config", label: "System Config", icon: Settings },
      ];
    } else if (user?.role === "staff") {
      return [
        {
          to: "/admin/announcements",
          label: "Manage Announcements",
          icon: Megaphone,
        },
      ];
    }
    return [];
  };

  const navigationItems = [
    { to: getRoleBasedDashboard(), label: "Dashboard", icon: BarChart3 },
    { to: "/announcements", label: "Announcements", icon: Megaphone },
    { to: "/services", label: "Services", icon: User },
    { to: "/complaints", label: "Complaints", icon: MessageSquare },
    { to: "/events", label: "Events", icon: Calendar },
  ];

  return (
    <nav style={{ ...styles.nav, ...(scrolled ? styles.navScrolled : {}) }}>
      <div className="container" style={styles.container}>
        {/* Logo Section */}
        <Link to="/" style={styles.logo} aria-label="iBarangay Home">
          <div style={styles.logoIconWrapper}>
            <BarangayLogo size={32} />
          </div>
          <div style={styles.logoTextWrapper}>
            <span style={styles.logoText}>iBarangay</span>
            <span style={styles.logoSubtext}>Community Portal</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div style={styles.desktopMenu}>
          {isAuthenticated ? (
            <>
              {/* Navigation Links */}
              <div style={styles.navLinksContainer}>
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.to);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      style={{
                        ...styles.navLink,
                        ...(active ? styles.navLinkActive : {}),
                      }}
                      className="nav-link"
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon size={16} strokeWidth={2.2} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Admin/Staff Dropdown */}
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
                      onKeyDown={(e) => {
                        if (e.key === "Escape") setShowAdminDropdown(false);
                        if (e.key === "Enter" || e.key === " ")
                          setShowAdminDropdown((s) => !s);
                      }}
                      className="admin-dropdown-btn"
                      aria-expanded={showAdminDropdown}
                      aria-haspopup="true"
                      aria-controls="admin-dropdown"
                    >
                      <Shield size={16} strokeWidth={2.2} />
                      <span>Admin</span>
                      <ChevronDown
                        size={14}
                        style={{
                          transition:
                            "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                          transform: showAdminDropdown
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      />
                    </button>

                    {showAdminDropdown && (
                      <div
                        id="admin-dropdown"
                        style={styles.adminDropdown}
                        className="fade-in"
                        role="menu"
                        aria-label="Administration menu"
                      >
                        <div style={styles.dropdownHeader}>
                          <Shield size={14} style={{ opacity: 0.6 }} />
                          <span>Administration</span>
                        </div>
                        {getAdminLinks().map((link) => {
                          const Icon = link.icon;
                          return (
                            <Link
                              key={link.to}
                              to={link.to}
                              style={{
                                ...styles.dropdownLink,
                                ...(isActive(link.to)
                                  ? styles.dropdownLinkActive
                                  : {}),
                              }}
                              onClick={() => setShowAdminDropdown(false)}
                              className="dropdown-link"
                              role="menuitem"
                            >
                              {Icon && <Icon size={16} strokeWidth={2} />}
                              <span>{link.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

              {/* Right Section */}
              <div style={styles.rightSection}>
                <div style={styles.divider} />

                {/* Notification Bell */}
                <div style={styles.notificationWrapper}>
                  <NotificationBell />
                </div>

                {/* User Menu */}
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
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setShowUserDropdown(false);
                      if (e.key === "Enter" || e.key === " ")
                        setShowUserDropdown((s) => !s);
                    }}
                    className="user-menu-btn"
                    aria-expanded={showUserDropdown}
                    aria-haspopup="true"
                    aria-controls="user-dropdown"
                    aria-label="User menu"
                  >
                    <div style={styles.userAvatar}>
                      <User size={16} strokeWidth={2.5} />
                    </div>
                    <div style={styles.userInfo}>
                      <span style={styles.userName}>{user?.firstName}</span>
                      {getRoleBadge()}
                    </div>
                    <ChevronDown
                      size={16}
                      style={{
                        transition:
                          "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                        transform: showUserDropdown
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        opacity: 0.7,
                      }}
                    />
                  </button>

                  {showUserDropdown && (
                    <div
                      id="user-dropdown"
                      style={styles.userDropdown}
                      className="fade-in"
                      role="menu"
                      aria-label="User menu"
                    >
                      <div style={styles.userDropdownHeader}>
                        <div style={styles.userDropdownAvatar}>
                          <User size={20} strokeWidth={2} />
                        </div>
                        <div style={styles.userDropdownInfo}>
                          <div style={styles.dropdownUserName}>
                            {user?.firstName} {user?.lastName}
                          </div>
                          <div style={styles.dropdownUserEmail}>
                            {user?.email}
                          </div>
                          <div style={{ marginTop: "0.5rem" }}>
                            {getRoleBadge()}
                          </div>
                        </div>
                      </div>
                      <div style={styles.dropdownDivider} />
                      <button
                        onClick={handleLogout}
                        style={styles.logoutBtn}
                        className="logout-btn"
                        role="menuitem"
                      >
                        <LogOut size={18} strokeWidth={2} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.loginBtn} className="login-btn">
                Login
              </Link>
              <Link
                to="/signup"
                style={styles.signupBtn}
                className="signup-btn"
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
          aria-expanded={isMenuOpen}
          className="mobile-menu-btn"
        >
          {isMenuOpen ? (
            <X size={22} strokeWidth={2.5} />
          ) : (
            <Menu size={22} strokeWidth={2.5} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div style={styles.mobileMenu} className="slide-in-right">
          {isAuthenticated ? (
            <>
              <div style={styles.mobileUserHeader}>
                <div style={styles.mobileUserAvatar}>
                  <User size={24} strokeWidth={2} />
                </div>
                <div style={styles.mobileUserInfo}>
                  <div style={styles.mobileUserName}>
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div style={styles.mobileUserEmail}>{user?.email}</div>
                  <div style={{ marginTop: "0.625rem" }}>{getRoleBadge()}</div>
                </div>
              </div>

              <div style={styles.mobileDivider} />

              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    style={styles.mobileLink}
                    onClick={() => setIsMenuOpen(false)}
                    className="mobile-link"
                  >
                    <Icon size={18} strokeWidth={2} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {(user?.role === "staff" || user?.role === "admin") &&
                getAdminLinks().length > 0 && (
                  <>
                    <div style={styles.mobileDivider} />
                    <div style={styles.mobileSectionTitle}>
                      <Shield size={14} strokeWidth={2.5} />
                      <span>
                        {user.role === "admin" ? "Admin Tools" : "Staff Tools"}
                      </span>
                    </div>
                    {getAdminLinks().map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.to}
                          to={link.to}
                          style={styles.mobileLink}
                          onClick={() => setIsMenuOpen(false)}
                          className="mobile-link"
                        >
                          {Icon && <Icon size={18} strokeWidth={2} />}
                          <span>{link.label}</span>
                        </Link>
                      );
                    })}
                  </>
                )}

              <div style={styles.mobileDivider} />

              <Link
                to="/notifications"
                style={styles.mobileLink}
                onClick={() => setIsMenuOpen(false)}
                className="mobile-link"
              >
                <Bell size={18} strokeWidth={2} />
                <span>Notifications</span>
              </Link>
              <button
                onClick={handleLogout}
                style={styles.mobileLogout}
                className="mobile-logout"
              >
                <LogOut size={18} strokeWidth={2} />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={styles.mobileLink}
                onClick={() => setIsMenuOpen(false)}
                className="mobile-link"
              >
                Login
              </Link>
              <Link
                to="/signup"
                style={styles.mobileLink}
                onClick={() => setIsMenuOpen(false)}
                className="mobile-link"
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
    background:
      "linear-gradient(135deg, #1E3A8A 0%, #2563eb 50%, #1e40af 100%)",
    color: "white",
    padding: "0.75rem 0",
    boxShadow:
      "0 4px 24px rgba(30, 58, 138, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  },
  navScrolled: {
    padding: "0.625rem 0",
    boxShadow:
      "0 8px 32px rgba(30, 58, 138, 0.25), 0 4px 12px rgba(0, 0, 0, 0.15)",
    background:
      "linear-gradient(135deg, rgba(30, 58, 138, 0.98) 0%, rgba(37, 99, 235, 0.98) 50%, rgba(30, 64, 175, 0.98) 100%)",
    backdropFilter: "blur(20px) saturate(180%)",
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "0 2rem",
    gap: "2rem",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    textDecoration: "none",
    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
  },
  logoIconWrapper: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(10px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1.5px solid rgba(255, 255, 255, 0.25)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  logoTextWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "0.125rem",
  },
  logoText: {
    fontSize: "1.375rem",
    fontWeight: "700",
    color: "white",
    letterSpacing: "-0.025em",
    lineHeight: 1,
  },
  logoSubtext: {
    fontSize: "0.6875rem",
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.75)",
    letterSpacing: "0.025em",
    textTransform: "uppercase",
  },
  desktopMenu: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    flex: 1,
    justifyContent: "flex-end",
  },
  navLinksContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
  },
  navLink: {
    color: "white",
    fontWeight: "500",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    opacity: 0.85,
    position: "relative",
    padding: "0.5rem 0.75rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    borderRadius: "8px",
    fontSize: "0.875rem",
    textDecoration: "none",
    whiteSpace: "nowrap",
    border: "1px solid transparent",
  },
  navLinkActive: {
    opacity: 1,
    fontWeight: "600",
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    boxShadow:
      "0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  divider: {
    width: "1px",
    height: "28px",
    background: "rgba(255, 255, 255, 0.2)",
  },
  notificationWrapper: {
    display: "flex",
    alignItems: "center",
  },
  dropdownContainer: {
    position: "relative",
  },
  adminDropdownBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 0.875rem",
    background: "rgba(255, 255, 255, 0.12)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.25)",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    fontSize: "0.875rem",
    fontWeight: "500",
    whiteSpace: "nowrap",
  },
  adminDropdownBtnActive: {
    background: "rgba(255, 255, 255, 0.2)",
    borderColor: "rgba(255, 255, 255, 0.35)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  adminDropdown: {
    position: "absolute",
    top: "calc(100% + 0.125rem)",
    left: 0,
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2), 0 0 1px rgba(0, 0, 0, 0.1)",
    minWidth: "240px",
    overflow: "hidden",
    border: "1px solid rgba(0, 0, 0, 0.06)",
    zIndex: 1001,
    paddingTop: "0.125rem",
  },
  dropdownHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.875rem 1rem",
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
    fontSize: "0.75rem",
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  dropdownLink: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem 1rem",
    color: "#334155",
    textDecoration: "none",
    fontSize: "0.875rem",
    fontWeight: "500",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    borderLeft: "3px solid transparent",
  },
  dropdownLinkActive: {
    background:
      "linear-gradient(90deg, rgba(30, 58, 138, 0.08) 0%, transparent 100%)",
    color: "#1E3A8A",
    fontWeight: "600",
    borderLeft: "3px solid #1E3A8A",
  },
  userMenuContainer: {
    position: "relative",
  },
  userMenu: {
    display: "flex",
    alignItems: "center",
    gap: "0.625rem",
    padding: "0.375rem 0.875rem 0.375rem 0.5rem",
    background: "rgba(255, 255, 255, 0.12)",
    backdropFilter: "blur(10px)",
    borderRadius: "10px",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "1px solid rgba(255, 255, 255, 0.25)",
    cursor: "pointer",
    color: "white",
  },
  userMenuActive: {
    background: "rgba(255, 255, 255, 0.2)",
    borderColor: "rgba(255, 255, 255, 0.35)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  userAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background:
      "linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.2))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1.5px solid rgba(255, 255, 255, 0.35)",
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
    fontSize: "0.875rem",
    letterSpacing: "-0.01em",
    lineHeight: 1,
  },
  userDropdown: {
    position: "absolute",
    top: "calc(100% + 0.125rem)",
    right: 0,
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2), 0 0 1px rgba(0, 0, 0, 0.1)",
    minWidth: "280px",
    overflow: "hidden",
    border: "1px solid rgba(0, 0, 0, 0.06)",
    zIndex: 1001,
    paddingTop: "0.125rem",
  },
  userDropdownHeader: {
    display: "flex",
    gap: "0.875rem",
    padding: "1.25rem",
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
  },
  userDropdownAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #1E3A8A, #2563eb)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    flexShrink: 0,
    boxShadow: "0 4px 12px rgba(30, 58, 138, 0.2)",
  },
  userDropdownInfo: {
    flex: 1,
    minWidth: 0,
  },
  dropdownUserName: {
    fontWeight: "600",
    fontSize: "1rem",
    color: "#1F2937",
    marginBottom: "0.25rem",
    letterSpacing: "-0.01em",
  },
  dropdownUserEmail: {
    fontSize: "0.8125rem",
    color: "#6B7280",
    fontWeight: "500",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  dropdownDivider: {
    height: "1px",
    background: "rgba(0, 0, 0, 0.06)",
  },
  logoutBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.875rem 1.25rem",
    background: "transparent",
    border: "none",
    color: "#ef4444",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontSize: "0.875rem",
  },
  loginBtn: {
    color: "white",
    fontWeight: "500",
    padding: "0.5rem 1.25rem",
    borderRadius: "8px",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    textDecoration: "none",
    fontSize: "0.875rem",
    border: "1px solid rgba(255, 255, 255, 0.25)",
    background: "rgba(255, 255, 255, 0.1)",
  },
  signupBtn: {
    background: "white",
    color: "#1E3A8A",
    padding: "0.5rem 1.5rem",
    borderRadius: "8px",
    fontWeight: "600",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "0.875rem",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  mobileMenuBtn: {
    display: "none",
    background: "rgba(255, 255, 255, 0.15)",
    border: "1px solid rgba(255, 255, 255, 0.25)",
    color: "white",
    cursor: "pointer",
    padding: "0.625rem",
    minWidth: "44px",
    minHeight: "44px",
    borderRadius: "10px",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  mobileMenu: {
    display: "none",
    flexDirection: "column",
    gap: "0.375rem",
    padding: "1.25rem",
    background: "rgba(30, 58, 138, 0.98)",
    backdropFilter: "blur(20px)",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  },
  mobileUserHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.875rem",
    padding: "1rem",
    background: "rgba(255, 255, 255, 0.12)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    marginBottom: "0.625rem",
    border: "1px solid rgba(255, 255, 255, 0.15)",
  },
  mobileUserAvatar: {
    width: "52px",
    height: "52px",
    borderRadius: "10px",
    background: "rgba(255, 255, 255, 0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    flexShrink: 0,
  },
  mobileUserInfo: {
    flex: 1,
    minWidth: 0,
  },
  mobileUserName: {
    fontWeight: "600",
    fontSize: "1rem",
    marginBottom: "0.25rem",
    color: "white",
  },
  mobileUserEmail: {
    fontSize: "0.8125rem",
    color: "rgba(255, 255, 255, 0.8)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  mobileDivider: {
    height: "1px",
    background: "rgba(255, 255, 255, 0.15)",
    margin: "0.625rem 0",
  },
  mobileSectionTitle: {
    fontSize: "0.6875rem",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "rgba(255, 255, 255, 0.6)",
    padding: "0.625rem 0.75rem 0.375rem",
    marginTop: "0.375rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  mobileLink: {
    color: "white",
    padding: "0.75rem 0.875rem",
    fontWeight: "500",
    borderRadius: "8px",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    textDecoration: "none",
    fontSize: "0.875rem",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    border: "1px solid transparent",
  },
  mobileLogout: {
    background: "rgba(239, 68, 68, 0.15)",
    color: "#fca5a5",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    padding: "0.75rem 0.875rem",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "0.625rem",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.625rem",
    fontSize: "0.875rem",
  },
};

// Enhanced animations and hover effects
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(-10px);
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
    animation: fade-in 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .slide-in-right {
    animation: slide-in-right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Logo hover */
  nav a[style*="logo"]:hover {
    transform: scale(1.03);
  }
  
  nav a[style*="logo"]:hover > div[style*="logoIconWrapper"] {
    background: rgba(255, 255, 255, 0.25) !important;
    border-color: rgba(255, 255, 255, 0.4) !important;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15) !important;
  }

  /* Nav links hover */
  .nav-link:hover {
    opacity: 1 !important;
    background: rgba(255, 255, 255, 0.18) !important;
    transform: translateY(-1px);
    border-color: rgba(255, 255, 255, 0.2) !important;
  }
  
  /* Admin dropdown button hover */
  .admin-dropdown-btn:hover {
    background: rgba(255, 255, 255, 0.2) !important;
    border-color: rgba(255, 255, 255, 0.35) !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  }
  
  /* Dropdown link hover */
  .dropdown-link:hover {
    background: linear-gradient(90deg, rgba(30, 58, 138, 0.08) 0%, transparent 100%) !important;
    color: #1E3A8A !important;
    transform: translateX(4px);
  }
  
  /* User menu button hover */
  .user-menu-btn:hover {
    background: rgba(255, 255, 255, 0.2) !important;
    border-color: rgba(255, 255, 255, 0.35) !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  }
  
  /* Logout button hover */
  .logout-btn:hover {
    background: linear-gradient(90deg, rgba(239, 68, 68, 0.1) 0%, transparent 100%) !important;
    color: #dc2626 !important;
  }
  
  /* Login button hover */
  .login-btn:hover {
    background: rgba(255, 255, 255, 0.18) !important;
    border-color: rgba(255, 255, 255, 0.35) !important;
    transform: translateY(-1px);
  }
  
  /* Signup button hover */
  .signup-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2) !important;
    background: #f8fafc !important;
  }
  
  /* Mobile menu button hover */
  .mobile-menu-btn:hover {
    background: rgba(255, 255, 255, 0.25) !important;
    border-color: rgba(255, 255, 255, 0.35) !important;
    transform: scale(1.05);
  }
  
  /* Mobile link hover */
  .mobile-link:hover {
    background: rgba(255, 255, 255, 0.15) !important;
    transform: translateX(6px);
    border-color: rgba(255, 255, 255, 0.2) !important;
  }
  
  /* Mobile logout hover */
  .mobile-logout:hover {
    background: rgba(239, 68, 68, 0.25) !important;
    border-color: rgba(239, 68, 68, 0.5) !important;
    color: #fff !important;
    transform: translateY(-2px);
  }
  
  /* Responsive styles */
  @media (max-width: 1024px) {
    nav > div {
      padding: 0 1.5rem !important;
    }
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
