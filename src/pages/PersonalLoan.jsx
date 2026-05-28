import React from "react";
import { useNavigate } from "react-router-dom";
import EligibilityCriteria from "../components/EligibilityCriteria";
import personalLoanImg from "../assets/personal loan.png";

export default function PersonalLoan() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen pt-24 text-slate-100 font-sans"
      style={{
        background:
          "radial-gradient(1200px 680px at 20% -10%, rgba(90,140,255,0.18), transparent 62%), radial-gradient(980px 580px at 100% 0%, rgba(36,107,198,0.14), transparent 60%), linear-gradient(180deg, #071327 0%, #08162b 100%)",
      }}
    >
      {/* HERO */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-blue-400 text-xs mb-3 tracking-wide">
            FAST APPROVAL LOANS
          </p>

          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Personal Loans
          </h1>

          <p className="text-gray-400 mb-6 text-sm leading-relaxed">
            Get instant personal loans with minimal paperwork. Enjoy quick approvals, flexible repayment options, and fast disbursal.
          </p>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => navigate("/tools?tool=loan-prediction")}
              className="bg-blue-600 px-6 py-2 rounded-full text-sm"
            >
              Apply Now
            </button>

            <button
              onClick={() => navigate("/emi-calculator")}
              className="bg-white/10 px-6 py-2 rounded-full text-sm"
            >
              Calculate EMI
            </button>
          </div>

          <div className="flex gap-6 text-sm text-gray-300">
            <div>
              <p className="text-xl font-bold text-white">10%</p>
              <p>Interest</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">Fast</p>
              <p>Approval</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">Zero</p>
              <p>Hidden Charges</p>
            </div>
          </div>
        </div>

                <div className="rounded-[28px] overflow-hidden border border-white/20 bg-white/[0.06] backdrop-blur-2xl shadow-[0_12px_32px_rgba(5,16,38,0.45),inset_0_1px_0_rgba(255,255,255,0.14)] h-[360px]">
          <img
            src={personalLoanImg}
            alt="personal loan"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* WHY CHOOSE */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-center text-lg font-semibold mb-10">
          Why Choose T-Home?
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { title: "Lowest Rates", desc: "Affordable interest rates tailored for you.", icon: "💰" },
            { title: "Zero Hidden Fees", desc: "Transparent pricing with no hidden costs.", icon: "🧾" },
            { title: "Doorstep Pickup", desc: "We collect documents from your location.", icon: "🚚" },
            { title: "Legal Assistance", desc: "Complete support for documentation.", icon: "⚖️" }
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/20 bg-white/[0.07] backdrop-blur-2xl shadow-[0_12px_32px_rgba(5,16,38,0.35),inset_0_1px_0_rgba(255,255,255,0.12)] p-5 flex flex-col gap-3 hover:bg-white/[0.11] transition"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-600/20 text-lg">
                {item.icon}
              </div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-gray-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PROCESS */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-center text-lg font-semibold mb-2">Simple Process</h2>
        <p className="text-center text-gray-400 text-xs mb-12">
          Getting your home loan is easier than ever
        </p>

        {/* MOBILE (vertical timeline) */}
        <div className="space-y-6 md:hidden">
          {[
            { title: "Application", desc: "Fill out the online application form with basic details." },
            { title: "Document Collection", desc: "Submit KYC, income proof, and property papers." },
            { title: "Verification", desc: "Bank verifies documents and credit score." },
            { title: "Sanction", desc: "Loan is approved with terms and conditions." },
            { title: "Disbursement", desc: "Loan amount is disbursed after agreement." }
          ].map((step, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                  {String(i + 1).padStart(2, "0")}
                </div>
                {i !== 4 && <div className="w-[2px] h-16 bg-white/20"></div>}
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 w-full hover:bg-white/10 transition">
                <p className="text-blue-400 text-xs mb-1">
                  STEP {String(i + 1).padStart(2, "0")}
                </p>
                <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
                <p className="text-gray-400 text-xs">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP (horizontal timeline) */}
        <div className="relative flex justify-between items-start hidden md:flex">
          <div className="absolute top-4 left-0 w-full h-[2px] bg-white/20"></div>

          {[
            { title: "Application", desc: "Fill out the online application form with basic details." },
            { title: "Document Collection", desc: "Submit KYC, income proof, and property papers." },
            { title: "Verification", desc: "Bank verifies documents and credit score." },
            { title: "Sanction", desc: "Loan is approved with terms and conditions." },
            { title: "Disbursement", desc: "Loan amount is disbursed after agreement." }
          ].map((step, i) => (
            <div
              key={i}
              className="relative flex flex-col items-center text-center w-full"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold z-10">
                {String(i + 1).padStart(2, "0")}
              </div>

              <p className="text-blue-400 text-xs mt-4">
                STEP {String(i + 1).padStart(2, "0")}
              </p>
              <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
              <p className="text-gray-400 text-xs max-w-[140px]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>


{/* ELIGIBILITY */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <EligibilityCriteria />
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="text-center text-lg font-semibold mb-6">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {[
            {
              q: "Is collateral required for a personal loan?",
              a: "Personal loans are generally unsecured and do not need property pledging.Approval mainly depends on financial background and credit score.",
            },
            {
              q: "How quickly is a personal loan disbursed?",
              a: "Many lenders process approved applications within a few working days.Timing varies according to verification and bank procedures.",
            },
            {
              q: "Can self-employed applicants get personal loans?",
              a: "Business owners and freelancers can apply with proper income proof.Stable earnings improve the chances of loan approval.",
            },
          ].map((faq, i) => (
            <details
              key={i}
              className="rounded-xl border border-white/20 bg-white/[0.07] backdrop-blur-2xl p-4 shadow-[0_10px_28px_rgba(5,16,38,0.25)]"
            >
              <summary className="cursor-pointer text-sm">{faq.q}</summary>
              <p className="text-gray-200 text-xs mt-2 leading-relaxed whitespace-pre-line">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="rounded-[28px] border border-white/20 bg-[linear-gradient(135deg,rgba(63,117,203,0.40),rgba(40,80,180,0.30))] backdrop-blur-2xl p-7 text-center shadow-[0_14px_40px_rgba(4,18,52,0.38),inset_0_1px_0_rgba(255,255,255,0.18)]">
          <h2 className="text-2xl font-bold mb-2">
            Ready to take the next step?
          </h2>

          <p className="text-white/80 mb-6 text-sm">
            Get funds with fast approval and minimal paperwork.
          </p>

          <div className="flex justify-center gap-4">
            <button
  onClick={() => navigate("/tools?tool=loan-prediction")}
  className="bg-white text-black px-6 py-2 rounded-full text-sm"
>
  Start Application
</button>

<button
  onClick={() => navigate("/contact")}
  className="border border-white px-6 py-2 rounded-full text-sm"
>
  Contact Support
</button>
          </div>
        </div>
      </div>
    </div>
  );
}
