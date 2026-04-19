import { useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  {
    group: null,
    items: [
      { id: "dashboard", label: "Dashboard", icon: "grid" },
      { id: "applications", label: "Applications", icon: "file" },
      { id: "documents", label: "Documents", icon: "folder" },
    ],
  },
  {
    group: "Settings",
    items: [
      { id: "profile", label: "Profile", icon: "user" },
      { id: "support", label: "Support", icon: "headset" },
    ],
  },
];

function NavIcon({ type }) {
  const cls = "w-4 h-4";
  const p = {
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 1.8,
    className: cls,
  };

  switch (type) {
    case "grid":
      return (
        <svg {...p}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "file":
      return (
        <svg {...p}>
          <path
            strokeLinecap="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
    case "folder":
      return (
        <svg {...p}>
          <path
            strokeLinecap="round"
            d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
          />
        </svg>
      );
    case "user":
      return (
        <svg {...p}>
          <path
            strokeLinecap="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      );
    case "headset":
      return (
        <svg {...p}>
          <path strokeLinecap="round" d="M3 18v-6a9 9 0 0118 0v6" />
          <path
            strokeLinecap="round"
            d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"
          />
        </svg>
      );
    default:
      return null;
  }
}

export default function Sidebar({ activePage, onNavigate, onLogout }) {
  const navigate = useNavigate();

  const handleNav = (id) => {
    const routes = {
      dashboard: "/dashboard",
      applications: "/applications",
      documents: "/documents",
      profile: "/profile",
      support: "/support",
    };

    navigate(routes[id] ?? "/dashboard");

    if (onNavigate) onNavigate(id);
  };

  const handleLogout = () => {
    if (typeof onLogout === "function") {
      onLogout();
      return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    window.dispatchEvent(new Event("authChange"));
    navigate("/get-started");
  };

  return (
    <aside
      className="w-52 flex-shrink-0 flex flex-col py-6 px-3 min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, rgba(17,38,70,0.62) 0%, rgba(10,27,53,0.56) 100%)",
        backdropFilter: "blur(24px) saturate(160%)",
        WebkitBackdropFilter: "blur(24px) saturate(160%)",
        borderRight: "1px solid rgba(143,190,255,0.24)",
        boxShadow:
          "inset -1px 0 0 rgba(170,205,255,0.12), 10px 0 28px rgba(0,0,0,0.32)",
      }}
    >
      <div className="px-1 pb-5">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2.5 text-sm font-medium text-slate-200 transition-all hover:border-red-300/35 hover:bg-red-500/10 hover:text-white"
          style={{
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 24px rgba(0,0,0,0.18)",
          }}
        >
          <span className="text-red-300">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 17l5-5-5-5"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12H3"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 5v14a2 2 0 01-2 2h-6"
              />
            </svg>
          </span>
          Logout
        </button>
      </div>

      {NAV_ITEMS.map((section, si) => (
        <div key={si} className={si > 0 ? "mt-6" : ""}>
          {section.group && (
            <p className="text-[10px] font-bold text-slate-300/60 uppercase tracking-widest px-3 mb-2">
              {section.group}
            </p>
          )}

          <div className="space-y-0.5">
            {section.items.map((item) => {
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
                  style={
                    isActive
                      ? {
                          background:
                            "linear-gradient(135deg, rgba(63,117,203,0.34) 0%, rgba(31,74,154,0.28) 100%)",
                          border: "1px solid rgba(137,192,255,0.42)",
                          color: "#d6e8ff",
                          boxShadow:
                            "0 6px 20px rgba(16,51,115,0.28), inset 0 1px 0 rgba(194,223,255,0.22)",
                        }
                      : {
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid transparent",
                          color: "#9bb0ca",
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.09)";
                      e.currentTarget.style.borderColor = "rgba(152,190,241,0.22)";
                      e.currentTarget.style.color = "#d2e2f7";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                      e.currentTarget.style.borderColor = "transparent";
                      e.currentTarget.style.color = "#9bb0ca";
                    }
                  }}
                >
                  <span className={isActive ? "text-blue-200" : "text-slate-400"}>
                    <NavIcon type={item.icon} />
                  </span>
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
}