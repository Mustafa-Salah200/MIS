import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { cn } from "@/lib/utils";

export default function MainLayout() {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // desktop collapse
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile drawer

  const handleSidebarToggle = () => {
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
    if (isDesktop) {
      setSidebarCollapsed((prev) => !prev);
    } else {
      setSidebarOpen((prev) => !prev);
    }
  };

  // Keep sidebar state in sync when resizing between mobile and desktop
  useEffect(() => {
    const syncSidebarState = () => {
      if (typeof window === "undefined") return;
      const isDesktop = window.innerWidth >= 1024;
      if (isDesktop) {
        setSidebarOpen(false); // ensure drawer closed on desktop
      }
    };

    syncSidebarState();
    window.addEventListener("resize", syncSidebarState);
    return () => window.removeEventListener("resize", syncSidebarState);
  }, []);

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        isMobileOpen={sidebarOpen}
        onToggle={handleSidebarToggle}
      />

      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={() => setSidebarOpen(false)}
      />
      
      <div
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        )}
      >
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
