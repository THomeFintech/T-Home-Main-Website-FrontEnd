import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ClipboardList, Phone, FileText, Landmark } from "lucide-react";

export default function BalanceTransferSubmitted() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const referenceId = "BT-2026-1346";

  const handleCopy = () => {
    navigator.clipboard.writeText(referenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <section className="relative min-h-screen overflow-hidden px-4 pb-10 pt-24 font-['Outfit',sans-serif] sm:px-6 md:pt-28 lg:px-8 lg:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[#020918]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,77,167,0.34),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-[900px] rounded-[14px] border border-white/15 bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.06)_100%)] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.48)] backdrop-blur-xl sm:p-6 flex flex-col items-center">
        <CheckCircle size={70} className="text-emerald-400 mb-4 mt-2" />
        <h1 className="text-center text-[38px] sm:text-[48px] md:text-[56px] font-bold leading-tight text-white mb-2">Application Submitted</h1>
        <p className="text-center text-[16px] text-white/70 mb-6">Your loan application has been received. Our team will review your documents and contact you within 24–48 hours.</p>

        <div className="w-full max-w-[520px] rounded-[12px] border border-white/15 bg-[rgba(255,255,255,0.08)] p-4 flex flex-col sm:flex-row items-center gap-3 mb-7">
          <div className="flex items-center gap-2 flex-1">
            <ClipboardList size={22} className="text-[#5ea0ff]" />
            <div>
              <div className="text-[13px] text-white/70">Loan Reference ID</div>
              <div className="text-[18px] font-semibold text-white tracking-wide">{referenceId}</div>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="rounded-[8px] bg-[#1f6bff] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#1c5ee0] flex items-center gap-2"
          >
            {copied ? "Copied!" : "Copy ID"}
          </button>
        </div>

        <div className="w-full max-w-[900px]">
          <div className="text-[20px] font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1f6bff] mr-2" /> Tracking Progress
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <StatusCard
              icon={<FileText size={22} />}
              title="Under Review"
              status="Active"
              active
            />
            <StatusCard
              icon={<Phone size={22} />}
              title="Team calls within 24h"
              status="Wait for call"
              subStatus="PENDING"
            />
            <StatusCard
              icon={<FileText size={22} />}
              title="Documents verified"
              status="Post-call stage"
              subStatus="QUEUED"
            />
            <StatusCard
              icon={<Landmark size={22} />}
              title="Bank matching starts"
              status="Final approval"
              subStatus="FINAL"
            />
          </div>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-10 rounded-[8px] bg-[#1f6bff] px-8 py-3 text-[16px] font-medium text-white hover:bg-[#1c5ee0]"
        >
          Go To Dashboard →
        </button>
      </div>
    </section>
  );
}

function StatusCard({ icon, title, status, active, subStatus }) {
  return (
    <div className={`flex flex-col gap-1 rounded-[12px] border p-4 min-h-[120px] ${active ? 'border-[#1f6bff] bg-[rgba(47,124,255,0.07)] shadow-[0_0_0_2px_#1f6bff33]' : 'border-white/15 bg-[rgba(255,255,255,0.04)]'}`}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-[15px] font-semibold text-white">{title}</span>
        {active && <CheckCircle size={18} className="text-[#1f6bff] ml-auto" />}
      </div>
      <div className="text-[13px] text-white/80">Status: {status}</div>
      {subStatus && <div className="text-[11px] text-white/50">{subStatus}</div>}
    </div>
  );
}
