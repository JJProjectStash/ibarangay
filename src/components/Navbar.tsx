import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Bell, LogOut, Settings, ChevronDown } from "lucide-react";
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

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/services", label: "Services" },
    { path: "/events", label: "Events" },
    { path: "/announcements", label: "Announcements" },
    { path: "/complaints", label: "Complaints" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
        isScrolled
          ? "glass-nav shadow-lg border-b border-border/30 py-3"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary via-primary to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-primary/40 transition-all duration-300 group-hover:scale-105 hover-lift">
                iB
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-blue-600/20 blur-md group-hover:blur-lg transition-all duration-300" />
            </div>
            <span
              className={cn(
                "text-xl font-bold tracking-tight transition-all duration-300",
                isScrolled ? "text-foreground" : "text-foreground",
                "group-hover:text-primary"
              )}
            >
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
                  "relative px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover-lift",
                  isActive(link.path)
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                )}
              >
                {link.label}
                {isActive(link.path) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
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
                      className="flex items-center space-x-3 rounded-full pl-2 pr-4 hover:bg-accent/60 border border-transparent hover:border-border/50 transition-all duration-300 hover-lift"
                    >
                      <div className="relative">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-white font-medium text-sm shadow-md">
                          {user.firstName?.[0] || "U"}
                        </div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/30 to-blue-500/30 blur-sm" />
                      </div>
                      <div className="flex flex-col items-start text-xs">
                        <span className="font-semibold text-foreground">
                          {user.firstName}
                        </span>
                        <span className="text-muted-foreground capitalize">
                          {user.role}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 p-2 glass-card animate-in slide-in-from-top-4"
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold leading-none">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        navigate(
                          user.role === "admin"
                            ? "/admin"
                            : user.role === "staff"
                            ? "/staff"
                            : "/dashboard"
                        )
                      }
                      className="cursor-pointer hover:bg-accent/60 transition-colors"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer text-destructive focus:text-destructive hover:bg-destructive/10 transition-colors"
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
                    className="rounded-full hover-lift font-medium"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="rounded-full btn-glow hover-lift font-medium shadow-lg shadow-primary/20">
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
              className="rounded-full hover-scale"
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
        <div className="md:hidden absolute top-full left-0 right-0 glass-nav border-b border-border/30 shadow-lg animate-in slide-in-from-top-4">
          <div className="container mx-auto px-4 py-6 flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                  isActive(link.path)
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-foreground hover:bg-accent/60"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-border/50 my-3" />
            {user ? (
              <>
                <Button
                  variant="ghost"
                  className="justify-start w-full rounded-xl"
                  onClick={() => {
                    navigate("/notifications");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start w-full rounded-xl"
                  onClick={() => {
                    navigate(
                      user.role === "admin"
                        ? "/admin"
                        : user.role === "staff"
                        ? "/staff"
                        : "/dashboard"
                    );
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start w-full text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
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
                    className="w-full justify-center rounded-xl"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full justify-center rounded-xl">
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
