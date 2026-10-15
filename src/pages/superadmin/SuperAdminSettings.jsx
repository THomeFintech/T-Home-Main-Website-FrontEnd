import { useEffect, useState, useMemo } from "react";
import {
  Settings,
  Shield,
  ShieldCheck,
  Building2,
  Layers,
  RefreshCw,
  UserCheck,
  UserX,
  AlertCircle,
  Check,
  History,
  Search,
  FileText,
} from "lucide-react";
import {
  getSettingsData,
  updateAdminActiveStatus,
  getAuditLogs,
} from "../../api/superAdminApi";

export default function SuperAdminSettings() {
  const [activeTab, setActiveTab] = useState("admins");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditSearch, setAuditSearch] = useState("");
  const [auditActionFilter, setAuditActionFilter] = useState("All");

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (activeTab === "audit") {
      loadAuditLogsData();
    }
  }, [activeTab]);

  async function loadSettings() {
    try {
      setLoading(true);
      setError("");
      const res = await getSettingsData();
      if (res?.success && res?.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
      setError(err.message || "Failed to load platform settings.");
    } finally {
      setLoading(false);
    }
  }

  async function loadAuditLogsData() {
    try {
      setAuditLoading(true);
      const res = await getAuditLogs({ limit: 100 });
      if (res?.success && Array.isArray(res?.data)) {
        setAuditLogs(res.data);
      }
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setAuditLoading(false);
    }
  }

  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchSearch =
        !auditSearch ||
        (log.admin_email || "").toLowerCase().includes(auditSearch.toLowerCase()) ||
        (log.action || "").toLowerCase().includes(auditSearch.toLowerCase()) ||
        (log.entity_id || "").toLowerCase().includes(auditSearch.toLowerCase()) ||
        (log.details || "").toLowerCase().includes(auditSearch.toLowerCase());

      const matchAction =
        auditActionFilter === "All" ||
        (log.action || "").toLowerCase().includes(auditActionFilter.toLowerCase());

      return matchSearch && matchAction;
    });
  }, [auditLogs, auditSearch, auditActionFilter]);

  const handleToggleAdmin = async (admin) => {
    if (admin.id === data?.currentAdminId) {
      alert("You cannot deactivate your own Super Admin account.");
      return;
    }

    try {
      setUpdatingId(admin.id);
      const newStatus = !admin.is_active;
      const res = await updateAdminActiveStatus(admin.id, newStatus);
      if (res?.success) {
        setData((prev) => ({
          ...prev,
          admins: prev.admins.map((a) =>
            a.id === admin.id ? { ...a, is_active: newStatus } : a
          ),
        }));
      }
    } catch (err) {
      alert("Failed to update admin: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Platform Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Super Admin access governance, services catalog, and partner bank configuration.
          </p>
        </div>

        <button
          onClick={loadSettings}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* TABS */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          type="button"
          onClick={() => setActiveTab("admins")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "admins"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Super Admins ({data?.admins?.length || 0})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("services")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "services"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Layers className="w-4 h-4" />
          Fintech Services Catalog
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("banks")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "banks"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Building2 className="w-4 h-4" />
          Partner Bank Network
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("audit")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "audit"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <History className="w-4 h-4" />
          Audit Trail ({auditLogs.length})
        </button>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-500 flex flex-col items-center justify-center gap-3 bg-white rounded-xl border border-slate-200">
          <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
          <span className="text-sm">Loading platform settings...</span>
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-red-600 font-medium">
          {error}
        </div>
      ) : !data ? null : activeTab === "admins" ? (
        /* SUPER ADMINS DIRECTORY */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-base font-bold text-slate-900">
              Super Admin Accounts
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Administrators with highest privilege level across T-HOME services.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Admin User</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">OTP Verified</th>
                  <th className="px-5 py-3.5">Created Date</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Access Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.admins.map((admin) => {
                  const isCurrent = admin.id === data.currentAdminId;
                  const initials = (admin.name || "A")
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();

                  return (
                    <tr key={admin.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 flex items-center gap-2">
                              <span>{admin.name}</span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-700 rounded font-semibold">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-slate-400">{admin.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          Super Admin
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-xs text-slate-600">
                        {admin.is_verified ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                            <Check className="w-3.5 h-3.5" />
                            Verified
                          </span>
                        ) : (
                          <span className="text-amber-600">Pending</span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                        {admin.created_at
                          ? new Date(admin.created_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td>

                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                            admin.is_active
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {admin.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        {isCurrent ? (
                          <span className="text-xs text-slate-400 italic">Active session</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggleAdmin(admin)}
                            disabled={updatingId === admin.id}
                            className={`px-3 py-1 text-xs font-semibold rounded-md border transition disabled:opacity-50 ${
                              admin.is_active
                                ? "text-rose-600 border-rose-200 hover:bg-rose-50"
                                : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                            }`}
                          >
                            {admin.is_active ? "Deactivate" : "Activate"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === "services" ? (
        /* SERVICES CATALOG */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.services.map((srv) => (
            <div
              key={srv.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between"
            >
              <div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                  {srv.category}
                </span>
                <h3 className="font-bold text-slate-800 text-sm mt-0.5">
                  {srv.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Public customer intake form & LPS integration
                </p>
              </div>

              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live
              </span>
            </div>
          ))}
        </div>
      ) : activeTab === "banks" ? (
        /* PARTNER BANKS */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.partnerBanks.map((bank) => (
            <div
              key={bank.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{bank.name}</h3>
                  <span className="text-xs text-emerald-600 font-medium">
                    {bank.status} Partner
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Indicative Base Rate:</span>
                <span className="font-bold text-slate-900">{bank.baseRate}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Max Tenure:</span>
                <span className="font-medium text-slate-800">{bank.maxTenure}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* AUDIT TRAIL TAB */
        <div className="space-y-4">
          {/* FILTER BAR */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search action, admin email, entity ID, or details..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Action:</span>
              <select
                value={auditActionFilter}
                onChange={(e) => setAuditActionFilter(e.target.value)}
                className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-700"
              >
                <option value="All">All Actions</option>
                <option value="DECISION">Loan Decisions</option>
                <option value="DOCUMENT">Document Verification</option>
                <option value="USER">User Account Status</option>
                <option value="LEAD">Leads Management</option>
                <option value="BANK">Bank Routing</option>
                <option value="ADMIN">Super Admin Changes</option>
              </select>
            </div>

            <button
              onClick={loadAuditLogsData}
              disabled={auditLoading}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${auditLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {auditLoading ? (
              <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
                <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
                <span className="text-sm">Loading immutable audit logs...</span>
              </div>
            ) : filteredAuditLogs.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <History className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="font-medium text-slate-700">No audit records match the filters</p>
                <p className="text-xs text-slate-400 mt-1">
                  Actions taken by Super Admins will appear here in chronological order.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="px-5 py-3.5">Timestamp (IST)</th>
                      <th className="px-5 py-3.5">Admin Email</th>
                      <th className="px-5 py-3.5">Action Executed</th>
                      <th className="px-5 py-3.5">Entity</th>
                      <th className="px-5 py-3.5">Details</th>
                      <th className="px-5 py-3.5">Client IP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-xs">
                    {filteredAuditLogs.map((log) => {
                      const isPositive =
                        log.action?.includes("APPROV") ||
                        log.action?.includes("ACTIVATE") ||
                        log.action?.includes("VERIF");
                      const isNegative =
                        log.action?.includes("REJECT") ||
                        log.action?.includes("SUSPEND") ||
                        log.action?.includes("DEACTIVATE");

                      const badgeClass = isPositive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : isNegative
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : "bg-blue-50 text-blue-700 border-blue-200";

                      return (
                        <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap font-sans">
                            {log.created_at
                              ? new Date(log.created_at).toLocaleString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                })
                              : "N/A"}
                          </td>

                          <td className="px-5 py-3.5 text-slate-800 font-sans font-medium">
                            {log.admin_email || "Super Admin"}
                          </td>

                          <td className="px-5 py-3.5">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold border ${badgeClass}`}
                            >
                              {log.action}
                            </span>
                          </td>

                          <td className="px-5 py-3.5 text-slate-700 font-semibold">
                            {log.entity_type} #{log.entity_id}
                          </td>

                          <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate" title={log.details}>
                            {log.details || "—"}
                          </td>

                          <td className="px-5 py-3.5 text-slate-400">
                            {log.ip_address || "127.0.0.1"}
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
                Showing {filteredAuditLogs.length} of {auditLogs.length} logged actions
              </span>
              <span className="text-[11px] text-slate-400">
                Immutable Ledger: PostgreSQL `admin_audit_logs`
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
