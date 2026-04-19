import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  ShieldCheck,
  Plus,
  Pencil,
  Trash2,
  IndianRupee,
  CalendarDays,
  Percent,
  FileText,
  Scale,
} from "lucide-react";

const initialOffer = {
  bankName: "",
  rate: "7.25",
  amount: "300000",
  tenure: "30 Months",
  fee: "5475",
};

const suggestedOffers = [
  {
    bank: "HDFC BANK",
    tag: "",
    amount: "5,00,000",
    tenure: "48 Months",
    rate: "10.45% p.a.",
    customerAmount: "4,90,000",
    fee: "10,000 (2%)",
    accent: "bg-[#0f5fbf]",
  },
  {
    bank: "AXIS BANK",
    tag: "",
    amount: "5,00,000",
    tenure: "60 Months",
    rate: "10.45% p.a.",
    customerAmount: "4,92,500",
    fee: "7,500 (1.5%)",
    accent: "bg-[#a11b54]",
  },
  {
    bank: "AXIS BANK",
    tag: "Our Suggestion",
    amount: "5,00,000",
    tenure: "60 Months",
    rate: "10.45% p.a.",
    customerAmount: "4,92,500",
    fee: "7,500 (1.5%)",
    accent: "bg-[#a11b54]",
  },
];

