import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home, User, Building2, KeyRound, ArrowRightLeft, GraduationCap,
  FileText, Briefcase, ShieldCheck, Search, ChevronRight, ChevronDown
} from "lucide-react";

const data = [
  {
    title: "Loans",
    key: "loans",
    count: 5,
    icon: <Home size={20} className="text-blue-500 stroke-[2.5]" />, 
    items: [
     
      { name: "Home Loans", tag: "POPULAR", description: "Low interest rates for your dream home with easy processing", icon: <Home size={20} />, link: "/home-loans" },
      { name: "Personal Loans", description: "Quick approvals and flexible repayment options", icon: <User size={20} />, link: "/personal-loans" },
      { name: "Loan Against Property", description: "Unlock the value of your property to fund your needs", icon: <Building2 size={20} />, link: "/loan-against-property" },
      { name: "Mortgage Loan", tag: "RECOMMENDED", description: "Secure and robust financing options against real estate", icon: <KeyRound size={20} />, link: "/mortgage-loan" },
      {
  name: "Balance Transfer",
  description: "Lower your existing interest rates seamlessly",
  icon: <ArrowRightLeft size={20} />,
  link: "/coming-soon"
},
      
    ],
  },
  {
    title: "Tax & Compliance",
    key: "tax",
    count: 3,
    icon: <FileText size={20} className="text-blue-500 stroke-[2.5]" />,
    items: [
      { name: "ITR Filing", tag: "POPULAR", description: "Low interest rates for your dream home with easy processing", icon: <FileText size={20} />, link: "/itr-filing" },
      { name: "GST Registration & Filing", description: "Quick approvals and flexible repayment options", icon: <ShieldCheck size={20} />, link: "/gst-registration" },
      { name: "PAN & Aadhaar Linking", description: "Unlock the value of your property to fund your needs", icon: <FileText size={20} />, link: "/pan-aadhaar-linking" },
    ],
  },
  { 
    title: "Business Registrations",
    key: "business",
    count: 3,
    icon: <Briefcase size={20} className="text-blue-500 stroke-[2.5]" />,
    items: [
      { name: "Business Registration", tag: "POPULAR", description: "Low interest rates for your dream home with easy processing", icon: <Briefcase size={20} />, link: "/company-registration" },
      { name: "UDYAM / MSME Registration", description: "Quick approvals and flexible repayment options", icon: <Briefcase size={20} />, link: "/udyam-msme-registration" },
      { name: "Food License Registration", description: "Unlock the value of your property to fund your needs", icon: <ShieldCheck size={20} />, link: "/food-license" },
    ],
  },
];

export default function Services() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  const filteredData =
    activeTab === "all"
      ? data
      : data.filter((s) => s.key === activeTab);

  return (
    /* Background matched to contact.jsx base: #020617 */
    <div
      className="min-h-screen text-slate-100 font-['Outfit',sans-serif] selection:bg-blue-500/30 relative overflow-hidden"
      style={{ background: "radial-gradient(64.07% 159.91% at 50% 0%, #112240 0%, #0B1220 80%)" }}
    >
      
      {/* 1. HERO GLOW (Matched to ContactPage Hero) */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* 2. MAIN SECTION GLOW (Matched to ContactPage Main Section) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(120,165,255,0.12)_0%,_transparent_70%)] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">

        {/* HEADER SECTION */}
        <div className="mb-5 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-1 text-white/95">
            Explore All Services
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm font-medium">
            Browse financial and business solutions tailored for you
          </p>
        </div>

        {/* GLASS FILTER & SEARCH BAR (Updated glass levels) */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center mb-5 sm:mb-6 gap-3 sm:gap-4">
          <div className="flex w-full md:w-auto overflow-x-auto rounded-xl border border-white/15 bg-white/[0.05] p-1 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.08)]">
            {["All Services", "Loans", "Tax & Compliance", "Business Services"].map((label) => {
              const key = label === "All Services" ? "all" : label.split(' ')[0].toLowerCase();
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`whitespace-nowrap px-3 sm:px-4 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all duration-300 ${
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
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              placeholder="Search services..."
              className="w-full rounded-xl border border-white/15 bg-white/[0.06] pl-11 pr-4 py-2.5 text-sm outline-none backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.08)] placeholder:text-gray-500 transition-all focus:border-blue-400"
            />
          </div>
        </div>

        {/* SECTIONS */}
        <div className="space-y-6">
          {filteredData.map((section) => (
            <div key={section.key} className="overflow-hidden rounded-xl sm:rounded-2xl border border-white/15 bg-white/[0.05] backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.06)] ring-1 ring-white/5">
              
              {/* CATEGORY HEADER */}
              <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="flex items-center justify-center rounded-lg sm:rounded-xl border border-white/15 bg-white/[0.07] p-1.5 sm:p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    {section.icon}
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <h2 className="text-base sm:text-xl font-bold text-white tracking-wide">{section.title}</h2>
                    <span className="text-[9px] sm:text-[10px] bg-blue-500/10 text-blue-400 px-2.5 sm:px-3 py-1 rounded-full border border-blue-500/20 uppercase font-bold tracking-widest">
                      {section.count} services
                    </span>
                  </div>
                </div>
                <ChevronDown size={18} className="text-gray-500 cursor-pointer hidden sm:block" />
              </div>

              {/* SERVICE CARDS GRID */}
              <div className="p-3 sm:p-4 lg:px-8 lg:py-5">
                <div className="grid md:grid-cols-2 gap-3">
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
                      className="group relative flex cursor-pointer items-center justify-between overflow-hidden rounded-xl border border-white/10 bg-white/[0.05] px-3 sm:px-5 py-3 transition-all duration-500 hover:border-blue-400/30 hover:bg-white/[0.09]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/[0.03] to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="flex gap-3 sm:gap-4 items-center relative z-10 min-w-0">
                        <div className="min-w-[38px] sm:min-w-[44px] rounded-lg border border-white/10 bg-white/[0.07] px-2 py-2 sm:py-2.5 text-center shadow-[0_6px_18px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.08)] transition-all group-hover:border-blue-400/30">
                          <div className="text-gray-400 group-hover:text-blue-400 transition-colors">
                            {item.icon}
                          </div>
                        </div>

                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-[14px] sm:text-[16px] font-bold text-white group-hover:text-blue-100 transition-colors">
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
                          <p className="text-gray-400 text-[11px] sm:text-[12px] max-w-[300px] line-clamp-2 sm:line-clamp-1 font-medium group-hover:text-gray-300 transition-colors">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <button className="text-blue-400 text-xs font-bold hidden sm:flex items-center gap-2 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all relative z-10 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
                        View Details <ChevronRight size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* VIEW ALL */}
                <div className="mt-4 sm:mt-5 flex justify-center">
                  
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
