import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function formatINR(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

function buildRows(principal, emi, annualRate, months) {
  const list = [];
  let opening = Number(principal || 0);
  const safeEmi = Number(emi || 0);
  const safeMonths = Number(months || 0);
  const monthlyRate = Number(annualRate || 0) / 12 / 100;

  if (!opening || !safeEmi || !safeMonths) return [];

  for (let month = 1; month <= safeMonths; month++) {
    const interestValue = opening * monthlyRate;
    const principalValue = Math.max(safeEmi - interestValue, 0);
    const closing = Math.max(opening - principalValue, 0);

    list.push({
      month,
      openingRaw: opening,
      emiRaw: safeEmi,
      principalRaw: principalValue,
      interestRaw: interestValue,
      closingRaw: closing,
      opening: formatINR(opening),
      emi: formatINR(safeEmi),
      principal: formatINR(principalValue),
      interest: formatINR(interestValue),
      closing: formatINR(closing),
    });

    opening = closing;
  }

  return list;
}

function buildChartPoints(rows, key, maxValue, width = 720, height = 150) {
  if (!rows.length || !maxValue) return "";
  return rows
    .map((row, index) => {
      const x = (index / Math.max(rows.length - 1, 1)) * width;
      const y = height - (Number(row[key] || 0) / maxValue) * height;
      return `${x},${y}`;
    })
    .join(" ");
}

export default function BalanceTransferAmortization() {
  const navigate = useNavigate();

  const report = JSON.parse(localStorage.getItem("btFinalReport") || "{}");
  const loanResult = JSON.parse(localStorage.getItem("btLoanResult") || "{}");
  const loanForm = JSON.parse(localStorage.getItem("btLoanForm") || "{}");

  const comparisons = Array.isArray(report?.bank_comparisons)
    ? report.bank_comparisons
    : [];

  const recommendedBank =
    comparisons.find(
      (b) =>
        String(b.bank_name || "").trim().toLowerCase() ===
        String(report?.recommended_bank_name || "").trim().toLowerCase()
    ) ||
    comparisons.find((b) => b.offer_source !== "CURRENT BANK") ||
    null;

  const outstandingPrincipal =
    Number(loanResult?.outstanding_principal) ||
    Math.max(
      Number(loanForm?.original_principal || 0) - Number(loanForm?.amount_paid || 0),
      0
    );

  const emi =
    Number(recommendedBank?.emi) ||
    Number(comparisons.find((b) => b.offer_source !== "CURRENT BANK")?.emi) ||
    0;

  const interestRate =
    Number(recommendedBank?.interest_rate) ||
    Number(comparisons.find((b) => b.offer_source !== "CURRENT BANK")?.interest_rate) ||
    0;

  const tenureMonths =
    Number(recommendedBank?.tenure_months) ||
    Number(loanForm?.remaining_tenure_months) ||
    0;

  const totalInterest =
    Number(recommendedBank?.interest_amount) ||
    Math.max(Number(report?.recommended_bank_outflow || 0) - outstandingPrincipal, 0);

  const totalOutflow =
    Number(recommendedBank?.total_outflow) ||
    Number(report?.recommended_bank_outflow) ||
    0;

  const allRows = useMemo(() => {
    return buildRows(outstandingPrincipal, emi, interestRate, tenureMonths);
  }, [outstandingPrincipal, emi, interestRate, tenureMonths]);

  const rowsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(allRows.length / rowsPerPage));
  const [currentPage, setCurrentPage] = useState(1);

  const visibleRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return allRows.slice(start, start + rowsPerPage);
  }, [allRows, currentPage]);

  const chartMeta = useMemo(() => {
    if (!allRows.length) return null;

    const maxValue = Math.max(
      ...allRows.map((row) =>
        Math.max(Number(row.principalRaw || 0), Number(row.interestRaw || 0))
      )
    );

    return {
      principalPoints: buildChartPoints(allRows, "principalRaw", maxValue),
      interestPoints: buildChartPoints(allRows, "interestRaw", maxValue),
      maxValue,
    };
  }, [allRows]);

  const handleExportCsv = () => {
    if (!allRows.length) return;

    const header = [
      "Month",
      "Opening Balance",
      "EMI",
      "Principal",
      "Interest",
      "Closing Balance",
    ];

    const body = allRows.map((row) => [
      row.month,
      row.opening,
      row.emi,
      row.principal,
      row.interest,
      row.closing,
    ]);

    const csv = [header, ...body].map((line) => line.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "amortization-schedule.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleExportPdf = () => {
    if (!allRows.length) return;

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
              <tr>
                <th>Month</th>
                <th>Opening Balance</th>
                <th>EMI</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>Closing Balance</th>
              </tr>
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

  const hasData = allRows.length > 0;

  return (
    <section className="relative min-h-screen overflow-hidden px-4 pb-10 pt-24 sm:px-6 md:pt-28 lg:px-8 lg:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[#020918]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,77,167,0.34),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-[1320px] rounded-[14px] border border-white/15 bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.06)_100%)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.48)] backdrop-blur-xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-[44px] font-semibold text-white">Amortization Schedule</h1>
            <p className="text-[12px] text-white/65">Month-wise breakup of principal and interest</p>
          </div>

          <div className="mt-2 flex flex-wrap gap-3 text-[12px] text-white sm:mt-1">
            <button type="button" onClick={handleExportPdf} disabled={!hasData}>
              Export PDF
            </button>
            <button type="button" onClick={handleExportCsv} disabled={!hasData}>
              Export CSV
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
          <TopCard title="EMI Amount" value={formatINR(emi)} />
          <TopCard title="Total Interest" value={formatINR(totalInterest)} />
          <TopCard title="Tenure" value={`${tenureMonths || 0} months`} />
          <TopCard title="Total Outflow" value={formatINR(totalOutflow)} />
        </div>

        {!hasData ? (
          <div className="mt-4 rounded-[10px] border border-slate-200/70 bg-[#f8fafc] p-4 text-[#1f2937]">
            <h3 className="text-[22px] font-semibold">Amortization data not available</h3>
            <p className="mt-2 text-sm text-slate-500">
              Please open the analysis page first so the report is loaded and saved.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-4 rounded-[10px] border border-slate-200/70 bg-[#f8fafc] p-4 text-[#1f2937]">
              <h3 className="text-[30px] font-semibold">Loan Breakdown Over Time</h3>
              <div className="mt-3 h-[260px] rounded-[8px] bg-white p-3">
                <svg viewBox="0 0 800 190" className="h-full w-full">
                  <line x1="40" y1="165" x2="760" y2="165" stroke="#c9d3e6" strokeWidth="1" />
                  <line x1="40" y1="20" x2="40" y2="165" stroke="#c9d3e6" strokeWidth="1" />

                  <polyline
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    points={chartMeta?.principalPoints || ""}
                  />

                  <polyline
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3"
                    points={chartMeta?.interestPoints || ""}
                  />

                  {allRows.length > 0 ? (
                    <>
                      <text x="52" y="178" fontSize="9" fill="#64748b">
                        Month 1
                      </text>
                      <text x="360" y="178" fontSize="9" fill="#64748b">
                        Month {Math.ceil(allRows.length / 2)}
                      </text>
                      <text x="700" y="178" fontSize="9" fill="#64748b">
                        Month {allRows.length}
                      </text>
                    </>
                  ) : null}

                  <circle cx="620" cy="30" r="5" fill="#f59e0b" />
                  <text x="632" y="34" fontSize="10" fill="#475569">
                    Principal
                  </text>

                  <circle cx="710" cy="30" r="5" fill="#2563eb" />
                  <text x="722" y="34" fontSize="10" fill="#475569">
                    Interest
                  </text>
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
                  <p className="text-center text-[#f97316]">{row.principal}</p>
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

                <p className="text-slate-500">
                  Page {currentPage} of {totalPages}
                </p>

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
          </>
        )}

        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/balance-transfer/analysis")}
            className="rounded-[8px] border border-white/25 bg-white px-6 py-2.5 text-[18px] font-medium text-[#0f172a] transition hover:bg-slate-100"
          >
            Back
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
