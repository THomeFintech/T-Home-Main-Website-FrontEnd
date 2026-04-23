import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://127.0.0.1:8000";

function authHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

// ── Centralised fetch with 401 redirect ──
async function apiFetch(url) {
  const headers = authHeaders();
  const r = await fetch(url, { headers });
  if (r.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    return null;
  }
  if (!r.ok) return null;
  return r.json();
}

// ── Format ISO date from DB ──
function fmtDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtINR(val) {
  if (val == null) return "—";
  return "₹ " + Number(val).toLocaleString("en-IN");
}

// ── Stat Card ──
function StatCard({ label, value, sub, subColor = "text-blue-400", icon, loading }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/[0.07] backdrop-blur-2xl shadow-[0_12px_32px_rgba(5,16,38,0.45),inset_0_1px_0_rgba(255,255,255,0.14)] p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/40 uppercase tracking-wider">{label}</span>
        <span className="text-white/20">{icon}</span>
      </div>
      {loading ? (
        <div className="h-8 w-28 rounded-lg bg-white/10 animate-pulse" />
      ) : (
        <p className="text-2xl font-semibold text-white">{value ?? "—"}</p>
      )}
      {loading ? (
        <div className="h-3 w-36 rounded bg-white/10 animate-pulse" />
      ) : (
        <p className={`text-xs ${subColor}`}>{sub}</p>
      )}
    </div>
  );
}

// ── Skeleton line ──
function Skeleton({ className = "" }) {
  return <div className={`rounded-lg bg-white/10 animate-pulse ${className}`} />;
}

// ── Status badge color map ──
const STATUS_BADGE = {
  "Under Review": "bg-orange-500/15 text-orange-400 border-orange-400/20",
  "Approved":     "bg-green-500/15 text-green-400 border-green-400/20",
  "Submitted":    "bg-blue-500/15 text-blue-400 border-blue-400/20",
  "Verified":     "bg-green-500/15 text-green-400 border-green-400/20",
  "Disbursed":    "bg-purple-500/15 text-purple-400 border-purple-400/20",
};

const DOC_COLOR = {
  green:  "bg-green-500/15 text-green-400 border-green-400/20",
  orange: "bg-orange-500/15 text-orange-400 border-orange-400/20",
  blue:   "bg-blue-500/15 text-blue-400 border-blue-400/20",
  red:    "bg-red-500/15 text-red-400 border-red-400/20",
};

const NOTIF_DOT = {
  blue:   "bg-blue-500",
  green:  "bg-green-500",
  orange: "bg-orange-500",
  red:    "bg-red-500",
};

const LOAN_ICON = {
  "Home":     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f72e0" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  "Personal": <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f72e0" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  "LAP":      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f72e0" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
};

