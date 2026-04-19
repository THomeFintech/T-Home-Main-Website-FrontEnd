import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageMap = {
    "/dashboard":     "dashboard",
    "/applications":  "applications",
    "/documents":     "documents",
    "/profile":       "profile",
    "/support":       "support",
  };
  const activePage = pageMap[location.pathname] ?? "dashboard";

  // ✅ FIXED: was using sessionStorage — Navbar reads localStorage, so logout wasn't working
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChange")); // tells Navbar to switch back to Login + Get Started
    navigate("/get-started");
  };

  return (
    <div className="flex min-h-screen bg-[radial-gradient(1200px_680px_at_20%_-10%,rgba(90,140,255,0.18),transparent_62%),radial-gradient(980px_580px_at_100%_0%,rgba(36,107,198,0.14),transparent_60%),linear-gradient(180deg,#071327_0%,#08162b_100%)] text-slate-100">

      {/* Burger for mobile */}
      <button
        className="fixed top-4 left-4 z-40 flex items-center justify-center w-10 h-10 rounded-lg bg-[#1e2447] text-white shadow-lg sm:hidden"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <span className="text-2xl">☰</span>
      </button>

      {/* Sidebar */}
      <div>
        <div className="hidden sm:block">
          <Sidebar activePage={activePage} onNavigate={() => {}} onLogout={handleLogout} />
        </div>

        {/* Mobile Drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <div className="relative w-64 max-w-[80vw] h-full bg-[#101a2b] shadow-2xl animate-slideInLeft">
              <Sidebar
                activePage={activePage}
                onNavigate={() => setSidebarOpen(false)}
                onLogout={handleLogout}
              />
              <button
                className="absolute top-3 right-3 text-white text-2xl"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      <main className="flex-1 overflow-y-auto backdrop-blur-[2px]">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;