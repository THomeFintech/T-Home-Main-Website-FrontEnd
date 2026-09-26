import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText } from "lucide-react";

export default function SuperAdminSidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("superadmin_authenticated");
    navigate("/super-admin");
  };

  return (
    <aside className="w-[247px] min-h-screen bg-white border-r border-slate-200 flex flex-col">

      {/* BRAND */}
      <div className="h-[71px] px-4 flex items-center border-b border-slate-200">

        <div className="w-9 h-9 flex items-center justify-center mr-2">
          <img
            src="/apple-touch-icon.png"
            alt="T-HOME Fintech"
            className="w-9 h-9 object-contain"
          />
        </div>

        <div className="text-[15px] font-semibold text-slate-700">
          T-Home{" "}
          <span className="font-normal">
            Fintech
          </span>
        </div>

        <button
          type="button"
          className="ml-auto text-slate-400 hover:text-slate-700"
        >
          ‹
        </button>

      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-3 py-4">

        <div className="space-y-2">

          {/* DASHBOARD */}
          <NavLink
            to="/super-admin/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-700 hover:bg-slate-50"
              }`
            }
          >
            <LayoutDashboard className="w-4 h-4" />

            <span>
              Dashboard
            </span>
          </NavLink>

          {/* DOCUMENTS */}
          <NavLink
            to="/super-admin/documents"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-700 hover:bg-slate-50"
              }`
            }
          >
            <FileText className="w-4 h-4" />

            <span>
              Documents Submitted
            </span>
          </NavLink>

        </div>

      </nav>

      {/* LOGOUT */}
      <div className="border-t border-slate-200 p-3">

        <button
          type="button"
          onClick={logout}
          className="w-full text-left px-3 py-2.5 text-sm text-slate-500 hover:bg-slate-50 rounded-md"
        >
          Sign out
        </button>

      </div>

    </aside>
  );
}