import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  ExternalLink,
  MapPin,
  Clock,
  Users,
  IndianRupee,
  AlertCircle,
  RefreshCw,
  X,
  Building2,
  GraduationCap,
  Mail,
  FileText,
} from "lucide-react";
import {
  getCareerOpenings,
  createCareerOpening,
  updateCareerOpening,
  toggleCareerOpeningStatus,
  deleteCareerOpening,
} from "../../api/superAdminApi";

const DEPARTMENTS = [
  "Engineering",
  "Design & Creative",
  "Media & Production",
  "Marketing & Content",
  "Marketing & SEO",
  "Sales & Business Development",
  "Finance & Compliance",
  "Operations & HR",
  "General",
];

const EMPLOYMENT_TYPES = [
  "Internship",
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
];

const INITIAL_FORM = {
  title: "",
  department: "Engineering",
  location: "Hyderabad, India (Hybrid)",
  employment_type: "Internship",
  experience: "Fresher / Intern",
  openings_count: 1,
  salary_range: "",
  description: "",
  requirements: "",
  apply_email: "info@thome.co.in",
  is_active: true,
};

export default function SuperAdminCareers() {
  const [openings, setOpenings] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    internships: 0,
    fullTime: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Search & Filters
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit'
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadOpenings();
  }, []);

  async function loadOpenings() {
    try {
      setLoading(true);
      setError("");
      const res = await getCareerOpenings();
      if (res?.success && Array.isArray(res?.data)) {
        setOpenings(res.data);
        if (res.stats) {
          setStats(res.stats);
        }
      }
    } catch (err) {
      console.error("Failed to load career openings:", err);
      setError(err.message || "Failed to load career openings.");
    } finally {
      setLoading(false);
    }
  }

  // Filtered Openings
  const filteredOpenings = useMemo(() => {
    return openings.filter((item) => {
      const matchSearch =
        !search ||
        (item.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (item.department || "").toLowerCase().includes(search.toLowerCase()) ||
        (item.description || "").toLowerCase().includes(search.toLowerCase());

      const matchDept =
        selectedDept === "All" ||
        (item.department || "").toLowerCase() === selectedDept.toLowerCase();

      const matchType =
        selectedType === "All" ||
        (item.employment_type || "").toLowerCase() === selectedType.toLowerCase();

      const matchStatus =
        selectedStatus === "All" ||
        (selectedStatus === "Active" ? item.is_active : !item.is_active);

      return matchSearch && matchDept && matchType && matchStatus;
    });
  }, [openings, search, selectedDept, selectedType, selectedStatus]);

  // Unique departments for filter dropdown
  const availableDepts = useMemo(() => {
    const set = new Set(openings.map((o) => o.department).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [openings]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setModalMode("create");
    setEditingId(null);
    setFormData(INITIAL_FORM);
    setFormError("");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    setModalMode("edit");
    setEditingId(item.id);
    setFormData({
      title: item.title || "",
      department: item.department || "General",
      location: item.location || "Hyderabad, India (Hybrid)",
      employment_type: item.employment_type || "Full-time",
      experience: item.experience || "Fresher / Any",
      openings_count: item.openings_count || 1,
      salary_range: item.salary_range || "",
      description: item.description || "",
      requirements: item.requirements || "",
      apply_email: item.apply_email || "info@thome.co.in",
      is_active: item.is_active ?? true,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  // Save (Create or Update)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError("Job Title is required.");
      return;
    }

    try {
      setFormSubmitting(true);
      setFormError("");

      if (modalMode === "create") {
        await createCareerOpening(formData);
        setSuccessMsg(`"${formData.title}" posted successfully!`);
      } else {
        await updateCareerOpening(editingId, formData);
        setSuccessMsg(`"${formData.title}" updated successfully!`);
      }

      setIsModalOpen(false);
      await loadOpenings();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error("Form submit error:", err);
      setFormError(err.message || "Failed to save opening.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Toggle Active Status
  const handleToggleStatus = async (item) => {
    const nextState = !item.is_active;
    try {
      // Optimistic update
      setOpenings((prev) =>
        prev.map((o) => (o.id === item.id ? { ...o, is_active: nextState } : o))
      );

      await toggleCareerOpeningStatus(item.id, nextState);
      setSuccessMsg(`Opening status updated.`);
      setTimeout(() => setSuccessMsg(""), 3000);
      loadOpenings();
    } catch (err) {
      console.error("Failed to toggle status:", err);
      setError(err.message || "Failed to update status.");
      loadOpenings();
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteCareerOpening(deleteTarget.id);
      setSuccessMsg(`Opening "${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
      await loadOpenings();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error("Failed to delete opening:", err);
      setError(err.message || "Failed to delete opening.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Career Openings
            </h1>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
              {openings.length} Total
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Post and manage job vacancies displayed live on the public{" "}
            <Link
              to="/career"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-blue-600 hover:underline"
            >
              Careers page <ExternalLink className="h-3 w-3" />
            </Link>
            .
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadOpenings}
            className="flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-slate-700 shadow-sm transition hover:bg-slate-50"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Post New Opening
          </button>
        </div>
      </div>

      {/* SUCCESS & ERROR BANNERS */}
      {successMsg && (
        <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg("")} className="text-emerald-600 hover:text-emerald-800">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError("")} className="text-red-600 hover:text-red-800">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Postings</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <Briefcase className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{stats.total || openings.length}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Live on Website</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {openings.filter((o) => o.is_active).length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Drafts / Inactive</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-600">
            {openings.filter((o) => !o.is_active).length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Internships</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <GraduationCap className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-600">
            {openings.filter((o) => (o.employment_type || "").toLowerCase().includes("intern")).length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Full-time Roles</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <Building2 className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-purple-600">
            {openings.filter((o) => (o.employment_type || "").toLowerCase().includes("full")).length}
          </p>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by role title, department, or keyword..."
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            {availableDepts.map((dept) => (
              <option key={dept} value={dept}>
                Dept: {dept}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="All">All Types</option>
            {EMPLOYMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="All">All Status</option>
            <option value="Active">Active / Live</option>
            <option value="Inactive">Inactive / Hidden</option>
          </select>

          {(search || selectedDept !== "All" || selectedType !== "All" || selectedStatus !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedDept("All");
                setSelectedType("All");
                setSelectedStatus("All");
              }}
              className="h-10 rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* OPENINGS LIST */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16 text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-3 text-sm text-slate-500">Loading career openings...</p>
        </div>
      ) : filteredOpenings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <Briefcase className="h-12 w-12 text-slate-300" />
          <h3 className="mt-3 text-base font-semibold text-slate-800">No career openings found</h3>
          <p className="mt-1 text-sm text-slate-500">
            {openings.length === 0
              ? "Get started by posting your first job vacancy or internship."
              : "No openings match your current search and filter criteria."}
          </p>
          {openings.length === 0 && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              + Post First Opening
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {filteredOpenings.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col justify-between rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
                item.is_active ? "border-slate-200" : "border-slate-200 bg-slate-50/60 opacity-80"
              }`}
            >
              <div>
                {/* Header row: Badges + Status Switch */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 border border-blue-200">
                      {item.department || "General"}
                    </span>
                    <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[11px] font-semibold text-purple-700 border border-purple-200">
                      {item.employment_type || "Full-time"}
                    </span>
                  </div>

                  {/* Status Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(item)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                      item.is_active
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                    }`}
                    title={item.is_active ? "Click to deactivate/hide from website" : "Click to activate/publish on website"}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        item.is_active ? "bg-emerald-500" : "bg-slate-400"
                      }`}
                    />
                    {item.is_active ? "Live" : "Inactive"}
                  </button>
                </div>

                {/* Title */}
                <h3 className="mt-3 text-lg font-bold text-slate-900 line-clamp-1" title={item.title}>
                  {item.title}
                </h3>

                {/* Meta details */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item.location || "Hyderabad, India"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{item.experience || "Fresher / Any"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>
                      {item.openings_count || 1} {item.openings_count === 1 ? "Opening" : "Openings"}
                    </span>
                  </div>

                  {item.salary_range && (
                    <div className="flex items-center gap-2 font-medium text-emerald-700">
                      <IndianRupee className="h-3.5 w-3.5 shrink-0" />
                      <span>{item.salary_range}</span>
                    </div>
                  )}
                </div>

                {/* Description snippet */}
                {item.description && (
                  <p className="mt-3 text-xs leading-relaxed text-slate-500 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Card Footer: Action Buttons */}
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-[11px] text-slate-400">
                  {new Date(item.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="flex h-8 items-center gap-1.5 rounded-md border border-slate-200 px-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition"
                    title="Delete opening"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {modalMode === "create" ? "Post New Career Opening" : "Edit Career Opening"}
                </h2>
                <p className="text-xs text-slate-500">
                  This opening will be published directly on the T-HOME Careers page.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-700">
                {formError}
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm} className="mt-4 space-y-4">
              {/* Job Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Full Stack Developer Intern, Senior Accountant, Loan Officer"
                  className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Grid: Department & Employment Type */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Employment Type</label>
                  <select
                    value={formData.employment_type}
                    onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                    className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    {EMPLOYMENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid: Location & Experience */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Hyderabad, India (Hybrid) or Remote"
                    className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Experience Required</label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="e.g. Fresher / Intern, 0-1 Years, 2+ Years"
                    className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Grid: Vacancies & Salary */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Vacancies / Openings Count</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.openings_count}
                    onChange={(e) => setFormData({ ...formData, openings_count: Number(e.target.value) || 1 })}
                    className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Salary / Stipend Range</label>
                  <input
                    type="text"
                    value={formData.salary_range}
                    onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                    placeholder="e.g. ₹15,000 - ₹25,000 / month or Competitive"
                    className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Resume/Application Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700">Application Email</label>
                <input
                  type="email"
                  value={formData.apply_email}
                  onChange={(e) => setFormData({ ...formData, apply_email: e.target.value })}
                  placeholder="info@thome.co.in"
                  className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700">Role Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief overview of responsibilities and what the role entails..."
                  className="mt-1 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-xs font-semibold text-slate-700">Key Skills & Requirements</label>
                <textarea
                  rows="3"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="Required technologies, education, communication skills..."
                  className="mt-1 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="modal_is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="modal_is_active" className="text-sm font-medium text-slate-700 cursor-pointer">
                  Publish opening live on the Careers page immediately
                </label>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {formSubmitting && <RefreshCw className="h-4 w-4 animate-spin" />}
                  {modalMode === "create" ? "Post Opening" : "Update Opening"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Delete Career Opening?</h3>
            </div>

            <p className="mt-3 text-sm text-slate-600">
              Are you sure you want to delete <span className="font-semibold text-slate-900">&ldquo;{deleteTarget.title}&rdquo;</span>? This will permanently remove it from both the admin dashboard and the public website.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
              >
                {deleting && <RefreshCw className="h-4 w-4 animate-spin" />}
                Delete Opening
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

