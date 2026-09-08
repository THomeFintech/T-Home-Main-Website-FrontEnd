import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BadgeIndianRupee,
  CircleDollarSign,
  Building2,
  CalendarDays,
  Percent,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Send,
  SquarePen,
} from "lucide-react";
import { getBankLogo } from "../utils/Banklogos";

function formatINR(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

function formatMonths(value) {
  return `${Number(value || 0)} months`;
}

function formatPercent(value) {
  return `${Number(value || 0)}%`;
}

export default function BalanceTransferReview() {
  const navigate = useNavigate();

  const loanForm = JSON.parse(localStorage.getItem("btLoanForm") || "{}");
  const loanResult = JSON.parse(localStorage.getItem("btLoanResult") || "{}");
  const offerEvaluation = JSON.parse(localStorage.getItem("btOfferEvaluation") || "[]");

  const loanRows = useMemo(
    () => [
      ["Original Loan Amount", formatINR(loanForm.original_principal), CircleDollarSign],
      ["Amount Paid", formatINR(loanForm.amount_paid), BadgeIndianRupee],
      ["Outstanding Principal", formatINR(loanResult.outstanding_principal), Building2],
      ["Remaining Tenure", formatMonths(loanForm.remaining_tenure_months), CalendarDays],
      ["Current Interest Rate", formatPercent(loanForm.current_interest_rate), Percent],
      ["Monthly Income", formatINR(loanForm.net_monthly_income), Wallet],
      ["Credit Score", String(loanForm.cibil_score || "-"), ShieldCheck],
    ],
    [loanForm, loanResult]
  );

  const manualOffers = useMemo(() => {
    return offerEvaluation
      .filter((item) => item.offer_source === "USER PROVIDED")
      .map((item, index) => ({
        id: `Offer ${index + 1}`,
        bank: item.bank_name,
        logo: getBankLogo(item.bank_name),
        rate: `${Number(item.interest_rate || 0)}%`,
        tenure: `${Number(item.tenure_months || 0)} months`,
        amount: formatINR(item.loan_amount_offered),
        fee: formatINR(item.processing_fee || item.total_fees || 0),
        emi: formatINR(item.emi),
        tagColor: "bg-[#0f5fbf]",
      }));
  }, [offerEvaluation]);

  const usedSuggestOffersOnly = useMemo(() => {
    const hasManualOffers = offerEvaluation.some(
      (item) => item.offer_source === "USER PROVIDED"
    );
    const hasAiOffers = offerEvaluation.some(
      (item) => item.offer_source === "AI SUGGESTED"
    );

    return !hasManualOffers && hasAiOffers;
  }, [offerEvaluation]);

  return (
    <section className="relative min-h-screen overflow-hidden px-4 pb-12 pt-28 sm:px-6 md:pt-32 lg:px-8 lg:pt-36">
      <div className="pointer-events-none absolute inset-0 bg-[#030a1a]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(44,78,173,0.36),transparent_58%)]" />

      <div className="relative z-10 mx-auto max-w-[1320px] rounded-[16px] border border-white/15 bg-[linear-gradient(90deg,rgba(255,255,255,0.11)_0%,rgba(255,255,255,0.06)_100%)] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
        <div className="mx-auto max-w-[1180px]">
          <div className="text-center">
            <h1 className="text-[42px] font-semibold text-white">Review Your Details</h1>
            <p className="mt-1 text-[13px] text-white/65">
              Confirm your loan and bank offer details before we analyze your balance transfer.
            </p>
          </div>

          <div className="mt-7 rounded-[10px] border border-slate-200/70 bg-[#f8fafc] p-4 text-[#1f2937] shadow-[0_10px_28px_rgba(0,0,0,0.16)] sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[34px] font-semibold">Your Current Loan</h2>
              <button
                type="button"
                onClick={() => navigate("/balance-transfer/details")}
                className="inline-flex items-center gap-1 text-[13px] font-medium text-[#2467ff]"
              >
                <SquarePen size={13} /> Edit Loan Details
              </button>
            </div>

            <div className="overflow-hidden rounded-[8px] border border-slate-200">
              {loanRows.map(([label, value, Icon], idx) => (
                <div
                  key={label}
                  className={`flex items-center justify-between px-4 py-2.5 text-[14px] ${
                    idx !== loanRows.length - 1 ? "border-b border-slate-200" : ""
                  }`}
                >
                  <p className="inline-flex items-center gap-2 text-slate-600">
                    <Icon size={14} className="text-[#2b72ff]" /> {label}
                  </p>
                  <p className="font-semibold text-slate-700">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-[10px] border border-slate-200/70 bg-[#f8fafc] p-4 text-[#1f2937] shadow-[0_10px_28px_rgba(0,0,0,0.16)] sm:p-5">
            <h2 className="text-[34px] font-semibold">Added Bank Offers</h2>

            <div className="mt-3 space-y-3">
              {manualOffers.length > 0 ? (
                manualOffers.map((offer) => (
                  <div key={offer.id} className="rounded-[8px] border border-slate-200 bg-white p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-[14px] font-semibold text-slate-700">{offer.id} :</p>
                        {offer.logo ? (
                          <img
                            src={offer.logo}
                            alt={offer.bank}
                            className="h-8 w-8 rounded-full bg-white p-1 object-contain"
                          />
                        ) : null}
                        <span
                          className={`inline-flex h-6 items-center rounded-sm px-2 text-[10px] font-semibold text-white ${offer.tagColor}`}
                        >
                          {offer.bank}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
                      <Info label="Interest Rate" value={offer.rate} />
                      <Info label="Tenure" value={offer.tenure} />
                      <Info label="Loan Amount" value={offer.amount} />
                      <Info label="Processing Fees" value={offer.fee} />
                      <Info label="Estimated New EMI" value={offer.emi} valueClass="text-emerald-600" />
                    </div>
                  </div>
                ))
              ) : usedSuggestOffersOnly ? (
                <div className="rounded-[8px] border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
                  <p className="text-[16px] font-semibold text-slate-700">
                    You haven&apos;t added any offers yet.
                  </p>
                  <p className="mt-2 text-[13px] text-slate-500">
                    Don&apos;t worry — we&apos;ll compare your current loan with our best suggested banks and show you the most beneficial options.
                  </p>
                </div>
              ) : (
                <div className="rounded-[8px] border border-slate-200 bg-white p-4 text-center text-[14px] text-slate-500">
                  No bank offers added yet.
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 rounded-[10px] border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] px-4 py-4 text-white sm:px-5">
            <h3 className="text-[18px] font-semibold">What We Will Analyze</h3>
            <div className="mt-3 grid grid-cols-1 gap-2 text-[13px] text-white/80 md:grid-cols-2">
              <p className="inline-flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400" /> EMI comparison across banks
              </p>
              <p className="inline-flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400" /> Total cost and savings calculation
              </p>
              <p className="inline-flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400" /> Best time for balance transfer
              </p>
              <p className="inline-flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400" /> Approval probability and risk assessment
              </p>
            </div>
            <div className="mt-3 rounded-[8px] border border-[#4d7cff]/35 bg-[#1d3f8b]/20 px-3 py-2 text-[12px] text-[#8fb8ff]">
              <p className="inline-flex items-center gap-2">
                <Lock size={13} /> Your data is encrypted and will not affect your credit score.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/balance-transfer/offers")}
              className="rounded-[9px] border border-white/25 bg-white px-5 py-2.5 text-[14px] font-medium text-[#0f172a] transition hover:bg-slate-100"
            >
              ← Back to Add Bank Offers
            </button>
            <button
              type="button"
              onClick={() => navigate("/balance-transfer/analysis")}
              className="inline-flex items-center gap-2 rounded-[9px] bg-[#1f6bff] px-6 py-2.5 text-[14px] font-medium text-white transition hover:bg-[#1c5ee0]"
            >
              <Send size={14} /> Run Balance Transfer Analysis
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Info({ label, value, valueClass = "text-slate-700" }) {
  return (
    <div className="rounded-[7px] bg-[#f1f5f9] p-2.5">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className={`mt-1 text-[16px] font-semibold ${valueClass}`}>{value}</p>
    </div>
  );
}
