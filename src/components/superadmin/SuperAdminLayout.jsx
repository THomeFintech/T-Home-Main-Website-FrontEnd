import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { Bell, Search, ShieldCheck, Menu, X, LogOut, ExternalLink } from "lucide-react";
import SuperAdminSidebar from "./SuperAdminSidebar";
import { useState, useMemo } from "react";

export default function SuperAdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Read stored admin profile
  const adminProfile = useMemo(() => {
    try {
      const stored = localStorage.getItem("superadmin_admin");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
    return { name: "Super Admin", email: "admin@thomefintech.com" };
  }, []);

  // Compute initials
  const initials = useMemo(() => {
    const parts = (adminProfile.name || "Super Admin").trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return (adminProfile.name || "SA").slice(0, 2).toUpperCase();
  }, [adminProfile]);

  // Compute title from route
  const currentTitle = useMemo(() => {
    const path = location.pathname;
    if (path.includes("/leads")) return "Leads Inbox";
    if (path.includes("/bt-lps")) return "Balance Transfer & LPS";
    if (path.includes("/documents")) return "Documents Review";
    if (path.includes("/applications/")) return "Application Review";
    if (path.includes("/bank-forwarding")) return "Bank Forwarding Tracker";
    if (path.includes("/users")) return "Customer Directory";
    if (path.includes("/reports")) return "Reports & Analytics";
    if (path.includes("/settings")) return "Platform Settings";
    return "Operations Dashboard";
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("superadmin_token");
    localStorage.removeItem("superadmin_admin");
    localStorage.removeItem("superadmin_authenticated");
    navigate("/super-admin");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex">
        <SuperAdminSidebar />
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-[260px] bg-white h-full shadow-xl flex flex-col">
            <div className="p-4 flex items-center justify-between border-b border-slate-200">
              <span className="font-bold text-slate-800 text-sm">
                T-Home Admin
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SuperAdminSidebar />
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* TOP HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 lg:px-6 sticky top-0 z-30 justify-between gap-4">
          {/* LEFT: HAMBURGER & BREADCRUMB */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-medium text-slate-400 hidden sm:inline">
                T-Home Fintech
              </span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <h1 className="text-sm font-semibold text-slate-800 truncate">
                {currentTitle}
              </h1>
            </div>
          </div>

          {/* RIGHT CONTROLS */}
          <div className="flex items-center gap-3">
            {/* SUPER ADMIN BADGE */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Super Admin</span>
            </div>

            {/* NOTIFICATIONS POPOVER */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                    <p className="text-xs font-semibold text-slate-700">Notifications</p>
                    <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Live</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded bg-slate-50 text-slate-600">
                      <p className="font-medium text-slate-800">System Ready</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Live database synchronization active.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ADMIN PROFILE AVATAR */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm shadow-blue-500/20">
                {initials}
              </div>

              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-tight">
                  {adminProfile.name || "Super Admin"}
                </p>
                <p className="text-[10px] text-slate-400 leading-tight">
                  {adminProfile.email || "admin@thome.co.in"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}