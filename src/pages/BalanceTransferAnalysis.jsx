import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Shield,
  CircleDollarSign,
  TrendingDown,
  BadgeCheck,
  Lock,
  Brain,
  FileBarChart2,
  Send,
} from "lucide-react";
import { BT_API_BASE } from "../config";
import { getBankLogo } from "../utils/Banklogos";

function formatINR(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

function getApprovalText(probability) {
  const p = Number(probability || 0);
  if (p >= 80) return "High";
  if (p >= 50) return "Medium";
  return "Low";
}

function getApprovalPercent(probability) {
  return `${Math.round(Number(probability || 0))}%`;
}

export default function BalanceTransferAnalysis() {
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loanResult = JSON.parse(localStorage.getItem("btLoanResult") || "{}");
  const loanForm = JSON.parse(localStorage.getItem("btLoanForm") || "{}");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const loanReference = localStorage.getItem("btLoanReference");

        if (!loanReference) {
          setError("Loan reference missing.");
          return;
        }

        const response = await fetch(
  `${BT_API_BASE}/loan/${loanReference}/report`
);

if (!response.ok) {
  throw new Error("Failed to load report");
}

const result = await response.json();
console.log("REPORT API RESPONSE:", result);

setReport(result);
localStorage.setItem("btFinalReport", JSON.stringify(result));
      } catch (err) {
        setError(err?.response?.data?.detail || "Failed to load report.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  const recommendedLogo = useMemo(
    () => getBankLogo(report?.recommended_bank_name),
    [report]
  );

  const metrics = useMemo(() => {
    if (!report) return [];

    const currentEmi =
      report?.bank_comparisons?.find((item) => item.offer_source === "CURRENT BANK")?.emi ||
      loanResult?.current_emi ||
      0;

    const recommendedBankRow =
      report?.bank_comparisons?.find(
        (item) => item.bank_name === report.recommended_bank_name
      ) || {};

    const newEmi = recommendedBankRow?.emi || 0;
    const emiReduction = Math.max(Number(currentEmi || 0) - Number(newEmi || 0), 0);

    return [
      {
        title: "Current Loan",
        k1: "Current EMI",
        v1: formatINR(currentEmi),
        k2: "Total Outflow",
        v2: formatINR(report.current_bank_outflow),
        icon: Shield,
      },
      {
        title: "New Plan",
        k1: "New EMI",
        v1: formatINR(newEmi),
        k2: "New Total Outflow",
        v2: formatINR(report.recommended_bank_outflow),
        icon: CircleDollarSign,
      },
      {
        title: "Your Benefits",
        k1: "Net Savings",
        v1: formatINR(report.best_net_savings),
        k2: "EMI Reduction",
        v2: `${formatINR(emiReduction)}/month`,
        icon: TrendingDown,
        accent: "text-emerald-500",
      },
      {
        title: "Approval Chance",
        k1: "Credit Score",
        v1: String(loanForm?.cibil_score || "-"),
        k2: "Approval Odds",
        v2: getApprovalText(report.transfer_success_probability),
        icon: BadgeCheck,
        accent: "text-emerald-500",
      },
    ];
  }, [report, loanResult, loanForm]);

  const bars = useMemo(() => {
    if (!report) return [];

    const currentEmi =
      report?.bank_comparisons?.find((item) => item.offer_source === "CURRENT BANK")?.emi ||
      loanResult?.current_emi ||
      0;

    const recommendedBankRow =
      report?.bank_comparisons?.find(
        (item) => item.bank_name === report.recommended_bank_name
      ) || {};

    const newEmi = recommendedBankRow?.emi || 0;

    const currentOutflow = Number(report.current_bank_outflow || 0);
    const newOutflow = Number(report.recommended_bank_outflow || 0);
    const savings = Number(report.best_net_savings || 0);

    const savingsRatio =
      currentOutflow > 0 ? Math.min((savings / currentOutflow) * 100, 100) : 0;
    const emiRatio =
      Number(currentEmi || 0) > 0
        ? Math.min((Math.abs(Number(currentEmi || 0) - Number(newEmi || 0)) / Number(currentEmi || 0)) * 100, 100)
        : 0;

    return [
      {
        label: "EMI",
        left: formatINR(currentEmi),
        right: formatINR(newEmi),
        tag: Number(newEmi) < Number(currentEmi) ? "Reduced" : "Updated",
        width: `${Math.max(emiRatio, 35)}%`,
      },
      {
        label: "Total Cost",
        left: formatINR(currentOutflow),
        right: formatINR(newOutflow),
        tag: newOutflow < currentOutflow ? "Savings" : "Updated",
        width: `${Math.max(savingsRatio, 45)}%`,
      },
      {
        label: "Savings",
        left: "-",
        right: formatINR(savings),
        tag: savings > 0 ? "Positive" : "Neutral",
        width: `${Math.max(savingsRatio, 30)}%`,
      },
      {
        label: "Approval Probability",
        left: "-",
        right: getApprovalPercent(report.transfer_success_probability),
        tag: getApprovalText(report.transfer_success_probability),
        width: `${Math.max(Number(report.transfer_success_probability || 0), 35)}%`,
      },
    ];
  }, [report, loanResult]);

  if (loading) {
    return (
      <section className="relative min-h-screen overflow-hidden px-4 pb-10 pt-24 sm:px-6 md:pt-28 lg:px-8 lg:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[#020918]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,77,167,0.34),transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-[900px] rounded-[14px] border border-white/15 bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.06)_100%)] p-8 text-center text-white shadow-[0_18px_60px_rgba(0,0,0,0.48)] backdrop-blur-xl">
          Loading analysis...
        </div>
      </section>
    );
  }

  if (error || !report) {
    return (
      <section className="relative min-h-screen overflow-hidden px-4 pb-10 pt-24 sm:px-6 md:pt-28 lg:px-8 lg:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[#020918]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,77,167,0.34),transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-[900px] rounded-[14px] border border-white/15 bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.06)_100%)] p-8 text-center text-red-300 shadow-[0_18px_60px_rgba(0,0,0,0.48)] backdrop-blur-xl">
          {error || "Unable to load analysis."}
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden px-4 pb-10 pt-24 sm:px-6 md:pt-28 lg:px-8 lg:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[#020918]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,77,167,0.34),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-[1320px] rounded-[14px] border border-white/15 bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.06)_100%)] p-3 shadow-[0_18px_60px_rgba(0,0,0,0.48)] backdrop-blur-xl sm:p-5">
        <div className="rounded-[12px] border border-white/20 bg-[#182537] px-3 py-2 text-[12px] text-white/85">
          <h2 className="text-[30px] font-semibold leading-none">Our Recommendation</h2>

          <div className="mx-auto mt-4 max-w-[760px] text-center">
            <div className="mx-auto inline-flex h-[46px] w-[380px] max-w-full items-center justify-center gap-2 rounded-[7px] bg-[#1ea84a] px-4 text-[22px] font-semibold text-white">
              <CheckCircle2 size={18} /> {report.decision === "TRANSFER" ? "Transfer Recommended" : "Transfer Recommended"}
            </div>

            <div className="mt-4 flex items-center justify-center gap-3">
              {recommendedLogo ? (
                <img
                  src={recommendedLogo}
                  alt={report.recommended_bank_name}
                  className="h-12 w-12 rounded-full bg-white p-1 object-contain shadow-sm"
                />
              ) : null}

              <p className="text-[32px] font-semibold text-white">
                <span className="inline-flex rounded-[3px] bg-[#8d1f50] px-2 py-0.5 text-[15px] font-semibold text-white">
                  {report.recommended_bank_name}
                </span>
                <span className="ml-3">For {loanForm?.loan_type || "Loan"}</span>
              </p>
            </div>

            <p className="mt-2 text-[62px] font-bold leading-none text-white">
              {formatINR(report.best_net_savings)}{" "}
              <span className="text-[34px] font-semibold text-emerald-600">Total Savings</span>
            </p>

            <div className="mt-2 border-t border-white/20" />
            <p className="py-2 text-[28px] text-white/85">
              Compared to continuing with your current bank.
            </p>
            <div className="border-t border-white/20" />

            <p className="mt-2 text-[12px] text-white/60">
              This option offers lower total outflow, manageable EMI stress, and an approval probability of{" "}
              {getApprovalPercent(report.transfer_success_probability)}.
            </p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-4">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <article
                key={m.title}
                className="rounded-[12px] border border-white/20 bg-[#182537] p-3 text-white"
              >
                <div className="mx-auto mb-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#173a72] text-blue-300">
                  <Icon size={13} />
                </div>
                <h3 className="text-center text-[14px] font-semibold">{m.title}</h3>
                <div className="mt-2 text-[12px]">
                  <div className="flex items-center justify-between text-white/60">
                    <span>{m.k1}</span>
                    <span className={`font-semibold ${m.accent || "text-white"}`}>{m.v1}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-white/60">
                    <span>{m.k2}</span>
                    <span className={`font-semibold ${m.accent || "text-white"}`}>{m.v2}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
          <article className="rounded-[12px] border border-white/20 bg-[#182537] p-4 text-white">
            <h3 className="text-[30px] font-semibold leading-none">Why this bank is recommended</h3>
            <p className="mt-1 text-[12px] text-white/60">
              A quick explanation of the factors that improve your balance transfer outcome.
            </p>
            <ul className="mt-3 space-y-2 text-[14px] text-white/85">
              <li className="inline-flex gap-2">
                <CheckCircle2 size={14} className="mt-0.5 text-emerald-500" />
                Lower total outflow than your current loan, helping reduce your overall repayment burden.
              </li>
              <li className="inline-flex gap-2">
                <CheckCircle2 size={14} className="mt-0.5 text-emerald-500" />
                Better monthly repayment structure based on the recommended bank’s EMI outcome.
              </li>
              <li className="inline-flex gap-2">
                <CheckCircle2 size={14} className="mt-0.5 text-emerald-500" />
                Transfer success probability of {getApprovalPercent(report.transfer_success_probability)} based on your current financial profile.
              </li>
              <li className="inline-flex gap-2">
                <CheckCircle2 size={14} className="mt-0.5 text-emerald-500" />
                EMI stress level is marked as <strong>{report.emi_stress_level}</strong>, making the repayment plan easier to manage.
              </li>
            </ul>
            <div className="mt-3 rounded-[6px] border border-blue-400/30 bg-blue-500/10 px-3 py-2 text-[12px] text-blue-300">
              Decision Benefit: {report.decision || "Lower total outflow compared to your current bank."}
            </div>
          </article>

          <article className="rounded-[12px] border border-white/20 bg-[#182537] p-4 text-white">
            <h3 className="text-[30px] font-semibold leading-none">Comparison visualization</h3>
            <p className="mt-1 text-[12px] text-white/60">
              Current Loan vs Recommended Bank across the metrics that matter most.
            </p>
            <div className="mt-3 space-y-3">
              {bars.map((b) => (
                <div key={b.label}>
                  <div className="mb-1 flex items-center justify-between text-[12px] text-white/70">
                    <span>{b.label}</span>
                    <span>
                      {b.left} → {b.right}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,#2f6fff,#284ec4)]"
                        style={{ width: b.width }}
                      />
                    </div>
                    <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                      {b.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[12px] border border-white/20 bg-[#182537] px-3 py-2 text-[12px] text-white/85">
            <p className="inline-flex items-center gap-2 font-semibold">
              <Lock size={13} className="text-amber-400" /> Secure & Confidential
            </p>
            <p className="mt-1 text-white/75">Your loan analysis details stay protected and private.</p>
          </div>
          <div className="rounded-[12px] border border-white/20 bg-[#182537] px-3 py-2 text-[12px] text-white/85">
            <p className="inline-flex items-center gap-2 font-semibold">
              <Brain size={13} className="text-blue-400" /> AI-Powered Analysis
            </p>
            <p className="mt-1 text-white/75">Recommendations are generated using structured financial comparisons.</p>
          </div>
          <div className="rounded-[12px] border border-white/20 bg-[#182537] px-3 py-2 text-[12px] text-white/85">
            <p className="inline-flex items-center gap-2 font-semibold">
              <FileBarChart2 size={13} className="text-emerald-400" /> Transparent Results
            </p>
            <p className="mt-1 text-white/75">See every major number behind the recommendation before you proceed.</p>
          </div>
          <div className="rounded-[12px] border border-white/20 bg-[#182537] px-3 py-2 text-[12px] text-white/85">
           <p className="inline-flex items-center gap-2 font-semibold">
             <FileBarChart2 size={13} className="text-cyan-400" />
              Formula Breakdown
           </p>
           <p className="mt-2 text-white/65">
              Understand how the key values are derived.
            </p>
            <div className="mt-3 space-y-2 text-[14px] text-white/70">
             <div>
               <span className="font-semibold text-white">
                 Outstanding Loan
              </span>
               <p>Original Principal − Amount Paid.</p>
              </div>
              <div>
               <span className="font-semibold text-white">
                 Current EMI
                </span>
                <p>Uses Current Interest Rate and Remaining Tenure.</p>
              </div>
              <div>
               <span className="font-semibold text-white">
                 New EMI
                </span>
               <p>Uses Proposed Interest Rate and New Loan Tenure.</p>
              </div>
              <div>
               <span className="font-semibold text-white">
                 Net Savings
               </span>
               <p>Current Outflow − Recommended Outflow.</p>
              </div>
            </div>
          </div>
          
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/balance-transfer/review")}
            className="rounded-[8px] border border-white/25 bg-white px-6 py-2.5 text-[22px] font-medium text-[#0f172a] transition hover:bg-slate-100"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={() => navigate("/balance-transfer/amortization")}
            className="inline-flex items-center gap-2 rounded-[8px] bg-[#1f6bff] px-7 py-2.5 text-[22px] font-medium text-white transition hover:bg-[#1c5ee0]"
          >
            <Send size={16} /> View Amortization
          </button>
        </div>
      </div>
    </section>
  );
}
