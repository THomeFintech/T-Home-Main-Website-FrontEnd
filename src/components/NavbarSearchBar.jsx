import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  Home,
  Briefcase,
  Building2,
  Landmark,
  Repeat,
  Building,
  Banknote,
  BadgePercent,
  FileText,
  Utensils,
  Link as LucideLink,
  Calculator,
  ShieldCheck,
  Layers,
  Info,
  Phone,
  Users,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const SEARCH_INDEX = [
  // Services - Loans
  {
    id: "home-loan",
    title: "Home Loan",
    category: "Service",
    description: "Low-interest housing loans with flexible tenure & paperless process",
    keywords: ["home", "housing", "mortgage", "house", "flat", "plot", "construction", "buy home"],
    to: "/home-loans",
    icon: Home,
    popular: true,
  },
  {
    id: "personal-loan",
    title: "Personal Loan",
    category: "Service",
    description: "Instant personal loans for medical, travel, wedding & emergency needs",
    keywords: ["personal", "instant", "cash", "salary", "emergency", "unsecured", "quick loan"],
    to: "/personal-loans",
    icon: Briefcase,
    popular: true,
  },
  {
    id: "mortgage-loan",
    title: "Mortgage Loan",
    category: "Service",
    description: "High-value loans against residential or commercial properties",
    keywords: ["mortgage", "collateral", "property loan", "secured loan"],
    to: "/mortgage-loan",
    icon: Building2,
  },
  {
    id: "loan-against-property",
    title: "Loan Against Property",
    category: "Service",
    description: "Leverage real estate equity for business growth or personal goals",
    keywords: ["lap", "property", "asset", "commercial", "residential", "equity"],
    to: "/loan-against-property",
    icon: Landmark,
  },
  {
    id: "balance-transfer",
    title: "Balance Transfer",
    category: "Service",
    description: "Transfer high-interest loans for lower EMIs and better terms",
    keywords: ["balance transfer", "refinance", "lower emi", "switch loan", "bt", "reduce interest"],
    to: "/balance-transfer",
    icon: Repeat,
    popular: true,
  },
  // Services - Business & Compliance
  {
    id: "company-registration",
    title: "Company Registration",
    category: "Service",
    description: "Pvt Ltd, LLP, OPC, and Partnership firm registration services",
    keywords: ["company", "pvt ltd", "llp", "business", "incorporation", "startup", "firm"],
    to: "/company-registration",
    icon: Building,
  },
  {
    id: "gst-registration",
    title: "GST Registration & Filing",
    category: "Service",
    description: "New GSTIN registration and expert monthly/quarterly tax filings",
    keywords: ["gst", "gstin", "tax", "goods and service tax", "filing", "returns"],
    to: "/gst-registration",
    icon: Banknote,
  },
  {
    id: "udyam-msme",
    title: "UDYAM / MSME Registration",
    category: "Service",
    description: "Government recognized MSME certificate for subsidies and bank benefits",
    keywords: ["udyam", "msme", "small business", "ssi", "government subsidy", "priority lending"],
    to: "/udyam-msme-registration",
    icon: BadgePercent,
  },
  {
    id: "itr-filing",
    title: "ITR Tax Filing",
    category: "Service",
    description: "Expert-assisted Income Tax Return filing for individuals & businesses",
    keywords: ["itr", "income tax", "tax return", "ca filing", "tds", "refund", "form 16"],
    to: "/itr-filing",
    icon: FileText,
    popular: true,
  },
  {
    id: "food-license",
    title: "Food License (FSSAI)",
    category: "Service",
    description: "FSSAI registration & state/central license for food businesses",
    keywords: ["fssai", "food license", "restaurant", "cafe", "cloud kitchen", "food safety"],
    to: "/food-license",
    icon: Utensils,
  },
  {
    id: "pan-aadhaar",
    title: "PAN & Aadhaar Linking",
    category: "Service",
    description: "Check status and complete mandatory Aadhaar-PAN linking",
    keywords: ["pan", "aadhaar", "uidai", "nsdl", "link pan", "link aadhaar"],
    to: "/pan-aadhaar-linking",
    icon: LucideLink,
  },
  // Financial Tools
  {
    id: "loan-eligibility-calculator",
    title: "Loan Eligibility Calculator",
    category: "Tool",
    description: "Calculate borrowing limit and maximum loan eligibility in seconds",
    keywords: ["eligibility", "calculator", "loan prediction", "how much loan", "borrow", "approval"],
    to: "/tools?tool=loan-prediction",
    icon: Calculator,
    popular: true,
  },
  {
    id: "emi-calculator",
    title: "EMI Calculator",
    category: "Tool",
    description: "Calculate monthly installments, total interest & amortization schedule",
    keywords: ["emi", "monthly payment", "interest calculator", "installment", "amortization"],
    to: "/emi-calculator",
    icon: Calculator,
    popular: true,
  },
  {
    id: "cibil-score",
    title: "Free Credit Score / CIBIL",
    category: "Tool",
    description: "Check your CIBIL score instantly with personalized loan suggestions",
    keywords: ["cibil", "credit score", "credit report", "credit rating", "experian", "crif"],
    to: "/get-cibil-score",
    icon: ShieldCheck,
    popular: true,
  },
  // Quick Links
  {
    id: "all-services",
    title: "Explore All Services",
    category: "Quick Link",
    description: "Browse full catalog of 11+ loan, tax, and registration services",
    keywords: ["all services", "services", "catalogue", "offerings"],
    to: "/services",
    icon: Layers,
  },
  {
    id: "about-us",
    title: "About T-HOME",
    category: "Quick Link",
    description: "Learn about T-HOME's fintech vision, partners, and team",
    keywords: ["about", "company", "team", "mission", "vision"],
    to: "/about",
    icon: Info,
  },
  {
    id: "contact-support",
    title: "Contact & Support",
    category: "Quick Link",
    description: "Speak with a financial advisor or reach our customer care desk",
    keywords: ["contact", "support", "help", "phone", "email", "advisors"],
    to: "/contact",
    icon: Phone,
  },
  {
    id: "career",
    title: "Careers",
    category: "Quick Link",
    description: "Join T-HOME — browse openings in tech, sales, and operations",
    keywords: ["career", "jobs", "hiring", "work with us", "apply"],
    to: "/career",
    icon: Briefcase,
  },
  {
    id: "collaborate",
    title: "Collaborate / Partner",
    category: "Quick Link",
    description: "Become a DSA, channel partner, or referral associate with T-HOME",
    keywords: ["collaborate", "partner", "dsa", "channel partner", "affiliate"],
    to: "/collaborate",
    icon: Users,
  },
];

