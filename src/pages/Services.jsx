import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home, User, Building2, KeyRound, ArrowRightLeft,
  FileText, Briefcase, ShieldCheck, Search, ChevronRight, ChevronDown
} from "lucide-react";

const data = [
  {
    title: "Loans",
    key: "loans",
    count: 5,
    icon: <Home size={24} className="text-blue-500 stroke-[2.5]" />, 
    items: [
      { name: "Home Loan", tag: "POPULAR", description: "Compare loan offers from multiple banks and get the lowest interest rates with fast approvals.", icon: <Home size={24} />, link: "/home-loans" },
      { name: "Mortgage Loan", tag: "RECOMMENDED", description: "Flexible mortgage solutions tailored to your unique financial requirements.", icon: <KeyRound size={24} />, link: "/mortgage-loan" },
      { name: "LAP (Loan Against Property)", description: "Unlock the value of your property with flexible loans and competitive interest rates.", icon: <Building2 size={24} />, link: "/loan-against-property" },
      { name: "PL (Personal Loan)", description: "Quick approvals and flexible repayment options for your personal financial needs.", icon: <User size={24} />, link: "/personal-loans" },
      { name: "BT (Balance Transfer)", description: "Lower your existing interest rates seamlessly.", icon: <ArrowRightLeft size={24} />, link: "/balance-transfer" },
    ],
  },
  {
    title: "Tax & Compliance",
    key: "tax",
    count: 3,
    icon: <FileText size={24} className="text-blue-500 stroke-[2.5]" />,
    items: [
      { name: "ITR", tag: "POPULAR", description: "File your ITR easily with expert guidance and accurate tax calculations.", icon: <FileText size={24} />, link: "/itr-filing" },
      { name: "GST", description: "End-to-end GST filing, registration, and compliance support for businesses.", icon: <ShieldCheck size={24} />, link: "/gst-registration" },
      { name: "Pan-Aadhaar", description: "Complete PAN and Aadhaar linking without confusion through guided support.", icon: <FileText size={24} />, link: "/pan-aadhaar-linking" },
    ],
  },
  { 
    title: "Business Services",
    key: "business",
    count: 3,
    icon: <Briefcase size={24} className="text-blue-500 stroke-[2.5]" />,
    items: [
      { name: "Company Registration", tag: "POPULAR", description: "Start your company with complete registration assistance and legal support.", icon: <Briefcase size={24} />, link: "/company-registration" },
      { name: "UDYAM/MSME", description: "Specialized support and funding solutions designed for MSME businesses.", icon: <Briefcase size={24} />, link: "/udyam-msme-registration" },
      { name: "Food License", description: "Get FSSAI registration and licensing support quickly and accurately.", icon: <ShieldCheck size={24} />, link: "/food-license" },
    ],
  },
];

