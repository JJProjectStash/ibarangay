import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Define navigation links based on user role
  const getNavLinks = () => {
    // Public links for non-authenticated users
    if (!user) {
      return [
        { path: "/", label: "Home" },
        { path: "/services", label: "Services" },
        { path: "/events", label: "Events" },
        { path: "/announcements", label: "Announcements" },
      ];
    }

    // Role-based navigation - Home removed for authenticated users
    switch (user.role) {
      case "admin":
        return [
          { path: "/admin", label: "Dashboard" },
          { path: "/admin/complaints", label: "Complaints" },
          { path: "/announcements", label: "Announcements" },
        ];

      case "staff":
        return [
          { path: "/staff", label: "Dashboard" },
          { path: "/staff/complaints", label: "Complaints" },
          { path: "/announcements", label: "Announcements" },
        ];

      case "resident":
      default:
        return [
          { path: "/dashboard", label: "Dashboard" },
          { path: "/services", label: "Services" },
          { path: "/events", label: "Events" },
          { path: "/complaints", label: "Complaints" },
          { path: "/announcements", label: "Announcements" },
        ];
    }
  };

  const navLinks = getNavLinks();

  // Enhanced active check to handle nested routes
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Get role-specific paths
  const getDashboardPath = () => {
    if (!user) return "/";
    return user.role === "admin"
      ? "/admin"
      : user.role === "staff"
      ? "/staff"
      : "/dashboard";
  };

  const getComplaintsPath = () => {
    if (!user) return "/login";
    return user.role === "admin"
      ? "/admin/complaints"
      : user.role === "staff"
      ? "/staff/complaints"
      : "/complaints";
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-[#1e1b4b]/80 backdrop-blur-xl border-b border-white/10 shadow-lg py-3"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105"
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg transition-all duration-300 group-hover:shadow-purple-500/50">
                iB
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white transition-all duration-300 group-hover:text-purple-300">
              iBarangay
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                  isActive(link.path)
                    ? "bg-white/20 text-white shadow-lg backdrop-blur-xl border border-white/30"
                    : "text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                {/* Notification Bell */}
                <div className="flex items-center">
                  <NotificationBell />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-3 rounded-full pl-2 pr-4 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-xl transition-all duration-300 hover:scale-105"
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm shadow-md">
                        {user.firstName?.[0] || "U"}
                      </div>
                      <div className="flex flex-col items-start text-xs">
                        <span className="font-semibold text-white">
                          {user.firstName}
                        </span>
                        <span className="text-white/70 capitalize">
                          {user.role}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-white/70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 p-2 bg-[#1e1b4b]/95 backdrop-blur-xl border-2 border-white/20 shadow-2xl"
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold leading-none text-white">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs leading-none text-white/60">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/20" />
                    <DropdownMenuItem
                      onClick={() => navigate(getDashboardPath())}
                      className="cursor-pointer text-white hover:bg-white/10 transition-colors"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate(getComplaintsPath())}
                      className="cursor-pointer text-white hover:bg-white/10 transition-colors"
                    >
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      <span>Complaints</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer text-red-300 hover:text-red-200 hover:bg-red-500/20 transition-colors"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="rounded-full font-medium text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="rounded-full font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-500/50 transition-all duration-300 hover:shadow-xl hover:scale-105">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-full text-white hover:bg-white/10 transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#1e1b4b]/95 backdrop-blur-xl border-b border-white/10 shadow-lg animate-in slide-in-from-top-4 duration-300">
          <div className="container mx-auto px-4 py-6 flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                  isActive(link.path)
                    ? "bg-white/20 text-white shadow-sm backdrop-blur-xl border border-white/30"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-white/20 my-3" />
            {user ? (
              <>
                <Button
                  variant="ghost"
                  className="justify-start w-full rounded-xl text-white hover:bg-white/10"
                  onClick={() => {
                    navigate(getDashboardPath());
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start w-full rounded-xl text-white hover:bg-white/10"
                  onClick={() => {
                    navigate(getComplaintsPath());
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Complaints
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start w-full text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded-xl"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </>
            ) : (
              <div className="flex flex-col space-y-3 pt-2">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full justify-center rounded-xl bg-white/10 border-2 border-white/20 text-white hover:bg-white/20 backdrop-blur-xl"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full justify-center rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white border-0 shadow-lg">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
