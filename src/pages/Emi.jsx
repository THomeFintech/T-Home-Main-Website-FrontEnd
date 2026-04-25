import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ---------- DESIGN TOKENS ----------
const colors = {
  bg: "",
  card: "rounded-[22px] border border-white/15 bg-white/[0.07] backdrop-blur-2xl shadow-[0_12px_34px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)]",
  primary: "#2563eb",
  accent: "#f59e0b",
};

// ---------- SERVICE TYPE THRESHOLDS ----------
const loanThresholds = {
  "home loan": {
    minAmount: 100000,
    maxAmount: 50000000,
    minInterest: 7,
    maxInterest: 15,
    minTenure: 5,
    maxTenure: 30,
    defaults: { amount: 2500000, interest: 9, tenure: 20 },
  },
  "personal loan": {
    minAmount: 10000,
    maxAmount: 1500000,
    minInterest: 10,
    maxInterest: 36,
    minTenure: 1,
    maxTenure: 7,
    defaults: { amount: 200000, interest: 14, tenure: 3 },
  },
  "car loan": {
    minAmount: 50000,
    maxAmount: 4000000,
    minInterest: 7,
    maxInterest: 20,
    minTenure: 1,
    maxTenure: 7,
    defaults: { amount: 800000, interest: 11, tenure: 5 },
  },
  "educational loan": {
    minAmount: 10000,
    maxAmount: 4000000,
    minInterest: 6.5,
    maxInterest: 16,
    minTenure: 1,
    maxTenure: 15,
    defaults: { amount: 500000, interest: 9, tenure: 7 },
  },
  "mortgage loan": {
    minAmount: 100000,
    maxAmount: 10000000,
    minInterest: 8,
    maxInterest: 21,
    minTenure: 1,
    maxTenure: 20,
    defaults: { amount: 5000000, interest: 12, tenure: 10 },
  },
  "loan against property": {
    minAmount: 100000,
    maxAmount: 700000000,
    minInterest: 8,
    maxInterest: 21,
    minTenure: 1,
    maxTenure: 20,
    defaults: { amount: 3000000, interest: 12, tenure: 10 },
  },
  "business loan": {
    minAmount: 50000,
    maxAmount: 10000000,
    minInterest: 8,
    maxInterest: 24,
    minTenure: 1,
    maxTenure: 10,
    defaults: { amount: 500000, interest: 15, tenure: 5 },
  },
  custom: {
    minAmount: 1000,
    maxAmount: 100000000,
    minInterest: 1,
    maxInterest: 40,
    minTenure: 1,
    maxTenure: 30,
    defaults: { amount: 100000, interest: 15, tenure: 5 },
  },
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

const addMonthsSafe = (date, monthsToAdd) => {
  const d = new Date(date);
  const originalDate = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + monthsToAdd);
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(originalDate, lastDay));
  return d;
};

const formatDateDisplay = (date) =>
  date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).toUpperCase();

const generateSchedule = (P, annualRate, months) => {
  const principalAmount = Number(P);
  const totalMonths = Number(months);
  const emi = calculateEMI(principalAmount, annualRate, totalMonths);
  const r = Number(annualRate) / 12 / 100;

  let balance = principalAmount;
  const schedule = [];
  const baseDate = new Date();

  for (let i = 1; i <= totalMonths; i++) {
    let interest = r === 0 ? 0 : +(balance * r).toFixed(2);
    let principal = +(emi - interest).toFixed(2);

    if (i === totalMonths) {
      principal = +balance.toFixed(2);
      interest = +(emi - principal).toFixed(2);
      if (interest < 0) interest = 0;
    }

    balance = +(balance - principal).toFixed(2);
    if (balance < 0) balance = 0;

    const paymentDate = addMonthsSafe(baseDate, i);

    schedule.push({
      month: i,
      date: paymentDate,
      dateLabel: formatDateDisplay(paymentDate),
      principal,
      interest,
      balance,
    });
  }

  return schedule;
};

