import React from "react";
import { useNavigate } from "react-router-dom";

const comparisons = [
  { bank: "HDFC BANK", bankColor: "bg-[#0f5fbf]" },
  { bank: "AXIS BANK", bankColor: "bg-[#8d1f50]", suggested: true },
  { bank: "SBI", bankColor: "bg-[#1f51b3]" },
];

export default function BalanceTransferComparison() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen overflow-hidden px-4 pb-10 pt-24 sm:px-6 md:pt-28 lg:px-8 lg:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[#020918]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,77,167,0.34),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-[1320px] rounded-[14px] border border-white/15 bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.06)_100%)] p-3 shadow-[0_18px_60px_rgba(0,0,0,0.48)] backdrop-blur-xl sm:p-5">
        <h1 className="text-center text-[40px] font-semibold text-white">Total Cost Comparison</h1>
        <p className="mt-1 text-center text-[12px] text-white/65">A clear comparison of what you&apos;ll pay if you continue vs transfer your loan.</p>

        <div className="mt-5 space-y-4">
          {comparisons.map((item, idx) => (
            <div key={`${item.bank}-${idx}`} className="rounded-[10px] border border-white/15 bg-[rgba(255,255,255,0.04)] p-4 sm:p-5">
              <div className="grid grid-cols-3 items-center gap-2 px-2 text-center text-[12px] font-semibold text-white/90">
                <p>Current Bank</p>
                <p></p>
                <p>
                  Added Bank
                  <span className={`ml-1 inline-flex h-5 items-center rounded-sm px-2 text-[9px] font-semibold text-white ${item.bankColor}`}>
                    {item.bank}
                  </span>
                </p>
              </div>

              <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
                <div className="mx-auto h-[246px] w-full max-w-[255px] rounded-[10px] bg-white px-4 py-4 text-[#1f2937]">
                  <div className="text-center">
                    <p className="text-[10px] text-slate-500">Total Remaining Outflow</p>
                    <p className="mt-1 text-[35px] font-bold leading-none">₹52,40,000</p>
                  </div>
                  <div className="mt-6 space-y-3 text-[12px] text-slate-700">
                    <div className="flex items-center justify-between"><span>Outstanding Principal:</span><span>₹35,00,000</span></div>
                    <div className="flex items-center justify-between"><span>Remaining Interest:</span><span>₹17,40,000</span></div>
                  </div>
                  <p className="mt-6 text-center text-[10px] text-slate-500">If you continue with your existing loan</p>
                </div>

                <div className="w-[120px] text-center">
                  <p className="text-[11px] font-semibold text-white/85">You save</p>
                  <p className="text-[34px] font-bold leading-none text-[#f5c84b]">₹3,42,000</p>
                  <div className="mt-1 flex items-center justify-center">
                    <span className="text-[14px] text-white/45">←</span>
                    <span className="mx-1 h-px w-[56px] bg-white/35" />
                    <span className="text-[14px] text-white/45">→</span>
                  </div>
                </div>

                <div className="mx-auto h-[246px] w-full max-w-[255px] rounded-[10px] bg-white px-4 py-4 text-[#1f2937]">
                  {item.suggested ? (
                    <p className="mx-auto mb-1 inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-semibold text-emerald-700">Best Offer</p>
                  ) : (
                    <div className="mb-4" />
                  )}
                  <div className="text-center">
                    <p className="text-[10px] text-slate-500">Total Outflow</p>
                    <p className="mt-1 text-[35px] font-bold leading-none text-[#1f6bff]">₹49,00,000</p>
                  </div>
                  <div className="mt-4 space-y-3 text-[12px] text-slate-700">
                    <div className="flex items-center justify-between"><span>New Principal:</span><span>₹35,00,000</span></div>
                    <div className="flex items-center justify-between"><span>Remaining Interest:</span><span>₹17,40,000</span></div>
                  </div>
                  <div className="mt-3 rounded-[6px] bg-[#1f6bff] py-1 text-center text-[10px] font-semibold text-white">You save ₹3,42,000</div>
                  <p className="mt-2 text-center text-[10px] text-slate-500">Including processing & foreclosure charge</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/balance-transfer/analysis")}
            className="rounded-[8px] border border-white/25 bg-white px-6 py-2.5 text-[18px] font-medium text-[#0f172a] transition hover:bg-slate-100"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={() => navigate("/balance-transfer/detailed-table")}
            className="rounded-[8px] bg-[#1f6bff] px-7 py-2.5 text-[18px] font-medium text-white transition hover:bg-[#1c5ee0]"
          >
            View Detailed Table
          </button>
        </div>
      </div>
    </section>
  );
}
