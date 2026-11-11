import { useEffect, useState, useMemo } from "react";
import {
  Briefcase,
  MapPin,
  Clock,
  Users,
  IndianRupee,
  ChevronDown,
  ChevronUp,
  Mail,
  ArrowRight,
  Search,
  Sparkles,
  Zap,
  TrendingUp,
  Award,
  Check,
  Copy,
} from "lucide-react";
import SEO from "../components/SEO";
import { getPublicCareerOpenings } from "../api/careerApi";

const DEFAULT_ROLES = [
  {
    id: 1,
    title: "Full Stack Developer Intern",
    department: "Engineering",
    location: "Hyderabad, India (Hybrid)",
    employment_type: "Internship",
    experience: "Fresher / Intern",
    openings_count: 2,
    salary_range: "₹15,000 - ₹25,000 / mo",
    description: "Build cutting-edge user interfaces and scalable APIs for T-HOME's core fintech lending and advisory engines.",
    requirements: "Hands-on experience with React, Node.js, Express, PostgreSQL / Prisma. Strong JavaScript fundamentals.",
    apply_email: "info@thome.co.in",
  },
  {
    id: 2,
    title: "Backend Developer Intern",
    department: "Engineering",
    location: "Hyderabad, India (Hybrid)",
    employment_type: "Internship",
    experience: "Fresher / Intern",
    openings_count: 2,
    salary_range: "₹15,000 - ₹25,000 / mo",
    description: "Design secure backend microservices, banking API integrations, and low-latency database queries.",
    requirements: "Solid proficiency in Node.js, REST API design, database indexing, and OAuth/JWT authentication.",
    apply_email: "info@thome.co.in",
  },
  {
    id: 3,
    title: "Graphic Designer Intern",
    department: "Design",
    location: "Hyderabad, India (Hybrid)",
    employment_type: "Internship",
    experience: "Fresher / Intern",
    openings_count: 1,
    salary_range: "₹10,000 - ₹20,000 / mo",
    description: "Create brand identity assets, marketing visuals, product infographics, and social media campaigns.",
    requirements: "Proficiency in Figma, Adobe Photoshop, and Illustrator. Strong eye for typography and layout.",
    apply_email: "info@thome.co.in",
  },
  {
    id: 4,
    title: "Video Editor Intern",
    department: "Creative & Media",
    location: "Hyderabad, India (Hybrid)",
    employment_type: "Internship",
    experience: "Fresher / Intern",
    openings_count: 1,
    salary_range: "₹12,000 - ₹20,000 / mo",
    description: "Produce impactful video content, social reels, financial explainer videos, and product walkthroughs.",
    requirements: "Experience with Premiere Pro, After Effects, or DaVinci Resolve. Good sense of pacing and sound design.",
    apply_email: "info@thome.co.in",
  },
  {
    id: 5,
    title: "Database Intern",
    department: "Engineering",
    location: "Hyderabad, India (Hybrid)",
    employment_type: "Internship",
    experience: "Fresher / Intern",
    openings_count: 1,
    salary_range: "₹15,000 - ₹22,000 / mo",
    description: "Maintain database integrity, design normalized schemas, and tune complex SQL queries across loan modules.",
    requirements: "Understanding of relational databases (PostgreSQL/MySQL), schema design, and query optimization.",
    apply_email: "info@thome.co.in",
  },
  {
    id: 6,
    title: "Content Intern",
    department: "Marketing",
    location: "Hyderabad, India (Hybrid)",
    employment_type: "Internship",
    experience: "Fresher / Intern",
    openings_count: 1,
    salary_range: "₹10,000 - ₹18,000 / mo",
    description: "Craft engaging financial articles, educational guides, website copy, and customer success stories.",
    requirements: "Excellent English writing and storytelling skills. Ability to simplify complex financial topics.",
    apply_email: "info@thome.co.in",
  },
  {
    id: 7,
    title: "SEO Intern",
    department: "Marketing",
    location: "Hyderabad, India (Hybrid)",
    employment_type: "Internship",
    experience: "Fresher / Intern",
    openings_count: 1,
    salary_range: "₹10,000 - ₹18,000 / mo",
    description: "Optimize organic search rankings, conduct keyword analysis, and monitor technical SEO metrics.",
    requirements: "Familiarity with Google Search Console, Google Analytics, meta tags, and on-page optimization.",
    apply_email: "info@thome.co.in",
  },
];

