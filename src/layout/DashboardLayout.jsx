import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showBurger, setShowBurger] = useState(true);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY <= 10) {
        setShowBurger(true);
      } else {
        setShowBurger(false);
      }
    };

    const handleMouseMove = (event) => {
      if (event.clientY <= 80) {
        setShowBurger(true);
      } else if (window.scrollY > 10) {
        setShowBurger(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const pageMap = {
    "/dashboard": "dashboard",
    "/applications": "applications",
    "/documents": "documents",
    "/profile": "profile",
    "/support": "support",
  };

  const activePage = pageMap[location.pathname] ?? "dashboard";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    window.dispatchEvent(new Event("authChange"));

    navigate("/get-started");
  };

  const handleNavigate = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[radial-gradient(1200px_680px_at_20%_-10%,rgba(90,140,255,0.18),transparent_62%),radial-gradient(980px_580px_at_100%_0%,rgba(36,107,198,0.14),transparent_60%),linear-gradient(180deg,#071327_0%,#08162b_100%)] text-slate-100">

      {/* =========================
          MOBILE HAMBURGER
      ========================== */}
      <button
        type="button"
        className="
          fixed top-4 left-4 z-40
          flex h-10 w-10
          items-center justify-center
          rounded-lg
          bg-[#1e2447]
          text-white
          shadow-lg
          sm:hidden
        "
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <span className="text-xl leading-none">☰</span>
      </button>

      {/* =========================
          DESKTOP SIDEBAR
      ========================== */}
      <div className="hidden sm:block">
        <Sidebar
          activePage={activePage}
          onNavigate={() => {}}
          onLogout={handleLogout}
        />
      </div>

      {/* =========================
          MOBILE SIDEBAR DRAWER
      ========================== */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Drawer */}
          <div
            className="
              absolute
              left-0
              top-0
              h-full
              w-64
              max-w-[85vw]
              overflow-hidden
              bg-[#0d1b32]
              shadow-2xl
              animate-slideInLeft
            "
          >

            {/* Close button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="
                absolute
                top-4
                right-4
                z-50
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                text-white
                text-2xl
                leading-none
                hover:bg-white/10
                transition
              "
              aria-label="Close menu"
            >
              ×
            </button>

            {/* Sidebar */}
            <Sidebar
              activePage={activePage}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
            />
          </div>
        </div>
      )}

      {/* =========================
          MAIN CONTENT
      ========================== */}
      <main
        className="
          flex-1
          min-w-0
          overflow-y-auto
          px-4
          pt-20
          sm:px-6
          sm:pt-0
          backdrop-blur-[2px]
        "
      >
        <Outlet />
      </main>

    </div>
  );
}

export default DashboardLayout;