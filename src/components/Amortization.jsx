import React, { useState, useEffect, useMemo } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function AmortizationSchedule({ onBack, schedule }) {
  /* PAGINATION */
  const rowsPerPage = 12;
  const [page, setPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  console.log("Amortization schedule received:", schedule);

  /* DATA FROM BACKEND */
  const amortizationData = Array.isArray(schedule) ? schedule : [];

  /* SEARCHED DATA */
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return amortizationData;

    return amortizationData.filter((row) =>
      String(row.month).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [amortizationData, searchTerm]);

  const totalRows = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));

  const currentRows = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  /* RESET PAGE WHEN SEARCH CHANGES */
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  /* EXPORT PDF */
  const exportPDF = () => {
    const doc = new jsPDF();

    const tableColumn = ["Month", "EMI", "Principal", "Interest", "Balance"];

    const tableRows = filteredData.map((row) => [
      row.month,
      row.emi,
      row.principal,
      row.interest,
      row.balance,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("amortization_schedule.pdf");
  };

  /* EXPORT CSV */
  const exportCSV = () => {
    const headers = ["Month", "EMI", "Principal", "Interest", "Balance"];

    const rows = filteredData.map((row) => [
      row.month,
      row.emi,
      row.principal,
      row.interest,
      row.balance,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "amortization_schedule.csv");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* PAGINATION */
  const goNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const goPrev = () => {
    if (page > 1) setPage(page - 1);
  };

  /* SUMMARY VALUES */
  const summary = useMemo(() => {
    if (!amortizationData.length) {
      return {
        emi: 0,
        totalInterest: 0,
        totalPrincipal: 0,
        totalAmount: 0,
        duration: 0,
      };
    }

    const emi = Number(amortizationData[0]?.emi || 0);
    const totalInterest = amortizationData.reduce(
      (sum, row) => sum + Number(row.interest || 0),
      0
    );
    const totalPrincipal = amortizationData.reduce(
      (sum, row) => sum + Number(row.principal || 0),
      0
    );

    return {
      emi,
      totalInterest,
      totalPrincipal,
      totalAmount: totalInterest + totalPrincipal,
      duration: amortizationData.length,
    };
  }, [amortizationData]);

  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="min-h-screen w-full bg-black text-white">
      <div className="mx-auto max-w-[1400px] px-4 py-8 md:px-8 lg:px-10">
        <div
          className="min-h-screen rounded-[28px] border border-white/10 bg-cover bg-center bg-no-repeat p-5 shadow-[0_0_40px_rgba(0,0,0,0.45)] md:p-8"
          style={{
            background:
              "radial-gradient(circle at center, rgba(53,66,121,0.85) 0%, rgba(10,16,40,0.92) 45%, rgba(0,0,0,0.98) 100%)",
          }}
        >
          {/* HEADER */}
          <div className="mb-8 flex flex-col justify-between gap-6 xl:flex-row xl:items-start">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
                Amortization Schedule
              </h1>
              <p className="mt-3 text-sm text-white/70 md:text-lg">
                Month-wise breakup of principal & interest
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={exportPDF}
                className="rounded-2xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/15"
              >
                Export PDF
              </button>

              <button
                onClick={exportCSV}
                className="rounded-2xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/15"
              >
                Export CSV
              </button>

              <button
                onClick={onBack}
                className="rounded-2xl border border-[#4b8dff]/40 bg-[#17325d]/70 px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1f4278]"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* SUMMARY CARDS */}
          <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[24px] border border-[#1f2f4f] bg-[#f3f4f6] px-6 py-5 text-[#202938] shadow-[0_8px_25px_rgba(0,0,0,0.28)]">
              <p className="text-xl font-medium">Monthly EMI</p>
              <h3 className="mt-2 text-3xl font-bold md:text-4xl">
                {formatCurrency(summary.emi)}
              </h3>
              <p className="mt-2 text-sm font-medium text-emerald-600">
                Fixed Monthly
              </p>
            </div>

            <div className="rounded-[24px] border border-[#1f2f4f] bg-[#f3f4f6] px-6 py-5 text-[#202938] shadow-[0_8px_25px_rgba(0,0,0,0.28)]">
              <p className="text-xl font-medium">Total Interest</p>
              <h3 className="mt-2 text-3xl font-bold md:text-4xl">
                {formatCurrency(summary.totalInterest)}
              </h3>
              <p className="mt-2 text-sm font-medium text-[#4b8dff]">
                Interest Component
              </p>
            </div>

            <div className="rounded-[24px] border border-[#1f2f4f] bg-[#f3f4f6] px-6 py-5 text-[#202938] shadow-[0_8px_25px_rgba(0,0,0,0.28)]">
              <p className="text-xl font-medium">Loan Duration</p>
              <h3 className="mt-2 text-3xl font-bold md:text-4xl">
                {summary.duration} Months
              </h3>
              <p className="mt-2 text-sm font-medium text-slate-500">
                Total Repayment Period
              </p>
            </div>

            <div className="rounded-[24px] border border-[#1f2f4f] bg-[#f3f4f6] px-6 py-5 text-[#202938] shadow-[0_8px_25px_rgba(0,0,0,0.28)]">
              <p className="text-xl font-medium">Total Amount</p>
              <h3 className="mt-2 text-3xl font-bold md:text-4xl">
                {formatCurrency(summary.totalAmount)}
              </h3>
              <p className="mt-2 text-sm font-medium text-slate-500">
                Principal + Interest
              </p>
            </div>
          </div>

          {/* CHART SECTION */}
          <div className="mb-10 rounded-[28px] border border-white/15 bg-white/[0.06] p-6 shadow-[0_10px_35px_rgba(0,0,0,0.3)] backdrop-blur-md">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-2xl font-semibold text-white">
                Loan Breakdown Over Time
              </h2>

              <div className="mt-4 flex gap-4 text-sm text-white/70 md:mt-0">
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-blue-400"></span>
                  Principal
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-orange-400"></span>
                  Interest
                </span>
              </div>
            </div>

            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={amortizationData}>
                  <defs>
                    <linearGradient
                      id="principalGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                    </linearGradient>

                    <linearGradient
                      id="interestGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#fb923c" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />

                  <XAxis
                    dataKey="month"
                    stroke="#9ca3af"
                    tick={{ fontSize: 12 }}
                  />

                  <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="principal"
                    stroke="#60a5fa"
                    fillOpacity={1}
                    fill="url(#principalGradient)"
                  />

                  <Area
                    type="monotone"
                    dataKey="interest"
                    stroke="#fb923c"
                    fillOpacity={1}
                    fill="url(#interestGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="overflow-hidden rounded-[28px] border border-white/15 bg-white/[0.06] shadow-[0_10px_35px_rgba(0,0,0,0.3)] backdrop-blur-md">
            <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-6">
              <h2 className="text-2xl font-semibold text-white">
                Payment Schedule
              </h2>

              <div className="w-full md:w-[260px]">
                <input
                  type="text"
                  placeholder="Search month..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#4b8dff]/60"
                />
              </div>
            </div>

            {filteredData.length === 0 ? (
              <div className="px-6 py-16 text-center text-base text-white/70">
                No amortization data available.
              </div>
            ) : (
              <>
                <div className="hidden overflow-x-auto md:block">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-[#14304f]/80 text-[#4fa3ff]">
                        <th className="px-6 py-5 text-left text-lg font-semibold">
                          Month
                        </th>
                        <th className="px-6 py-5 text-left text-lg font-semibold">
                          EMI
                        </th>
                        <th className="px-6 py-5 text-left text-lg font-semibold">
                          Principal
                        </th>
                        <th className="px-6 py-5 text-left text-lg font-semibold">
                          Interest
                        </th>
                        <th className="px-6 py-5 text-left text-lg font-semibold">
                          Balance
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {currentRows.map((row, index) => (
                        <tr
                          key={index}
                          className="border-t border-white/8 text-white/90 transition hover:bg-white/[0.03]"
                        >
                          <td className="px-6 py-5 font-medium">{row.month}</td>
                          <td className="px-6 py-5">
                            {formatCurrency(row.emi)}
                          </td>
                          <td className="px-6 py-5 font-semibold text-emerald-400">
                            {formatCurrency(row.principal)}
                          </td>
                          <td className="px-6 py-5 font-semibold text-red-400">
                            {formatCurrency(row.interest)}
                          </td>
                          <td className="px-6 py-5">
                            {formatCurrency(row.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-4 p-4 md:hidden">
                  {currentRows.map((row, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-white/10 bg-white/[0.05] p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-base font-semibold text-white">
                          {row.month}
                        </h3>
                        <span className="text-sm text-white/60">EMI</span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between gap-4">
                          <span className="text-white/60">EMI</span>
                          <span className="font-medium text-white">
                            {formatCurrency(row.emi)}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4">
                          <span className="text-white/60">Principal</span>
                          <span className="font-medium text-emerald-400">
                            {formatCurrency(row.principal)}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4">
                          <span className="text-white/60">Interest</span>
                          <span className="font-medium text-red-400">
                            {formatCurrency(row.interest)}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4">
                          <span className="text-white/60">Balance</span>
                          <span className="font-medium text-white">
                            {formatCurrency(row.balance)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="flex flex-col gap-4 border-t border-white/10 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-6">
              <p className="text-sm text-white/55">
                Showing{" "}
                {filteredData.length === 0 ? 0 : (page - 1) * rowsPerPage + 1} to{" "}
                {Math.min(page * rowsPerPage, filteredData.length)} of{" "}
                {filteredData.length} payments
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={goPrev}
                  disabled={page === 1}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Prev
                </button>

                {!isMobile && (
                  <span className="rounded-xl bg-[#4b8dff] px-4 py-2 text-sm font-semibold text-white">
                    Page {page} / {totalPages}
                  </span>
                )}

                {isMobile && (
                  <span className="rounded-xl bg-[#4b8dff] px-4 py-2 text-sm font-semibold text-white">
                    {page}/{totalPages}
                  </span>
                )}

                <button
                  onClick={goNext}
                  disabled={page === totalPages}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}