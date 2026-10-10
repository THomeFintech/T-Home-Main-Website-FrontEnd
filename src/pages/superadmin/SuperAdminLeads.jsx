import { useEffect, useState, useMemo } from "react";
import {
  Search,
  Filter,
  User,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Send,
  UserCheck,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { getLeads, updateLead } from "../../api/superAdminApi";

export default function SuperAdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Selected lead for detail drawer
  const [activeLead, setActiveLead] = useState(null);
  const [drawerStatus, setDrawerStatus] = useState("");
  const [drawerNotes, setDrawerNotes] = useState("");
  const [drawerAssigned, setDrawerAssigned] = useState("");
  const [savingLead, setSavingLead] = useState(false);

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    try {
      setLoading(true);
      setError("");
      const res = await getLeads();
      if (res?.success && Array.isArray(res?.data)) {
        setLeads(res.data);
      }
    } catch (err) {
      console.error("Failed to load leads:", err);
      setError(err.message || "Failed to load leads.");
    } finally {
      setLoading(false);
    }
  }

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchSearch =
        !search ||
        (lead.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (lead.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (lead.phone || "").toLowerCase().includes(search.toLowerCase());

      const matchService =
        selectedService === "All" ||
        (lead.service || "").toLowerCase() === selectedService.toLowerCase();

      const matchStatus =
        selectedStatus === "All" ||
        (lead.status || "").toLowerCase() === selectedStatus.toLowerCase();

      return matchSearch && matchService && matchStatus;
    });
  }, [leads, search, selectedService, selectedStatus]);

  // Unique services in dataset
  const availableServices = useMemo(() => {
    const set = new Set(leads.map((l) => l.service).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [leads]);

  const openDrawer = (lead) => {
    setActiveLead(lead);
    setDrawerStatus(lead.status || "New");
    setDrawerNotes(lead.notes || "");
    setDrawerAssigned(lead.assignedTo || "");
  };

  const closeDrawer = () => {
    setActiveLead(null);
  };

  const handleSaveDrawer = async (e) => {
    e.preventDefault();
    if (!activeLead) return;

    try {
      setSavingLead(true);
      const res = await updateLead(activeLead.id, {
        status: drawerStatus,
        notes: drawerNotes,
        assignedTo: drawerAssigned || null,
      });

      if (res?.success) {
        // Update local state
        setLeads((prev) =>
          prev.map((l) =>
            l.id === activeLead.id
              ? {
                  ...l,
                  status: drawerStatus,
                  notes: drawerNotes,
                  assignedTo: drawerAssigned,
                }
              : l
          )
        );
        setActiveLead((prev) => ({
          ...prev,
          status: drawerStatus,
          notes: drawerNotes,
          assignedTo: drawerAssigned,
        }));
      }
    } catch (err) {
      alert("Failed to update lead: " + err.message);
    } finally {
      setSavingLead(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = String(status || "New").toLowerCase();
    if (s.includes("closed") || s.includes("won") || s.includes("approved")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (s.includes("progress") || s.includes("assigned") || s.includes("contacted")) {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }
    if (s.includes("lost") || s.includes("reject")) {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            All Leads
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Filter, assign, and track every lead captured by the T-HOME website.
          </p>
        </div>

        <button
          onClick={loadLeads}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        {/* SEARCH */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* SERVICE FILTER */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
            Service:
          </span>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-700"
          >
            {availableServices.map((srv) => (
              <option key={srv} value={srv}>
                {srv}
              </option>
            ))}
          </select>
        </div>

        {/* STATUS FILTER */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
            Status:
          </span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-700"
          >
            <option value="All">All statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed Won">Closed Won</option>
            <option value="Closed Lost">Closed Lost</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
            <span className="text-sm">Loading leads database...</span>
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
        ) : filteredLeads.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-medium text-slate-700">No leads match the filters</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search criteria or clearing filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Lead Contact</th>
                  <th className="px-5 py-3.5">Service Requested</th>
                  <th className="px-5 py-3.5">Submitted On</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Assigned To</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((lead) => {
                  const leadInitials = (lead.name || "U")
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => openDrawer(lead)}
                    >
                      {/* CONTACT */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-600 shrink-0">
                            {leadInitials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 truncate">
                              {lead.name}
                            </p>
                            <p className="text-xs text-slate-500 truncate flex items-center gap-2 mt-0.5">
                              <span>{lead.phone}</span>
                              <span className="text-slate-300">·</span>
                              <span>{lead.email}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* SERVICE */}
                      <td className="px-5 py-3.5">
                        <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                          {lead.service}
                        </span>
                      </td>

                      {/* DATE */}
                      <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                        {lead.createdAt
                          ? new Date(lead.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
                            lead.status
                          )}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {lead.status || "New"}
                        </span>
                      </td>

                      {/* ASSIGNED */}
                      <td className="px-5 py-3.5 text-xs text-slate-600">
                        {lead.assignedTo ? (
                          <span className="font-medium text-slate-800">
                            {lead.assignedTo}
                          </span>
                        ) : (
                          <span className="italic text-slate-400">Unassigned</span>
                        )}
                      </td>

                      {/* ACTION */}
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDrawer(lead);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition"
                        >
                          Review
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
            Showing {filteredLeads.length} of {leads.length} total leads
          </span>
          <span className="text-[11px] text-slate-400">
            Source: T-HOME Contact Requests & LPS Table
          </span>
        </div>
      </div>

      {/* SLIDE-OVER LEAD DETAIL DRAWER */}
      {activeLead && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={closeDrawer}
          />

          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
            {/* DRAWER HEADER */}
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  Lead Details
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  {activeLead.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* DRAWER BODY */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* CONTACT CARD */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
                <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Contact Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <a
                      href={`tel:${activeLead.phone}`}
                      className="hover:text-blue-600 font-medium"
                    >
                      {activeLead.phone || "Not provided"}
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <a
                      href={`mailto:${activeLead.email}`}
                      className="hover:text-blue-600 truncate"
                    >
                      {activeLead.email || "Not provided"}
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>
                      Submitted on{" "}
                      {activeLead.createdAt
                        ? new Date(activeLead.createdAt).toLocaleString("en-IN")
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* SERVICE & MESSAGE */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Requested Service
                </label>
                <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100 text-blue-900 text-sm font-semibold">
                  {activeLead.service}
                </div>
              </div>

              {activeLead.message && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Customer Message
                  </label>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-sm whitespace-pre-wrap">
                    {activeLead.message}
                  </div>
                </div>
              )}

              {/* EDIT STATUS & NOTES FORM */}
              <form onSubmit={handleSaveDrawer} className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Super Admin Management
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Lead Status
                  </label>
                  <select
                    value={drawerStatus}
                    onChange={(e) => setDrawerStatus(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-800"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed Won">Closed Won</option>
                    <option value="Closed Lost">Closed Lost</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Assign To Advisor / Agent
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma, Sales Team"
                    value={drawerAssigned}
                    onChange={(e) => setDrawerAssigned(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Internal Operational Notes
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Add follow-up notes, customer eligibility details, or bank discussion remarks..."
                    value={drawerNotes}
                    onChange={(e) => setDrawerNotes(e.target.value)}
                    className="w-full p-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={savingLead}
                    className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition disabled:opacity-50"
                  >
                    {savingLead ? "Saving..." : "Save Lead Updates"}
                  </button>
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
