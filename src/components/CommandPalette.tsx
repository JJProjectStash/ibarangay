import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Home,
  FileText,
  Calendar,
  AlertTriangle,
  Bell,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface CommandItemType {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string[];
}

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const commands: CommandItemType[] = [
    {
      id: "home",
      label: "Go to Home",
      icon: <Home className="mr-2 h-4 w-4" />,
      action: () => navigate("/"),
      keywords: ["home", "main", "landing"],
    },
    {
      id: "dashboard",
      label: "Go to Dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      action: () =>
        navigate(
          user?.role === "admin"
            ? "/admin"
            : user?.role === "staff"
            ? "/staff"
            : "/dashboard"
        ),
      keywords: ["dashboard", "overview"],
    },
    {
      id: "services",
      label: "View Services",
      icon: <FileText className="mr-2 h-4 w-4" />,
      action: () => navigate("/services"),
      keywords: ["services", "borrow", "return", "request"],
    },
    {
      id: "events",
      label: "View Events",
      icon: <Calendar className="mr-2 h-4 w-4" />,
      action: () => navigate("/events"),
      keywords: ["events", "calendar", "activities"],
    },
    {
      id: "complaints",
      label: "View Complaints",
      icon: <AlertTriangle className="mr-2 h-4 w-4" />,
      action: () => navigate("/complaints"),
      keywords: ["complaints", "issues", "reports"],
    },
    {
      id: "notifications",
      label: "View Notifications",
      icon: <Bell className="mr-2 h-4 w-4" />,
      action: () => navigate("/notifications"),
      keywords: ["notifications", "alerts", "updates"],
    },
    {
      id: "logout",
      label: "Log out",
      icon: <LogOut className="mr-2 h-4 w-4" />,
      action: () => {
        logout();
        navigate("/login");
      },
      keywords: ["logout", "signout", "exit"],
    },
  ];

  const handleSelect = useCallback((action: () => void) => {
    setOpen(false);
    action();
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <div className="bg-slate-900/95 backdrop-blur-xl border-2 border-white/20 shadow-2xl">
        <CommandInput
          placeholder="Type a command or search..."
          className="bg-transparent border-0 text-white placeholder:text-white/40 focus:ring-0"
        />
        <CommandList className="bg-transparent">
          <CommandEmpty className="text-white/70 py-6 text-center">
            No results found.
          </CommandEmpty>
          <CommandGroup heading="Navigation" className="text-white/70">
            {commands.map((command) => (
              <CommandItem
                key={command.id}
                onSelect={() => handleSelect(command.action)}
                className="text-white hover:bg-white/10 cursor-pointer transition-colors"
              >
                {command.icon}
                <span>{command.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </div>
    </CommandDialog>
  );
};