export default function Services() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  // Track expanded/collapsed state for each section
  const [openSections, setOpenSections] = useState(() => {
    // By default, all open
    const obj = {};
    data.forEach(section => { obj[section.key] = true; });
    return obj;
  });

  const filteredData = (activeTab === "all"
    ? data
    : data.filter((s) => s.key === activeTab)
  )
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return true;
        return `${section.title} ${item.name} ${item.description}`.toLowerCase().includes(query);
      }),
    }))
    .filter((section) => section.items.length > 0);

  const handleToggleSection = (key) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    /* Background matched to contact.jsx base: #020617 */
    <div
      className="min-h-screen text-slate-100 font-['Outfit',sans-serif] selection:bg-blue-500/30 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(1200px 680px at 20% -10%, rgba(90,140,255,0.18), transparent 62%), radial-gradient(980px 580px at 100% 0%, rgba(36,107,198,0.14), transparent 60%), linear-gradient(180deg, #071327 0%, #08162b 100%)",
      }}
    >
      
      {/* 1. HERO GLOW (Matched to ContactPage Hero) */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* 2. MAIN SECTION GLOW (Matched to ContactPage Main Section) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(120,165,255,0.12)_0%,_transparent_70%)] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 py-[100px] max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-[100px]">

        {/* HEADER SECTION */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-1 text-white/95" style={{fontFamily: "'Outfit', sans-serif"}}>
            Explore All Services
          </h1>
          <p className="text-gray-400 text-sm sm:text-base font-medium">
            Browse financial and business solutions tailored for you
          </p>
        </div>

        {/* GLASS FILTER & SEARCH BAR (Updated glass levels) */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center mb-5 sm:mb-6 gap-3 sm:gap-4">
          <div className="flex w-full md:w-auto overflow-x-auto rounded-xl border border-white/15 bg-white/[0.05] p-1.5 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.08)]">
            {["All Services", "Loans", "Tax & Compliance", "Business Services"].map((label) => {
              const key = label === "All Services" ? "all" : label.split(' ')[0].toLowerCase();
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition-all duration-300 ${
                    activeTab === key
                      ? "bg-white/[0.1] text-white border border-white/10"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search services..."
              className="w-full rounded-xl border border-white/15 bg-white/[0.06] pl-12 pr-4 py-3 text-base outline-none backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.08)] placeholder:text-gray-500 transition-all focus:border-blue-400"
            />
          </div>
        </div>

        {/* SECTIONS */}
        <div className="space-y-6">
          {filteredData.map((section) => (
            <div key={section.key} className="overflow-hidden rounded-xl sm:rounded-2xl border border-white/15 bg-white/[0.05] backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.06)] ring-1 ring-white/5">
              
              {/* CATEGORY HEADER */}
              <button
                type="button"
                className="flex w-full items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-4 text-left transition hover:bg-white/[0.06] sm:px-6 lg:px-8"
                aria-expanded={openSections[section.key]}
                onClick={() => handleToggleSection(section.key)}
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    {section.icon}
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <h2 className="text-base sm:text-xl font-bold text-white tracking-wide">{section.title}</h2>
                    <span className="text-[9px] sm:text-[10px] bg-blue-500/10 text-blue-400 px-2.5 sm:px-3 py-1 rounded-full border border-blue-500/20 uppercase font-bold tracking-widest">
                      {section.count} services
                    </span>
                  </div>
                </div>
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] transition-transform duration-300"
                  style={{ transform: openSections[section.key] ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                >
                  <ChevronDown size={18} className="text-gray-300" />
                </span>
              </button>

              {/* SERVICE CARDS GRID (collapsible) */}
              {openSections[section.key] && (
                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="grid gap-4 md:grid-cols-2">
                    {section.items.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          if (item.link) {
                            navigate(item.link);
                          } else {
                            navigate(
                              section.key === "loans"
                                ? item.name === "Balance Transfer"
                                  ? "/coming-soon"
                                  : "/tools?tool=loan-prediction"
                                : item.link
                            );
                          }
                        }}
                        className="group relative flex cursor-pointer items-center justify-between gap-4 overflow-hidden rounded-xl border border-white/10 bg-white/[0.05] px-4 py-4 transition-all duration-500 hover:border-blue-400/30 hover:bg-white/[0.09] sm:px-5"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/[0.03] to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex gap-3 sm:gap-4 items-center relative z-10 min-w-0">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.07] shadow-[0_6px_18px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.08)] transition-all group-hover:border-blue-400/30">
                            <div className="text-gray-400 group-hover:text-blue-400 transition-colors flex items-center justify-center">
                              {item.icon}
                            </div>
                          </div>

                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base font-bold text-white group-hover:text-blue-100 transition-colors">
                                {item.name}
                              </h3>
                              {item.tag && (
                                <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold tracking-tight border ${
                                  item.tag === "POPULAR" 
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                }`}>
                                  {item.tag}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-400 text-xs sm:text-sm max-w-[360px] line-clamp-2 font-medium group-hover:text-gray-300 transition-colors">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 items-end">
                          <button className="hidden items-center gap-2 rounded-lg px-3 py-2 text-base font-semibold text-blue-400 opacity-80 transition-all group-hover:translate-x-1 group-hover:opacity-100 sm:flex relative z-10 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
                            View Details <ChevronRight size={14} />
                          </button>
                          
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* VIEW ALL */}
                  <div className="mt-4 sm:mt-5 flex justify-center">
                    {/* Placeholder for future 'View All' button */}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
