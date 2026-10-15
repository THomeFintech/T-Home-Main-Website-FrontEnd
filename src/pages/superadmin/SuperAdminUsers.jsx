import { useEffect, useState, useMemo } from "react";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Shield,
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  AlertTriangle,
  UserCheck,
  UserX,
  X,
  CreditCard,
  FileCheck,
} from "lucide-react";
import { getUsersList, updateUserStatus } from "../../api/superAdminApi";

export default function SuperAdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Confirmation modal for status change
  const [confirmUser, setConfirmUser] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");
      const res = await getUsersList();
      if (res?.success && Array.isArray(res?.data)) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error("Failed to load users:", err);
      setError(err.message || "Failed to load customer directory.");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !search ||
        (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (u.phone || "").toLowerCase().includes(search.toLowerCase()) ||
        (u.city || "").toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "All" ||
        (statusFilter === "active" && u.is_active !== false) ||
        (statusFilter === "inactive" && u.is_active === false);

      return matchSearch && matchStatus;
    });
  }, [users, search, statusFilter]);

  const handleToggleStatus = async () => {
    if (!confirmUser) return;
    try {
      setUpdating(true);
      const newStatus = !confirmUser.is_active;
      const res = await updateUserStatus(confirmUser.id, newStatus);
      if (res?.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === confirmUser.id ? { ...u, is_active: newStatus } : u
          )
        );
        setConfirmUser(null);
      }
    } catch (err) {
      alert("Failed to update user status: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const getCibilBadge = (score) => {
    if (!score) return <span className="text-slate-400 text-xs">Unchecked</span>;
    if (score >= 750)
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {score} · Excellent
        </span>
      );
    if (score >= 700)
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          {score} · Good
        </span>
      );
    if (score >= 650)
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          {score} · Fair
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
        {score} · Poor
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Customer Directory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Registered customer accounts, verified KYC credentials, credit scores, and loan activity.
          </p>
        </div>

        <button
          onClick={loadUsers}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, email, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Account Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-700"
          >
            <option value="All">All accounts</option>
            <option value="active">Active only</option>
            <option value="inactive">Inactive / Suspended</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
            <span className="text-sm">Loading customer directory...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 font-medium">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No customers match the current criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Customer Name & Email</th>
                  <th className="px-5 py-3.5">Phone & Location</th>
                  <th className="px-5 py-3.5">CIBIL Score</th>
                  <th className="px-5 py-3.5">KYC Status</th>
                  <th className="px-5 py-3.5">Loans</th>
                  <th className="px-5 py-3.5">Registered</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((user) => {
                  const initials = (user.name || "U")
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();

                  const isActive = user.is_active !== false;

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 truncate">
                              {user.name || "Unnamed Customer"}
                            </p>
                            <p className="text-xs text-slate-400 truncate mt-0.5">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-xs text-slate-600">
                        <p className="font-medium text-slate-800">{user.phone || "No phone"}</p>
                        <p className="text-slate-400">{user.city || "India"}</p>
                      </td>

                      <td className="px-5 py-3.5">{getCibilBadge(user.cibil_score)}</td>

                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {user.is_verified && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Verified
                            </span>
                          )}
                          {user.digilocker_connected && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              DigiLocker
                            </span>
                          )}
                          {user.is_pan_verified && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                              PAN
                            </span>
                          )}
                          {user.is_aadhaar_verified && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                              Aadhaar
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <span className="font-bold text-slate-800 text-sm">
                          {user._count?.loan_records || 0}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td>

                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {isActive ? "Active" : "Suspended"}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => setConfirmUser(user)}
                          className={`px-3 py-1 text-xs font-semibold rounded-md border transition ${
                            isActive
                              ? "text-rose-600 border-rose-200 hover:bg-rose-50"
                              : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                          }`}
                        >
                          {isActive ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-3.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>
            Showing {filtered.length} of {users.length} registered customers
          </span>
          <span className="text-[11px] text-slate-400">
            Source: T-HOME Neon PostgreSQL Users Table
          </span>
        </div>
      </div>

      {/* CONFIRM STATUS TOGGLE MODAL */}
      {confirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full p-6 text-center">
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center bg-amber-50 text-amber-600 mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900">
              {confirmUser.is_active !== false ? "Deactivate Account?" : "Activate Account?"}
            </h3>

            <p className="text-xs text-slate-500 mt-2">
              {confirmUser.is_active !== false
                ? `Deactivating ${confirmUser.name || confirmUser.email} will prevent them from signing in and accessing loan facilities.`
                : `Activating ${confirmUser.name || confirmUser.email} will restore their login access.`}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmUser(null)}
                className="flex-1 py-2 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleToggleStatus}
                disabled={updating}
                className={`flex-1 py-2 text-xs font-semibold text-white rounded-lg transition disabled:opacity-50 ${
                  confirmUser.is_active !== false
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {updating ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
