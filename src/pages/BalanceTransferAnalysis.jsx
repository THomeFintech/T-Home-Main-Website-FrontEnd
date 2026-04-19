import React from "react";
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

const metrics = [
  { title: "Current Loan", k1: "Current EMI", v1: "Rs10,022", k2: "Total Outflow", v2: "Rs3,00,654", icon: Shield },
  { title: "New Plan", k1: "New EMI", v1: "Rs9,856", k2: "New Total Outflow", v2: "Rs2,95,688", icon: CircleDollarSign },
  { title: "Your Benefits", k1: "Net Savings", v1: "Rs4,966", k2: "EMI Reduction", v2: "Rs166/month", icon: TrendingDown, accent: "text-emerald-500" },
  { title: "Approval Chance", k1: "Credit Score", v1: "855", k2: "Approval Odds", v2: "High", icon: BadgeCheck, accent: "text-emerald-500" },
];

const bars = [
  { label: "Interest Rate", left: "8.5%", right: "7.6%", tag: "Lower", width: "64%" },
  { label: "EMI", left: "Rs10,022", right: "Rs9,856", tag: "Reduced", width: "55%" },
  { label: "Total Cost", left: "Rs3,00,654", right: "Rs2,95,688", tag: "Savings", width: "66%" },
  { label: "Savings", left: "-", right: "Rs4,966", tag: "Positive", width: "47%" },
];

export default function BalanceTransferAnalysis() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen overflow-hidden px-4 pb-10 pt-24 sm:px-6 md:pt-28 lg:px-8 lg:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[#020918]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,77,167,0.34),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-[1320px] rounded-[14px] border border-white/15 bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.06)_100%)] p-3 shadow-[0_18px_60px_rgba(0,0,0,0.48)] backdrop-blur-xl sm:p-5">
        <div className="rounded-[8px] border border-slate-200/80 bg-[#f7f9fc] p-4 text-[#1f2937]">
          <h2 className="text-[30px] font-semibold leading-none">Our Recommendation</h2>

          <div className="mx-auto mt-4 max-w-[720px] text-center">
            <div className="mx-auto inline-flex h-[46px] w-[380px] max-w-full items-center justify-center gap-2 rounded-[7px] bg-[#1ea84a] px-4 text-[22px] font-semibold text-white">
              <CheckCircle2 size={18} /> Transfer Recommended
            </div>

            <p className="mt-3 text-[32px] font-semibold text-slate-700">
              <span className="inline-flex rounded-[3px] bg-[#8d1f50] px-2 py-0.5 text-[15px] font-semibold text-white">AXIS BANK</span>
              <span className="ml-3">For Personal Loan</span>
            </p>

            <p className="mt-1 text-[62px] font-bold leading-none text-[#111827]">
              Rs4,966 <span className="text-[34px] font-semibold text-emerald-600">Total Savings</span>
            </p>

            <div className="mt-2 border-t border-slate-300" />
            <p className="py-2 text-[28px] text-slate-700">Compared to continuing with your current bank.</p>
            <div className="border-t border-slate-300" />

            <p className="mt-2 text-[12px] text-slate-500">
              This option offers lower interest, manageable EMI stress, and a high approval probability.
            </p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-4">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <article key={m.title} className="rounded-[12px] border border-slate-200/80 bg-[#f7f9fc] p-3 text-[#1f2937]">
                <div className="mx-auto mb-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Icon size={13} />
                </div>
                <h3 className="text-center text-[14px] font-semibold">{m.title}</h3>
                <div className="mt-2 text-[12px]">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>{m.k1}</span>
                    <span className={`font-semibold ${m.accent || "text-slate-700"}`}>{m.v1}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-slate-500">
                    <span>{m.k2}</span>
                    <span className={`font-semibold ${m.accent || "text-slate-700"}`}>{m.v2}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
          <article className="rounded-[12px] border border-slate-200/80 bg-[#f7f9fc] p-4 text-[#1f2937]">
            <h3 className="text-[30px] font-semibold leading-none">Why this bank is recommended</h3>
            <p className="mt-1 text-[12px] text-slate-500">
              A quick explanation of the factors that improve your balance transfer outcome.
            </p>
            <ul className="mt-3 space-y-2 text-[14px] text-slate-700">
              <li className="inline-flex gap-2"><CheckCircle2 size={14} className="mt-0.5 text-emerald-500" />Lower interest rate than your current loan, reducing finance charges over the remaining tenure.</li>
              <li className="inline-flex gap-2"><CheckCircle2 size={14} className="mt-0.5 text-emerald-500" />Lower EMI burden improves monthly cash flow and keeps the repayment plan easier to manage.</li>
              <li className="inline-flex gap-2"><CheckCircle2 size={14} className="mt-0.5 text-emerald-500" />Reduced total loan cost creates measurable savings even after considering transfer-related charges.</li>
              <li className="inline-flex gap-2"><CheckCircle2 size={14} className="mt-0.5 text-emerald-500" />High approval probability based on your current credit score and financial profile.</li>
            </ul>
            <div className="mt-3 rounded-[6px] border border-blue-200 bg-blue-50 px-3 py-2 text-[12px] text-blue-700">
              Decision Benefit: Lower total outflow compared to your current bank.
            </div>
          </article>

          <article className="rounded-[12px] border border-slate-200/80 bg-[#f7f9fc] p-4 text-[#1f2937]">
            <h3 className="text-[30px] font-semibold leading-none">Comparison visualization</h3>
            <p className="mt-1 text-[12px] text-slate-500">
              Current Loan vs Recommended Bank across the metrics that matter most.
            </p>
            <div className="mt-3 space-y-3">
              {bars.map((b) => (
                <div key={b.label}>
                  <div className="mb-1 flex items-center justify-between text-[12px] text-slate-600">
                    <span>{b.label}</span>
                    <span>{b.left} {"->"} {b.right}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-[linear-gradient(90deg,#2f6fff,#284ec4)]" style={{ width: b.width }} />
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">{b.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-[12px] border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] px-3 py-2 text-[12px] text-white/85">
            <p className="inline-flex items-center gap-2 font-semibold"><Lock size={13} className="text-amber-400" /> Secure & Confidential</p>
            <p className="mt-1 text-white/65">Your loan analysis details stay protected and private.</p>
          </div>
          <div className="rounded-[12px] border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] px-3 py-2 text-[12px] text-white/85">
            <p className="inline-flex items-center gap-2 font-semibold"><Brain size={13} className="text-blue-400" /> AI-Powered Analysis</p>
            <p className="mt-1 text-white/65">Recommendations are generated using structured financial comparisons.</p>
          </div>
          <div className="rounded-[12px] border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] px-3 py-2 text-[12px] text-white/85">
            <p className="inline-flex items-center gap-2 font-semibold"><FileBarChart2 size={13} className="text-emerald-400" /> Transparent Results</p>
            <p className="mt-1 text-white/65">See every major number behind the recommendation before you proceed.</p>
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
            onClick={() => navigate("/balance-transfer/comparison")}
            className="inline-flex items-center gap-2 rounded-[8px] bg-[#1f6bff] px-7 py-2.5 text-[22px] font-medium text-white transition hover:bg-[#1c5ee0]"
          >
            <Send size={16} /> View Detailed Comparison
          </button>
        </div>
      </div>
    </section>
  );
}
