import { useNavigate } from "react-router-dom";
import React from "react";

export default function LoanAgainstProperty() {
   const navigate = useNavigate(); // ✅ CORRECT PLACE
  return (
    <div
      className="min-h-screen pt-24 text-slate-100 font-sans"
      style={{ background: "radial-gradient(1200px 680px at 20% -10%, rgba(90,140,255,0.18), transparent 62%), radial-gradient(980px 580px at 100% 0%, rgba(36,107,198,0.14), transparent 60%), linear-gradient(180deg, #071327 0%, #08162b 100%)" }}
    >

      {/* HERO */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">

        <div>
          <p className="text-blue-400 text-xs mb-3 tracking-wide">
            SECURED LOANS
          </p>

          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Loan Against Property
          </h1>

          <p className="text-gray-400 mb-6 text-sm leading-relaxed">
            Unlock the value of your property with secured loans at attractive interest rates. Flexible repayment options and quick approvals.
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

          <div className="flex gap-10 text-sm text-gray-300">
            <div>
              <p className="text-xl font-bold text-white">9%</p>
              <p>Interest</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">Fast</p>
              <p>Processing</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">Zero</p>
              <p>Hidden Charges</p>
            </div>
          </div>
        </div>

                <div className="rounded-[28px] overflow-hidden border border-white/20 bg-white/[0.06] backdrop-blur-2xl shadow-[0_12px_32px_rgba(5,16,38,0.45),inset_0_1px_0_rgba(255,255,255,0.14)] h-[360px]">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
            alt="loan against property"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* WHY CHOOSE */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-center text-lg font-semibold mb-10">
          Why Choose T-Home?
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { title: "Lowest Rates", desc: "Best-in-class rates backed by your property.", icon: "💰" },
            { title: "Zero Hidden Fees", desc: "Transparent pricing with no hidden costs.", icon: "🧾" },
            { title: "Doorstep Pickup", desc: "We collect documents from your location.", icon: "🚚" },
            { title: "Legal Assistance", desc: "Expert help for property verification.", icon: "⚖️" }
          ].map((item, i) => (
            <div key={i} className="rounded-2xl border border-white/20 bg-white/[0.07] backdrop-blur-2xl shadow-[0_12px_32px_rgba(5,16,38,0.35),inset_0_1px_0_rgba(255,255,255,0.12)] p-5 flex flex-col gap-3 hover:bg-white/[0.11] transition">
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
      <div className="max-w-5xl mx-auto px-6 py-12">
  <h2 className="text-center text-lg font-semibold mb-2">Simple Process</h2>
  <p className="text-center text-gray-400 text-xs mb-12">
    Getting your home loan is easier than ever
  </p>

  <div className="relative flex justify-between items-start">

    {/* HORIZONTAL LINE */}
    <div className="absolute top-4 left-0 w-full h-[2px] bg-white/20"></div>

    {[
      { title: "Application", desc: "Fill out the online application form with basic details." },
      { title: "Document Collection", desc: "Submit KYC, income proof, and property papers." },
      { title: "Verification", desc: "Bank verifies documents and credit score." },
      { title: "Sanction", desc: "Loan is approved with terms and conditions." },
      { title: "Disbursement", desc: "Loan amount is disbursed after agreement." }
    ].map((step, i) => (
      <div key={i} className="relative flex flex-col items-center text-center w-full">

        {/* CIRCLE */}
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold z-10">
          {String(i + 1).padStart(2, '0')}
        </div>

        {/* TEXT */}
        <p className="text-blue-400 text-xs mt-4">
          STEP {String(i + 1).padStart(2, '0')}
        </p>
        <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
        <p className="text-gray-400 text-xs max-w-[140px]">{step.desc}</p>

      </div>
    ))}
  </div>
</div>

      {/* ELIGIBILITY + DOCUMENTS */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-6">

        <div className="rounded-2xl border border-white/20 bg-white/[0.07] backdrop-blur-2xl shadow-[0_12px_32px_rgba(5,16,38,0.35),inset_0_1px_0_rgba(255,255,255,0.12)] p-6">
          <h3 className="font-semibold mb-4">Eligibility Criteria</h3>

          <ul className="space-y-2 text-gray-400 text-sm">
            <li>Salaried or self-employed</li>
            <li>Property ownership required</li>
            <li>Age between 21–65 years</li>
            <li>Stable income</li>
          </ul>

          <button className="mt-5 w-full bg-blue-600 py-2 rounded-full text-sm">
            Check Eligibility Free
          </button>
        </div>

        <div className="rounded-2xl border border-white/20 bg-white/[0.07] backdrop-blur-2xl shadow-[0_12px_32px_rgba(5,16,38,0.35),inset_0_1px_0_rgba(255,255,255,0.12)] p-6">
          <h3 className="font-semibold mb-4">Required Documents</h3>

          <div className="space-y-3">
            {["KYC Proof", "Income Proof", "Property Documents"].map((doc, i) => (
              <div key={i} className="rounded-lg border border-white/20 bg-white/[0.08] backdrop-blur-xl p-3 text-sm">
                {doc}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-center text-lg font-semibold mb-6">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {[
            "What property types are accepted?",
            "Is this different from a personal loan?",
            "Can I use property during loan tenure?"
          ].map((q, i) => (
            <details key={i} className="rounded-xl border border-white/20 bg-white/[0.07] backdrop-blur-2xl p-4 shadow-[0_10px_28px_rgba(5,16,38,0.25)]">
              <summary className="cursor-pointer text-sm">{q}</summary>
              <p className="text-gray-400 text-xs mt-2">Detailed answer goes here.</p>
            </details>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="rounded-[28px] border border-white/20 bg-[linear-gradient(135deg,rgba(63,117,203,0.40),rgba(40,80,180,0.30))] backdrop-blur-2xl p-10 text-center shadow-[0_14px_40px_rgba(4,18,52,0.38),inset_0_1px_0_rgba(255,255,255,0.18)]">
          <h2 className="text-2xl font-bold mb-2">
            Ready to take the next step?
          </h2>

          <p className="text-white/80 mb-6 text-sm">
            Get funds against your property with flexible repayment options.
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
