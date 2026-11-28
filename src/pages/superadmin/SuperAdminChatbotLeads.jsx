import { useEffect, useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  X,
  Phone,
  Mail,
  User,
  Calendar,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  MessageSquare,
  Bot,
  UserCheck,
  FileSpreadsheet,
} from "lucide-react";
import {
  getChatbotLeads,
  getChatbotLead,
  updateChatbotLeadStatus,
  updateChatbotLeadAssignment,
  exportChatbotLeadsCsv,
} from "../../api/superAdminApi";

export default function SuperAdminChatbotLeads() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
    lost: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [page, setPage] = useState(1);

  // Detail Drawer
  const [activeLeadId, setActiveLeadId] = useState(null);
  const [leadDetail, setLeadDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [drawerStatus, setDrawerStatus] = useState("NEW");
  const [drawerAssigned, setDrawerAssigned] = useState("");
  const [drawerNotes, setDrawerNotes] = useState("");
  const [savingLead, setSavingLead] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadLeads();
  }, [page, selectedService, selectedStatus]);

  async function loadLeads() {
    try {
      setLoading(true);
      setError("");
      const res = await getChatbotLeads({
        page,
        limit: pagination.limit,
        search: search.trim() || undefined,
        service: selectedService,
        status: selectedStatus,
      });

      if (res?.success) {
        setLeads(res.data || []);
        if (res.stats) setStats(res.stats);
        if (res.pagination) setPagination(res.pagination);
      }
    } catch (err) {
      console.error("Failed to load chatbot leads:", err);
      setError(err?.message || "Failed to load chatbot leads database.");
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    setPage(1);
    loadLeads();
  }

  async function handleExportCsv() {
    try {
      setExporting(true);
      await exportChatbotLeadsCsv({
        search: search.trim() || undefined,
        service: selectedService,
        status: selectedStatus,
      });
    } catch (err) {
      alert("Failed to export leads: " + err.message);
    } finally {
      setExporting(false);
    }
  }

  async function openLeadDrawer(id) {
    setActiveLeadId(id);
    setLeadDetail(null);
    setSaveSuccess(false);
    setLoadingDetail(true);
    try {
      const res = await getChatbotLead(id);
      if (res?.success && res?.data) {
        setLeadDetail(res.data);
        setDrawerStatus(res.data.status || "NEW");
        setDrawerAssigned(res.data.assignedTo || "");
        setDrawerNotes(res.data.notes || "");
      }
    } catch (err) {
      console.error("Failed to load lead details:", err);
    } finally {
      setLoadingDetail(false);
    }
  }

  async function handleSaveLead(e) {
    e.preventDefault();
    if (!activeLeadId) return;

    try {
      setSavingLead(true);
      setSaveSuccess(false);

      // Update status and assignment concurrently
      await Promise.all([
        updateChatbotLeadStatus(activeLeadId, drawerStatus, drawerNotes),
        updateChatbotLeadAssignment(activeLeadId, drawerAssigned, drawerNotes),
      ]);

      setSaveSuccess(true);
      // Update in local table
      setLeads((prev) =>
        prev.map((l) =>
          l.id === activeLeadId
            ? { ...l, status: drawerStatus, assignedTo: drawerAssigned, notes: drawerNotes }
            : l
        )
      );
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert("Failed to save changes: " + err.message);
    } finally {
      setSavingLead(false);
    }
  }

  const getStatusBadge = (status) => {
    const s = String(status || "NEW").toUpperCase();
    if (s === "CONVERTED") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (s === "QUALIFIED") return "bg-indigo-50 text-indigo-700 border-indigo-200";
    if (s === "CONTACTED") return "bg-blue-50 text-blue-700 border-blue-200";
    if (s === "LOST") return "bg-rose-50 text-rose-700 border-rose-200";
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  const servicesList = [
    "All",
    "Home Loan",
    "Personal Loan",
    "Loan Against Property (LAP)",
    "Balance Transfer",
    "Mortgage Loan",
    "ITR Filing",
    "GST Registration",
    "Company Registration",
    "General Enquiry",
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <UserCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Chatbot Leads
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Qualify, assign, and review verified inquiries captured directly by the T-Home AI Assistant.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* EXPORT BUTTON */}
          <button
            onClick={handleExportCsv}
            disabled={exporting || loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition shadow-xs disabled:opacity-60"
          >
            <FileSpreadsheet className={`w-4 h-4 text-emerald-600 ${exporting ? "animate-spin" : ""}`} />
            {exporting ? "Exporting..." : "Export CSV"}
          </button>

          {/* REFRESH BUTTON */}
          <button
            onClick={loadLeads}
            disabled={loading}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 shadow-xs transition"
            title="Refresh leads list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* PIPELINE METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Total Leads", count: stats.total, color: "text-slate-900", bg: "bg-slate-50" },
          { label: "New", count: stats.new, color: "text-amber-600", bg: "bg-amber-50/50" },
          { label: "Contacted", count: stats.contacted, color: "text-blue-600", bg: "bg-blue-50/50" },
          { label: "Qualified", count: stats.qualified, color: "text-indigo-600", bg: "bg-indigo-50/50" },
          { label: "Converted", count: stats.converted, color: "text-emerald-600", bg: "bg-emerald-50/50" },
          { label: "Lost", count: stats.lost, color: "text-rose-600", bg: "bg-rose-50/50" },
        ].map((item, idx) => (
          <div key={idx} className={`p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1`}>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{item.label}</span>
            <div className={`text-xl font-bold ${item.color}`}>
              {loading ? <div className="h-6 w-10 bg-slate-200 rounded animate-pulse" /> : item.count || 0}
            </div>
          </div>
        ))}
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        {/* SEARCH FORM */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
          />
        </form>

        {/* SERVICE FILTER */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Service:</span>
          <select
            value={selectedService}
            onChange={(e) => {
              setSelectedService(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-700"
          >
            {servicesList.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* STATUS FILTER */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-700"
          >
            <option value="All">All statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="CONVERTED">Converted</option>
            <option value="LOST">Lost</option>
          </select>
        </div>
      </div>

      {/* LEADS TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-emerald-600 rounded-full animate-spin" />
            <span className="text-xs">Loading chatbot leads...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-sm text-red-600 font-medium">{error}</p>
            <button
              onClick={loadLeads}
              className="mt-3 px-4 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <UserCheck className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-medium text-slate-700">No chatbot leads found</p>
            <p className="text-xs text-slate-400 mt-1">
              When visitors complete chatbot verification and enquire about services, leads will automatically be listed here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Lead ID</th>
                  <th className="py-3 px-4">Customer Name & Contact</th>
                  <th className="py-3 px-4">Interested Service</th>
                  <th className="py-3 px-4">DPDP Consent</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Staff</th>
                  <th className="py-3 px-4">Captured Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      #{lead.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{lead.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                        <span>{lead.phone}</span>
                        <span>·</span>
                        <span>{lead.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800">{lead.service}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {lead.consentGiven ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Verified
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Standard</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${getStatusBadge(
                          lead.status
                        )}`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {lead.assignedTo ? (
                        <span className="font-medium text-slate-800">{lead.assignedTo}</span>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openLeadDrawer(lead.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition"
                      >
                        Manage
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION FOOTER */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
            <div>
              Showing page <span className="font-semibold text-slate-700">{pagination.page}</span> of{" "}
              <span className="font-semibold text-slate-700">{pagination.totalPages}</span> ({pagination.total} leads)
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* LEAD MANAGEMENT & TRANSCRIPT DRAWER */}
      {activeLeadId && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* BACKDROP */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setActiveLeadId(null)}
          />

          {/* DRAWER CONTAINER */}
          <div className="relative z-10 w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
            {/* DRAWER HEADER */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                  <UserCheck className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">
                    Manage Chatbot Lead #{activeLeadId}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Lead Status, Staff Assignment & Related Chat Transcript
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveLeadId(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* DRAWER BODY */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {loadingDetail ? (
                <div className="py-24 text-center text-slate-400 text-xs">
                  <div className="w-6 h-6 border-2 border-slate-300 border-t-emerald-600 rounded-full animate-spin mx-auto mb-2" />
                  Loading lead details and conversation...
                </div>
              ) : !leadDetail ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Lead details not found.
                </div>
              ) : (
                <>
                  {/* SAVE NOTIFICATION */}
                  {saveSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      Lead updated successfully!
                    </div>
                  )}

                  {/* CUSTOMER CONTACT CARD */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 text-sm">{leadDetail.name}</div>
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                        {leadDetail.service}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono">{leadDetail.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono truncate">{leadDetail.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          Captured: {new Date(leadDetail.createdAt).toLocaleString("en-IN", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-medium">DPDP Consent Verified</span>
                      </div>
                    </div>
                  </div>

                  {/* EDIT LEAD CONTROLS FORM */}
                  <form onSubmit={handleSaveLead} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* STATUS SELECTOR */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Lead Status
                        </label>
                        <select
                          value={drawerStatus}
                          onChange={(e) => setDrawerStatus(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-medium text-slate-800"
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="QUALIFIED">QUALIFIED</option>
                          <option value="CONVERTED">CONVERTED</option>
                          <option value="LOST">LOST</option>
                        </select>
                      </div>

                      {/* ASSIGNED STAFF */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Assigned Staff Member
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Loan Officer Name / Admin"
                          value={drawerAssigned}
                          onChange={(e) => setDrawerAssigned(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-800"
                        />
                      </div>
                    </div>

                    {/* NOTES */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Internal Follow-up Notes
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Add remarks about customer call, requirements, or next steps..."
                        value={drawerNotes}
                        onChange={(e) => setDrawerNotes(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-800"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={savingLead}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition disabled:opacity-60 shadow-xs"
                    >
                      {savingLead ? "Saving Changes..." : "Save Lead Updates"}
                    </button>
                  </form>

                  {/* RELATED CHATBOT CONVERSATION TRANSCRIPT */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                      <div>
                        <h4 className="font-bold text-slate-800 text-xs">
                          Related Chatbot Conversation
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Questions and inquiries asked by this customer prior to becoming a lead
                        </p>
                      </div>
                      <span className="p-1 bg-blue-50 text-blue-600 rounded">
                        <MessageSquare className="w-4 h-4" />
                      </span>
                    </div>

                    {!leadDetail.conversation || leadDetail.conversation.length === 0 ? (
                      <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 text-center text-xs text-slate-400">
                        No chatbot message transcript found for this session.
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 max-h-72 overflow-y-auto space-y-2.5">
                        {leadDetail.conversation.map((msg, idx) => {
                          const isUser = msg.role === "user";
                          return (
                            <div
                              key={idx}
                              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                            >
                              <div className="text-[10px] text-slate-400 mb-0.5 px-1">
                                {isUser ? "Customer" : "AI Assistant"}
                              </div>
                              <div
                                className={`p-2.5 rounded-xl text-xs max-w-[90%] leading-relaxed ${
                                  isUser
                                    ? "bg-blue-600 text-white rounded-br-xs"
                                    : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-2xs"
                                }`}
                              >
                                {msg.message}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* DRAWER FOOTER */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setActiveLeadId(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
