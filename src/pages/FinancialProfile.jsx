import React from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import { LENDER_AUTHORITY_LINE } from "../constants/legalNotices";

/* Financial profile page (Change Document 4.2: Financial Profile & Affordability Assessment). */
export default function FinancialProfile() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen pt-24 font-sans text-slate-100"
      style={{
        background:
          "radial-gradient(1200px 680px at 20% -10%, rgba(90,140,255,0.18), transparent 62%), radial-gradient(980px 580px at 100% 0%, rgba(36,107,198,0.14), transparent 60%), linear-gradient(180deg, #071327 0%, #08162b 100%)",
      }}
    >
      <SEO
        title="Financial Profile and Affordability Assessment"
        description="Evaluate net income, recurring expenses and existing obligations to find a comfortable EMI budget before applying."
        path="/financial-profile"
      />

      <div className="mx-auto max-w-4xl px-6 py-16 text-center">
        <p className="mb-3 text-xs tracking-wide text-blue-400">FINANCIAL PLANNING</p>
        <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">
          Financial Profile &amp; Affordability Assessment
        </h1>
        <p className="mx-auto mb-6 max-w-2xl text-sm leading-relaxed text-gray-400 md:text-base">
          Evaluate net income, recurring expenses and existing obligations to find a comfortable EMI
          budget before applying.
        </p>
        <p className="mx-auto mb-8 max-w-2xl text-xs text-gray-400">{LENDER_AUTHORITY_LINE}</p>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate("/emi-calculator")}
            className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold shadow-lg transition hover:bg-blue-700"
          >
            Open EMI Calculator
          </button>
          <button
            onClick={() => navigate("/tools?tool=loan-prediction")}
            className="rounded-full border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-semibold transition hover:bg-white/20"
          >
            Check Indicative Eligibility
          </button>
        </div>
      </div>
    </div>
  );
}
