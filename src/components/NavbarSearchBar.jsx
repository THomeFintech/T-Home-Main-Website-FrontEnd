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
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mobileModalOpen, setMobileModalOpen] = useState(false);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const mobileInputRef = useRef(null);
  const resultsListRef = useRef(null);

  // Global Ctrl+K / Cmd+K keyboard shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isMobile) {
          setMobileModalOpen(true);
        } else {
          setIsOpen(true);
          inputRef.current?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isMobile]);

  // Click outside listener to close desktop dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Focus mobile input when mobile modal opens
  useEffect(() => {
    if (mobileModalOpen) {
      const timer = setTimeout(() => {
        mobileInputRef.current?.focus();
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [mobileModalOpen]);

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

  const handleSelect = (item) => {
    setIsOpen(false);
    setMobileModalOpen(false);
    setQuery("");
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
      setIsOpen(false);
      setMobileModalOpen(false);
      inputRef.current?.blur();
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

  // ----------------------------------------------------
  // MOBILE SEARCH BUTTON & MODAL
  // ----------------------------------------------------
  if (isMobile) {
    return (
      <>
        <button
          type="button"
          onClick={() => setMobileModalOpen(true)}
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
          title="Search services and tools"
          aria-label="Search"
        >
          <Search className="h-[18px] w-[18px]" />
        </button>

        {mobileModalOpen && (
          <div className="fixed inset-0 z-[10000] flex flex-col bg-[#071328]/95 px-4 pt-6 pb-8 backdrop-blur-2xl">
            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <div className="relative flex flex-1 items-center">
                <Search className="pointer-events-none absolute left-3.5 h-5 w-5 text-white/50" />
                <input
                  ref={mobileInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search loans, tax, tools..."
                  className="h-11 w-full rounded-xl border border-white/20 bg-white/10 pl-11 pr-10 text-sm text-white placeholder-white/50 outline-none focus:border-[#4f8fff] focus:ring-2 focus:ring-[#4f8fff]/30"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      mobileInputRef.current?.focus();
                    }}
                    className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-white/70 hover:bg-white/30"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setMobileModalOpen(false);
                  setQuery("");
                }}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white/80 hover:bg-white/20"
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Results / Suggestions */}
            <div className="mt-4 flex-1 overflow-y-auto pr-1">
              <div className="mb-2 flex items-center justify-between text-xs font-medium text-white/50 px-1">
                <span>{query ? `Results (${filteredResults.length})` : "Popular Searches"}</span>
                {!query && (
                  <span className="flex items-center gap-1 text-[#60a5fa]">
                    <Sparkles className="h-3 w-3" /> Quick Access
                  </span>
                )}
              </div>

              {filteredResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Search className="mb-2 h-8 w-8 text-white/30" />
                  <p className="text-sm font-medium text-white/80">No results found for &ldquo;{query}&rdquo;</p>
                  <p className="mt-1 text-xs text-white/50">Try searching for &quot;home loan&quot;, &quot;emi&quot;, &quot;fssai&quot;, or &quot;gst&quot;</p>
                  <button
                    type="button"
                    onClick={() => handleSelect({ to: "/services" })}
                    className="mt-4 rounded-full bg-[#4f72e0] px-5 py-2 text-xs font-medium text-white"
                  >
                    Browse All Services →
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {filteredResults.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={`m-${item.id}`}
                        type="button"
                        onClick={() => handleSelect(item)}
                        className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
                          idx === selectedIndex ? "bg-[#4f72e0]/20 border border-[#4f72e0]/40" : "bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-semibold text-white">{item.title}</span>
                            <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${getCategoryBadgeClass(item.category)}`}>
                              {item.category}
                            </span>
                          </div>
                          <p className="truncate text-xs text-white/60">{item.description}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 shrink-0 text-white/40" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  // ----------------------------------------------------
  // DESKTOP SEARCH BAR (Inline beside notification bell)
  // ----------------------------------------------------
  return (
    <div ref={containerRef} className="relative">
      {/* Search Input Container */}
      <div
        className={`relative flex items-center transition-all duration-300 ${
          isOpen || isFocused
            ? "w-52 lg:w-60 xl:w-72"
            : "w-40 lg:w-48 xl:w-60"
        }`}
      >
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-white/50" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            setIsFocused(true);
            setIsOpen(true);
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={isFocused ? "Search services, tools..." : "Search..."}
          className="h-9 w-full rounded-full border border-white/20 bg-white/10 pl-9 pr-14 text-xs text-white placeholder-white/50 backdrop-blur-md transition-all duration-200 hover:border-white/30 hover:bg-white/15 focus:border-[#4f8fff] focus:bg-[rgba(9,22,52,0.96)] focus:outline-none focus:ring-2 focus:ring-[#4f8fff]/30 sm:text-sm"
          aria-label="Search services and tools"
          aria-expanded={isOpen}
        />

        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-white/70 hover:bg-white/30 hover:text-white"
            title="Clear search"
          >
            <X className="h-3 w-3" />
          </button>
        ) : !isFocused ? (
          <span className="pointer-events-none absolute right-2.5 hidden select-none items-center rounded border border-white/20 bg-white/5 px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-white/50 xl:flex">
            CTRL K
          </span>
        ) : null}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute right-0 sm:left-0 sm:right-auto top-full z-[100] mt-2 w-80 sm:w-96 rounded-2xl border border-white/20 bg-[rgba(8,20,45,0.96)] p-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.65)] backdrop-blur-3xl">
          {/* Dropdown Header */}
          <div className="mb-2 flex items-center justify-between px-2 pt-1 text-[11px] font-medium text-white/50">
            <span>{query ? `Found ${filteredResults.length} result${filteredResults.length === 1 ? "" : "s"}` : "Popular Searches"}</span>
            {!query && (
              <span className="flex items-center gap-1 text-[#60a5fa]">
                <Sparkles className="h-3 w-3" /> Quick Access
              </span>
            )}
          </div>

          {/* Results List */}
          <div
            ref={resultsListRef}
            className="max-h-[340px] space-y-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
          >
            {filteredResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
                <Search className="mb-2 h-7 w-7 text-white/30" />
                <p className="text-sm font-medium text-white/80">No results found for &ldquo;{query}&rdquo;</p>
                <p className="mt-1 text-xs text-white/50">Try searching for &quot;home loan&quot;, &quot;emi&quot;, &quot;fssai&quot;, or &quot;gst&quot;</p>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect({ to: "/services" });
                  }}
                  className="mt-3.5 rounded-full bg-[#4f72e0] px-4 py-1.5 text-xs font-medium text-white transition hover:bg-[#3d62d6]"
                >
                  Explore All Services →
                </button>
              </div>
            ) : (
              filteredResults.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === selectedIndex;

                return (
                  <div
                    key={`d-${item.id}`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(item);
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`group flex cursor-pointer items-center gap-3 rounded-xl p-2.5 transition-all duration-150 ${
                      isSelected
                        ? "bg-[#4f72e0]/25 border border-[#4f72e0]/50 shadow-sm"
                        : "hover:bg-white/10 border border-transparent"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        isSelected
                          ? "bg-[#4f8fff] text-white"
                          : "bg-white/10 text-white/80 group-hover:bg-[#4f8fff]/20 group-hover:text-[#4f8fff]"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
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
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

