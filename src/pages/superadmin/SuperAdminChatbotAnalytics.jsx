import { useEffect, useState, useMemo } from "react";
import {
  MessageSquare,
  Bot,
  Users,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  Search,
  ChevronRight,
  X,
  HelpCircle,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  PhoneCall,
  UserCheck,
  Calendar,
  MessageCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  getChatbotAnalyticsSummary,
  getChatbotTrends,
  getChatbotFaqs,
  getChatbotConversations,
  getChatbotConversation,
} from "../../api/superAdminApi";

export default function SuperAdminChatbotAnalytics() {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [range, setRange] = useState("7d");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Conversation Transcript Drawer
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [transcriptData, setTranscriptData] = useState(null);
  const [loadingTranscript, setLoadingTranscript] = useState(false);

  useEffect(() => {
    loadAllData();
  }, [range]);

  async function loadAllData() {
    try {
      setLoading(true);
      setError("");

      const [sumRes, trendRes, faqRes, convRes] = await Promise.all([
        getChatbotAnalyticsSummary(),
        getChatbotTrends({ range }),
        getChatbotFaqs(),
        getChatbotConversations({ limit: 15 }),
      ]);

      if (sumRes?.success && sumRes?.data) setSummary(sumRes.data);
      if (trendRes?.success && Array.isArray(trendRes?.data)) setTrends(trendRes.data);
      if (faqRes?.success && Array.isArray(faqRes?.data)) setFaqs(faqRes.data);
      if (convRes?.success && Array.isArray(convRes?.data)) setConversations(convRes.data);
    } catch (err) {
      console.error("Chatbot analytics load error:", err);
      setError(err?.message || "Failed to load chatbot analytics data.");
    } finally {
      setLoading(false);
    }
  }

  // Open conversation transcript drawer
  async function openTranscript(sessionId) {
    setActiveSessionId(sessionId);
    setTranscriptData(null);
    setLoadingTranscript(true);
    try {
      const res = await getChatbotConversation(sessionId);
      if (res?.success && res?.data) {
        setTranscriptData(res.data);
      }
    } catch (err) {
      console.error("Failed to load transcript:", err);
    } finally {
      setLoadingTranscript(false);
    }
  }

  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      const matchesSearch =
        !search ||
        (c.customerName || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.customerEmail || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.id || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.service || "").toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        (c.status || "").toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [conversations, search, statusFilter]);

  const getStatusBadge = (status) => {
    const s = String(status || "ACTIVE").toUpperCase();
    if (s === "COMPLETED") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (s === "ESCALATED") return "bg-purple-50 text-purple-700 border-purple-200";
    if (s === "REDIRECTED") return "bg-blue-50 text-blue-700 border-blue-200";
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Bot className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Chatbot Analytics
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time performance metrics, user engagement trends, and conversation transcripts.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* DATE RANGE FILTER */}
          <div className="inline-flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
            {["7d", "30d", "90d", "all"].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-md transition ${
                  range === r
                    ? "bg-white text-blue-600 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : r === "90d" ? "90 Days" : "All Time"}
              </button>
            ))}
          </div>

          <button
            onClick={loadAllData}
            disabled={loading}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 shadow-xs transition"
            title="Refresh analytics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* ERROR BANNER */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between">
          <div className="flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={loadAllData}
            className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* SUMMARY KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL CONVERSATIONS */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Conversations</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <MessageSquare className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {loading ? <div className="h-7 w-16 bg-slate-200 rounded animate-pulse" /> : summary?.totalConversations || 0}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span className="text-emerald-600 font-semibold">{summary?.activeToday || 0} active</span>
            <span>in last 24h</span>
          </div>
        </div>

        {/* TOTAL MESSAGES */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Messages</span>
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <MessageCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {loading ? <div className="h-7 w-16 bg-slate-200 rounded animate-pulse" /> : summary?.totalMessages || 0}
          </div>
          <div className="text-xs text-slate-500">
            User questions & AI assistant replies
          </div>
        </div>

        {/* CAPTURED LEADS */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Captured Leads</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <UserCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {loading ? <div className="h-7 w-16 bg-slate-200 rounded animate-pulse" /> : summary?.totalLeads || 0}
          </div>
          <div className="text-xs text-emerald-600 font-medium">
            {summary?.conversionRate || 0}% conversation conversion rate
          </div>
        </div>

        {/* ERROR / ESCALATION RATE */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Bot Error Rate</span>
            <span className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {loading ? <div className="h-7 w-16 bg-slate-200 rounded animate-pulse" /> : `${summary?.errorRate || 0}%`}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <span>{summary?.escalationCount || 0} human escalations</span>
          </div>
        </div>
      </div>

      {/* ACTIVITY TREND CHART */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-800">Conversation & Message Activity</h2>
            <p className="text-xs text-slate-500">Daily interaction volume over the selected time period</p>
          </div>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mr-2" />
            Loading trend data...
          </div>
        ) : trends.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-sm">
            <Calendar className="w-8 h-8 mb-2 text-slate-300" />
            <p className="font-medium text-slate-600">No conversation history in this period</p>
            <p className="text-xs text-slate-400 mt-0.5">Interaction trends will appear as customers chat.</p>
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMsg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "0.75rem",
                    fontSize: "0.75rem",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "12px" }} />
                <Area
                  type="monotone"
                  dataKey="conversations"
                  name="Conversations"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorConv)"
                />
                <Area
                  type="monotone"
                  dataKey="messages"
                  name="Messages"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorMsg)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* TOP INQUIRIES & SERVICES ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FAQS & TOP QUESTIONS */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">Frequently Asked Inquiries</h2>
              <p className="text-xs text-slate-500">Most frequent user questions asked to the chatbot</p>
            </div>
            <HelpCircle className="w-4 h-4 text-slate-400" />
          </div>

          {loading ? (
            <div className="py-10 text-center text-slate-400 text-xs">Loading questions...</div>
          ) : faqs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              <HelpCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="font-medium text-slate-600">No recurring questions recorded yet</p>
              <p className="text-xs text-slate-400 mt-0.5">Top customer inquiries will be clustered here.</p>
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="text-slate-800 font-medium truncate">{faq.question}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px]">
                      {faq.service}
                    </span>
                    <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 text-[11px]">
                      {faq.count} {faq.count === 1 ? "time" : "times"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* POPULAR SERVICE INTEREST */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">Financial Service Distribution</h2>
              <p className="text-xs text-slate-500">Which loan or compliance products customers explore most</p>
            </div>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>

          {loading ? (
            <div className="py-10 text-center text-slate-400 text-xs">Loading services...</div>
          ) : !summary?.serviceDistribution || summary.serviceDistribution.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="font-medium text-slate-600">No service selections recorded yet</p>
              <p className="text-xs text-slate-400 mt-0.5">Product interest breakdown will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {summary.serviceDistribution.map((item, idx) => {
                const total = summary.totalConversations || 1;
                const pct = Math.round((item.count / total) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700">{item.service}</span>
                      <span className="text-slate-500 font-semibold">
                        {item.count} sessions ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(4, pct))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RECENT CONVERSATIONS TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-800">Recent Chatbot Conversations</h2>
            <p className="text-xs text-slate-500">Live chat history, verification status, and transcripts</p>
          </div>

          <div className="flex items-center gap-2">
            {/* SEARCH */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search user, email, service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition w-48 sm:w-56"
              />
            </div>

            {/* STATUS FILTER */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-700"
            >
              <option value="All">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="ESCALATED">Escalated</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-2" />
            Loading conversations...
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Bot className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-medium text-slate-600">No conversations match the filters</p>
            <p className="text-xs text-slate-400 mt-1">
              Conversations will appear in real time as website visitors interact with the chatbot.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-5 -mb-5 border-t border-slate-200">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Visitor / Contact</th>
                  <th className="py-3 px-4">Service Context</th>
                  <th className="py-3 px-4">Messages</th>
                  <th className="py-3 px-4">DPDP Consent</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredConversations.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{c.customerName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{c.customerEmail}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-700">{c.service}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-700">
                        {c.messageCount} msg
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {c.consentGiven ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Verified
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${getStatusBadge(
                          c.status
                        )}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {c.lastActiveAt ? new Date(c.lastActiveAt).toLocaleString("en-IN", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }) : "N/A"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openTranscript(c.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition"
                      >
                        Transcript
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CONVERSATION TRANSCRIPT DRAWER */}
      {activeSessionId && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* BACKDROP */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setActiveSessionId(null)}
          />

          {/* DRAWER BODY */}
          <div className="relative z-10 w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
            {/* DRAWER HEADER */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-blue-100 text-blue-700 rounded">
                    <Bot className="w-4 h-4" />
                  </span>
                  <h3 className="font-bold text-slate-800 text-sm truncate">Chatbot Conversation</h3>
                </div>
                <p className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                  ID: {activeSessionId}
                </p>
              </div>

              <button
                onClick={() => setActiveSessionId(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CUSTOMER INFO CARD */}
            {transcriptData && (
              <div className="p-4 bg-blue-50/50 border-b border-blue-100 text-xs text-slate-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{transcriptData.customerName}</span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold text-[10px]">
                    {transcriptData.service}
                  </span>
                </div>
                <div className="text-slate-500 font-mono">
                  {transcriptData.customerEmail} · {transcriptData.customerMobile}
                </div>
                {transcriptData.consentTimestamp && (
                  <div className="text-[11px] text-emerald-700 flex items-center gap-1 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    DPDP Consent granted on {new Date(transcriptData.consentTimestamp).toLocaleString("en-IN")}
                  </div>
                )}
              </div>
            )}

            {/* MESSAGES SCROLL AREA */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
              {loadingTranscript ? (
                <div className="py-20 text-center text-slate-400 text-xs">
                  <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-2" />
                  Loading message transcript...
                </div>
              ) : !transcriptData?.messages || transcriptData.messages.length === 0 ? (
                <div className="py-20 text-center text-slate-400 text-xs">
                  No messages recorded in this session.
                </div>
              ) : (
                transcriptData.messages.map((m, idx) => {
                  const isUser = m.role === "user";
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                        <span>{isUser ? "Customer" : "T-Home Assistant"}</span>
                        <span>·</span>
                        <span>
                          {new Date(m.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div
                        className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                          isUser
                            ? "bg-blue-600 text-white rounded-br-xs shadow-xs"
                            : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{m.message}</p>

                        {m.redirectUrl && (
                          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1 text-blue-600 font-semibold text-[11px]">
                            <span>Redirect Recommendation:</span>
                            <span className="underline">{m.redirectUrl}</span>
                          </div>
                        )}

                        {m.status === "escalation" && (
                          <div className="mt-2 pt-1 text-purple-700 font-semibold text-[11px] flex items-center gap-1">
                            <PhoneCall className="w-3.5 h-3.5" />
                            User requested customer support
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* DRAWER FOOTER */}
            <div className="p-3 border-t border-slate-200 bg-white flex justify-end">
              <button
                onClick={() => setActiveSessionId(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Close Transcript
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
