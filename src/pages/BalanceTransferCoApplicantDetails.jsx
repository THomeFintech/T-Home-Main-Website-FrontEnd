import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Lightbulb } from "lucide-react";

export default function BalanceTransferCoApplicantDetails() {
  const navigate = useNavigate();
  const [addCoApplicant, setAddCoApplicant] = useState(false);

  return (
    <section className="relative min-h-screen overflow-hidden px-4 pb-10 pt-24 font-['Outfit',sans-serif] sm:px-6 md:pt-28 lg:px-8 lg:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[#020918]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,77,167,0.34),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-[1320px] rounded-[14px] border border-white/15 bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.06)_100%)] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.48)] backdrop-blur-xl sm:p-6">
        <h1 className="text-center text-[30px] font-semibold leading-tight text-white sm:text-[38px] md:text-[52px]">
          Balance Transfer <span className="text-[#1f6bff]">Application</span> Portal
        </h1>

        {/* Stepper */}
        <div className="mt-5 overflow-x-auto">
          <div className="relative mx-auto min-w-[560px] px-1 sm:min-w-[760px]">
            <div className="absolute left-[6%] right-[6%] top-4 h-px bg-white/30" />
            <div className="relative flex items-start justify-between">
              {[1, 2, 3, 4, 5].map((step) => {
                const active = step === 4;
                const done = step < 4;
                const labels = [
                  "PERSONAL DETAILS",
                  "INCOME DOCUMENTS",
                  "EXISTING LOAN DOCUMENTS",
                  "CO-APPLICANT DETAILS",
                  "REVIEW & SUBMIT",
                ];
                return (
                  <div key={step} className="flex w-full flex-col items-center text-center">
                    <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border text-[12px] font-semibold ${active ? "border-[#2f78ff] bg-white text-[#1f6bff]" : done ? "border-emerald-500 bg-emerald-500 text-white" : "border-white/70 bg-white text-slate-700"}`}>
                      {done ? "✓" : step}
                    </div>
                    <p className={`mt-4 text-[10px] font-semibold ${active ? "text-[#2f78ff]" : done ? "text-emerald-400" : "text-white/55"}`}>{labels[step - 1]}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-[700px] rounded-[12px] border border-white/15 bg-[rgba(255,255,255,0.05)] p-4 sm:p-5">
          <h2 className="text-center text-[24px] font-semibold text-white sm:text-[28px]">Co-Applicant Details <span className="text-white/60">(Optional)</span></h2>
          <p className="text-center text-[15px] text-white/70 mt-1">Increases joint loan eligibility</p>

          {/* Add Co-Applicant Toggle */}
          <div className="mt-6 flex items-center gap-3 rounded-[10px] border border-white/15 bg-[rgba(255,255,255,0.08)] px-4 py-3">
            <Users size={22} className="text-[#5ea0ff] mr-2" />
            <div className="flex-1">
              <div className="text-[15px] font-medium text-white">Add a Co-Applicant</div>
              <div className="text-[12px] text-white/60">Spouse, parent, adult child or business partner</div>
            </div>
            <label className="inline-flex items-center cursor-pointer ml-2">
              <input
                type="checkbox"
                checked={addCoApplicant}
                onChange={() => setAddCoApplicant((v) => !v)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:bg-[#1f6bff] transition-all duration-200 relative">
                <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-200 ${addCoApplicant ? 'translate-x-5' : ''}`}></div>
              </div>
            </label>
          </div>


          {/* Why add a co-applicant? */}
          <div className="mt-6 rounded-[10px] border border-white/15 bg-[rgba(255,255,255,0.10)] p-4 flex items-start gap-3">
            <Lightbulb size={22} className="text-[#f7c948] mt-1" />
            <div>
              <div className="text-[15px] font-semibold text-white mb-1">Why add a co-applicant?</div>
              <div className="text-[13px] text-white/80">
                Adding a co-applicant combines incomes for eligibility. A 70k/month income may qualify for ₹24L — adding a spouse earning ₹55k/month raises it to ₹45L+. Banks view joint applications as lower risk, often offering better interest rates.
              </div>
            </div>
          </div>

          {/* Co-Applicant Details Form - only visible if toggle is ON */}
          {addCoApplicant && (
            <div className="mt-8 rounded-[10px] border border-white/20 bg-[rgba(255,255,255,0.13)] p-4">
              <h3 className="text-[16px] font-semibold text-white mb-4">Co-Applicant Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] text-white/90 mb-1">Full Name</label>
                  <input type="text" placeholder="Enter full name" className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/40 outline-none focus:border-[#5b93ff]" />
                </div>
                <div>
                  <label className="block text-[13px] text-white/90 mb-1">Relationship</label>
                  <select className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white outline-none focus:border-[#5b93ff]">
                    <option value="">Select</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Adult Child</option>
                    <option value="Partner">Business Partner</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] text-white/90 mb-1">Mobile Number</label>
                  <input type="text" placeholder="10-digit mobile number" maxLength={10} className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/40 outline-none focus:border-[#5b93ff]" />
                </div>
                <div>
                  <label className="block text-[13px] text-white/90 mb-1">Email ID</label>
                  <input type="email" placeholder="you@example.com" className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/40 outline-none focus:border-[#5b93ff]" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[13px] text-white/90 mb-1">Income (Monthly)</label>
                  <input type="number" placeholder="e.g. 50000" className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/40 outline-none focus:border-[#5b93ff]" />
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-[8px] border border-white/25 bg-white px-4 py-2 text-[13px] font-medium text-[#0f172a]"
            >
              ← Back
            </button>

            <div className="w-full px-2 sm:w-[260px]">
              <div className="h-1.5 w-full rounded-full bg-white/25">
                <div className="h-full w-[80%] rounded-full bg-[#2f78ff]" />
              </div>
              <p className="mt-1 text-center text-[10px] text-white/60">Step 4 of 5</p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/balance-transfer/application-portal/review-submit")}
              className="rounded-[8px] bg-[#1f6bff] px-5 py-2 text-[13px] font-medium text-white hover:bg-[#1c5ee0]"
            >
              Review Application →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