function loanIcon(type) {
  return LOAN_ICON[type] || LOAN_ICON["Personal"];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ── API state ──
  const [summary,       setSummary]       = useState(null);
  const [loans,         setLoans]         = useState([]);
  const [documents,     setDocuments]     = useState([]);
  const [progress,      setProgress]      = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [advisor,       setAdvisor]       = useState(null);

  // ── Loading ──
  const [loadingSummary,  setLoadingSummary]  = useState(true);
  const [loadingLoans,    setLoadingLoans]    = useState(true);
  const [loadingDocs,     setLoadingDocs]     = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [loadingNotifs,   setLoadingNotifs]   = useState(true);
  const [loadingAdvisor,  setLoadingAdvisor]  = useState(true); // FIX 1: advisor loading state

  const fetchAll = useCallback(async () => {

    // ✅ Auto-sync pending loan to current user
    const pendingLoanId = localStorage.getItem("loan_id");
    if (pendingLoanId) {
      try {
        await fetch(`${API}/dashboard/sync-loan/${pendingLoanId}`, {
          method: "POST",
          headers: authHeaders(),
        });
        localStorage.removeItem("loan_id"); // ✅ clear after sync
      } catch (e) {
        console.warn("Sync failed:", e);
      }
    }

    // summary
    apiFetch(`${API}/dashboard/summary`)
      .then(d => setSummary(d))
      .finally(() => setLoadingSummary(false));

    // loans
    apiFetch(`${API}/dashboard/loans`)
      .then(d => setLoans(d ?? []))
      .finally(() => setLoadingLoans(false));

    // documents
    apiFetch(`${API}/dashboard/documents`)
      .then(d => setDocuments(d ?? []))
      .finally(() => setLoadingDocs(false));

    // progress
    apiFetch(`${API}/dashboard/progress`)
      .then(d => setProgress(d))
      .finally(() => setLoadingProgress(false));

    // notifications
    apiFetch(`${API}/dashboard/notifications`)
      .then(d => setNotifications(d ?? []))
      .finally(() => setLoadingNotifs(false));

    // advisor — 404 returns null from apiFetch
    apiFetch(`${API}/dashboard/advisor`)
      .then(d => setAdvisor(d))
      .finally(() => setLoadingAdvisor(false)); // FIX 1: clear advisor loading
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const markRead = async (id) => {
    await fetch(`${API}/dashboard/notifications/${id}/read`, {
      method: "PATCH",
      headers: authHeaders(),
    });
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
  };

  // ── doc row icons ──
  const DOC_ROW_ICON = {
    "KYC":           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
    "Income Proof":  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    "Property Docs": <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>,
  };

  const DOC_STATUS_ICON = {
    green:  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,
    orange: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    blue:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/></svg>,
    red:    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  };

  const currentStatus = progress?.current_status ?? "Submitted";
  const steps         = progress?.steps ?? [];
  const expectedDays  = progress?.expected_days;

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-8 text-slate-100">

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold">
          Welcome back, {user?.name} 👋
        </h1>
        <p className="text-white/40 text-xs sm:text-sm mt-1">Here's your financial overview</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6 sm:mb-8">
        <StatCard
          loading={loadingSummary}
          label="Active Applications"
          value={summary?.active_applications}
          sub={summary ? `● ${summary.application_summary}` : ""}
          subColor="text-blue-400"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
        />
        <StatCard
          loading={loadingSummary}
          label="Total Loan Amount"
          value={summary ? fmtINR(summary.total_loan_amount) : null}
          sub={summary ? `● ${summary.total_loan_summary}` : ""}
          subColor="text-blue-400"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
        />
        <StatCard
          loading={loadingSummary}
          label="Next EMI Due"
          value={summary?.next_emi_amount ? fmtINR(summary.next_emi_amount) : "No EMI"}
          sub={summary?.next_emi_due_date ? `● Due on ${summary.next_emi_due_date}` : "● No upcoming EMI"}
          subColor="text-orange-400"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
        />
        <StatCard
          loading={loadingSummary}
          label="CIBIL Score"
          value={summary?.cibil_score ?? "—"}
          sub={summary ? `● ${summary.cibil_label}` : ""}
          subColor={
            summary?.cibil_label === "Excellent" ? "text-green-400" :
            summary?.cibil_label === "Good"      ? "text-blue-400"  :
            summary?.cibil_label === "Fair"      ? "text-orange-400":
                                                   "text-red-400"
          }
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>}
        />
      </div>

      {/* ── Two-column layout ── */}
      <div className="flex flex-col xl:grid xl:grid-cols-[1fr_320px] gap-6">

        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-4 sm:gap-6">

          {/* Application Progress */}
          <div className="rounded-2xl border border-white/20 bg-white/[0.07] backdrop-blur-2xl shadow-[0_12px_32px_rgba(5,16,38,0.45),inset_0_1px_0_rgba(255,255,255,0.14)] p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-medium text-white">Application Progress</h2>
              {loadingProgress ? (
                <Skeleton className="h-6 w-28" />
              ) : (
                <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs border ${STATUS_BADGE[currentStatus] ?? STATUS_BADGE["Submitted"]}`}>
                  {currentStatus}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </span>
              )}
            </div>

            {loadingProgress ? (
              <div className="flex justify-between gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center flex-1 gap-2">
                    <Skeleton className="w-7 h-7 rounded-full" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative flex items-start justify-between">
                {steps.map((step, i) => {
                  const dot =
                    step.status === "done"   ? "bg-green-500 border-green-500" :
                    step.status === "active" ? "bg-[#4f72e0] border-[#4f72e0] ring-4 ring-[#4f72e0]/30" :
                                               "bg-transparent border-white/20";
                  return (
                    <div key={i} className="flex flex-col items-center flex-1">
                      <div className="relative flex items-center w-full">
                        {i > 0 && (
                          <div className={`flex-1 h-0.5 ${steps[i - 1].status === "done" ? "bg-green-500" : "bg-white/10"}`} />
                        )}
                        <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${dot}`}>
                          {step.status === "done" && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                          )}
                          {step.status === "active" && (
                            <div className="w-2.5 h-2.5 rounded-full bg-white" />
                          )}
                        </div>
                        {i < steps.length - 1 && (
                          <div className={`flex-1 h-0.5 ${step.status === "done" ? "bg-green-500" : "bg-white/10"}`} />
                        )}
                      </div>
                      <span className={`mt-2 text-xs text-center ${step.status === "active" ? "text-white font-medium" : step.status === "done" ? "text-white/60" : "text-white/30"}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-5 flex items-center gap-2 rounded-lg bg-white/[0.06] border border-white/20 px-4 py-2.5 backdrop-blur-xl">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f72e0" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span className="text-xs text-white/50">
                {expectedDays != null
                  ? `Expected approval in ${expectedDays} day${expectedDays !== 1 ? "s" : ""}`
                  : currentStatus === "Disbursed"
                  ? "Loan has been disbursed"
                  : "Processing your application"
                }
              </span>
            </div>
          </div>

          {/* Active Loans */}
          <div className="rounded-2xl border border-white/20 bg-white/[0.07] backdrop-blur-2xl shadow-[0_12px_32px_rgba(5,16,38,0.45),inset_0_1px_0_rgba(255,255,255,0.14)] p-4 sm:p-6">
            <h2 className="font-medium text-white mb-4">Your Active Loans</h2>

            {loadingLoans ? (
              <div className="rounded-xl border border-white/20 bg-white/[0.05] p-4 space-y-3">
                <Skeleton className="h-5 w-40" />
                <div className="grid grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-8" />)}
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ) : loans.length === 0 ? (
              <p className="text-sm text-white/40 text-center py-6">No active loans found</p>
            ) : (
              <div className="flex flex-col gap-4">
                {loans.map((loan) => (
                  <div key={loan.loan_id} className="rounded-xl border border-white/20 bg-white/[0.05] backdrop-blur-xl p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#4f72e0]/15 flex items-center justify-center">
                          {loanIcon(loan.loan_type)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{loan.loan_type} Loan</p>
                          <p className="text-xs text-white/30">A/C: {loan.account_number}</p>
                        </div>
                      </div>
                      {/* FIX 3: View Details wired to loan route */}
                      
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {[
                        { label: "Loan Amount",      value: fmtINR(loan.loan_amount)       },
                        { label: "EMI Amount",        value: fmtINR(loan.monthly_emi)       },
                        { label: "Remaining Balance", value: fmtINR(loan.remaining_balance) },
                      ].map(item => (
                        <div key={item.label}>
                          <p className="text-[11px] text-white/30 mb-1">{item.label}</p>
                          <p className="text-sm font-medium text-white">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-white/40">Repayment Progress</span>
                        <span className="text-xs text-white/40">
                          {loan.repayment_percent ?? 0}% Paid ({fmtINR(loan.amount_paid)})
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#4f72e0] to-[#7b9ef0] transition-all duration-500"
                          style={{ width: `${loan.repayment_percent ?? 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-white/20 bg-white/[0.07] backdrop-blur-2xl shadow-[0_12px_32px_rgba(5,16,38,0.45),inset_0_1px_0_rgba(255,255,255,0.14)] p-4 sm:p-6">
            <h2 className="font-medium text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Apply for New Loan", onClick: () => { localStorage.setItem("isLoggedIn","true"); navigate("/services"); }, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
                { label: "Upload Documents",   onClick: () => navigate("/documents"),   icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg> },
                { label: "Check Eligibility",  onClick: () => navigate("/home-loans"),  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg> },
                { label: "Contact Advisor",    onClick: () => navigate("/contact"),     icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg> },
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={action.onClick}
                  className="flex flex-col items-center gap-2.5 rounded-xl border border-white/20 bg-white/[0.06] backdrop-blur-xl px-3 py-4 text-white/70 hover:text-white hover:border-[#9cc9ff]/60 hover:bg-white/[0.14] transition-all text-xs text-center"
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6">

          {/* Your Documents */}
          <div className="rounded-2xl border border-white/20 bg-white/[0.07] backdrop-blur-2xl shadow-[0_12px_32px_rgba(5,16,38,0.45),inset_0_1px_0_rgba(255,255,255,0.14)] p-4 sm:p-6">
            <h2 className="font-medium text-white mb-4">Your Documents</h2>
            <div className="flex flex-col gap-2 mb-4">
              {loadingDocs ? (
                [...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)
              ) : documents.length === 0 ? (
                <p className="text-sm text-white/40 text-center py-4">No documents found</p>
              ) : (
                // FIX 5: use doc.id ?? index as key to avoid label collision
                documents.map((doc, i) => (
                  <div key={doc.id ?? i} className="flex items-center justify-between rounded-xl border border-white/20 bg-white/[0.06] backdrop-blur-xl px-4 py-3">
                    <div className="flex items-center gap-2.5 text-white/50">
                      {DOC_ROW_ICON[doc.label] ?? DOC_ROW_ICON["Income Proof"]}
                      <span className="text-sm text-white/70">{doc.label}</span>
                    </div>
                    <span className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium ${DOC_COLOR[doc.color] ?? DOC_COLOR.orange}`}>
                      {DOC_STATUS_ICON[doc.color]} {doc.status}
                    </span>
                  </div>
                ))
              )}
            </div>
            <button
              className="w-full rounded-xl border border-[#9cc9ff]/45 bg-gradient-to-r from-[#5e86f3]/85 to-[#7fa7ff]/80 py-2.5 text-sm font-medium text-white hover:brightness-110 transition flex items-center justify-center gap-2 shadow-[0_10px_24px_rgba(33,84,180,0.35),inset_0_1px_0_rgba(216,233,255,0.25)]"
              onClick={() => navigate("/documents")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
              Upload Documents
            </button>
          </div>

          {/* Recent Updates */}
          <div className="rounded-2xl border border-white/20 bg-white/[0.07] backdrop-blur-2xl shadow-[0_12px_32px_rgba(5,16,38,0.45),inset_0_1px_0_rgba(255,255,255,0.14)] p-6">
            <h2 className="font-medium text-white mb-4">Recent Updates</h2>
            {loadingNotifs ? (
              <div className="flex flex-col gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="mt-1 w-2 h-2 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-2.5 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <p className="text-sm text-white/40 text-center py-4">No updates yet</p>
            ) : (
              <div className="flex flex-col gap-4">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 cursor-pointer ${!n.is_read ? "opacity-100" : "opacity-60"}`}
                    onClick={() => !n.is_read && markRead(n.id)}
                  >
                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${NOTIF_DOT[n.color] ?? "bg-blue-500"}`} />
                    <div>
                      <p className="text-sm text-white/70">{n.message}</p>
                      {/* FIX 2: format ISO date string from DB */}
                      <p className="text-xs text-white/30 mt-0.5">{fmtDate(n.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Need Help — Advisor */}
          <div className="rounded-2xl border border-white/20 bg-white/[0.07] backdrop-blur-2xl shadow-[0_12px_32px_rgba(5,16,38,0.45),inset_0_1px_0_rgba(255,255,255,0.14)] p-4 sm:p-5">
            <p className="font-medium text-white text-sm mb-0.5">Need help?</p>
            <p className="text-xs text-white/30 mb-4">
              {loadingAdvisor
                ? "Loading advisor info..."
                : advisor
                ? `Talk to your advisor, ${advisor.name}`
                : "Contact our support team"
              }
            </p>

            {/* FIX 1: show skeleton while advisor loads */}
            {loadingAdvisor ? (
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="w-9 h-9 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-2.5 w-16" />
                </div>
              </div>
            ) : advisor ? (
              <div className="flex items-center gap-3 mb-4">
                {advisor.photo_url ? (
                  <img src={advisor.photo_url} alt={advisor.name} className="w-9 h-9 rounded-full border border-white/10 object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full border border-white/10 bg-white/10 flex items-center justify-center text-white/50 text-sm font-semibold">
                    {advisor.name?.[0] ?? "A"}
                  </div>
                )}
                <div>
                  <p className="text-sm text-white/80">{advisor.name}</p>
                  <p className="text-xs text-white/30">{advisor.designation}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full border border-white/10 bg-white/10 flex items-center justify-center text-white/50 text-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div>
                  <p className="text-sm text-white/80">Support Team</p>
                  <p className="text-xs text-white/30">Available 9AM – 6PM</p>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-white/[0.08] backdrop-blur-xl py-2 text-xs text-white/80 hover:bg-white/[0.14] transition">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Chat Now
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-[#9cc9ff]/45 bg-gradient-to-r from-[#5e86f3]/85 to-[#7fa7ff]/80 py-2 text-xs text-white hover:brightness-110 transition shadow-[0_8px_20px_rgba(33,84,180,0.3)]"
                onClick={() => advisor?.phone && window.open(`tel:${advisor.phone}`)}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/></svg>
                Call Support
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
