import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);
  const isDashboard =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/staff");

  return (
    <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
      {!isAuthPage && !isDashboard && <Navbar />}

      <main
        className={cn(
          "flex-1 w-full",
          !isAuthPage && !isDashboard && "pt-16", // Offset for fixed navbar
          "animate-in fade-in duration-500"
        )}
      >
        {children || <Outlet />}
      </main>

      {!isAuthPage && !isDashboard && (
        <footer className="border-t bg-muted/30 backdrop-blur-sm py-8 mt-auto">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} iBarangay. All rights reserved.
            </p>
            <div className="mt-2 flex justify-center gap-4">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