export default function BalanceTransferOffers() {
  const navigate = useNavigate();
  const [offer, setOffer] = useState(initialOffer);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAiRecommended, setShowAiRecommended] = useState(false);
  const normalOffers = suggestedOffers.filter((item) => !item.tag);
  const aiSuggestedOffers = suggestedOffers.filter((item) => item.tag);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOffer((prev) => ({ ...prev, [name]: value }));
  };

  const inputClass =
    "h-[42px] w-full rounded-[8px] border border-white/15 bg-[rgba(255,255,255,0.07)] px-3 text-[13px] text-white placeholder:text-white/45 outline-none transition focus:border-[#5b93ff]";

  return (
    <section className="relative min-h-screen overflow-hidden px-4 pb-12 pt-28 sm:px-6 md:pt-32 lg:px-8 lg:pt-36">
      <div className="pointer-events-none absolute inset-0 bg-[#030a1a]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(44,78,173,0.36),transparent_58%)]" />

      <div className="relative z-10 mx-auto max-w-[1300px] rounded-[16px] border border-white/15 bg-[linear-gradient(90deg,rgba(255,255,255,0.11)_0%,rgba(255,255,255,0.06)_100%)] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
        <div className="mx-auto max-w-[1160px]">
          <div className="text-center">
            <h1 className="text-[36px] font-semibold leading-tight text-white sm:text-[58px]">
              Add Bank <span className="text-[#2572ff]">Offers to</span> Compare
            </h1>
            <p className="mt-2 text-[12px] text-white/70 sm:text-[13px]">
              Add one or more bank offers to see which balance transfer saves you the most.
            </p>
          </div>

          <div className="mt-8 rounded-[12px] border border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.28)] sm:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-[30px] font-semibold text-white">Add Bank Offer</h2>
                <p className="mt-1 max-w-[720px] text-[12px] text-white/60">
                  Enter one or more bank offers to compare balance transfer savings with your current loan. Each field is grouped for faster completion and easier review.
                </p>
              </div>
              <div className="inline-flex h-[30px] items-center gap-1.5 self-start rounded-full border border-[#5a8fe4]/50 bg-[#1f4ea8]/20 px-3 text-[10px] font-medium text-[#93bfff]">
                <ShieldCheck size={12} />
                SECURE COMPARISON FLOW
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="md:col-span-1">
                <label className="mb-1.5 block text-[12px] font-medium text-white/90">Bank Name *</label>
                <div className="relative">
                  <Building2 size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/45" />
                  <input
                    name="bankName"
                    value={offer.bankName}
                    onChange={handleChange}
                    placeholder="Select or enter bank name"
                    className={`${inputClass} pl-9`}
                  />
                </div>
                <p className="mt-1 text-[10px] text-white/45">Example: Indian Bank</p>
              </div>

              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-white/90">Interest Rate (%)</label>
                <input name="rate" value={offer.rate} onChange={handleChange} className={inputClass} />
                <p className="mt-1 text-[10px] text-white/45">Example: 7.25%</p>
              </div>

              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-white/90">Loan Amount Offered</label>
                <input name="amount" value={offer.amount} onChange={handleChange} className={inputClass} />
                <p className="mt-1 text-[10px] text-emerald-400/80">Maximum loan offered by bank</p>
              </div>

              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-white/90">Tenure (Months) *</label>
                <input name="tenure" value={offer.tenure} onChange={handleChange} className={inputClass} />
                <p className="mt-1 text-[10px] text-white/45">Match this with your remaining tenure for fair comparison</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-white/90">Processing Fee *</label>
                <input name="fee" value={offer.fee} onChange={handleChange} className={inputClass} />
                <p className="mt-1 text-[10px] text-amber-400/80">Validation hint: include GST or administrative fee if applicable</p>
              </div>
              <button
                type="button"
                className="inline-flex h-[42px] items-center justify-center gap-1.5 rounded-[9px] bg-[#1f6bff] px-5 text-[13px] font-medium text-white transition hover:bg-[#1c5ee0]"
              >
                <Plus size={14} />
                Add Offer
              </button>
            </div>

            <p className="mt-4 text-[11px] text-emerald-300/80">✓ Inline validation and formatted values help reduce manual errors.</p>
          </div>

          {!showSuggestions ? (
            <div className="mt-6 rounded-[12px] border border-white/15 bg-[linear-gradient(90deg,rgba(255,255,255,0.09)_0%,rgba(255,255,255,0.04)_100%)] px-4 py-6 text-center">
              <p className="text-[16px] text-white">if you don&apos;t have offers you can use AI Suggestions</p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/balance-transfer/details")}
                  className="rounded-[8px] border border-white/25 bg-white/10 px-4 py-2 text-[12px] font-medium text-white transition hover:bg-white/15"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSuggestions(true);
                    setShowAiRecommended(false);
                  }}
                  className="rounded-[8px] bg-[#1f6bff] px-4 py-2 text-[12px] font-medium text-white transition hover:bg-[#1c5ee0]"
                >
                  Suggest Banks
                </button>
              </div>
            </div>
          ) : null}

          {showSuggestions ? (
            <>
              {normalOffers.length > 0 ? (
                <>
                  <h2 className="mt-10 text-center text-[42px] font-semibold text-white">Added Bank Offers</h2>
                  <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-3">
                    {normalOffers.map((item, index) => (
                      <article
                        key={`normal-${item.bank}-${index}`}
                        className="rounded-[14px] border border-slate-200/80 bg-[#f8fafc] p-3 text-[#1f2937] shadow-[0_10px_24px_rgba(0,0,0,0.2)]"
                      >
                        <div className="mb-2 flex items-start justify-between border-b border-slate-200 pb-2">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex h-6 items-center rounded-sm px-2 text-[10px] font-semibold text-white ${item.accent}`}>
                              {item.bank}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <button type="button" className="rounded-full bg-slate-200 p-1"><Pencil size={11} /></button>
                            <button type="button" className="rounded-full bg-slate-200 p-1"><Trash2 size={11} /></button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className="rounded-[9px] bg-[#eef3ff] p-2.5">
                            <p className="text-slate-500">Loan Amount</p>
                            <p className="mt-1 flex items-center gap-1 text-[16px] font-semibold text-[#0f9f6a]"><IndianRupee size={14} /> {item.amount}</p>
                          </div>
                          <div className="rounded-[9px] bg-[#f2f5fb] p-2.5">
                            <p className="text-slate-500">Tenure</p>
                            <p className="mt-1 flex items-center gap-1 text-[16px] font-semibold"><CalendarDays size={14} /> {item.tenure}</p>
                          </div>
                        </div>

                        <div className="mt-2 rounded-[10px] border border-slate-200 bg-[#f1f5ff] p-2.5">
                          <p className="text-[11px] text-slate-500">Interest Rate</p>
                          <p className="mt-1 flex items-center gap-2 text-[30px] font-bold leading-none text-[#111827]"><Percent size={16} className="text-indigo-600" /> {item.rate}</p>
                        </div>

                        <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                          <div>
                            <p className="flex items-center gap-1"><FileText size={12} /> Amount to Customer</p>
                            <p className="mt-1 text-[16px] font-semibold text-[#111827]">Rs {item.customerAmount}</p>
                          </div>
                          <div>
                            <p className="flex items-center gap-1"><FileText size={12} /> Processing Fees</p>
                            <p className="mt-1 text-[16px] font-semibold text-[#111827]">Rs {item.fee}</p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              ) : null}

              {!showAiRecommended ? (
                <div className="mt-6 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAiRecommended(true)}
                    className="rounded-[9px] bg-[#1f6bff] px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-[#1c5ee0]"
                  >
                    AI Suggest Offer
                  </button>
                </div>
              ) : null}

              {showAiRecommended && aiSuggestedOffers.length > 0 ? (
                <>
                  <h2 className="mt-10 text-center text-[42px] font-semibold text-white">AI Suggested Bank Offers</h2>
                  <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-3">
                    {aiSuggestedOffers.map((item, index) => (
                      <article
                        key={`ai-${item.bank}-${index}`}
                        className="rounded-[14px] border border-slate-200/80 bg-[#f8fafc] p-3 text-[#1f2937] shadow-[0_10px_24px_rgba(0,0,0,0.2)]"
                      >
                        <div className="mb-2 flex items-start justify-between border-b border-slate-200 pb-2">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex h-6 items-center rounded-sm px-2 text-[10px] font-semibold text-white ${item.accent}`}>
                              {item.bank}
                            </span>
                            <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-medium text-blue-700">{item.tag}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <button type="button" className="rounded-full bg-slate-200 p-1"><Pencil size={11} /></button>
                            <button type="button" className="rounded-full bg-slate-200 p-1"><Trash2 size={11} /></button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className="rounded-[9px] bg-[#eef3ff] p-2.5">
                            <p className="text-slate-500">Loan Amount</p>
                            <p className="mt-1 flex items-center gap-1 text-[16px] font-semibold text-[#0f9f6a]"><IndianRupee size={14} /> {item.amount}</p>
                          </div>
                          <div className="rounded-[9px] bg-[#f2f5fb] p-2.5">
                            <p className="text-slate-500">Tenure</p>
                            <p className="mt-1 flex items-center gap-1 text-[16px] font-semibold"><CalendarDays size={14} /> {item.tenure}</p>
                          </div>
                        </div>

                        <div className="mt-2 rounded-[10px] border border-slate-200 bg-[#f1f5ff] p-2.5">
                          <p className="text-[11px] text-slate-500">Interest Rate</p>
                          <p className="mt-1 flex items-center gap-2 text-[30px] font-bold leading-none text-[#111827]"><Percent size={16} className="text-indigo-600" /> {item.rate}</p>
                        </div>

                        <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                          <div>
                            <p className="flex items-center gap-1"><FileText size={12} /> Amount to Customer</p>
                            <p className="mt-1 text-[16px] font-semibold text-[#111827]">Rs {item.customerAmount}</p>
                          </div>
                          <div>
                            <p className="flex items-center gap-1"><FileText size={12} /> Processing Fees</p>
                            <p className="mt-1 text-[16px] font-semibold text-[#111827]">Rs {item.fee}</p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              ) : null}

              <div className="mt-7 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowSuggestions(false);
                    setShowAiRecommended(false);
                  }}
                  className="rounded-[9px] border border-white/25 bg-white px-5 py-2.5 text-[14px] font-medium text-[#0f172a] transition hover:bg-slate-100"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/balance-transfer/review")}
                  className="inline-flex items-center gap-2 rounded-[9px] bg-[#1f6bff] px-6 py-2.5 text-[14px] font-medium text-white transition hover:bg-[#1c5ee0]"
                >
                  <Scale size={14} />
                  Compare Balance Transfer
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
