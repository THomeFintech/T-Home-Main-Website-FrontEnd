import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileCheck,
  Search,
  Filter,
  RefreshCw,
  ChevronRight,
  AlertCircle,
  FileText,
} from "lucide-react";
import { getDocuments } from "../../api/superAdminApi";

export default function SuperAdminDocuments() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    try {
      setLoading(true);
      setError("");

      const response = await getDocuments();
      setApplications(response?.data || []);
    } catch (err) {
      console.error("Failed to load documents:", err);
      setError(err.message || "Failed to load documents list.");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const matchSearch =
        !search ||
        (app.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (app.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (app.loanId || "").toLowerCase().includes(search.toLowerCase()) ||
        (app.referenceId || "").toLowerCase().includes(search.toLowerCase());

      const dec = String(app.decision || "Pending Review").toLowerCase();
      let matchStatus = true;
      if (statusFilter === "Approved") matchStatus = dec.includes("approved");
      if (statusFilter === "Rejected") matchStatus = dec.includes("reject");
      if (statusFilter === "Pending") matchStatus = !dec.includes("approved") && !dec.includes("reject");

      return matchSearch && matchStatus;
    });
  }, [applications, search, statusFilter]);

  const getStatusBadge = (decision) => {
    const val = String(decision || "").toLowerCase();
    if (val.includes("approved")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (val.includes("reject")) {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  const getDisplayStatus = (decision) => {
    if (!decision) return "Pending Review";
    const val = String(decision).toLowerCase();
    if (val.includes("approved")) return "Approved";
    if (val.includes("reject")) return "Rejected";
    return "Pending Review";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Documents Submitted
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review user applications, verify identity documents, and sanction loan decisions.
          </p>
        </div>

        <button
          onClick={loadApplications}
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
            placeholder="Search applicant name, email, loan ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Decision Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-700"
          >
            <option value="All">All decisions</option>
            <option value="Pending">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
            <span className="text-sm">Loading applications and documents...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 font-medium">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-medium text-slate-700">No applications match the filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Applicant Details</th>
                  <th className="px-5 py-3.5">Loan Type & Amount</th>
                  <th className="px-5 py-3.5">Attached Files</th>
                  <th className="px-5 py-3.5">Application Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((application) => {
                  const initials = (application.name || "U")
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();

                  return (
                    <tr
                      key={application.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {application.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {application.email || application.phone || "No direct email"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <p className="font-medium text-slate-800 capitalize">
                          {application.loanType || "Loan"}
                        </p>
                        <p className="text-xs font-semibold text-slate-900 mt-0.5">
                          {application.loanAmount
                            ? `₹${Number(application.loanAmount).toLocaleString("en-IN")}`
                            : "N/A"}
                        </p>
                      </td>

                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-700">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {application.documentCount || 0} document
                            {application.documentCount === 1 ? "" : "s"}
                          </span>
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
                            application.decision
                          )}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {getDisplayStatus(application.decision)}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/super-admin/applications/${application.id}`)
                          }
                          className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition shadow-sm"
                        >
                          Review Case
                          <ChevronRight className="w-3.5 h-3.5" />
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
            Showing {filtered.length} of {applications.length} applications
          </span>
          <span className="text-[11px] text-slate-400">
            Source: T-HOME Neon DB Loan Records & User Documents
          </span>
        </div>
      </div>
    </div>
  );
}