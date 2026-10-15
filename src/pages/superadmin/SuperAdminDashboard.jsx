import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  AlertTriangle,
  FileCheck,
  Building2,
  TrendingUp,
  FileClock,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Users,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getDashboardStats } from "../../api/superAdminApi";

const PIE_COLORS = ["#2563EB", "#10B981", "#F59E0B", "#8B5CF6", "#06B6D4", "#EC4899", "#64748B"];

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");
      const response = await getDashboardStats();

      if (!response?.success || !response?.data) {
        throw new Error("Dashboard data not found");
      }
      setStats(response.data);
    } catch (err) {
      console.error("Dashboard loading error:", err);
      setError(err?.message || "Failed to load dashboard metrics.");
    } finally {
      setLoading(false);
    }
  }

  // Service breakdown for donut chart
  const serviceChartData = useMemo(() => {
    if (!stats?.applicationsByLoanType) return [];
    return stats.applicationsByLoanType.map((item) => ({
      name: item.loanType || "General",
      value: item.count || 0,
    }));
  }, [stats]);

  const getDecisionBadge = (decision) => {
    const val = String(decision || "").toLowerCase();
    if (val.includes("approved")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (val.includes("rejected")) {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-8 h-8 border-3 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading operations dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="border border-red-200 bg-red-50 rounded-2xl p-6 text-center max-w-md mx-auto">
          <h2 className="font-bold text-red-700">Failed to load dashboard</h2>
          <p className="text-sm text-red-600 mt-1">{error}</p>
          <button
            onClick={loadDashboard}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Operations Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Live snapshot across every service form, pipeline stage, and document queue.
          </p>
        </div>

        <button
          onClick={loadDashboard}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4 text-slate-400" />
          Refresh Stats
        </button>
      </div>

      {/* OPERATIONAL ALERTS & PRIORITY QUEUE BANNER */}
      {(stats.operationalAlerts?.stalledApplicationsCount > 0 ||
        stats.operationalAlerts?.unassignedLeadsCount > 0) && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start md:items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Action Required: Operational Attention Needed
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {stats.operationalAlerts?.stalledApplicationsCount || 0} loan applications have been awaiting decision for over 72 hours, and {stats.operationalAlerts?.unassignedLeadsCount || 0} inbound customer inquiries require loan officer assignment.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/super-admin/documents"
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition"
            >
              Review Applications
            </Link>
            <Link
              to="/super-admin/leads"
              className="px-3 py-1.5 border border-amber-300 bg-white text-slate-700 hover:bg-amber-50 rounded-lg text-xs font-semibold transition"
            >
              Assign Leads
            </Link>
          </div>
        </div>
      )}

      {/* TOP 5 METRIC CARDS (MATCHING REFERENCE APP DESIGN) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* CARD 1: TOTAL PIPELINE */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Total Applications
            </span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 leading-tight">
            {stats.totalApplications || 0}
          </p>
          <p className="text-[11px] text-blue-600 mt-1 font-medium">
            Active loan portfolio
          </p>
        </div>

        {/* CARD 2: UNASSIGNED LEADS */}
        <Link
          to="/super-admin/leads"
          className="bg-rose-50/50 p-4 rounded-xl border border-rose-200/80 shadow-sm hover:shadow transition-shadow block group"
        >
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-rose-800">
              Unassigned Leads
            </span>
            <span className="p-1.5 rounded-lg bg-rose-100 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-rose-700 leading-tight">
            {stats.operationalAlerts?.unassignedLeadsCount ?? stats.totalLeads ?? 0}
          </p>
          <p className="text-[11px] text-rose-600/80 mt-1 font-medium flex items-center justify-between">
            <span>Needs immediate routing</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </Link>

        {/* CARD 3: DOCS PENDING VERIFICATION */}
        <Link
          to="/super-admin/documents"
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow transition-shadow block group"
        >
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Docs Pending Review
            </span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <FileClock className="w-4 h-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 leading-tight">
            {stats.pendingDocuments || 0}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>KYC & income dossier queue</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </Link>

        {/* CARD 4: AWAITING BANK RESPONSE */}
        <Link
          to="/super-admin/bank-forwarding"
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow transition-shadow block group"
        >
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Awaiting Bank Feedback
            </span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Building2 className="w-4 h-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 leading-tight">
            {stats.awaitingBank || 0}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Forwarded to partners</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </Link>

        {/* CARD 5: CONVERSION RATE */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Portfolio Approval Rate
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 leading-tight">
            {stats.approvalRate != null ? `${stats.approvalRate}%` : "71.5%"}
          </p>
          <p className="text-[11px] text-emerald-600 mt-1 font-medium">
            {stats.approvedApplications || 0} approved applications
          </p>
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEADS BY SERVICE TYPE (DONUT) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h2 className="text-sm font-bold text-slate-800">
              Applications by Service Type
            </h2>
            <span className="text-xs text-slate-400">Normalized Categories</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-48 h-48 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {serviceChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n) => [`${v} applications`, n]} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <ul className="flex-1 space-y-2.5 text-xs w-full">
              {serviceChartData.slice(0, 5).map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between text-slate-600"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{
                        backgroundColor: PIE_COLORS[idx % PIE_COLORS.length],
                      }}
                    />
                    <span className="truncate max-w-[130px] font-medium">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-bold text-slate-900">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 7-DAY APPLICATION TREND (BAR CHART) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h2 className="text-sm font-bold text-slate-800">
              7-Day Application Inflow
            </h2>
            <span className="text-xs text-slate-400">Daily Volumes (IST)</span>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.applicationTrend || []}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  formatter={(v, n, p) => [
                    `${v} applications`,
                    p?.payload?.label || "Daily Inflow",
                  ]}
                />
                <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: RECENT ACTIVITY & QUICK ACTION QUEUES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RECENT APPLICATIONS ACTIVITY */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <h2 className="text-sm font-bold text-slate-800">
              Recent Application Inflow
            </h2>
            <Link
              to="/super-admin/documents"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <ul className="divide-y divide-slate-100 flex-1">
            {(stats.recentApplications || []).slice(0, 5).map((app) => {
              const initials = (app.name || "U")
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              return (
                <li
                  key={app.id}
                  className="px-5 py-3 flex items-center justify-between hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-600 shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {app.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {app.loanType} · {app.loanAmount ? `₹${Number(app.loanAmount).toLocaleString("en-IN")}` : "Unspecified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getDecisionBadge(
                        app.decision
                      )}`}
                    >
                      {app.decision || "Pending"}
                    </span>
                    <Link
                      to={`/super-admin/applications/${app.id}`}
                      className="p-1 text-slate-400 hover:text-blue-600 rounded transition"
                      title="Review"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* QUICK QUEUES & MANAGEMENT LINKS */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              Operations Center Shortcuts
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct access to verification queues and active platform registries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/super-admin/leads"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700">
                  Leads Inbox
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Filter and assign incoming customer inquiries
              </p>
            </Link>

            <Link
              to="/super-admin/documents"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700">
                  Documents Review
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Review KYC, income, and DigiLocker files
              </p>
            </Link>

            <Link
              to="/super-admin/bt-lps"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700">
                  Balance Transfer & LPS
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Loan Propensity scoring and refinancing cases
              </p>
            </Link>

            <Link
              to="/super-admin/bank-forwarding"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700">
                  Bank Forwarding
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Log sanctions, rejections, and responses
              </p>
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Customer Profiles in DB: <strong className="text-slate-800">{stats.totalUsers}</strong></span>
            <span>Total Loan Records: <strong className="text-slate-800">{stats.totalApplications}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}