export default function NavbarSearchBar({ isMobile = false }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const resultsListRef = useRef(null);

  // Global Ctrl+K / Cmd+K keyboard shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Focus input and lock body scroll when modal opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 60);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  // Filtered search results
  const filteredResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return SEARCH_INDEX.filter((item) => item.popular);
    }

    return SEARCH_INDEX.map((item) => {
      let score = 0;
      const titleLower = item.title.toLowerCase();
      const descLower = item.description.toLowerCase();
      const catLower = item.category.toLowerCase();

      // Highest priority: Title matches
      if (titleLower === trimmed) {
        score += 100;
      } else if (titleLower.startsWith(trimmed)) {
        score += 70;
      } else if (titleLower.includes(trimmed)) {
        score += 50;
      }

      // Keyword matches
      for (const kw of item.keywords) {
        const kwLower = kw.toLowerCase();
        if (kwLower === trimmed) {
          score += 40;
        } else if (kwLower.startsWith(trimmed)) {
          score += 30;
        } else if (kwLower.includes(trimmed)) {
          score += 20;
        }
      }

      // Category matches
      if (catLower.includes(trimmed)) {
        score += 15;
      }

      // Description matches
      if (descLower.includes(trimmed)) {
        score += 10;
      }

      return { item, score };
    })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item);
  }, [query]);

  // Keep selectedIndex in bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    if (resultsListRef.current && resultsListRef.current.children[selectedIndex]) {
      resultsListRef.current.children[selectedIndex].scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
  };

  const handleSelect = (item) => {
    handleClose();
    navigate(item.to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        filteredResults.length === 0 ? 0 : (prev + 1) % filteredResults.length
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        filteredResults.length === 0
          ? 0
          : (prev - 1 + filteredResults.length) % filteredResults.length
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredResults.length > 0 && filteredResults[selectedIndex]) {
        handleSelect(filteredResults[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleClose();
    }
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case "Tool":
        return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
      case "Service":
        return "bg-[#4f72e0]/20 text-[#7ca2ff] border-[#4f72e0]/35";
      default:
        return "bg-purple-500/15 text-purple-300 border-purple-500/30";
    }
  };

  return (
    <>
      {/* Search Icon Button in Navbar */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#4f8fff]/40"
        title="Search services & tools (Ctrl + K)"
        aria-label="Search"
      >
        <Search className="h-[18px] w-[18px]" />
      </button>

      {/* Global Command Palette / Search Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[10000] flex items-start justify-center bg-black/70 p-3 pt-14 sm:p-4 sm:pt-20 backdrop-blur-md transition-opacity"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div
            ref={containerRef}
            className="relative flex w-full max-w-2xl flex-col rounded-2xl border border-white/20 bg-[rgba(8,20,45,0.96)] shadow-[0_25px_70px_rgba(0,0,0,0.7)] backdrop-blur-3xl overflow-hidden"
          >
            {/* Modal Search Bar Header */}
            <div className="relative flex items-center border-b border-white/10 px-4 py-3 sm:px-5 sm:py-3.5">
              <Search className="pointer-events-none h-5 w-5 shrink-0 text-white/50" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search loans, tax filing, financial tools, services..."
                className="ml-3 w-full bg-transparent text-sm sm:text-base text-white placeholder-white/40 outline-none"
              />

              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-white/70 hover:bg-white/25 hover:text-white"
                  title="Clear"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : (
                <kbd className="ml-2 hidden rounded border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/50 sm:inline-block">
                  ESC
                </kbd>
              )}

              <button
                type="button"
                onClick={handleClose}
                className="ml-2 flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white"
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Results / Suggestions Container */}
            <div className="flex max-h-[60vh] flex-col overflow-y-auto p-2 sm:p-3 scrollbar-thin scrollbar-thumb-white/20">
              <div className="mb-2 flex items-center justify-between px-2 pt-1 text-xs font-medium text-white/50">
                <span>
                  {query
                    ? `Found ${filteredResults.length} result${filteredResults.length === 1 ? "" : "s"}`
                    : "Popular Searches & Quick Links"}
                </span>
                {!query && (
                  <span className="flex items-center gap-1 text-[#60a5fa]">
                    <Sparkles className="h-3 w-3" /> Quick Access
                  </span>
                )}
              </div>

              {filteredResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                  <Search className="mb-2 h-8 w-8 text-white/30" />
                  <p className="text-sm font-medium text-white/80">
                    No results found for &ldquo;{query}&rdquo;
                  </p>
                  <p className="mt-1 text-xs text-white/50">
                    Try searching for &quot;home loan&quot;, &quot;emi&quot;, &quot;fssai&quot;, or &quot;gst&quot;
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSelect({ to: "/services" })}
                    className="mt-4 rounded-full bg-[#4f72e0] px-5 py-2 text-xs font-medium text-white transition hover:bg-[#3d62d6]"
                  >
                    Browse All Services →
                  </button>
                </div>
              ) : (
                <div ref={resultsListRef} className="space-y-1">
                  {filteredResults.map((item, idx) => {
                    const Icon = item.icon;
                    const isSelected = idx === selectedIndex;

                    return (
                      <div
                        key={item.id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelect(item);
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`group flex cursor-pointer items-center gap-3 rounded-xl p-2.5 sm:p-3 transition-all duration-150 ${
                          isSelected
                            ? "bg-[#4f72e0]/25 border border-[#4f72e0]/50 shadow-sm"
                            : "hover:bg-white/10 border border-transparent"
                        }`}
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                            isSelected
                              ? "bg-[#4f8fff] text-white"
                              : "bg-white/10 text-white/80 group-hover:bg-[#4f8fff]/20 group-hover:text-[#4f8fff]"
                          }`}
                        >
                          <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`truncate text-sm font-medium transition-colors ${
                                isSelected ? "text-white" : "text-white/90 group-hover:text-white"
                              }`}
                            >
                              {item.title}
                            </span>

                            <span
                              className={`shrink-0 rounded-full border px-1.5 py-0.2 text-[9px] font-medium ${getCategoryBadgeClass(
                                item.category
                              )}`}
                            >
                              {item.category}
                            </span>
                          </div>

                          <p className="truncate text-xs text-white/60 group-hover:text-white/75">
                            {item.description}
                          </p>
                        </div>

                        <ArrowRight
                          className={`h-4 w-4 shrink-0 transition-all ${
                            isSelected
                              ? "translate-x-0 text-white opacity-100"
                              : "-translate-x-1 text-white/30 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Keyboard Shortcuts Footer (Desktop) */}
            <div className="hidden sm:flex items-center justify-between border-t border-white/10 px-4 py-2.5 text-[11px] text-white/50 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <span>
                  <kbd className="rounded border border-white/20 bg-white/10 px-1 py-0.5 text-[10px]">↑</kbd>{" "}
                  <kbd className="rounded border border-white/20 bg-white/10 px-1 py-0.5 text-[10px]">↓</kbd> to navigate
                </span>
                <span>
                  <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-[10px]">↵</kbd> to select
                </span>
                <span>
                  <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-[10px]">ESC</kbd> to close
                </span>
              </div>
              <span className="text-[#60a5fa] font-medium">T-HOME Quick Search</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
