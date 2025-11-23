import { Link, useLocation } from "react-router-dom";
import { Home, FileText, Calendar, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export const MobileNav = () => {
  const location = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  const navItems = [
    {
      path:
        user.role === "admin"
          ? "/admin"
          : user.role === "staff"
          ? "/staff"
          : "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/services",
      label: "Services",
      icon: FileText,
    },
    {
      path: "/events",
      label: "Events",
      icon: Calendar,
    },
    {
      path: "/",
      label: "Home",
      icon: Home,
    },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t-2 border-white/20 shadow-2xl">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-300",
                active
                  ? "text-purple-400 scale-110"
                  : "text-white/60 hover:text-white/90"
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-xl transition-all duration-300",
                  active && "bg-purple-500/20"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium">{item.label}</span>
              {active && (
                <div className="absolute bottom-0 w-12 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
