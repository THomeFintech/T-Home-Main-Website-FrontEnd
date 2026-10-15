import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Repeat2,
  FileCheck,
  Building2,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";

export default function SuperAdminSidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const logout = () => {
    localStorage.removeItem("superadmin_token");
    localStorage.removeItem("superadmin_admin");
    localStorage.removeItem("superadmin_authenticated");
    navigate("/super-admin");
  };

  const navItems = [
    {
      to: "/super-admin/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      to: "/super-admin/leads",
      icon: ClipboardList,
      label: "Leads",
    },
    {
      to: "/super-admin/bt-lps",
      icon: Repeat2,
      label: "Balance Transfer & LPS",
    },
    {
      to: "/super-admin/documents",
      icon: FileCheck,
      label: "Documents Submitted",
    },
    {
      to: "/super-admin/bank-forwarding",
      icon: Building2,
      label: "Bank Forwarding Tracker",
    },
    {
      to: "/super-admin/users",
      icon: Users,
      label: "Customer Directory",
    },
    {
      to: "/super-admin/reports",
      icon: BarChart3,
      label: "Reports & Analytics",
    },
    {
      to: "/super-admin/settings",
      icon: Settings,
      label: "Settings",
    },
  ];

  return (
    <aside
      className={`${
        collapsed ? "w-[72px]" : "w-[248px]"
      } min-h-screen bg-white border-r border-slate-200 flex flex-col transition-all duration-200 shrink-0 select-none`}
    >
      {/* BRAND */}
      <div className="h-16 px-4 flex items-center border-b border-slate-200 gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm shadow-blue-500/20">
          TH
        </div>

        {!collapsed && (
          <div className="min-w-0">
            <span className="text-sm font-bold tracking-tight text-slate-800">
              T-Home{" "}
              <span className="font-normal text-slate-500">Fintech</span>
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="ml-auto p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <ChevronLeft
            className={`w-4 h-4 transition-transform duration-200 ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                } ${collapsed ? "justify-center px-0" : ""}`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* FOOTER INFO & LOGOUT */}
      <div className="border-t border-slate-200 p-3 space-y-2">
        {!collapsed && (
          <div className="px-3 py-1 text-[11px] text-slate-400 tracking-wide">
            v1.0 · Super Admin Console
          </div>
        )}

        <button
          type="button"
          onClick={logout}
          title="Sign out"
          className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ${
            collapsed ? "justify-center px-0" : ""
          }`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}