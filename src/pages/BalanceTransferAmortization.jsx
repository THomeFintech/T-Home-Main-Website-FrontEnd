import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function formatINR(value) {
  return `₹${Math.round(value)}`;
}

function buildRows(totalMonths = 30) {
  const list = [];
  let opening = 270000;
  const emi = 9856;
  const monthlyRate = 0.006;

  for (let month = 1; month <= totalMonths; month += 1) {
    const interestValue = Math.round(opening * monthlyRate);
    const principalValue = emi - interestValue;
    const closing = Math.max(opening - principalValue, 0);

    list.push({
      month,
      opening: formatINR(opening),
      emi: formatINR(emi),
      principal: formatINR(principalValue),
      interest: formatINR(interestValue),
      closing: formatINR(closing),
    });

    opening = closing;
  }

  return list;
}

export default function BalanceTransferAmortization() {
  const navigate = useNavigate();
  const allRows = useMemo(() => buildRows(30), []);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(allRows.length / rowsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const visibleRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return allRows.slice(start, start + rowsPerPage);
  }, [allRows, currentPage]);

  const handleExportCsv = () => {
    const header = ["Month", "Opening Balance", "EMI", "Principal", "Interest", "Closing Balance"];
    const body = allRows.map((row) => [row.month, row.opening, row.emi, row.principal, row.interest, row.closing]);
    const csv = [header, ...body].map((line) => line.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "amortization-schedule.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleExportPdf = () => {
    const rowsHtml = allRows
      .map(
        (row) =>
          `<tr><td>${row.month}</td><td>${row.opening}</td><td>${row.emi}</td><td>${row.principal}</td><td>${row.interest}</td><td>${row.closing}</td></tr>`
      )
      .join("");

    const popup = window.open("", "_blank", "width=900,height=700");
    if (!popup) return;

    popup.document.write(`
      <html>
        <head><title>Amortization Schedule</title></head>
        <body style="font-family:Arial;padding:16px;">
          <h2>Amortization Schedule</h2>
          <table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;width:100%;font-size:12px;">
            <thead>
              <tr><th>Month</th><th>Opening Balance</th><th>EMI</th><th>Principal</th><th>Interest</th><th>Closing Balance</th></tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </body>
      </html>
    `);
    popup.document.close();
    popup.focus();
    popup.print();
  };

  return (
    <section className="relative min-h-screen overflow-hidden px-4 pb-10 pt-24 sm:px-6 md:pt-28 lg:px-8 lg:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[#020918]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,77,167,0.34),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-[1320px] rounded-[14px] border border-white/15 bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.06)_100%)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.48)] backdrop-blur-xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-[44px] font-semibold text-white">Amortization Schedule</h1>
            <p className="text-[12px] text-white/65">Month-wise breakup of principal & interest</p>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-[12px] text-[#5ea0ff] sm:mt-1">
            <button type="button" onClick={handleExportPdf}>Export PDF</button>
            <button type="button" onClick={handleExportCsv}>Export CSV</button>
            <button type="button" onClick={() => navigate("/balance-transfer/detailed-table")}>← Back to Comparison</button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
          <TopCard title="EMI Amount" value="₹ 9,856" />
          <TopCard title="Total Interest Payable" value="₹ 25,688" />
          <TopCard title="Loan End Date" value="Aug 2028" />
          <TopCard title="Total Outflow" value="₹ 295,688" />
        </div>

        <div className="mt-4 rounded-[10px] border border-slate-200/70 bg-[#f8fafc] p-4 text-[#1f2937]">
          <h3 className="text-[30px] font-semibold">Loan Breakdown Over Time</h3>
          <div className="mt-3 h-[210px] rounded-[8px] bg-white p-3">
            <svg viewBox="0 0 800 190" className="h-full w-full">
              <line x1="40" y1="165" x2="760" y2="165" stroke="#c9d3e6" strokeWidth="1" />
              <line x1="40" y1="20" x2="40" y2="165" stroke="#c9d3e6" strokeWidth="1" />
              <path d="M40 25 L760 165 L40 165 Z" fill="#3b82f6" opacity="0.8" />
              <path d="M40 5 L760 165 L40 25 Z" fill="#fbbf24" opacity="0.9" />
              <circle cx="360" cy="95" r="5" fill="#1e3a8a" />
              <rect x="330" y="34" width="84" height="52" rx="8" fill="#0f172a" opacity="0.95" />
              <text x="372" y="49" fill="#e2e8f0" fontSize="10" textAnchor="middle">Month</text>
              <text x="372" y="63" fill="#ffffff" fontSize="10" textAnchor="middle">90</text>
              <text x="372" y="77" fill="#cbd5e1" fontSize="9" textAnchor="middle">Principal  ₹5.5</text>
              <text x="372" y="88" fill="#cbd5e1" fontSize="9" textAnchor="middle">Interest   ₹1.1</text>
              <text x="52" y="174" fontSize="9" fill="#64748b">Month 0</text>
              <text x="228" y="174" fontSize="9" fill="#64748b">Month 55</text>
              <text x="340" y="174" fontSize="9" fill="#64748b">Month 90</text>
              <text x="450" y="174" fontSize="9" fill="#64748b">Month 120</text>
              <text x="560" y="174" fontSize="9" fill="#64748b">Month 150</text>
              <text x="670" y="174" fontSize="9" fill="#64748b">Month 200</text>
            </svg>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-[10px] border border-slate-200/70 bg-[#f8fafc] text-[#1f2937]">
          <div className="grid grid-cols-6 bg-[#eef2f8] px-4 py-2 text-[12px] font-semibold text-[#394a68]">
            <p className="text-center">Month</p>
            <p className="text-center">Opening Balance</p>
            <p className="text-center">EMI</p>
            <p className="text-center">Principal</p>
            <p className="text-center">Interest</p>
            <p className="text-center">Closing Balance</p>
          </div>

          {visibleRows.map((row) => (
            <div key={row.month} className="grid grid-cols-6 border-t border-slate-200 px-4 py-2 text-[12px]">
              <p className="text-center">{row.month}</p>
              <p className="text-center">{row.opening}</p>
              <p className="text-center">{row.emi}</p>
              <p className="text-center text-[#f59e0b]">{row.principal}</p>
              <p className="text-center text-[#2563eb]">{row.interest}</p>
              <p className="text-center">{row.closing}</p>
            </div>
          ))}

          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-[12px]">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded bg-slate-200 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Prev
            </button>
            <p className="text-slate-500">Page {currentPage} of {totalPages}</p>
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded bg-slate-200 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Next
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/balance-transfer/detailed-table")}
            className="rounded-[8px] border border-white/25 bg-white px-6 py-2.5 text-[18px] font-medium text-[#0f172a] transition hover:bg-slate-100"
          >
            Back to Comparison
          </button>
          <button
            type="button"
            onClick={() => navigate("/balance-transfer/ready")}
            className="rounded-[8px] bg-[#1f6bff] px-7 py-2.5 text-[18px] font-medium text-white transition hover:bg-[#1c5ee0]"
          >
            Apply Balance Transfer
          </button>
        </div>
      </div>
    </section>
  );
}

function TopCard({ title, value }) {
  return (
    <div className="rounded-[10px] border border-slate-200/70 bg-[#f8fafc] p-4 text-center text-[#1f2937]">
      <p className="text-[14px] font-semibold text-[#8ca3c9]">{title}</p>
      <p className="mt-1 text-[42px] font-bold leading-none">{value}</p>
    </div>
  );
}
