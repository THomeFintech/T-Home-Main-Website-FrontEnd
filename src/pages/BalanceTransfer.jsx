import React from "react";
import { useNavigate } from "react-router-dom";
import EligibilityCriteria from "../components/EligibilityCriteria";
import { ArrowRightLeft } from "lucide-react";
import BalanceTransferImg from "../assets/Balance transfer.png";

export default function BalanceTransfer() {
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
      <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-blue-400 text-xs mb-3">TRUSTED FINANCIAL SERVICES</p>

          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Balance Transfer
          </h1>

          <p className="text-gray-400 mb-6 text-sm leading-relaxed">
            Reduce your current loan interest rates and save thousands. Transfer your existing loan to better banks with lower rates, flexible terms, and zero processing fees.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              onClick={() => navigate("/coming-soon")}
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

          <div className="flex flex-wrap gap-6 text-sm text-gray-300 justify-center sm:justify-start">
            <div>
              <p className="text-xl font-bold text-white">95%</p>
              <p className="text-xs">Success Rate</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">24 Hours</p>
              <p className="text-xs">Offers</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">Zero</p>
              <p className="text-xs">Fees</p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] overflow-hidden border border-white/20 bg-white/[0.06] backdrop-blur-2xl shadow-[0_12px_32px_rgba(5,16,38,0.45),inset_0_1px_0_rgba(255,255,255,0.14)] h-[360px]">
  <img
            src={BalanceTransferImg}
            alt="Balance Transfer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* WHY CHOOSE */}
      <div className="max-w-7xl mx-auto px-4 py-10">
<h1 className="text-center text-3xl font-bold mb-10 text-white">
          Why Choose T-Home Balance Transfer?
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-600/20 text-lg border border-blue-500/30">
                {item.icon}
              </div>
              <h3 className="font-semibold text-white text-base">{item.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PROCESS */}
      <div className="max-w-5xl mx-auto px-4 py-12">
<h1 className="text-center text-3xl font-bold mb-10 text-white">Simple Process</h1>
        <p className="text-center text-gray-400 text-xs mb-12">
          
        </p>

        <div className="relative flex justify-center items-start max-w-4xl mx-auto">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-[400px] h-[2px] bg-white/20 rounded-full"></div>

          {[
            { title: "Application", desc: "Fill out the online form with your current loan details." },
            { title: "Document Collection", desc: "Submit KYC and existing loan statements." },
            { title: "Verification", desc: "Our team verifies your details and credit." },
            { title: "Offers", desc: "Receive and compare multiple bank offers." },
            { title: "Transfer", desc: "New loan disbursed, old loan closed." }
          ].map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center flex-1">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-lg z-10 mb-3">
                0{String(i + 1)}
              </div>

              <p className="text-blue-400 text-xs font-medium mb-2">
                STEP 0{String(i + 1)}
              </p>
              <h4 className="font-semibold text-sm mb-1 text-white">{step.title}</h4>
              <p className="text-gray-400 text-xs max-w-[140px]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ELIGIBILITY */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <EligibilityCriteria />
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4 py-12">
<h1 className="text-center text-3xl font-bold mb-10 text-white">
          Frequently Asked Questions
        </h1>

        <div className="space-y-3">
          {[
            "What is the maximum tenure for a balance transfer?",
            "Can I prepay my balance transfer loan?",
            "Do I need a co-applicant?",
            "What is the processing time?"
          ].map((q, i) => (
            <details
              key={i}
              className="rounded-xl border border-white/20 bg-white/[0.07] backdrop-blur-2xl p-4 shadow-[0_10px_28px_rgba(5,16,38,0.25)] cursor-pointer"
            >
              <summary className="cursor-pointer text-sm font-medium text-white">{q}</summary>
              <p className="text-gray-400 text-xs mt-2 pt-2 border-t border-white/10">Detailed answer goes here.</p>
            </details>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="rounded-[28px] border border-white/20 bg-[linear-gradient(135deg,rgba(63,117,203,0.40),rgba(40,80,180,0.30))] backdrop-blur-2xl p-10 text-center shadow-[0_14px_40px_rgba(4,18,52,0.38),inset_0_1px_0_rgba(255,255,255,0.18)]">
          <h2 className="text-2xl font-bold mb-2 text-white">
            Ready to Save on Interest?
          </h2>
          <p className="text-white/80 mb-6 text-sm">
            Experience the future of balance transfer. Get started now and save thousands.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/balance-transfer/details")}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-full text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Apply Now
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="border border-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:bg-white/10"
            >
              Talk to Advisor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
