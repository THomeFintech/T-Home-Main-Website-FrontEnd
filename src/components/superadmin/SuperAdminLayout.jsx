import { Outlet } from "react-router-dom";
import { Bell } from "lucide-react";
import SuperAdminSidebar from "./SuperAdminSidebar";

export default function SuperAdminLayout() {
  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* SIDEBAR */}
      <SuperAdminSidebar />

      {/* MAIN AREA */}
      <div className="flex-1 min-w-0">

        {/* TOP HEADER */}
        <header className="h-[71px] bg-white border-b border-slate-200 flex items-center px-6">

          {/* BREADCRUMB */}
          <div className="flex items-center gap-2 min-w-[190px]">

            <span className="text-sm text-slate-400">
              T-Home Fintech
            </span>

            <span className="text-slate-300">
              /
            </span>

            <span className="text-sm font-medium text-slate-700">
              Dashboard
            </span>

          </div>

          {/* SEARCH */}
          <div className="flex-1 max-w-[385px] ml-5">

            <div className="relative">

              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search leads, agents, banks..."
                className="w-full h-9 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-400"
              />

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="ml-auto flex items-center gap-5">

            <select
              className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-700 outline-none"
              defaultValue="Super Admin"
            >
              <option>Super Admin</option>
            </select>

            <button
  type="button"
  className="text-slate-500 hover:text-slate-700 transition"
  title="Notifications"
>
  <Bell className="w-5 h-5" />
</button>

            <div className="flex items-center gap-2">

              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  AR
                </span>
              </div>

              <div className="hidden lg:block">

                <p className="text-xs font-semibold text-slate-700">
                  Admin Root
                </p>

                <p className="text-[11px] text-slate-400">
                  Super Admin
                </p>

              </div>

            </div>

          </div>

        </header>

        {/* PAGE CONTENT */}
        <main className="min-w-0">
          <Outlet />
        </main>

      </div>

    </div>
  );
}