const RESUME_EMAIL = "info@thome.co.in";

export default function Career() {
  const [openings, setOpenings] = useState(DEFAULT_ROLES);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedDept, setSelectedDept] = useState("All");
  const [search, setSearch] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchCareers() {
      try {
        setLoading(true);
        const res = await getPublicCareerOpenings();
        if (!cancelled && res?.success && Array.isArray(res?.data) && res.data.length > 0) {
          setOpenings(res.data);
        }
      } catch (err) {
        console.warn("Using default career openings fallback:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCareers();
    return () => {
      cancelled = true;
    };
  }, []);

  // Unique departments for filter pills
  const departments = useMemo(() => {
    const set = new Set(openings.map((o) => o.department).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [openings]);

  // Filtered openings
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

      return matchSearch && matchDept;
    });
  }, [openings, search, selectedDept]);

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(RESUME_EMAIL);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const getApplyMailto = (item) => {
    const subject = encodeURIComponent(`Application for ${item.title} - T-HOME`);
    const email = item.apply_email || RESUME_EMAIL;
    const body = encodeURIComponent(
      `Hello T-HOME Hiring Team,\n\nI am excited to apply for the ${item.title} position at T-HOME Fintech.\n\nPlease find my resume attached.\n\nKey Highlights:\n- Name: \n- Contact: \n- Education/Experience: \n- LinkedIn/Portfolio: \n\nLooking forward to hearing from you!\n\nBest regards,\n`
    );
    return `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden text-white font-['Outfit',sans-serif]"
      style={{
        background:
          "radial-gradient(1200px 680px at 20% -10%, rgba(90,140,255,0.2), transparent 65%), radial-gradient(980px 580px at 100% 0%, rgba(36,107,198,0.16), transparent 60%), linear-gradient(180deg, #071327 0%, #08162b 100%)",
      }}
    >
      <SEO
        title="Careers at T-HOME | Build the Future of Fintech"
        description="Join T-HOME Fintech. Explore open positions in engineering, product, design, and growth. Fast-track your career with high-impact work."
        path="/career"
      />

      {/* BACKGROUND GLOW BLOBS */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[480px] w-[1000px] -translate-x-1/2 rounded-full bg-[#2f73ff]/20 blur-[150px]" />
        <div className="absolute top-[35%] right-[5%] h-[350px] w-[350px] rounded-full bg-[#3b82f6]/10 blur-[140px]" />
        <div className="absolute bottom-[20%] left-[5%] h-[320px] w-[320px] rounded-full bg-[#4f84ff]/12 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-36 pb-24 sm:px-6 lg:px-8 md:pt-40">
        {/* ========================================================
            HERO SECTION
        ======================================================== */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-300 backdrop-blur-xl shadow-inner">
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            CAREERS AT T-HOME
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Build the Future of{" "}
            <span className="bg-gradient-to-r from-[#4f8fff] via-[#60a5fa] to-[#93c5fd] bg-clip-text text-transparent">
              Fintech
            </span>{" "}
            With Us
          </h1>

          <p className="mt-4 text-xl font-semibold text-yellow-300 sm:text-2xl">
            We&apos;re Hiring Exceptional Talents & Interns
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#c8d5ef] sm:text-lg">
            Join our mission to democratize financial intelligence, loan accessibility, and automated tax services across India. Work on real products from Day 1.
          </p>

          {/* QUICK CTA */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#openings"
              className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(120deg,#3b82f6_0%,#1d4ed8_100%)] px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(37,99,235,0.4)] transition-all hover:brightness-110 hover:shadow-[0_12px_30px_rgba(37,99,235,0.5)]"
            >
              Explore {openings.length} Openings
              <ArrowRight className="h-4 w-4" />
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white/90 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
            >
              {copiedEmail ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-400">Email Copied!</span>
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span>Send Resume Directly</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ========================================================
            WHY WORK AT T-HOME (3 PERKS)
        ======================================================== */}
        <div className="mx-auto mt-16 grid max-w-5xl gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(25,40,90,0.6)_0%,rgba(14,24,60,0.6)_100%)] p-6 shadow-lg backdrop-blur-xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">Rapid Ownership</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#c8d5ef]">
              No busywork. Interns and full-time engineers ship real features used by thousands of loan applicants.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(25,40,90,0.6)_0%,rgba(14,24,60,0.6)_100%)] p-6 shadow-lg backdrop-blur-xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">Direct Mentorship</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#c8d5ef]">
              Work side-by-side with senior fintech engineers and leadership. Learn system architecture & clean code.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(25,40,90,0.6)_0%,rgba(14,24,60,0.6)_100%)] p-6 shadow-lg backdrop-blur-xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">Stipend & PPO Offers</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#c8d5ef]">
              Competitive monthly stipends with Pre-Placement Offers (PPOs) for top-performing interns upon graduation.
            </p>
          </div>
        </div>

        {/* ========================================================
            OPENINGS SECTION
        ======================================================== */}
        <div id="openings" className="mt-24 scroll-mt-24">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Current Open Positions
                </h2>
                <span className="rounded-full border border-blue-400/30 bg-blue-500/20 px-3 py-0.5 text-xs font-semibold text-blue-300">
                  {filteredOpenings.length} Active
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-400">
                All roles are open for immediate joining at our Hyderabad hub (Hybrid/In-office).
              </p>
            </div>

            {/* SEARCH INPUT */}
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search roles or skills..."
                className="h-10 w-full rounded-xl border border-white/15 bg-white/5 pl-9 pr-4 text-xs text-white placeholder-white/40 outline-none backdrop-blur-md transition-all focus:border-blue-400 focus:bg-white/10 sm:text-sm"
              />
            </div>
          </div>

          {/* DEPARTMENT PILLS FILTER */}
          <div className="mt-6 flex flex-wrap items-center gap-2 pb-2">
            {departments.map((dept) => {
              const isSelected = selectedDept === dept;
              return (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setSelectedDept(dept)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-[0_4px_16px_rgba(37,99,235,0.4)]"
                      : "border border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {dept}
                </button>
              );
            })}
          </div>

          {/* OPENINGS GRID (2-COLUMN PREMIUM CARDS) */}
          <div className="mt-6">
            {filteredOpenings.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5 py-16 text-center">
                <Briefcase className="h-10 w-10 text-white/30" />
                <h3 className="mt-3 text-base font-semibold text-white">No openings match your search</h3>
                <p className="mt-1 text-xs text-white/50">
                  Try clearing your search query or selecting &quot;All&quot; departments.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSelectedDept("All");
                  }}
                  className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-1 lg:grid-cols-2">
                {filteredOpenings.map((role) => {
                  const isExpanded = expandedId === role.id;

                  return (
                    <div
                      key={role.id || role.title}
                      className="group flex flex-col justify-between rounded-2xl border border-white/12 bg-[linear-gradient(180deg,rgba(18,32,74,0.75)_0%,rgba(10,20,52,0.85)_100%)] p-6 shadow-[0_8px_28px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-200 hover:border-blue-400/50 hover:shadow-[0_12px_36px_rgba(37,99,235,0.22)]"
                    >
                      <div>
                        {/* Top badges */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="rounded-md border border-blue-400/30 bg-blue-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-blue-300">
                              {role.department || "General"}
                            </span>
                            <span className="rounded-md border border-purple-400/30 bg-purple-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-purple-300">
                              {role.employment_type || "Internship"}
                            </span>
                          </div>

                          {role.openings_count && role.openings_count > 1 && (
                            <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                              <Users className="h-3 w-3" />
                              {role.openings_count} Openings
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="mt-3.5 text-xl font-bold text-white transition-colors group-hover:text-blue-300">
                          {role.title}
                        </h3>

                        {/* Meta Tags */}
                        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-300">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                            <span>{role.location || "Hyderabad, India"}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                            <span>{role.experience || "Fresher / Intern"}</span>
                          </div>

                          {role.salary_range && (
                            <div className="flex items-center gap-1 font-semibold text-emerald-400">
                              <IndianRupee className="h-3.5 w-3.5 shrink-0" />
                              <span>{role.salary_range}</span>
                            </div>
                          )}
                        </div>

                        {/* Description snippet */}
                        {role.description && (
                          <p className="mt-3 text-xs leading-relaxed text-[#c0cee8] line-clamp-2">
                            {role.description}
                          </p>
                        )}

                        {/* Expandable Requirements */}
                        {isExpanded && (
                          <div className="mt-4 space-y-3 rounded-xl border border-white/10 bg-[#071328]/80 p-4 text-xs">
                            {role.description && (
                              <div>
                                <span className="font-semibold text-blue-300 uppercase tracking-wider text-[10px]">
                                  What You&apos;ll Do:
                                </span>
                                <p className="mt-1 leading-relaxed text-slate-300">
                                  {role.description}
                                </p>
                              </div>
                            )}

                            {role.requirements && (
                              <div>
                                <span className="font-semibold text-blue-300 uppercase tracking-wider text-[10px]">
                                  Requirements &amp; Skills:
                                </span>
                                <p className="mt-1 leading-relaxed text-slate-300">
                                  {role.requirements}
                                </p>
                              </div>
                            )}

                            <div className="border-t border-white/10 pt-2 text-[11px] text-slate-400">
                              Send your portfolio/resume directly to{" "}
                              <strong className="text-white">{role.apply_email || RESUME_EMAIL}</strong>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card Footer: Action Buttons */}
                      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : role.id)}
                          className="flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white transition"
                        >
                          <span>{isExpanded ? "Hide Details" : "View Details"}</span>
                          {isExpanded ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                          )}
                        </button>

                        <a
                          href={getApplyMailto(role)}
                          className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(120deg,#3b82f6_0%,#1d4ed8_100%)] px-4 py-2 text-xs font-bold text-white shadow-[0_4px_16px_rgba(37,99,235,0.35)] transition-all hover:brightness-110"
                        >
                          Apply Now
                          <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
            BOTTOM DIRECT APPLICATION CARD
        ======================================================== */}
        <div className="mt-20 rounded-3xl border border-blue-500/30 bg-[linear-gradient(135deg,rgba(20,38,88,0.8)_0%,rgba(10,18,50,0.9)_100%)] p-8 text-center shadow-2xl backdrop-blur-2xl sm:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-300">
            <Mail className="h-7 w-7" />
          </div>

          <h3 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
            Don&apos;t See Your Dream Role Above?
          </h3>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
            We are always looking for visionary builders, designers, and growth drivers. Drop your CV directly to our hiring team and let us know what you want to build.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white">
              <span>Send Resume to:</span>
              <a
                href={`mailto:${RESUME_EMAIL}?subject=General Application - T-HOME Careers`}
                className="text-yellow-300 underline hover:text-yellow-200"
              >
                {RESUME_EMAIL}
              </a>
            </div>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="flex items-center gap-1.5 rounded-full border border-blue-400/40 bg-blue-500/20 px-4 py-2.5 text-xs font-semibold text-blue-200 hover:bg-blue-500/30 transition"
            >
              {copiedEmail ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Email</span>
                </>
              )}
            </button>
          </div>

          <p className="mx-auto mt-6 max-w-lg text-xs leading-relaxed text-slate-400">
            Build your future with T-Home Fintech! Be a part of our journey to create accessible, intelligent financial tools for India.
          </p>
        </div>
      </div>
    </div>
  );
}
