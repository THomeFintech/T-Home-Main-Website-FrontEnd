import React from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Brain, BarChart3 } from "lucide-react";

const rows = [
  {
    bank: "HDFC BANK",
    bankColor: "bg-[#0f5fbf]",
    rate: "7.16%",
    tenure: "30",
    emi: "Rs 9,856",
    interest: "Rs 25,688",
    outflow: "Rs 2,95,688",
    saving: "Rs 4,966",
    decision: "Beneficial",
    decisionColor: "bg-emerald-100 text-emerald-700",
    best: true,
  },
  {
    bank: "AXIS BANK",
    bankColor: "bg-[#8d1f50]",
    rate: "8.5%",
    tenure: "30",
    emi: "Rs 10,022",
    interest: "Rs 30,654",
    outflow: "Rs 3,00,654",
    saving: "0",
    decision: "Neutral",
    decisionColor: "bg-slate-100 text-slate-600",
  },
  {
    bank: "SBI",
    bankColor: "bg-[#1f51b3]",
    rate: "8.5%",
    tenure: "30",
    emi: "Rs 10,022",
    interest: "Rs 30,654",
    outflow: "Rs 3,00,654",
    saving: "0",
    decision: "Neutral",
    decisionColor: "bg-slate-100 text-slate-600",
  },
];

export default function BalanceTransferDetailedTable() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen overflow-hidden px-4 pb-10 pt-24 sm:px-6 md:pt-28 lg:px-8 lg:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[#020918]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,77,167,0.34),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-[1320px] rounded-[14px] border border-white/15 bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.06)_100%)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.48)] backdrop-blur-xl">
        <h1 className="text-[44px] font-semibold text-white">Total Cost Comparison</h1>
        <p className="mt-1 text-[12px] text-white/65">Compare the total cost of continuing your loan with your current bank versus Transferring to a better offer.</p>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          <SummaryCard title="Current Loan Total Outflow" value="₹ 3,00,654" valueClass="text-[#111827]" />
          <SummaryCard title="Best Offer Total Outflow" value="₹ 2,95,688" valueClass="text-[#111827]" />
          <SummaryCard title="Estimated Net Savings" value="₹ 4,966" valueClass="text-emerald-600" />
        </div>

        <div className="mt-4 overflow-hidden rounded-[10px] border border-slate-200/70 bg-[#f8fafc] text-[#1f2937]">
          <div className="grid grid-cols-[1.2fr_0.7fr_0.7fr_0.9fr_0.9fr_0.9fr_0.9fr_0.8fr] bg-[#8db3f2] px-3 py-2 text-[12px] font-semibold text-[#103064]">
            <p>Bank Name</p>
            <p>Interest Rate (%)</p>
            <p>Tenure (months)</p>
            <p>New EMI (₹)</p>
            <p>Total Interest (₹)</p>
            <p>Total Outflow (₹)</p>
            <p>Net Savings (₹)</p>
            <p>Decision</p>
          </div>

          {rows.map((row, index) => (
            <div
              key={`${row.bank}-${index}`}
              className={`grid grid-cols-[1.2fr_0.7fr_0.7fr_0.9fr_0.9fr_0.9fr_0.9fr_0.8fr] items-center px-3 py-2 text-[12px] ${index !== rows.length - 1 ? "border-b border-slate-200" : ""}`}
            >
              <div className="flex items-center gap-2">
                <span className={`inline-flex h-6 items-center rounded-sm px-2 text-[10px] font-semibold text-white ${row.bankColor}`}>{row.bank}</span>
                {row.best ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-semibold text-emerald-700">Best Offer</span> : null}
              </div>
              <p>{row.rate}</p>
              <p>{row.tenure}</p>
              <p>{row.emi}</p>
              <p>{row.interest}</p>
              <p>{row.outflow}</p>
              <p>{row.saving}</p>
              <p><span className={`rounded px-2 py-1 text-[10px] font-semibold ${row.decisionColor}`}>{row.decision}</span></p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div className="rounded-[10px] border border-slate-200/70 bg-[#f8fafc] p-4 text-[#1f2937]">
            <h3 className="text-[30px] font-semibold">Financial Insights</h3>
            <ul className="mt-3 space-y-2 text-[13px] text-slate-700">
              <li>Indian Bank offers the lowest interest rate at 7.16%.</li>
              <li>EMI is reduced compared to your current loan projection.</li>
              <li>Total loan cost is minimized over the remaining tenure.</li>
              <li>Balance transfer will save you approximately ₹ 4,966.</li>
            </ul>
          </div>

          <div className="rounded-[10px] border border-slate-200/70 bg-[#f8fafc] p-4 text-[#1f2937]">
            <h3 className="text-[30px] font-semibold">Visual Comparison</h3>
            <div className="mt-3 space-y-4 text-[12px]">
              <div>
                <p className="font-semibold">Total Interest Cost</p>
                <div className="mt-1 flex items-center gap-2"><span className="w-[70px] text-slate-500">Indian Bank</span><div className="h-2 flex-1 rounded-full bg-slate-200"><div className="h-2 w-[78%] rounded-full bg-emerald-500" /></div><span>₹ 25,688</span></div>
                <div className="mt-1 flex items-center gap-2"><span className="w-[70px] text-slate-500">Current Loan</span><div className="h-2 flex-1 rounded-full bg-slate-200"><div className="h-2 w-[92%] rounded-full bg-slate-500" /></div><span>₹ 30,654</span></div>
              </div>

              <div>
                <p className="font-semibold">Monthly EMI</p>
                <div className="mt-1 flex items-center gap-2"><span className="w-[70px] text-slate-500">Indian Bank</span><div className="h-2 flex-1 rounded-full bg-slate-200"><div className="h-2 w-[84%] rounded-full bg-[#1f6bff]" /></div><span>₹ 9,856</span></div>
                <div className="mt-1 flex items-center gap-2"><span className="w-[70px] text-slate-500">Current Loan</span><div className="h-2 flex-1 rounded-full bg-slate-200"><div className="h-2 w-[88%] rounded-full bg-slate-500" /></div><span>₹ 10,022</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-8 text-[13px] text-white/90">
          <p className="inline-flex items-center gap-2"><Lock size={13} /> Secure Data</p>
          <p className="inline-flex items-center gap-2"><Brain size={13} /> AI Powered Analysis</p>
          <p className="inline-flex items-center gap-2"><BarChart3 size={13} /> Transparent Comparison</p>
        </div>

        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/balance-transfer/comparison")}
            className="rounded-[8px] border border-white/25 bg-white px-6 py-2.5 text-[18px] font-medium text-[#0f172a] transition hover:bg-slate-100"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={() => navigate("/balance-transfer/amortization")}
            className="rounded-[8px] bg-[#1f6bff] px-7 py-2.5 text-[18px] font-medium text-white transition hover:bg-[#1c5ee0]"
          >
            View Amortization Schedule
          </button>
        </div>
      </div>
    </section>
  );
}

function SummaryCard({ title, value, valueClass }) {
  return (
    <div className="rounded-[10px] border border-slate-200/70 bg-[#f8fafc] p-4 text-center text-[#1f2937]">
      <p className="text-[14px] font-semibold text-[#2363e8]">{title}</p>
      <p className={`mt-2 text-[46px] font-bold leading-none ${valueClass}`}>{value}</p>
    </div>
  );
}
