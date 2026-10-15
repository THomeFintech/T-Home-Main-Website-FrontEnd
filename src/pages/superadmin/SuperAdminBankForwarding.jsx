import { useEffect, useState, useMemo } from "react";
import {
  Building2,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Edit3,
  X,
  FileCheck,
  AlertCircle,
} from "lucide-react";
import { getBankForwarding, updateBankForwarding } from "../../api/superAdminApi";

export default function SuperAdminBankForwarding() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedBank, setSelectedBank] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Edit response modal
  const [activeItem, setActiveItem] = useState(null);
  const [modalStatus, setModalStatus] = useState("");
  const [modalNotes, setModalNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSubmissions();
  }, []);

  async function loadSubmissions() {
    try {
      setLoading(true);
      setError("");
      const res = await getBankForwarding();
      if (res?.success && Array.isArray(res?.data)) {
        setSubmissions(res.data);
      }
    } catch (err) {
      console.error("Failed to load bank forwarding tracker:", err);
      setError(err.message || "Failed to load bank submissions.");
    } finally {
      setLoading(false);
    }
  }

  const availableBanks = useMemo(() => {
    const set = new Set(submissions.map((s) => s.bankName).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [submissions]);

  const filtered = useMemo(() => {
    return submissions.filter((item) => {
      const matchSearch =
        !search ||
        item.applicantName.toLowerCase().includes(search.toLowerCase()) ||
        item.loanId.toLowerCase().includes(search.toLowerCase()) ||
        (item.bankName || "").toLowerCase().includes(search.toLowerCase());

      const matchBank =
        selectedBank === "All" ||
        (item.bankName || "").toLowerCase() === selectedBank.toLowerCase();

      const matchStatus =
        selectedStatus === "All" ||
        (item.status || "").toLowerCase() === selectedStatus.toLowerCase();

      return matchSearch && matchBank && matchStatus;
    });
  }, [submissions, search, selectedBank, selectedStatus]);

  const openModal = (item) => {
    setActiveItem(item);
    setModalStatus(item.status || "Awaiting Response");
    setModalNotes(item.notes || "");
  };

  const closeModal = () => {
    setActiveItem(null);
  };

  const handleSaveResponse = async (e) => {
    e.preventDefault();
    if (!activeItem) return;

    try {
      setSaving(true);
      const res = await updateBankForwarding(activeItem.id, {
        status: modalStatus,
        notes: modalNotes,
      });

      if (res?.success) {
        setSubmissions((prev) =>
          prev.map((s) =>
            s.id === activeItem.id
              ? { ...s, status: modalStatus, notes: modalNotes }
              : s
          )
        );
        closeModal();
      }
    } catch (err) {
      alert("Failed to update bank response: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = String(status || "Awaiting Response").toLowerCase();
    if (s.includes("approved")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (s.includes("rejected")) {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    if (s.includes("forwarded")) {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Bank Forwarding Tracker
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor partner bank selections, log sanction decisions, and track disbursements.
          </p>
        </div>

        <button
          onClick={loadSubmissions}
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
            placeholder="Search applicant, loan ID, bank..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Bank:</span>
          <select
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-700"
          >
            {availableBanks.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-700"
          >
            <option value="All">All statuses</option>
            <option value="Awaiting Response">Awaiting Response</option>
            <option value="Bank Approved">Bank Approved</option>
            <option value="Bank Rejected">Bank Rejected</option>
            <option value="Forwarded to Bank">Forwarded to Bank</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
            <span className="text-sm">Loading bank submissions...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 font-medium">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-medium text-slate-700">No bank forwarding records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Applicant & Contact</th>
                  <th className="px-5 py-3.5">Loan ID</th>
                  <th className="px-5 py-3.5">Partner Bank</th>
                  <th className="px-5 py-3.5">Interest Rate & Monthly EMI</th>
                  <th className="px-5 py-3.5">Selected Date</th>
                  <th className="px-5 py-3.5">Bank Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-slate-900">{item.applicantName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {item.applicantPhone || item.applicantEmail || "No direct phone"}
                      </p>
                    </td>

                    <td className="px-5 py-3.5 font-mono text-xs text-slate-600">
                      {item.loanId}
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 font-medium text-slate-800">
                        <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>{item.bankName}</span>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="text-sm font-semibold text-slate-900">
                        {item.interestRate}%
                      </div>
                      <div className="text-xs text-slate-500">
                        ₹{Number(item.monthlyEmi).toLocaleString("en-IN")}/mo
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                      {item.selectedAt
                        ? new Date(item.selectedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {item.status || "Awaiting Response"}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => openModal(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Log Response
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* LOG RESPONSE MODAL */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <h2 className="font-bold text-slate-900 text-base">
                Log Bank Response
              </h2>
              <button
                onClick={closeModal}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResponse} className="p-6 space-y-4">
              <div>
                <p className="text-xs text-slate-500">Applicant / Bank Case</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  {activeItem.applicantName} · {activeItem.bankName}
                </p>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  {activeItem.loanId}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Bank Status
                </label>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-800"
                >
                  <option value="Awaiting Response">Awaiting Response</option>
                  <option value="Forwarded to Bank">Forwarded to Bank</option>
                  <option value="Bank Approved">Bank Approved</option>
                  <option value="Bank Rejected">Bank Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Bank Official Notes / Sanction Letter Remarks
                </label>
                <textarea
                  rows={3}
                  placeholder="Record reference number, sanction details, or rejection grounds..."
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-800"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Bank Status"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
