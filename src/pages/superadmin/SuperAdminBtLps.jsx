import { useEffect, useState, useMemo } from "react";
import {
  Repeat2,
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  RefreshCw,
  ExternalLink,
  Percent,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getBtAndLps } from "../../api/superAdminApi";

export default function SuperAdminBtLps() {
  const [activeTab, setActiveTab] = useState("bt"); // "bt" or "lps"
  const [data, setData] = useState({ balanceTransfers: [], lpsRecords: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const res = await getBtAndLps();
      if (res?.success && res?.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Failed to load BT & LPS data:", err);
      setError(err.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }

  // Filtered lists
  const filteredBt = useMemo(() => {
    return data.balanceTransfers.filter((item) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(s) ||
        item.loanId.toLowerCase().includes(s) ||
        (item.referenceId || "").toLowerCase().includes(s)
      );
    });
  }, [data.balanceTransfers, search]);

  const filteredLps = useMemo(() => {
    return data.lpsRecords.filter((item) => {
      const matchSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.loanId.toLowerCase().includes(search.toLowerCase());

      let matchRisk = true;
      if (riskFilter !== "All") {
        const prob = item.probability || 0;
        if (riskFilter === "Low") matchRisk = prob >= 70;
        if (riskFilter === "Medium") matchRisk = prob >= 40 && prob < 70;
        if (riskFilter === "High") matchRisk = prob < 40;
      }

      return matchSearch && matchRisk;
    });
  }, [data.lpsRecords, search, riskFilter]);

  const getDecisionBadge = (decision) => {
    const d = String(decision || "pending").toLowerCase();
    if (d.includes("approved")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (d.includes("rejected")) {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  const getRiskBadge = (prob) => {
    if (prob == null) return { label: "Unscored", color: "bg-slate-100 text-slate-600" };
    if (prob >= 70) return { label: "Low Risk", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    if (prob >= 40) return { label: "Medium Risk", color: "bg-amber-50 text-amber-700 border-amber-200" };
    return { label: "High Risk", color: "bg-rose-50 text-rose-700 border-rose-200" };
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Balance Transfer & LPS
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track high-value Balance Transfer applications and ML-based Loan Propensity Scores.
          </p>
        </div>

        <button
          onClick={loadData}
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
          onClick={() => setActiveTab("bt")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "bt"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Repeat2 className="w-4 h-4" />
          Balance Transfer ({data.balanceTransfers.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("lps")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "lps"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          LPS Prediction Queue ({data.lpsRecords.length})
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search applicant name or loan ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {activeTab === "lps" && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Risk Profile:</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-700"
            >
              <option value="All">All risk levels</option>
              <option value="Low">Low risk (&ge; 70%)</option>
              <option value="Medium">Medium risk (40% - 69%)</option>
              <option value="High">High risk (&lt; 40%)</option>
            </select>
          </div>
        )}
      </div>

      {/* CONTENT TABLES */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3 bg-white rounded-xl border border-slate-200">
          <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
          <span className="text-sm">Loading applications...</span>
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      ) : activeTab === "bt" ? (
        /* BALANCE TRANSFER TABLE */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {filteredBt.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              No Balance Transfer cases found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-5 py-3.5">Applicant</th>
                    <th className="px-5 py-3.5">Loan ID</th>
                    <th className="px-5 py-3.5">Loan Amount</th>
                    <th className="px-5 py-3.5">Selected Bank</th>
                    <th className="px-5 py-3.5">Interest Rate / EMI</th>
                    <th className="px-5 py-3.5">Decision</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBt.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-slate-900">
                        {item.name}
                        {item.phone && (
                          <span className="block text-xs font-normal text-slate-400">
                            {item.phone}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-xs font-mono text-slate-600">
                        {item.loanId}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-900">
                        {item.loanAmount
                          ? `₹${Number(item.loanAmount).toLocaleString("en-IN")}`
                          : "N/A"}
                      </td>
                      <td className="px-5 py-3.5">
                        {item.selectedBanks.length > 0 ? (
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <Building2 className="w-3.5 h-3.5 text-blue-600" />
                            <span>{item.selectedBanks[0].bankName}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Pending selection</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-600">
                        {item.selectedBanks.length > 0 ? (
                          <div>
                            <span className="font-semibold text-slate-800">
                              {item.selectedBanks[0].interestRate}%
                            </span>
                            <span className="text-slate-400 ml-1">
                              (₹{Number(item.selectedBanks[0].monthlyEmi).toLocaleString("en-IN")}/mo)
                            </span>
                          </div>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDecisionBadge(
                            item.decision
                          )}`}
                        >
                          {item.decision}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          to={`/super-admin/applications/${item.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                        >
                          Review
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* LPS PREDICTION QUEUE TABLE */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {filteredLps.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              No Loan Propensity Score cases found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-5 py-3.5">Applicant</th>
                    <th className="px-5 py-3.5">Loan Type</th>
                    <th className="px-5 py-3.5">Loan Amount</th>
                    <th className="px-5 py-3.5">CIBIL Score</th>
                    <th className="px-5 py-3.5">Approval Probability</th>
                    <th className="px-5 py-3.5">Risk Rating</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLps.map((item) => {
                    const rawProb = item.probability;
                    const prob = rawProb != null ? (rawProb <= 1 ? rawProb * 100 : rawProb) : null;
                    const risk = getRiskBadge(prob);
                    const isExorbitant = item.loanAmount && item.loanAmount > 1000000000;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-slate-900">
                          {item.name}
                          <span className="block text-xs font-mono text-slate-400">
                            {item.loanId}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-700 font-medium capitalize">
                          {item.loanType}
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-slate-900">
                          {item.loanAmount
                            ? isExorbitant
                              ? "Exceeds Limit (Test)"
                              : `₹${Number(item.loanAmount).toLocaleString("en-IN")}`
                            : "N/A"}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-800">
                            {item.cibil || "N/A"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          {prob != null ? (
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
                                <div
                                  className={`h-full ${
                                    prob >= 70
                                      ? "bg-emerald-500"
                                      : prob >= 40
                                      ? "bg-amber-500"
                                      : "bg-rose-500"
                                  }`}
                                  style={{ width: `${Math.min(100, prob)}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold text-slate-700">
                                {prob.toFixed(1)}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs">Unscored</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${risk.color}`}
                          >
                            {risk.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Link
                            to={`/super-admin/applications/${item.id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                          >
                            Review
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
