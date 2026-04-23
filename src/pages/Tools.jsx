import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Calculator, Shield, TrendingUp } from "lucide-react";

import ContactForm from "../components/ContactForm";
import LoanForm from "../components/LoanForm";
import Meter from "../components/Meter";
import Decision from "../components/Decision";
import BankCards from "../components/BankCards";
import Proceed from "../components/Proceed";
import Amortization from "../components/Amortization";
import EMIPage from "./Emi";

export default function Tools() {
  const location = useLocation();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [contactData, setContactData] = useState({});
  const [loanData, setLoanData] = useState({});
  const [predictionResult, setPredictionResult] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);
  const [showBankCards, setShowBankCards] = useState(false);
  const [isSelectingBank, setIsSelectingBank] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tool = params.get("tool");
    if (tool === "loan-prediction") {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      if (isLoggedIn) {
        setStep(1);
      } else {
        navigate("/login");
      }
    }
  }, [location.search, navigate]);

  useEffect(() => {
  if (location.pathname === "/tools" && !location.search) {
    setStep(0);
  }
}, [location.pathname, location.search]);

useEffect(() => {
  if (location.pathname === "/tools" && location.state?.resetTools) {
    setStep(0);
    setContactData({});
    setLoanData({});
    setPredictionResult(null);
    setSelectedBank(null);
    setShowBankCards(false);
    setIsSelectingBank(false);
  }
}, [location]);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleLoanResult = (data, formValues) => {
    console.log("Prediction result:", data);
    console.log("Form values:", formValues);

    setPredictionResult(data);
    setLoanData(formValues);

    if (["Approved", "Partially Approved"].includes(data?.decision)) {
      setShowBankCards(true);
    } else {
      setShowBankCards(false);
    }
  };

  const formattedBanks = useMemo(() => {
    if (!predictionResult?.recommended_banks) return [];

    console.log("Recommended banks from backend:", predictionResult.recommended_banks);

    return predictionResult.recommended_banks.map((b, i) => ({
      id: i + 1,
      name: b.bank_name || "Bank",
      bank_name: b.bank_name || "Bank",
      logo: b.logo || b.bank_logo || "",
      interestRate: `${Number(b.interest_rate || 0)}%`,
      monthlyEmi: `₹${Number(b.monthly_emi || b.emi || 0).toLocaleString("en-IN")}`,
      interest_rate: Number(b.interest_rate || 0),
      monthly_emi: Number(b.monthly_emi || b.emi || 0),
      original: b,
    }));
  }, [predictionResult]);

  const handleBankSelect = async (bank) => {
    try {
      setIsSelectingBank(true);
      console.log("Selected bank from UI:", bank);

      const loanId = localStorage.getItem("loan_id");

      if (!loanId) {
        alert("Loan ID is missing. Please complete the loan step first.");
        return;
      }

      const interestRate = Number(
        bank.interest_rate ??
          String(bank.interestRate || "0").replace("%", "")
      );

      const monthlyEmi = Number(
        bank.monthly_emi ??
          String(bank.monthlyEmi || "0").replace(/[₹,]/g, "")
      );

      const payload = {
        loan_id: String(loanId),
        bank_name: bank.bank_name || bank.name || "",
        interest_rate: Number.isNaN(interestRate) ? 0 : interestRate,
        monthly_emi: Number.isNaN(monthlyEmi) ? 0 : monthlyEmi,
      };

      if (!payload.bank_name) {
        alert("Bank name is missing.");
        return;
      }

      console.log("Calling /applications/select-bank with payload:", payload);

      const response = await fetch(`${API_BASE}/applications/select-bank`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Select bank API response:", data);

      if (!response.ok) {
        throw new Error(data?.detail || "Failed to select bank");
      }

      const bankSelectionId = data?.bank_selection_id;

      if (!bankSelectionId) {
        throw new Error("bank_selection_id missing in response");
      }

      localStorage.setItem("selected_bank", JSON.stringify(bank));
      localStorage.setItem("bank_selection_id", String(bankSelectionId));

      setSelectedBank(bank);
      setStep(3);
    } catch (error) {
      console.error("Select bank API error:", error);
      alert(error.message || "Failed to select bank");
    } finally {
      setIsSelectingBank(false);
    }
  };

  const toolCards = [
    {
      title: "EMI Intelligence System",
      description:
        "Calculate your monthly EMI and understand your complete repayment plan with our advanced algorithms.",
      buttonText: "Calculate Now",
      icon: Calculator,
      onClick: () => setStep(5),
      theme: {
        border: "border-amber-500/20",
        cardBorder: "border-amber-500/10",
        text: "text-amber-500",
        hoverBg: "hover:bg-amber-500/10",
        btnBorder: "border-amber-500/30",
        glow:
          "hover:shadow-[0_0_56px_rgba(245,158,11,0.35),0_16px_36px_rgba(0,0,0,0.35)] active:shadow-[0_0_42px_rgba(245,158,11,0.28),0_12px_28px_rgba(0,0,0,0.32)]",
      },
    },
    {
      title: "Loan Prediction System",
      description:
        "Understand your chances of getting a loan with smart predictions powered by your financial details.",
      buttonText: "Check Eligibility",
      icon: Shield,
      onClick: () => {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

        if (isLoggedIn) {
          setStep(1);
        } else {
          navigate("/login");
        }
      },
      theme: {
        border: "border-blue-500/20",
        cardBorder: "border-blue-500/10",
        text: "text-blue-500",
        hoverBg: "hover:bg-blue-500/10",
        btnBorder: "border-blue-500/30",
        glow:
          "hover:shadow-[0_0_56px_rgba(59,130,246,0.35),0_16px_36px_rgba(0,0,0,0.35)] active:shadow-[0_0_42px_rgba(59,130,246,0.28),0_12px_28px_rgba(0,0,0,0.32)]",
      },
    },
    {
      title: "Balance Transfer Calculator",
      description:
        "See how much you can save by switching to a lower interest loan over the remaining loan tenure.",
      buttonText: "Calculate Now",
      icon: TrendingUp,
      onClick: () => navigate("/coming-soon"),
      theme: {
        border: "border-emerald-500/20",
        cardBorder: "border-emerald-500/10",
        text: "text-emerald-500",
        hoverBg: "hover:bg-emerald-500/10",
        btnBorder: "border-emerald-500/30",
        glow:
          "hover:shadow-[0_0_56px_rgba(16,185,129,0.35),0_16px_36px_rgba(0,0,0,0.35)] active:shadow-[0_0_42px_rgba(16,185,129,0.28),0_12px_28px_rgba(0,0,0,0.32)]",
      },
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#040b1f] font-['Outfit'] text-white">
      <div className="pointer-events-none absolute left-1/2 top-[-10%] h-[500px] w-[1000px] -translate-x-1/2 rounded-full bg-blue-500/16 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(56,92,188,0.22)_0%,_transparent_72%)]" />

      {step === 0 && (
        <section className="relative z-10 px-6 pb-24 pt-36">
          <div className="mx-auto max-w-[1200px] text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
              Financial Tools
            </h1>

            <p className="mx-auto max-w-2xl text-base font-normal leading-relaxed text-gray-400 md:text-lg">
              Smart calculators and tools to help you make informed financial decisions with precision and clarity.
            </p>

            <div className="mt-16 grid gap-6 text-left lg:grid-cols-3">
              {toolCards.map((tool, i) => {
                const Icon = tool.icon;

                return (
                  <div
                    key={i}
                    onClick={tool.onClick}
                    className={`
                      group relative min-h-[380px] cursor-pointer rounded-[18px]
                      border ${tool.theme.cardBorder}
                      bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.03))]
                      p-8 backdrop-blur-[34px]
                      shadow-[0_20px_40px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.20)]
                      transition-all duration-300 transform-gpu
                      hover:-translate-y-1 hover:border-white/30
                      hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.2),rgba(255,255,255,0.06))]
                      active:translate-y-0 active:scale-[0.99] active:border-white/35
                      ${tool.theme.glow}
                    `}
                  >
                    <div
                      className={`mb-8 flex h-12 w-12 items-center justify-center rounded-lg border bg-white/[0.03] transition-all duration-300 group-hover:scale-110 group-hover:bg-white/[0.08] group-active:scale-105 ${tool.theme.border}`}
                    >
                      <Icon className={`h-5 w-5 ${tool.theme.text}`} strokeWidth={1.5} />
                    </div>

                    <h2 className="mb-4 text-2xl font-semibold tracking-normal text-white transition-colors duration-300 group-hover:text-white/95">
                      {tool.title}
                    </h2>

                    <p className="mb-10 flex-grow text-[15px] font-light leading-relaxed text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
                      {tool.description}
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        tool.onClick();
                      }}
                      className={`
                        w-full rounded-lg border bg-white/[0.02] py-3.5 text-[15px] font-medium
                        backdrop-blur-xl transition-all duration-300
                        group-hover:bg-white/[0.08]
                        group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.28)]
                        active:scale-[0.99]
                        ${tool.theme.btnBorder} ${tool.theme.text} ${tool.theme.hoverBg}
                      `}
                    >
                      {tool.buttonText}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <div className="relative z-10">
        {step === 1 && (
          <ContactForm
            contactData={contactData}
            setContactData={setContactData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {step === 2 && (
          <section className="px-4 pb-20 pt-32">
            <div className="mx-auto max-w-[1400px]">
              <div className="grid gap-6 rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-3 shadow-[0_22px_50px_rgba(0,0,0,0.32)] backdrop-blur-2xl sm:p-4 lg:grid-cols-[1.6fr_1fr]">
                <LoanForm
                  loanData={loanData}
                  setLoanData={setLoanData}
                  onSubmit={handleLoanResult}
                  onBack={prevStep}
                />
                <div className="sticky top-28 h-fit space-y-5">
                  <Meter result={predictionResult} />
                  <Decision result={predictionResult} />
                </div>
              </div>

              {showBankCards && formattedBanks.length > 0 && (
                <div className="mt-12">
                  <BankCards
                    banks={formattedBanks}
                    selectedBank={selectedBank}
                    onSelectBank={handleBankSelect}
                    isLoading={isSelectingBank}
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {step === 3 && (
          <Proceed
            selectedBank={selectedBank}
            contactData={contactData}
            loanData={loanData}
            result={predictionResult}
            onNext={nextStep}
            onBack={() => setStep(2)}
          />
        )}

        {step === 4 && (
          <Amortization
            selectedBank={selectedBank}
            loanData={loanData}
            result={predictionResult}
            onBack={prevStep}
          />
        )}

        {step === 5 && <EMIPage onBack={() => setStep(0)} />}

        {step === 6 && (
          <div className="px-4 pt-40 text-center text-white">
            <div className="mx-auto max-w-2xl rounded-[22px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03))] px-8 py-12 shadow-[0_20px_45px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
              <h1 className="text-4xl font-bold">Balance Transfer Calculator</h1>
              <p className="mt-6 text-lg text-gray-500">Feature coming soon 🚀</p>
              <button
                onClick={() => setStep(0)}
                className="mt-8 rounded-xl border border-white/10 bg-white/5 px-10 py-4 font-semibold text-blue-400 transition-all hover:bg-white/10"
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