function downloadCSV(schedule) {
  const header = ["Month", "Payment Date", "Principal", "Interest", "Balance"];
  const rows = schedule.map((row) => [
    row.month,
    row.dateLabel,
    row.principal.toFixed(2),
    row.interest.toFixed(2),
    row.balance.toFixed(2),
  ]);

  const csvContent = [header, ...rows].map((e) => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "emi_schedule.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const getStressLevel = (percentage) => {
  if (percentage < 30) {
    return {
      label: "Low Stress",
      shortLabel: "LOW",
      colorText: "text-green-400",
      message:
        "Your EMI burden is comfortable and well within a healthy range of your monthly income.",
    };
  }
  if (percentage <= 50) {
    return {
      label: "Moderate Stress",
      shortLabel: "MODERATE",
      colorText: "text-yellow-400",
      message:
        "Your EMI burden is manageable, but careful budgeting is recommended to stay financially comfortable.",
    };
  }
  return {
    label: "High Stress",
    shortLabel: "HIGH",
    colorText: "text-red-400",
    message:
      "Your EMI burden is high compared to your monthly income. Consider reducing loan amount or extending tenure.",
    };
};

const getNeedleRotation = (percentage) => {
  const clamped = Math.max(0, Math.min(percentage, 100));
  return clamped * 1.8 - 90;
};

// ---------- ANIMATION ----------
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// ---------- COMPONENTS ----------
const StatCard = ({ title, value }) => (
  <motion.div
    variants={fadeUp}
    className={`${colors.card} w-full max-w-[360px] sm:max-w-[420px] md:max-w-none mx-auto md:mx-0 p-4 rounded-2xl shadow-lg`}
  >
    <p className="text-gray-400 text-xs sm:text-sm">{title}</p>
    <h2 className="text-xl sm:text-2xl font-semibold mt-1">₹{value}</h2>
  </motion.div>
);

const PieBreakdown = ({ data, amount = 0, interest = 0 }) => {
  const total = amount + interest;
  const principalPercent = total ? ((amount / total) * 100).toFixed(0) : 0;

  return (
    <motion.div
      variants={fadeUp}
      className="relative w-full max-w-[360px] sm:max-w-[420px] md:max-w-none mx-auto md:mx-0 rounded-[22px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl"
    >
      <div className="relative z-10 flex flex-col">
        <h3 className="text-sm text-white mb-3">Payment Breakdown</h3>

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

          <div className="absolute flex flex-col items-center">
            <span className="text-xl font-semibold text-white">
              {principalPercent}%
            </span>
            <span className="text-xs text-white/60">Principal</span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm text-white/70">
            <span>Principal</span>
            <span>₹{Math.round(amount).toLocaleString()}</span>
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
  <motion.div
    variants={fadeUp}
    className={`${colors.card} w-full max-w-[360px] sm:max-w-[420px] md:max-w-none mx-auto md:mx-0 p-4 rounded-2xl h-72`}
  >
    <h3 className="mb-2">Loan Balance</h3>
    <ResponsiveContainer>
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <Tooltip
          formatter={(value) => [`₹${Number(value).toFixed(2)}`, "Balance"]}
          labelFormatter={(label) => `Month ${label}`}
        />
        <Bar dataKey="balance" fill="#2563eb" />
      </BarChart>
    </ResponsiveContainer>
  </motion.div>
);

const Table = ({ data, showAll, onToggle }) => (
  <motion.div
    variants={fadeUp}
    className={`${colors.card} w-full max-w-[360px] sm:max-w-[420px] md:max-w-none mx-auto md:mx-0 p-3 sm:p-4 rounded-2xl max-h-[420px] overflow-auto`}
  >
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm sm:text-base">Amortization</h3>
      <button
        type="button"
        onClick={onToggle}
        className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition"
      >
        {showAll ? "Show Less" : "View All"}
      </button>
    </div>

    <table className="min-w-[640px] w-full text-xs sm:text-sm">
      <thead className="text-gray-400">
        <tr>
          <th className="text-left py-2">Month</th>
          <th className="text-left py-2">Date</th>
          <th className="text-left py-2">Principal</th>
          <th className="text-left py-2">Interest</th>
          <th className="text-left py-2">Balance</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.month} className="border-t border-white/10">
            <td className="py-1.5">{row.month}</td>
            <td className="py-1.5">{row.dateLabel}</td>
            <td className="py-1.5">₹{row.principal.toFixed(2)}</td>
            <td className="py-1.5">₹{row.interest.toFixed(2)}</td>
            <td className="py-1.5">₹{row.balance.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </motion.div>
);

// ---------- MAIN ----------

const convertToWords = (num) => {
  if (!num || num <= 0) return "";

  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
    "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
    "Sixteen", "Seventeen", "Eighteen", "Nineteen",
  ];

  const b = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy",
    "Eighty", "Ninety",
  ];

  const words = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return `${b[Math.floor(n / 10)]} ${a[n % 10]}`.trim();
    if (n < 1000) return `${a[Math.floor(n / 100)]} Hundred ${words(n % 100)}`.trim();
    if (n < 100000) return `${words(Math.floor(n / 1000))} Thousand ${words(n % 1000)}`.trim();
    if (n < 10000000) return `${words(Math.floor(n / 100000))} Lakh ${words(n % 100000)}`.trim();
    return `${words(Math.floor(n / 10000000))} Crore ${words(n % 10000000)}`.trim();
  };

  return `${words(Math.floor(Number(num)))} Rupees`;
};
export default function EMIPage() {
  const navigate = useNavigate();
  
  const [loanType, setLoanType] = useState("home loan");
  const [firstPaymentCustomDate, setFirstPaymentCustomDate] = useState("");

  const initialThreshold = loanThresholds[loanType];

  const [amount, setAmount] = useState(initialThreshold.defaults.amount);
  const [rate, setRate] = useState(initialThreshold.defaults.interest);
  const [years, setYears] = useState(initialThreshold.defaults.tenure);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [existingEmis, setExistingEmis] = useState("");
  const [showAllRows, setShowAllRows] = useState(false);

  const currentThreshold = loanThresholds[loanType];

  useEffect(() => {
    setAmount(currentThreshold.defaults.amount);
    setRate(currentThreshold.defaults.interest);
    setYears(currentThreshold.defaults.tenure);
    setShowAnalytics(false);
  }, [loanType]);

  const months = years * 12;

  const emi = useMemo(
    () => calculateEMI(amount, rate, months),
    [amount, rate, months]
  );

  const schedule = useMemo(
    () => generateSchedule(amount, rate, months),
    [amount, rate, months]
  );

  const total = useMemo(() => +(emi * months).toFixed(2), [emi, months]);
  const interest = useMemo(() => +(total - amount).toFixed(2), [total, amount]);

  const pieData = useMemo(
    () => [
      { name: "Principal", value: amount },
      { name: "Interest", value: interest },
    ],
    [amount, interest]
  );

 const firstPaymentDateValue =
  firstPaymentCustomDate && firstPaymentCustomDate !== ""
    ? firstPaymentCustomDate
    : schedule.length > 0
    ? schedule[0].date.toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

const safeDate = new Date(firstPaymentDateValue);

const firstPaymentDate = formatDateDisplay(safeDate);

const lastPaymentDate = formatDateDisplay(
  addMonthsSafe(safeDate, months - 1)
);

  const incomeNumber = Number(monthlyIncome) || 0;
  const existingEmiNumber = Number(existingEmis) || 0;

  const emiBurdenPercentage = useMemo(() => {
    if (incomeNumber <= 0) return 0;
    return +((((existingEmiNumber + emi) / incomeNumber) * 100).toFixed(2));
  }, [existingEmiNumber, emi, incomeNumber]);

  const stressInfo = useMemo(
    () => getStressLevel(emiBurdenPercentage),
    [emiBurdenPercentage]
  );

  const needleRotation = useMemo(
    () => getNeedleRotation(emiBurdenPercentage),
    [emiBurdenPercentage]
  );

  const displayedRows = showAllRows ? schedule : schedule.slice(0, 12);
  

  const downloadPDFStatement = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("T-Home Fintech", 50, 48);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("EMI Amortization Schedule", 50, 66);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Loan Summary", 50, 105);

    doc.setFillColor(245, 248, 255);
    doc.roundedRect(50, 118, 500, 90, 8, 8, "F");

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Loan Details", 70, 142);
    doc.text("Repayment Details", 320, 142);

    doc.setFont("helvetica", "normal");
    doc.text(`Service Type: ${loanType}`, 70, 162);
    doc.text(`Loan Amount: ₹${Number(amount).toLocaleString()}`, 70, 178);
    doc.text(`Annual Interest Rate: ${rate}%`, 70, 194);

    doc.text(`Tenure: ${years} years`, 320, 162);
    doc.text(`Monthly EMI: ₹${emi.toFixed(2)}`, 320, 178);
    doc.text(`Total Repayment: ₹${total.toFixed(2)}`, 320, 194);

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("EMI Schedule Info", 50, 240);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`First Payment Date: ${firstPaymentDate}`, 50, 260);
    doc.text(`Last Payment Date: ${lastPaymentDate}`, 220, 260);
    doc.text(`Total Months: ${months}`, 420, 260);

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("EMI Health Analysis", 50, 300);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Monthly Income: ₹${incomeNumber.toLocaleString()}`, 50, 320);
    doc.text(`Existing EMIs: ₹${existingEmiNumber.toLocaleString()}`, 220, 320);
    doc.text(`EMI Burden: ${emiBurdenPercentage.toFixed(2)}%`, 390, 320);
    doc.text(`Stress Level: ${stressInfo.label}`, 50, 338);
    doc.text(stressInfo.message, 50, 356, { maxWidth: 500 });

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Monthly Amortization Schedule", 50, 395);

    autoTable(doc, {
      startY: 410,
      head: [["Month", "Payment Date", "Principal", "Interest", "Balance"]],
      body: schedule.map((row) => [
        row.month,
        row.dateLabel,
        `₹${row.principal.toFixed(2)}`,
        `₹${row.interest.toFixed(2)}`,
        `₹${row.balance.toFixed(2)}`,
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

    doc.save("emi_amortization_schedule.pdf");
  };

  return (
    <div
      className="min-h-screen px-2 sm:px-6 lg:px-8 pb-8 sm:pb-10 pt-24 sm:pt-28 lg:pt-32 text-slate-100"
      style={{
        background:
          "radial-gradient(64.07% 159.91% at 50% 0%, #112240 0%, #0B1220 80%)",
      }}
    >
      <motion.h1
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center"
      >
        EMI Calculator
      </motion.h1>

      <div
        className={
          showAnalytics
            ? "grid lg:grid-cols-3 gap-4 sm:gap-6 mt-[50px] sm:mt-[60px]"
: "flex justify-center items-center min-h-[60vh] mt-[50px] sm:mt-[60px]"
        }
      >
        {/* LEFT */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="self-start mx-auto lg:mx-0 w-[96vw] max-w-[440px] sm:w-full sm:max-w-[460px] lg:max-w-[500px] rounded-[26px] border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.11)_0%,rgba(255,255,255,0.04)_100%)] p-5 sm:p-6 lg:p-7 shadow-[0_18px_50px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.10)] backdrop-blur-2xl"
        >
          <h2 className="text-[24px] sm:text-2xl font-semibold text-white leading-none">
            Loan Details
          </h2>
          <p className="text-[12px] sm:text-sm text-white/70 mt-2 mb-6 sm:mb-6 leading-[1.35]">
          
          </p>

          {/* SERVICE TYPE */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[13px] text-white/75 font-medium">
                Service Type
              </span>
              <span className="bg-white/90 text-blue-600 text-[13px] px-3 py-1 rounded-[8px] font-semibold capitalize">
                {loanType}
              </span>
            </div>

            <select
              value={loanType}
              onChange={(e) => setLoanType(e.target.value)}
              className="w-full h-[44px] rounded-[10px] bg-[rgba(255,255,255,0.08)] border border-white/20 px-3 text-[13px] text-white outline-none"
            >
              {Object.keys(loanThresholds).map((type) => (
                <option key={type} value={type} className="text-black capitalize">
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* LOAN AMOUNT */}
<div className="mb-6">
  <div className="flex justify-between items-center mb-2">
    <span className="text-[13px] text-white/75 font-medium">
      Loan Amount
    </span>
    <span className="bg-white/90 text-blue-600 text-[13px] px-3 py-1 rounded-[8px] font-semibold">
      ₹{amount.toLocaleString()}
    </span>
  </div>

  <input
    type="number"
    min={currentThreshold.minAmount}
    max={currentThreshold.maxAmount}
    step={1000}
    value={amount}
    onChange={(e) => setAmount(Number(e.target.value))}
    placeholder="Enter loan amount"
    className="w-full h-[44px] rounded-[10px] border border-white/20 bg-white/90 px-3 text-[14px] font-semibold text-black outline-none focus:border-blue-400"
  />

  <p className="mt-2 text-[12px] text-blue-300">
    {convertToWords(amount)}
  </p>

  <div className="flex justify-between text-[12px] text-white/40 mt-1">
    <span>₹{currentThreshold.minAmount.toLocaleString()}</span>
    <span>₹{currentThreshold.maxAmount.toLocaleString()}</span>
  </div>
</div>

{/* INTEREST RATE */}
<div className="mb-6">
  <div className="flex justify-between items-center mb-2">
    <span className="text-[13px] text-white/75 font-medium">
      Interest Rate (%)
    </span>
    <span className="bg-white/90 text-blue-600 text-[13px] px-3 py-1 rounded-[8px] font-semibold">
      {rate}%
    </span>
  </div>

  <input
    type="number"
    min={currentThreshold.minInterest}
    max={currentThreshold.maxInterest}
    step={0.1}
    value={rate}
    onChange={(e) => setRate(Number(e.target.value))}
    placeholder="Enter interest rate"
    className="w-full h-[44px] rounded-[10px] border border-white/20 bg-white/90 px-3 text-[14px] font-semibold text-black outline-none focus:border-blue-400"
  />

  <div className="flex justify-between text-[12px] text-white/40 mt-1">
    <span>{currentThreshold.minInterest}%</span>
    <span>{currentThreshold.maxInterest}%</span>
  </div>
</div>

{/* TENURE */}
<div className="mb-6">
  <div className="flex justify-between items-center mb-2">
    <span className="text-[13px] text-white/75 font-medium">
      Loan Tenure
    </span>

    <div className="flex bg-white/10 rounded-[8px] overflow-hidden text-[11px] border border-white/15">
      <button type="button" className="px-3 py-1 bg-white text-black font-semibold">
        Years
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
    type="number"
    min={currentThreshold.minTenure}
    max={currentThreshold.maxTenure}
    step={1}
    value={years}
    onChange={(e) => setYears(Number(e.target.value))}
    placeholder="Enter tenure"
    className="w-full h-[44px] rounded-[10px] border border-white/20 bg-white/90 px-3 text-[14px] font-semibold text-black outline-none focus:border-blue-400"
  />

  <div className="flex justify-between text-[12px] text-white/40 mt-1">
    <span>{currentThreshold.minTenure} Year</span>
    <span>{currentThreshold.maxTenure} Years</span>
  </div>
</div>

          <div className="mt-6 space-y-3.5">
            <button
              className="w-full rounded-[16px] bg-gradient-to-r from-blue-600 to-blue-500 py-3.5 text-white text-[16px] font-semibold shadow-[0_10px_30px_rgba(37,99,235,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              onClick={(e) => {
                e.preventDefault();
                setShowAnalytics(true);
              }}
            >
              Calculate Now
            </button>

            <button
  onClick={() => navigate("/tools?tool=loan-prediction")}
  className="w-full rounded-[16px] border border-white/35 py-3.5 text-white/90 text-[15px] font-semibold hover:bg-white/10 transition-all"
>
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
              <PieBreakdown
                data={pieData}
                amount={amount}
                interest={interest}
              />
              <BalanceChart data={schedule.slice(0, 12)} />
            </div>

            <Table
              data={displayedRows}
              showAll={showAllRows}
              onToggle={() => setShowAllRows((prev) => !prev)}
            />

            <div className="mt-10 space-y-8">
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
                    Your estimated monthly repayment details for the next{" "}
                    {months} months.
                  </p>

                  <div className="flex justify-between items-center bg-white/90 text-black rounded-md px-4 py-3 mb-3">
                    <span className="text-sm font-medium">📅 First Payment</span>
                    <input
  type="date"
  value={firstPaymentDateValue}
  onChange={(e) => setFirstPaymentCustomDate(e.target.value)}
  className="rounded-md bg-white px-2 py-1 text-sm font-semibold text-black outline-none"
/>
                  </div>

                  <div className="flex justify-between items-center bg-white/90 text-black rounded-md px-4 py-3 mb-3">
                    <span className="text-sm font-medium">📅 Last Payment</span>
                    <span className="text-sm font-semibold">
                      {lastPaymentDate}
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-white/90 text-black rounded-md px-4 py-3 mb-5">
                    <span className="text-sm font-medium">🗓 Total Months</span>
                    <span className="text-sm font-semibold">{months}</span>
                  </div>

                  <button
                    className="w-full rounded-[12px] bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-500 transition"
                    onClick={downloadPDFStatement}
                  >
                    ⬇ Download Statement
                  </button>
                </motion.div>

                {/* LOAN SUMMARY VISUAL BLOCK */}
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
                      <Tooltip
                        formatter={(value) => [
                          `₹${Number(value).toFixed(2)}`,
                          "Balance",
                        ]}
                        labelFormatter={(label) => `Month ${label}`}
                      />
                      <Bar
                        dataKey="balance"
                        fill="#3B82F6"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>

                  <button
                    type="button"
                    onClick={() => setShowAllRows(true)}
                    className="w-full text-center text-xs text-blue-400 mt-2 cursor-pointer"
                  >
                    View All {months} Months
                  </button>
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
                      type="number"
                      min="0"
                      placeholder="Enter income"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(e.target.value)}
                      className="w-full mb-3 rounded-md bg-white/90 text-black px-3 py-2 text-sm outline-none"
                    />

                    <input
                      type="number"
                      min="0"
                      placeholder="Enter existing EMI’s"
                      value={existingEmis}
                      onChange={(e) => setExistingEmis(e.target.value)}
                      className="w-full mb-4 rounded-md bg-white/90 text-black px-3 py-2 text-sm outline-none"
                    />

                    <button
                      type="button"
                      className="w-full bg-blue-600 py-2.5 rounded-[12px] text-sm font-medium hover:bg-blue-500"
                    >
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

                    <div className="relative flex justify-center items-center h-32">
                      <div className="w-40 h-20 bg-gradient-to-r from-green-500 via-yellow-400 to-red-500 rounded-t-full" />

                      <div
                        className="absolute w-1 h-16 bg-white origin-bottom rounded-full transition-transform duration-500 ease-in-out"
                        style={{
                          transform: `rotate(${needleRotation}deg)`,
                        }}
                      />
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        {stressInfo.label}
                      </h2>
                      <p className="text-sm text-white/60 mt-1">
                        Your EMI burden is approximately{" "}
                        <span className="text-blue-400 font-medium">
                          {emiBurdenPercentage.toFixed(2)}%
                        </span>{" "}
                        of your monthly income. {stressInfo.message}
                      </p>

                      <div className="flex gap-4 text-xs mt-3 text-white/60">
                        <span className="text-green-400">● LOW (&lt;30%)</span>
                        <span className="text-yellow-400">
                          ● MODERATE (30–50%)
                        </span>
                        <span className="text-red-400">● HIGH (&gt;50%)</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* EXPORT CSV */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => downloadCSV(schedule)}
                  className="rounded-[12px] bg-white/10 border border-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/15 transition"
                >
                  Download CSV
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
