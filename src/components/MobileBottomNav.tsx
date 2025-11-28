import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, MessageSquare, Calendar, Bell, Grid } from "lucide-react";

const MobileBottomNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { to: "/services", label: "Services", icon: Grid },
    { to: "/complaints", label: "Complaints", icon: MessageSquare },
    { to: "/events", label: "Events", icon: Calendar },
    { to: "/notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`mobile-bottom-nav-link ${isActive ? "active" : ""}`}
            aria-current={isActive ? "page" : undefined}
            aria-label={item.label}
          >
            <Icon size={20} aria-hidden={true} focusable={false} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;
