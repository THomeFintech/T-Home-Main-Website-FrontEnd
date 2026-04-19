import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Copy, FileText, FileSpreadsheet, Building2, UserRound } from "lucide-react";

export default function BalanceTransferReady() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const transferId = "BT-2026-1346";

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(transferId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  const downloadFile = (filename, content, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleDownloadPdf = () => {
    const html = `Balance Transfer Analysis\nID: ${transferId}\nRecommended Bank: AXIS BANK\nEstimated Net Savings: ₹4,966\nStatus: Transfer Approved`;
    downloadFile("balance-transfer-analysis.txt", html, "text/plain;charset=utf-8;");
  };

  const handleDownloadCsv = () => {
    const csv = [
      "metric,value",
      `transfer_id,${transferId}`,
      "recommended_bank,AXIS BANK",
      "estimated_net_savings,4966",
      "status,Transfer Approved",
    ].join("\n");
    downloadFile("balance-transfer-analysis.csv", csv, "text/csv;charset=utf-8;");
  };

  return (
    <section className="relative min-h-screen overflow-hidden px-4 pb-10 pt-24 font-['Outfit',sans-serif] sm:px-6 md:pt-28 lg:px-8 lg:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[#020918]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,77,167,0.34),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-[1320px] rounded-[14px] border border-white/15 bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.06)_100%)] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.48)] backdrop-blur-xl sm:p-6">
        <div className="mx-auto max-w-[960px] text-center">
          <div className="mx-auto mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/60 bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 size={18} />
          </div>
          <h1 className="text-[30px] font-semibold leading-tight text-white sm:text-[36px] md:text-[42px]">
            Your <span className="text-[#1f6bff]">Balance Transfer Analysis</span> Is Ready
          </h1>
          <p className="mt-1 text-[12px] text-white/65 sm:text-[13px]">You can download, share, or take the next step anytime.</p>

          <div className="mx-auto mt-4 max-w-[620px] rounded-[10px] border border-slate-200/70 bg-[#f8fafc] px-4 py-4 text-[#1f2937] sm:px-5">
            <p className="text-[12px] sm:text-[13px]">Recommended Bank: <span className="rounded-sm bg-[#8d1f50] px-2 py-0.5 text-[10px] font-semibold text-white">AXIS BANK</span></p>
            <p className="mt-2 text-[12px] sm:text-[13px]">Estimated Net Savings: <span className="font-semibold text-emerald-600">₹4,966</span> <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Transfer Approved</span></p>
          </div>

          <div className="mx-auto mt-4 max-w-[820px] rounded-[10px] border border-white/15 bg-[rgba(255,255,255,0.05)] px-4 py-3 text-left">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] text-white/55">Balance Transfer Reference ID</p>
                <p className="text-[24px] font-semibold text-white sm:text-[28px]">{transferId}</p>
              </div>
              <button
                type="button"
                onClick={handleCopyId}
                className="inline-flex w-full items-center justify-center gap-1 rounded-[8px] bg-[#1f6bff] px-4 py-2 text-[12px] font-medium text-white hover:bg-[#1c5ee0] sm:w-auto sm:text-[13px]"
              >
                <Copy size={13} /> {copied ? "Copied" : "Copy ID"}
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-[1180px]">
          <h3 className="text-[24px] font-semibold text-white sm:text-[28px]">Export Your Report</h3>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            <ActionCard
              icon={<FileText size={28} className="text-rose-500" />}
              title="Export as PDF"
              subtitle="Advisor-ready report"
              buttonText="Download PDF"
              onClick={handleDownloadPdf}
            />
            <ActionCard
              icon={<FileSpreadsheet size={28} className="text-emerald-500" />}
              title="Export as CSV"
              subtitle="For personal analysis"
              buttonText="Download CSV"
              onClick={handleDownloadCsv}
            />
          </div>

          <h3 className="mt-4 text-[24px] font-semibold text-white sm:text-[28px]">Take Next Step</h3>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            <ActionCard
              icon={<Building2 size={28} className="text-[#1f6bff]" />}
              title="Apply for balance transfer"
              subtitle="Proceed with the recommended bank and start your transfer process."
              buttonText="Apply Now"
              onClick={() => navigate("/balance-transfer/application-portal")}
            />
            <ActionCard
              icon={<UserRound size={28} className="text-[#1f2937]" />}
              title="Talk to a Loan Expert"
              subtitle="Get advice and discuss your options with our loan advisor."
              buttonText="Talk to an Expert"
              onClick={() => navigate("/contact")}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] text-white/80 sm:gap-8 sm:text-[12px]">
            <p>Your data is secure</p>
            <p>AI-powered recommendations</p>
            <p>No obligation to proceed</p>
          </div>

          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/balance-transfer/amortization")}
              className="w-full rounded-[8px] border border-white/25 bg-white px-6 py-2.5 text-[14px] font-medium text-[#0f172a] transition hover:bg-slate-100 sm:w-auto sm:text-[16px]"
            >
              Back to Amortization
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full rounded-[8px] bg-[#1f6bff] px-7 py-2.5 text-[14px] font-medium text-white transition hover:bg-[#1c5ee0] sm:w-auto sm:text-[16px]"
            >
              Save & Exit
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ActionCard({ icon, title, subtitle, buttonText, onClick }) {
  return (
    <div className="rounded-[10px] border border-slate-200/70 bg-[#f8fafc] p-4 text-center text-[#1f2937] sm:p-5">
      <div className="mx-auto w-fit">{icon}</div>
      <p className="mt-2 text-[16px] font-semibold sm:text-[18px]">{title}</p>
      <p className="mt-1 text-[11px] text-slate-500 sm:text-[12px]">{subtitle}</p>
      <button
        type="button"
        onClick={onClick}
        className="mt-3 rounded-[7px] bg-[#1f6bff] px-4 py-1.5 text-[12px] font-medium text-white hover:bg-[#1c5ee0] sm:text-[13px]"
      >
        {buttonText}
      </button>
    </div>
  );
}
