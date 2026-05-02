import { useEffect, useState, useRef } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Landmark,
  Building2,
  Banknote,
  FileText,
  BadgePercent,
  Building,
  Link as LucideLink,
  Utensils,
  Briefcase,
  Repeat,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );

  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user") || "{}")
  );

  const serviceLinks = [
    { label: "Home Loan", to: "/home-loans", icon: Home },
    { label: "Company Registration", to: "/company-registration", icon: Building },
    { label: "Mortgage Loan", to: "/mortgage-loan", icon: Building2 },
    { label: "GST Registration", to: "/gst-registration", icon: Banknote },
    { label: "Loan Against Property", to: "/loan-against-property", icon: Landmark },
    { label: "UDYAM/MSME Registration", to: "/udyam-msme-registration", icon: BadgePercent },
    { label: "Personal Loan", to: "/personal-loans", icon: Briefcase },
    { label: "ITR Tax Filing", to: "/itr-filing", icon: FileText },
    { label: "Balance Transfer", to: "/coming-soon", icon: Repeat },
    { label: "Food License", to: "/food-license", icon: Utensils },
    { label: "PAN & Aadhaar Linking", to: "/pan-aadhaar-linking", icon: LucideLink },
  ];

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    setUser(JSON.parse(localStorage.getItem("user") || "{}"));
  }, [location.pathname]);

  useEffect(() => {
    const onAuthChange = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
      setUser(JSON.parse(localStorage.getItem("user") || "{}"));
    };

    window.addEventListener("authChange", onAuthChange);
    window.addEventListener("storage", onAuthChange);

    return () => {
      window.removeEventListener("authChange", onAuthChange);
      window.removeEventListener("storage", onAuthChange);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setShowNavbar(window.scrollY <= 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setServicesOpen(false);
      }
    }

    if (servicesOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [servicesOpen]);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setUser({});
    setServicesOpen(false);
    setMobileServicesOpen(false);
    setMenuOpen(false);

    window.dispatchEvent(new Event("authChange"));
    navigate("/get-started");
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-[#4f72e0] font-semibold"
      : "text-white/80 hover:text-[#4f72e0] transition";

  const handleNavLink = () => {
    setMenuOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleServicesMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setServicesOpen(true);
  };

  const handleServicesMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setServicesOpen(false);
    }, 100);
  };

  const AuthButtons = () =>
    isLoggedIn ? (
      <>
        <button
          onClick={() => navigate("/notifications")}
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
          title="Notifications"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border border-[#0a1628] bg-[#4f72e0]" />
        </button>

        <Link
          to="/dashboard"
          className="h-9 w-9 overflow-hidden rounded-full border-2 border-[#4f72e0]/70 transition hover:border-[#4f72e0]"
          title="Profile"
        >
          <img
            src={user?.avatar || "/default-avatar.png"}
            alt={user?.name || "Account"}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.name || "U"
              )}&background=4f72e0&color=fff`;
            }}
          />
        </Link>
      </>
    ) : (
      <>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="flex h-9 min-w-[96px] items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 text-sm text-white/90 transition hover:bg-white/20 hover:text-white lg:text-base"
          title="Login"
        >
          Login
        </button>

        <button
          type="button"
          onClick={() => navigate("/get-started")}
          className="flex h-9 min-w-[122px] items-center justify-center rounded-full bg-[linear-gradient(120deg,rgba(91,165,255,0.9)_0%,rgba(55,124,236,0.9)_100%)] px-4 text-sm text-white shadow-[0_8px_26px_rgba(77,163,255,0.35)] transition hover:brightness-110 lg:px-6 lg:text-base"
          title="Get Started"
        >
          Get Started
        </button>
      </>
    );

  return (
    <div
      className={`fixed left-0 right-0 top-0 z-[9999] flex w-full justify-center px-3 pt-3 transition-all duration-300 sm:px-0 sm:pt-5 ${
        showNavbar
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-full opacity-0"
      }`}
    >
      <div className="w-full max-w-[95%] sm:max-w-[92%]">
<nav
          className="
            rounded-2xl border border-[#d8ecff]/44
            bg-[linear-gradient(120deg,rgba(20,35,75,0.85)_0%,rgba(12,22,55,0.92)_42%,rgba(8,16,40,0.95)_100%)]
            px-4 py-[11px]
            shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_0_0_1px_rgba(80,120,200,0.25),0_16px_40px_rgba(5,16,46,0.45)]
            backdrop-blur-[16px]
            sm:rounded-full sm:px-6 sm:bg-[linear-gradient(120deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.08)_42%,rgba(255,255,255,0.04)_100%)] sm:shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] lg:px-8
          "
        >
          <div className="flex items-center justify-between">
            <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
              <img
                src="/home/logo.png"
                alt="T-HOME Logo"
                className="h-9 w-9 flex-shrink-0 sm:h-10 sm:w-10"
              />
              <h1 className="truncate text-lg font-semibold text-white sm:text-xl lg:text-2xl">
                T-HOME
              </h1>
            </Link>

            <div className="hidden items-center gap-6 lg:flex xl:gap-8">
              <NavLink to="/" end className={navLinkClass} onClick={handleNavLink}>
                Home
              </NavLink>

              <div
                className="relative"
                ref={dropdownRef}
                onMouseEnter={handleServicesMouseEnter}
                onMouseLeave={handleServicesMouseLeave}
              >
                <div className="flex items-center gap-1">
                  <NavLink
                    to="/services"
                    className={navLinkClass}
                    onClick={handleNavLink}
                  >
                    Services
                  </NavLink>

                  <button
                    type="button"
                    className="cursor-default p-1 text-[10px] text-white/60 transition hover:text-[#4f72e0]"
                    aria-expanded={servicesOpen}
                    tabIndex={-1}
                  >
                    {servicesOpen ? "▲" : "▼"}
                  </button>
                </div>

                {servicesOpen && (
                  <div className="absolute left-1/2 top-full z-50 mt-2 grid w-[640px] -translate-x-1/2 grid-cols-2 gap-x-5 gap-y-2 rounded-xl border border-white/20 bg-white/70 p-4 backdrop-blur-xl shadow-[0_12px_30px_rgba(4,12,38,0.18)]">
                    {serviceLinks.map((item) => {
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setServicesOpen(false)}
                          className="flex min-w-[200px] items-center gap-3 rounded-md px-2 py-1 text-[14px] font-medium text-[#1a2b44] transition hover:bg-white/40 hover:text-[#2563eb]"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/60 shadow-sm">
                            <Icon className="h-5 w-5 text-[#294a6d]" />
                          </span>
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              <NavLink to="/tools" className={navLinkClass} onClick={handleNavLink}>
                Financial Tools
              </NavLink>
              <NavLink to="/about" className={navLinkClass} onClick={handleNavLink}>
                About
              </NavLink>
              <NavLink to="/career" className={navLinkClass} onClick={handleNavLink}>
                Career
              </NavLink>
              <NavLink
                to="/collaborate"
                className={navLinkClass}
                onClick={handleNavLink}
              >
                Collaborate
              </NavLink>
              <NavLink to="/contact" className={navLinkClass} onClick={handleNavLink}>
                Contact
              </NavLink>
            </div>

            <div className="hidden items-center gap-3 md:flex lg:gap-4">
              <AuthButtons />
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:bg-white/10 md:hidden"
            >
              <span className="text-2xl leading-none">{menuOpen ? "✕" : "☰"}</span>
            </button>
          </div>

          <div className="mt-4 hidden flex-wrap items-center justify-between gap-y-3 border-t border-white/10 pt-4 md:flex lg:hidden">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <NavLink to="/" end className={navLinkClass} onClick={handleNavLink}>
                Home
              </NavLink>

              <div className="relative flex items-center gap-1">
                <NavLink
                  to="/services"
                  className={navLinkClass}
                  onClick={() => setServicesOpen((p) => !p)}
                >
                  Services
                </NavLink>
                <button
                  type="button"
                  onClick={() => setServicesOpen((p) => !p)}
                  className="text-[10px] text-white/60"
                >
                  {servicesOpen ? "▲" : "▼"}
                </button>

                {servicesOpen && (
                  <div className="absolute left-0 top-full z-50 mt-3 w-[280px] rounded-xl border border-[#d8ecff]/30 bg-[#12224d]/95 p-3 shadow-[0_16px_40px_rgba(4,12,38,0.48)] backdrop-blur-xl">
                    <div className="flex flex-col gap-1 text-left">
                      {serviceLinks.map((item) => (
                        <Link
                          key={`tablet-${item.to}`}
                          to={item.to}
                          onClick={() => setServicesOpen(false)}
                          className="rounded-md px-3 py-2 text-sm text-white/85 transition hover:bg-[#213a7a]/55 hover:text-[#4f72e0]"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <NavLink to="/tools" className={navLinkClass} onClick={handleNavLink}>
                Financial Tools
              </NavLink>
              <NavLink to="/about" className={navLinkClass} onClick={handleNavLink}>
                About
              </NavLink>
              <NavLink to="/career" className={navLinkClass} onClick={handleNavLink}>
                Career
              </NavLink>
              <NavLink
                to="/collaborate"
                className={navLinkClass}
                onClick={handleNavLink}
              >
                Collaborate
              </NavLink>
              <NavLink to="/contact" className={navLinkClass} onClick={handleNavLink}>
                Contact
              </NavLink>
            </div>

            <div className="flex items-center gap-3">
              <AuthButtons />
            </div>
          </div>

          {menuOpen && (
            <div className="mt-4 space-y-4 border-t border-white/10 pt-4 text-left md:hidden">
              <div className="flex flex-col gap-3">
                <NavLink
                  to="/"
                  end
                  className={navLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </NavLink>

                <div>
                  <div className="flex items-center justify-between">
                    <NavLink
                      to="/services"
                      className={navLinkClass}
                      onClick={() => setMenuOpen(false)}
                    >
                      Services
                    </NavLink>
                    <button
                      type="button"
                      onClick={() => setMobileServicesOpen((p) => !p)}
                      className="p-2 text-white/60"
                    >
                      {mobileServicesOpen ? "▲" : "▼"}
                    </button>
                  </div>

                  {mobileServicesOpen && (
                    <div className="ml-3 mt-2 flex flex-col gap-1 rounded-lg border border-white/10 bg-white/5 p-2">
                      {serviceLinks.map((item) => (
                        <Link
                          key={`mobile-${item.to}`}
                          to={item.to}
                          onClick={() => {
                            setMenuOpen(false);
                            setMobileServicesOpen(false);
                          }}
                          className="rounded-md px-2 py-1.5 text-sm text-white/80 transition hover:bg-[#213a7a]/45 hover:text-[#4f72e0]"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <NavLink
                  to="/tools"
                  className={navLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  Financial Tools
                </NavLink>
                <NavLink
                  to="/about"
                  className={navLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  About
                </NavLink>
                <NavLink
                  to="/career"
                  className={navLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  Career
                </NavLink>
                <NavLink
                  to="/collaborate"
                  className={navLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  Collaborate
                </NavLink>
                <NavLink
                  to="/contact"
                  className={navLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  Contact
                </NavLink>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="rounded-full border border-[#4f72e0]/50 px-6 py-2 text-center text-sm text-[#4f72e0]"
                    >
                      Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="rounded-full border border-red-400/50 px-6 py-2 text-sm text-red-400"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        navigate("/login");
                        setMenuOpen(false);
                      }}
                      className="rounded-full border border-white/20 bg-white/10 px-6 py-2 text-center text-sm text-white/90 transition hover:bg-white/20"
                    >
                      Login
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        navigate("/get-started");
                        setMenuOpen(false);
                      }}
                      className="rounded-full bg-blue-600 px-6 py-2 text-white shadow-lg"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
