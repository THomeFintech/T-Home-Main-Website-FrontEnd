// PRODUCTION-GRADE EMI CALCULATOR (MODULAR + ANIMATED)

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";
import { downloadEmiPDF } from "../utils/downloadEmiPDF";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ---------- DESIGN TOKENS ----------
const colors = {
  bg: "",
  card: "rounded-[22px] border border-white/15 bg-white/[0.07] backdrop-blur-2xl shadow-[0_12px_34px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)]",
  primary: "#2563eb",
  accent: "#f59e0b",
};

// ---------- UTIL FUNCTIONS ----------
const calculateEMI = (P, annualRate, months) => {
  const principal = Number(P);
  const n = Number(months);
  const r = Number(annualRate) / 12 / 100;

  if (principal <= 0 || n <= 0) return 0;

  if (r === 0) return +(principal / n).toFixed(2);

  const pow = Math.pow(1 + r, n);

  const emi = (principal * r * pow) / (pow - 1);

  return +emi.toFixed(2);
};

const generateSchedule = (P, annualRate, months) => {
  const emi = calculateEMI(P, annualRate, months);

  const r = annualRate / 12 / 100;

  let balance = P;

  const schedule = [];

  for (let i = 1; i <= months; i++) {
    const interest = +(balance * r).toFixed(2);

    let principal = +(emi - interest).toFixed(2);

    // FINAL PAYMENT FIX (CRITICAL)
    if (i === months) {
      principal = balance;
    }

    balance = +(balance - principal).toFixed(2);

    schedule.push({
      month: i,
      principal,
      interest,
      balance: balance < 0 ? 0 : balance,
    });
  }

  return schedule;
};

// Utility to download CSV
function downloadCSV(schedule) {
  const header = ["Month", "Principal", "Interest", "Balance"];
  const rows = schedule.map(row => [row.month, row.principal, row.interest, row.balance]);
  const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "emi_schedule.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---------- ANIMATION ----------
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// ---------- COMPONENTS ----------

const SliderInput = ({ label, value, setValue, min, max, step }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm text-gray-300">
      <span>{label}</span>
      <span className="bg-white/10 px-2 py-1 rounded-md">{value}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => setValue(+e.target.value)}
      className="w-full accent-blue-500"
    />
  </div>
);

const StatCard = ({ title, value }) => (
  <motion.div variants={fadeUp} className={`${colors.card} w-full max-w-[360px] sm:max-w-[420px] md:max-w-none mx-auto md:mx-0 p-4 rounded-2xl shadow-lg`}>
    <p className="text-gray-400 text-xs sm:text-sm">{title}</p>
    <h2 className="text-xl sm:text-2xl font-semibold mt-1">₹{value}</h2>
  </motion.div>
);

