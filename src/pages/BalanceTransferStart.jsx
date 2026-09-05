import React from "react";
import { useNavigate } from "react-router-dom";
import EligibilityCriteria from "../components/EligibilityCriteria";
import { ArrowRightLeft } from "lucide-react";

export default function BalanceTransferStart() {
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
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-blue-400 text-xs mb-3">TRUSTED FINANCIAL SERVICES</p>

          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Balance Transfer
          </h1>

          <p className="text-gray-400 mb-6 text-sm leading-relaxed">
            Reduce your current loan interest rates and save thousands. Transfer your existing loan to better banks with lower rates, flexible terms, and zero processing fees.
          </p>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => navigate("/balance-transfer")}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Apply Now
            </button>

            <button
              onClick={() => navigate("/emi-calculator")}
              className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300"
            >
              Calculate Savings
            </button>
          </div>

          <div className="flex gap-10 text-sm text-gray-300">
            <div>
              <p className="text-xl font-bold text-white">95%</p>
              <p>Success Rate</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">24 Hours</p>
              <p>Offers</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">Zero</p>
              <p>Fees</p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] overflow-hidden border border-white/20 bg-white/[0.06] backdrop-blur-2xl shadow-[0_12px_32px_rgba(5,16,38,0.45),inset_0_1px_0_rgba(255,255,255,0.14)] h-[360px] flex items-center justify-center">
          <div className="text-6xl opacity-20">
            <ArrowRightLeft />
          </div>
        </div>
      </div>

      {/* WHY CHOOSE */}
      <div className="max-w-7xl mx-auto px-6 py-10">
<h1 className="text-center text-3xl font-bold mb-10 text-white">
          Why Choose T-Home Balance Transfer?
        </h1>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { title: "Massive Savings", desc: "Reduce interest by 2-4% and save ₹2-5 lakhs over loan tenure.", icon: "💰" },
            { title: "Zero Processing Fee", desc: "Transfer without any hidden charges or prepayment penalties.", icon: "🆓" },
            { title: "Multiple Offers", desc: "Compare 10+ bank offers instantly and pick the best.", icon: "🏦" },
            { title: "Seamless Process", desc: "Online application with doorstep document collection.", icon: "📱" }
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/20 bg-white/[0.07] backdrop-blur-2xl shadow-[0_12px_32px_rgba(5,16,38,0.35),inset_0_1px_0_rgba(255,255,255,0.12)] p-5 flex flex-col items-start gap-3 hover:bg-white/[0.11] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-emerald-500/20 text-lg border border-emerald-500/30">
                {item.icon}
              </div>
              <h3 className="font-semibold text-white text-base">{item.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PROCESS */}
      <div className="max-w-5xl mx-auto px-6 py-12">
<h1 className="text-center text-3xl font-bold mb-10 text-white">Simple 5-Step Process</h1>
        <p className="text-center text-gray-400 text-xs mb-12">
          Switch to better rates without hassle
        </p>

        <div className="relative flex justify-between items-start">
          <div className="absolute top-8 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500/30 to-emerald-500/30"></div>

          {[
            { title: "Enter Details", desc: "Share current loan info (amount, rate, tenure)." },
            { title: "Get Offers", desc: "Receive personalized offers from top banks." },
            { title: "Compare &amp; Pick", desc: "See savings and select the best option." },
            { title: "Documents", desc: "Upload existing loan docs and KYC." },
            { title: "Transfer Complete", desc: "New loan disbursed, old closed automatically." }
          ].map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center w-full z-10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-xs font-bold text-white shadow-lg ring-4 ring-white/20">
                {i + 1}
              </div>

              <p className="text-blue-400 text-xs mt-4 font-medium">
                STEP {String(i + 1).padStart(2, '0')}
              </p>
              <h4 className="font-semibold text-sm mb-1 text-white">{step.title}</h4>
              <p className="text-gray-400 text-xs max-w-[140px] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ELIGIBILITY */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <EligibilityCriteria />
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-6 py-12">
<h1 className="text-center text-3xl font-bold mb-10 text-white">
          Frequently Asked Questions
        </h1>

        <div className="space-y-3">
          {[
            "When is the best time for balance transfer?",
            "Will there be any prepayment penalty?",
            "How much can I save on interest?",
            "What documents do I need?",
            "How long does the process take?"
          ].map((q, i) => (
            <details
              key={i}
              className="rounded-xl border border-white/20 bg-white/[0.07] backdrop-blur-2xl p-4 shadow-[0_10px_28px_rgba(5,16,38,0.25)] cursor-pointer hover:shadow-lg transition-all duration-300"
            >
              <summary className="text-sm font-medium text-white marker:text-blue-400 list-none">{q}</summary>
              <p className="text-gray-400 text-xs mt-2 pt-2 border-t border-white/10 leading-relaxed">
                Detailed answer with all specifics goes here.
              </p>
            </details>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="rounded-[28px] border border-white/20 bg-[linear-gradient(135deg,rgba(63,117,203,0.40),rgba(40,80,180,0.30))] backdrop-blur-2xl p-10 text-center shadow-[0_14px_40px_rgba(4,18,52,0.38),inset_0_1px_0_rgba(255,255,255,0.18)]">
          <h2 className="text-2xl font-bold mb-2 text-white">
            Ready to Save on Interest?
          </h2>
          <p className="text-white/80 mb-6 text-sm leading-relaxed">
            Don't overpay on your current loan. Switch now and start saving from day 1.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => navigate("/balance-transfer")}
              className="bg-white text-[#1e293b] px-8 py-3 rounded-full text-sm font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-blue-500 to-emerald-500 text-white"
            >
              Start Balance Transfer
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="border-2 border-white/50 hover:border-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-white/10 transition-all duration-300"
            >
              Talk to Expert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