const PieBreakdown = ({ data, amount = 0, interest = 0 }) => {

  // ✅ calculate percentage safely
  const total = amount + interest;
  const principalPercent = total ? ((amount / total) * 100).toFixed(0) : 0;
  

  return (
    <motion.div
      variants={fadeUp}
      className="relative w-full max-w-[360px] sm:max-w-[420px] md:max-w-none mx-auto md:mx-0 rounded-[22px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl"
    >
      <div className="relative z-10 flex flex-col">

        <h3 className="text-sm text-white mb-3">
          Payment Breakdown
        </h3>

        {/* CHART + CENTER TEXT */}
        <div className="relative flex justify-center items-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
              >
                <Cell fill="#3B82F6" />
                <Cell fill="#F59E0B" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* ✅ CENTER PERCENTAGE */}
          <div className="absolute flex flex-col items-center">
            <span className="text-xl font-semibold text-white">
              {principalPercent}%
            </span>
            <span className="text-xs text-white/60">
              Principal
            </span>
          </div>
        </div>

        {/* LEGEND */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm text-white/70">
            <span>Principal</span>
            <span>₹{amount.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-sm text-white/70">
            <span>Interest</span>
            <span>₹{Math.round(interest).toLocaleString()}</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

const BalanceChart = ({ data }) => (
  <motion.div variants={fadeUp} className={`${colors.card} w-full max-w-[360px] sm:max-w-[420px] md:max-w-none mx-auto md:mx-0 p-4 rounded-2xl h-72`}>
    <h3 className="mb-2">Loan Balance</h3>
    <ResponsiveContainer>
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <Tooltip />
        <Bar dataKey="balance" fill="#2563eb" />
      </BarChart>
    </ResponsiveContainer>
  </motion.div>
);

const Table = ({ data }) => (
  <motion.div variants={fadeUp} className={`${colors.card} w-full max-w-[360px] sm:max-w-[420px] md:max-w-none mx-auto md:mx-0 p-3 sm:p-4 rounded-2xl max-h-72 overflow-auto`}>
    <h3 className="mb-2 text-sm sm:text-base">Amortization</h3>
    <table className="min-w-[520px] w-full text-xs sm:text-sm">
      <thead className="text-gray-400">
        <tr>
          <th>Month</th>
          <th>Principal</th>
          <th>Interest</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.month} className="border-t border-white/10">
            <td className="py-1.5">{row.month}</td>
            <td className="py-1.5">₹{row.principal}</td>
            <td className="py-1.5">₹{row.interest}</td>
            <td className="py-1.5">₹{row.balance}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </motion.div>
);

// ---------- MAIN ----------
export default function EMIPage() {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(5);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const months = years * 12;

  const emi = useMemo(() => calculateEMI(amount, rate, months), [amount, rate, months]);
  const schedule = useMemo(() => generateSchedule(amount, rate, months), [amount, rate, months]);

  const total = emi * months;
  const interest = total - amount;

  const pieData = [
    { name: "Principal", value: amount },
    { name: "Interest", value: interest },
  ];

  // Center the form on initial load, then move left when analytics are shown
  return (
    <div
      className="min-h-screen px-2 sm:px-6 lg:px-8 pb-8 sm:pb-10 pt-24 sm:pt-28 lg:pt-32 text-slate-100"
      style={{ background: "radial-gradient(64.07% 159.91% at 50% 0%, #112240 0%, #0B1220 80%)" }}
    >
      <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center">
        EMI Calculator
      </motion.h1>

      <div className={showAnalytics ? "grid lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8" : "flex justify-center items-center min-h-[60vh]"}>
        {/* LEFT */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="self-start mx-auto lg:mx-0 w-[96vw] max-w-[440px] sm:w-full sm:max-w-[460px] lg:max-w-[500px] rounded-[26px] border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.11)_0%,rgba(255,255,255,0.04)_100%)] p-5 sm:p-6 lg:p-7 shadow-[0_18px_50px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.10)] backdrop-blur-2xl"
        >
          {/* TITLE */}
          <h2 className="text-[24px] sm:text-2xl font-semibold text-white leading-none">
            Loan Details
          </h2>
          <p className="text-[12px] sm:text-sm text-white/70 mt-2 mb-6 sm:mb-6 leading-[1.35]">
            Adjust the sliders to calculate your EMI
          </p>

          {/* LOAN AMOUNT */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[13px] text-white/75 font-medium">Loan Amount</span>
              <span className="bg-white/90 text-blue-600 text-[13px] px-3 py-1 rounded-[8px] font-semibold">
                ₹{amount.toLocaleString()}
              </span>
            </div>

            <input
              type="range"
              min={5000}
              max={1000000}
              step={5000}
              value={amount}
              onChange={(e) => setAmount(+e.target.value)}
              className="w-full accent-blue-500"
            />

            <div className="flex justify-between text-[12px] text-white/40 mt-1">
              <span>₹5k</span>
              <span>₹1M</span>
            </div>
          </div>

          {/* INTEREST RATE */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[13px] text-white/75 font-medium">Interest Rate (%)</span>
              <span className="bg-white/90 text-blue-600 text-[13px] px-3 py-1 rounded-[8px] font-semibold">
                {rate}%
              </span>
            </div>

            <input
              type="range"
              min={1}
              max={25}
              step={0.1}
              value={rate}
              onChange={(e) => setRate(+e.target.value)}
              className="w-full accent-blue-500"
            />

            <div className="flex justify-between text-[12px] text-white/40 mt-1">
              <span>1%</span>
              <span>25%</span>
            </div>
          </div>

          {/* TENURE */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[13px] text-white/75 font-medium">Loan Tenure</span>

              {/* Toggle */}
              <div className="flex bg-white/10 rounded-[8px] overflow-hidden text-[11px] border border-white/15">
                <button className="px-3 py-1 bg-white text-black font-semibold">
                  Years
                </button>
                <button className="px-3 py-1 text-white/60 font-semibold">
                  Months
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-400 text-[20px] font-semibold leading-none">
                {years} Years
              </span>
              <span className="bg-white/90 text-blue-600 text-[13px] px-3 py-1 rounded-[8px] font-semibold">
                {years}
              </span>
            </div>

            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={years}
              onChange={(e) => setYears(+e.target.value)}
              className="w-full accent-blue-500"
            />

            <div className="flex justify-between text-[12px] text-white/40 mt-1">
              <span>1 Year</span>
              <span>30 Years</span>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="mt-6 space-y-3.5">

            <button
              className="w-full rounded-[16px] bg-gradient-to-r from-blue-600 to-blue-500 py-3.5 text-white text-[16px] font-semibold shadow-[0_10px_30px_rgba(37,99,235,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              onClick={e => { e.preventDefault(); setShowAnalytics(true); }}
            >
              Calculate Now
            </button>

            <button className="w-full rounded-[16px] border border-white/35 py-3.5 text-white/90 text-[15px] font-semibold 
            hover:bg-white/10 transition-all">
              ▶ Apply for Loan
            </button>

          </div>
        </motion.div>
        {/* RIGHT */}
        {showAnalytics && (
          <div className="col-span-2 space-y-4 sm:space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <StatCard title="Monthly EMI" value={emi.toFixed(2)} />
              <StatCard title="Total Interest" value={interest.toFixed(2)} />
              <StatCard title="Total Amount" value={total.toFixed(2)} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <PieBreakdown data={pieData} amount={amount} interest={interest} />
              <BalanceChart data={schedule.slice(0, 12)} />
            </div>

            <Table data={schedule.slice(0, 12)} />
            {/* ---------- EMI SCHEDULE INFO + HEALTH ---------- */}
            <div className="mt-10 space-y-8">

              {/* TOP ROW */}
              <div className="grid md:grid-cols-2 gap-6">

                {/* EMI SCHEDULE INFO */}
                <motion.div
                  variants={fadeUp}
                  className="rounded-[20px] border border-white/10 bg-gradient-to-br from-[#1a2238] to-[#0b1220] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
                >
                  <h3 className="text-white font-medium text-lg mb-2">
                    EMI Schedule Info
                  </h3>
                  <p className="text-sm text-white/60 mb-5">
                    Your estimated monthly repayment details for the next 60 months.
                  </p>

                  {/* FIRST PAYMENT */}
                  <div className="flex justify-between items-center bg-white/90 text-black rounded-md px-4 py-3 mb-3">
                    <span className="text-sm font-medium">📅 First Payment</span>
                    <span className="text-sm font-semibold">OCT 15, 2023</span>
                  </div>

                  {/* LAST PAYMENT */}
                  <div className="flex justify-between items-center bg-white/90 text-black rounded-md px-4 py-3 mb-5">
                    <span className="text-sm font-medium">📅 Last Payment</span>
                    <span className="text-sm font-semibold">SEP 15, 2028</span>
                  </div>

                  <button
                    className="w-full rounded-[12px] bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-500 transition"
                    onClick={() => {
                      // --- PDF GENERATION (ALL ANALYTICS) ---
                      const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
                      const logoUrl = "/home/logo.png";
                      // Header
                      doc.addImage(logoUrl, "PNG", 36, 24, 54, 54);
                      doc.setFontSize(18);
                      doc.setFont("helvetica", "bold");
                      doc.text("T-Home Fintech", 110, 48);
                      doc.setFontSize(10);
                      doc.setFont("helvetica", "normal");
                      doc.text("DPIIT Recognized & Certified by Startup India", 110, 62);

                      // Title
                      doc.setFontSize(14);
                      doc.setFont("helvetica", "bold");
                      doc.text("T-Home EMI Amortization Schedule", 50, 110);

                      // Loan/EMI Details
                      doc.setFontSize(11);
                      doc.setFont("helvetica", "normal");
                      doc.setFillColor(245, 248, 255);
                      doc.roundedRect(50, 120, 500, 70, 8, 8, 'F');
                      doc.setFont("helvetica", "bold");
                      doc.text("Loan Details", 70, 140);
                      doc.text("EMI Details", 320, 140);
                      doc.setFont("helvetica", "normal");
                      doc.text(`Loan Amount:  ₹${amount}`, 70, 158);
                      doc.text(`Annual Interest Rate:  ${rate}%`, 70, 172);
                      doc.text(`Tenure:  ${years} years`, 70, 186);
                      doc.text(`Payment Frequency:  Monthly`, 70, 200);
                      doc.text(`Monthly EMI:  ₹${emi.toFixed(2)}`, 320, 158);
                      doc.text(`Total Interest:  ₹${interest.toFixed(2)}`, 320, 172);
                      doc.text(`Total Payment:  ₹${total.toFixed(2)}`, 320, 186);

                      // Pie Breakdown
                      doc.setFontSize(13);
                      doc.setFont("helvetica", "bold");
                      doc.text("Payment Breakdown", 50, 230);
                      doc.setFontSize(10);
                      doc.setFont("helvetica", "normal");
                      doc.text(`Principal: ₹${amount.toLocaleString()}`, 70, 250);
                      doc.text(`Interest: ₹${Math.round(interest).toLocaleString()}`, 220, 250);
                      doc.text(`Principal %: ${((amount/(amount+interest))*100).toFixed(1)}%`, 370, 250);
                      doc.text(`Interest %: ${((interest/(amount+interest))*100).toFixed(1)}%`, 470, 250);

                      // Amortization Table
                      doc.setFontSize(13);
                      doc.setFont("helvetica", "bold");
                      doc.text("Monthly Amortization Schedule", 50, 280);
                      doc.setFontSize(10);
                      doc.setFont("helvetica", "normal");
                      autoTable(doc, {
                        startY: 290,
                        head: [["Month", "Principal", "Interest", "Balance"]],
                        body: schedule.map((row) => [
                          row.month,
                          `₹${row.principal}`,
                          `₹${row.interest}`,
                          `₹${row.balance}`,
                        ]),
                        theme: "grid",
                        styles: {
                          font: "helvetica",
                          fontSize: 9,
                          cellPadding: 4,
                          valign: "middle",
                          halign: "center",
                        },
                        headStyles: {
                          fillColor: [37, 99, 235],
                          textColor: 255,
                          fontStyle: "bold",
                        },
                        alternateRowStyles: { fillColor: [245, 248, 255] },
                        margin: { left: 50, right: 50 },
                        tableWidth: 500,
                      });

                      // EMI Health Section
                      let y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 30 : 700;
                      doc.setFontSize(13);
                      doc.setFont("helvetica", "bold");
                      doc.text("EMI Health Analysis", 50, y);
                      doc.setFontSize(10);
                      doc.setFont("helvetica", "normal");
                      doc.text("Your EMI burden is approximately 34% of your monthly income. This is considered healthy but requires careful budgeting.", 50, y + 18, { maxWidth: 500 });
                      doc.text("● LOW (<30%)   ● MODERATE (30–50%)   ● HIGH (>50%)", 50, y + 38);

                      // Footer
                      const pageHeight = doc.internal.pageSize.height;
                      doc.setFontSize(9);
                      doc.setTextColor(100);
                      doc.text(
                        "Thank you for choosing T-Home Fintech! We appreciate your trust in our services.",
                        50,
                        pageHeight - 60
                      );
                      doc.setDrawColor(37, 99, 235);
                      doc.setLineWidth(1.2);
                      doc.line(50, pageHeight - 50, 550, pageHeight - 50);
                      doc.setFontSize(8);
                      doc.setTextColor(120);
                      doc.text("Page 1 of 1", 520, pageHeight - 30);

                      doc.save("emi_amortization_schedule.pdf");
                    }}
                  >
                    ⬇ Download Statement
                  </button>
                </motion.div>

                {/* LOAN SUMMARY TABLE (SIMPLIFIED VISUAL BLOCK) */}
                <motion.div
                  variants={fadeUp}
                  className="rounded-[20px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl"
                >
                  <h3 className="text-white font-medium text-lg mb-4">
                    Loan Balance Over Time
                  </h3>

                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={schedule.slice(0, 6)}>
                      <XAxis dataKey="month" stroke="#aaa" />
                      <Tooltip />
                      <Bar dataKey="balance" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>

                  <p className="text-center text-xs text-blue-400 mt-2 cursor-pointer">
                    View All 60 Months
                  </p>
                </motion.div>
              </div>

              {/* EMI HEALTH SECTION */}
              <div>
                <h3 className="text-white text-lg font-semibold mb-4">
                  ☀️ Confused to check your EMI Health?
                </h3>

                <div className="grid md:grid-cols-2 gap-6">

                  {/* INPUT CARD */}
                  <motion.div
                    variants={fadeUp}
                    className="rounded-[20px] border border-white/10 bg-gradient-to-br from-[#1a2238] to-[#0b1220] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
                  >
                    <p className="text-sm text-white/70 mb-4">
                      💜 Check Here with us!!
                    </p>

                    <input
                      placeholder="Enter income"
                      className="w-full mb-3 rounded-md bg-white/90 text-black px-3 py-2 text-sm outline-none"
                    />

                    <input
                      placeholder="Enter existing EMI’s"
                      className="w-full mb-4 rounded-md bg-white/90 text-black px-3 py-2 text-sm outline-none"
                    />

                    <button className="w-full bg-blue-600 py-2.5 rounded-[12px] text-sm font-medium hover:bg-blue-500">
                      Analyze Health
                    </button>
                  </motion.div>

                  {/* STRESS METER */}
                  <motion.div
                    variants={fadeUp}
                    className="rounded-[20px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl flex flex-col justify-between"
                  >
                    <p className="text-sm text-white/70 mb-3">
                      ❤️ Your EMI Stress Level
                    </p>

                    {/* GAUGE */}
                    <div className="relative flex justify-center items-center h-32">
                      <div className="w-40 h-20 bg-gradient-to-r from-green-500 via-yellow-400 to-red-500 rounded-t-full" />

                      <div className="absolute w-1 h-16 bg-white origin-bottom rotate-[30deg] rounded-full" />
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        Moderate Stress
                      </h2>
                      <p className="text-sm text-white/60 mt-1">
                        Your EMI burden is approximately <span className="text-blue-400 font-medium">34%</span> of your monthly income.
                        This is considered healthy but requires careful budgeting.
                      </p>

                      <div className="flex gap-4 text-xs mt-3 text-white/60">
                        <span className="text-green-400">● LOW (&lt;30%)</span>
                        <span className="text-yellow-400">● MODERATE (30–50%)</span>
                        <span className="text-red-400">● HIGH (&gt;50%)</span>
                      </div>
                    </div>
                  </motion.div>

                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}