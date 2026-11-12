import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ShieldCheck,
  Gauge,
  FileText,
  IndianRupee,
  Lock,
  ArrowRight,
} from "lucide-react";
import { BT_API_BASE } from "../config";
import GetCibilScore from "../components/GetCibilScore";

const initialState = {
  loanType: "",
  bankName: "",
  customBankName: "",
  originalPrincipal: "",
  amountPaid: "",
  remainingTenure: "",
  newLoanTenure: "",
  currentInterestRate: "",
  proposedInterestRate: "",
  monthlyIncome: "",
  foreclosureFee: "",
};

const bankOptions = [
  "Bank of India",
  "Federal Bank",
  "Union Bank of India",
  "Indian Bank",
  "Canara Bank",
  "City Union Bank",
  "HDFC Bank",
  "Telangana Grameena Bank",
  "State Bank of India",
  "Central Bank of India",
  "Karur Vysya Bank",
  "Bank of Baroda",
  "ICICI Bank",
  "IndusInd Bank",
  "IDFC FIRST Bank",
  "Axis Bank",
  "Bandhan Bank",
  "Kotak Mahindra Bank",
  "Punjab National Bank",
  "Others",
];

function numberToWords(num) {
  if (!num || Number(num) === 0) return "";

  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const inWords = (n) => {
    if (n < 20) return a[n];

    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");

    if (n < 1000)
      return (
        a[Math.floor(n / 100)] + " Hundred " + (n % 100 ? inWords(n % 100) : "")
      );

    if (n < 100000)
      return (
        inWords(Math.floor(n / 1000)) +
        " Thousand " +
        (n % 1000 ? inWords(n % 1000) : "")
      );

    if (n < 10000000)
      return (
        inWords(Math.floor(n / 100000)) +
        " Lakh " +
        (n % 100000 ? inWords(n % 100000) : "")
      );

    return (
      inWords(Math.floor(n / 10000000)) +
      " Crore " +
      (n % 10000000 ? inWords(n % 10000000) : "")
    );
  };

  return `${inWords(Number(num))} Rupees Only`;
}

function formatINR(value) {
  return `₹${Math.round(value || 0).toLocaleString("en-IN")}`;
}

const hasValue = (v) => v !== "" && v !== null && v !== undefined;

// Reads the latest fetched credit-report values saved by GetCibilScore.
// Returns "" for anything that has not been fetched yet.
function readCreditProfile() {
  let savedLoanData = {};

  try {
    savedLoanData = JSON.parse(localStorage.getItem("loanData") || "{}") || {};
  } catch {
    savedLoanData = {};
  }

  const rawScore =
    localStorage.getItem("dashboard_cibil_score") ?? savedLoanData.cibilScore;
  const score = Number(rawScore);

  const rawActiveLoans = savedLoanData.activeLoans;
  const activeLoans =
    hasValue(rawActiveLoans) && Number.isFinite(Number(rawActiveLoans))
      ? Number(rawActiveLoans)
      : "";

  return {
    cibilScore: Number.isFinite(score) && score > 0 ? score : "",
    activeLoans,
  };
}

export default function BalanceTransferDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedService = location.state?.service || "";
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("btLoanDetailsDraft");

    if (savedData) {
      try {
        return {
          ...initialState,
          ...JSON.parse(savedData),
          loanType: JSON.parse(savedData).loanType || selectedService,
        };
      } catch {
        // Use initial values if saved data is invalid
      }
    }

    return {
      ...initialState,
      loanType: selectedService,
    };
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCibilScore, setShowCibilScore] = useState(false);

  // Read-only credit profile values (filled from the fetched CIBIL report).
  const [creditProfile, setCreditProfile] = useState(() => readCreditProfile());

  // Refresh when the page opens, when the user returns from the CIBIL form,
  // and immediately when a new score is fetched.
  useEffect(() => {
    setCreditProfile(readCreditProfile());

    const handleScoreUpdated = () => setCreditProfile(readCreditProfile());

    window.addEventListener("cibilScoreUpdated", handleScoreUpdated);

    return () => {
      window.removeEventListener("cibilScoreUpdated", handleScoreUpdated);
    };
  }, [showCibilScore]);

  const numbers = useMemo(() => {
    const principal = Number(formData.originalPrincipal) || 0;
    const paid = Number(formData.amountPaid) || 0;
    const fee = Number(formData.foreclosureFee) || 0;
    const rate = Number(formData.currentInterestRate) || 0;
    const tenureMonths = Number(formData.remainingTenure) || 0;

    const outstanding = Math.max(principal - paid + fee, 0);
    const interestLoad = outstanding * (rate / 100) * (tenureMonths / 12);
    const remainingOutflow = outstanding + interestLoad;

    return {
      outstanding,
      remainingOutflow,
      estimatedSaving: Math.max(remainingOutflow * 0.03, 0),
    };
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Don't allow negative numbers
    if (value !== "" && Number(value) < 0) {
      return;
    }

    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: value,
      };

      localStorage.setItem("btLoanDetailsDraft", JSON.stringify(updatedData));

      return updatedData;
    });
  };
  const handleAnalyzeLoan = async () => {
    try {
      setLoading(true);
      setError("");

      const tenure = Number(formData.remainingTenure);
      if (tenure < 1 || tenure > 360) {
        setError("Remaining tenure must be between 1 and 360 months.");
        setLoading(false);
        return;
      }
      const originalPrincipal = Number(formData.originalPrincipal);
      const amountPaid = Number(formData.amountPaid);

      if (amountPaid > originalPrincipal) {
        setError("Amount Paid cannot be greater than Original Principal.");
        setLoading(false);
        return;
      }

      const payload = {
        loan_type: formData.loanType,
        current_bank_name:
          formData.bankName === "Others"
            ? formData.customBankName.trim()
            : formData.bankName,
        original_principal: Number(formData.originalPrincipal),
        amount_paid: Number(formData.amountPaid),
        remaining_tenure_months: Number(formData.remainingTenure),
        new_tenure_months: Number(formData.newLoanTenure || 0),
        current_interest_rate: Number(formData.currentInterestRate),
        proposed_interest_rate: Number(formData.proposedInterestRate || 0),
        net_monthly_income: Number(formData.monthlyIncome),
        foreclosure_fee: Number(formData.foreclosureFee || 0),
        cibil_score: Number(localStorage.getItem("dashboard_cibil_score") || 0),
      };

      if (
        !payload.loan_type ||
        !payload.current_bank_name ||
        !payload.original_principal ||
        (!payload.amount_paid && payload.amount_paid !== 0) ||
        !payload.remaining_tenure_months ||
        !payload.current_interest_rate ||
        !payload.net_monthly_income
      ) {
        setError("Please fill all required fields.");
        return;
      }

      const res = await fetch(`${BT_API_BASE}/loan/loan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        console.log("Loan API Error:", error);
        throw new Error("Loan creation failed");
      }

      const result = await res.json();

      console.log("Loan Response:", result);

      localStorage.setItem("btLoanReference", result.loan_reference);

      localStorage.setItem("btLoanId", result.loan_id);

      localStorage.setItem("btLoanForm", JSON.stringify(payload));

      localStorage.setItem("btLoanResult", JSON.stringify(result));
      localStorage.setItem("currentBankName", payload.current_bank_name);

      navigate("/balance-transfer/offers");
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to connect to backend.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "h-[44px] w-full rounded-[9px] border border-white/20 bg-[rgba(255,255,255,0.08)] px-3 text-[13px] text-white placeholder:text-white/50 outline-none transition focus:border-[#4e8fff]";

  if (showCibilScore) {
    return (
      <div className="min-h-screen bg-[#030a1a] px-4 py-6">
        <div className="mx-auto max-w-[1300px]">
          <GetCibilScore onBack={() => setShowCibilScore(false)} />
        </div>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden px-4 pb-12 pt-[190px] sm:px-6 md:pt-[190px] lg:px-8 lg:pt-36">
      <div className="pointer-events-none absolute inset-0 bg-[#030a1a]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(44,78,173,0.36),transparent_58%)]" />

      <div className="relative z-10 mx-auto max-w-[1300px] rounded-[16px] border border-white/15 bg-[linear-gradient(90deg,rgba(255,255,255,0.11)_0%,rgba(255,255,255,0.06)_100%)] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
        <div className="mx-auto max-w-[1160px]">
          <div className="h-[80px] lg:hidden" />

          <div className="text-center">
            <h1 className="text-[32px] font-semibold leading-tight text-white sm:text-[54px]">
              Your <span className="text-[#2572ff]">Current Loan</span> Details
            </h1>
            <p className="mt-2 text-[12px] text-white/70 sm:text-[13px]">
              This helps us understand your existing loan and calculate accurate
              savings.
            </p>
            <div className="mt-3 inline-flex items-center rounded-full border border-[#4f84ff]/55 bg-[#1c4fbf]/20 px-3 py-1 text-[10px] text-[#7db2ff]">
              256-bit SSL secured • No data sharing • No spam calls
            </div>
          </div>

          <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Loan Type *">
                <input
                  type="text"
                  name="loanType"
                  value={formData.loanType}
                  readOnly
                  className={inputClass}
                />
              </Field>
              <Field label="Current Bank Name *">
                <select
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  className={`${inputClass} text-white`}
                >
                  <option value="" className="text-black bg-white">
                    Select current bank
                  </option>

                  {bankOptions.map((bank) => (
                    <option
                      key={bank}
                      value={bank}
                      className="text-black bg-white"
                    >
                      {bank}
                    </option>
                  ))}
                </select>
                {formData.bankName === "Others" && (
                  <input
                    type="text"
                    name="customBankName"
                    value={formData.customBankName}
                    onChange={handleChange}
                    placeholder="Enter your bank name"
                    className={`${inputClass} mt-2`}
                    required
                  />
                )}
              </Field>

              <Field label="Original Principal (₹) *">
                <input
                  type="number"
                  name="originalPrincipal"
                  value={formData.originalPrincipal}
                  onChange={handleChange}
                  placeholder="Enter original principal"
                  className={inputClass}
                />
                <p className="mt-1 text-[11px] text-white/55">
                  {numberToWords(formData.originalPrincipal)}
                </p>
              </Field>

              <Field label="Amount Paid (₹) *">
                <input
                  type="number"
                  name="amountPaid"
                  value={formData.amountPaid}
                  onChange={handleChange}
                  placeholder="Enter amount paid"
                  className={inputClass}
                />
                <p className="mt-1 text-[11px] text-white/55">
                  {numberToWords(formData.amountPaid)}
                </p>
              </Field>

              <Field label="Remaining Tenure(Months) *">
                <input
                  type="number"
                  name="remainingTenure"
                  value={formData.remainingTenure}
                  onChange={handleChange}
                  placeholder="Enter remaining tenure"
                  min="1"
                  max="360"
                  className={inputClass}
                />
                <p className="mt-1 text-[11px] text-white/60">
                  Enter the number of months remaining to fully repay your
                  current loan.
                </p>
              </Field>
              <Field label="New Loan Tenure (Months) *">
                <input
                  type="number"
                  name="newLoanTenure"
                  value={formData.newLoanTenure}
                  onChange={handleChange}
                  placeholder="Enter new loan tenure"
                  className={inputClass}
                />
              </Field>

              <Field label="Current Interest Rate (%) *">
                <input
                  type="number"
                  step="0.01"
                  name="currentInterestRate"
                  value={formData.currentInterestRate}
                  onChange={handleChange}
                  placeholder="Enter current interest rate"
                  className={inputClass}
                />
              </Field>
              <Field label="Proposed Interest Rate (%) *">
                <input
                  type="number"
                  step="0.01"
                  name="proposedInterestRate"
                  value={formData.proposedInterestRate}
                  onChange={handleChange}
                  placeholder="Enter proposed interest rate"
                  className={inputClass}
                />
              </Field>

              <Field label="Net Monthly Income (₹) *">
                <input
                  type="number"
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleChange}
                  placeholder="Enter monthly income"
                  className={inputClass}
                />
                {formData.monthlyIncome > 0 && (
                  <p className="mt-1 text-[11px] text-white/55">
                    ₹ {numberToWords(formData.monthlyIncome)}
                  </p>
                )}
              </Field>

              <Field label="Foreclosure Fee (₹) ">
                <input
                  type="number"
                  name="foreclosureFee"
                  value={formData.foreclosureFee}
                  onChange={handleChange}
                  placeholder="Enter foreclosure fee"
                  className={inputClass}
                />
                {formData.foreclosureFee > 0 && (
                  <p className="mt-1 text-[11px] text-white/55">
                    ₹ {numberToWords(formData.foreclosureFee)}
                  </p>
                )}
              </Field>
            </div>

            {/* ===================== CREDIT PROFILE CARD ===================== */}
            <div className="rounded-2xl border border-[#2563ff] bg-[#0b1a4a]/40 p-4 text-left sm:p-5 shadow-[0_0_0_1px_rgba(37,99,255,0.25)]">
              {/* Header */}
              <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-3 gap-y-2">
                <div className="row-start-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1b2d6b] sm:row-span-2 sm:h-12 sm:w-12">
                  <ShieldCheck className="h-5 w-5 text-[#4ea1ff] sm:h-6 sm:w-6" />
                </div>

                <h3 className="col-start-2 row-start-1 self-center text-lg font-semibold text-white sm:text-xl">
                  Credit Profile
                </h3>

                <span className="col-start-3 row-start-1 shrink-0 self-start rounded-full bg-[#1b3a8a] px-3 py-1.5 text-xs font-semibold text-[#3ea0ff] sm:px-4 sm:text-sm">
                  Recommended
                </span>

                <p className="col-span-3 row-start-2 mt-0 text-[13px] leading-5 text-white/75 sm:col-start-2 sm:col-span-1 sm:mt-1 sm:text-[15px] sm:leading-snug">
                  Connect your credit report to automatically retrieve your
                  CIBIL score and existing loan information.
                </p>
              </div>

              {/* Features strip */}
              <div className="mt-4 grid grid-cols-1 rounded-xl border border-white/10 bg-white/[0.03] lg:grid-cols-3">
                <div className="flex items-center gap-3 px-4 py-3 lg:min-w-0 lg:justify-center lg:border-r lg:border-white/10 lg:px-5 lg:py-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1b2d6b]">
                    <Gauge className="h-5 w-5 text-[#3ea0ff]" />
                  </div>
                  <p className="text-sm text-white/80 leading-snug">
                    Get your actual
                    <br />
                    CIBIL score
                  </p>
                </div>

                <div className="flex items-center gap-3 px-4 py-3 lg:min-w-0 lg:justify-center lg:border-r lg:border-white/10 lg:px-5 lg:py-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1b2d6b]">
                    <FileText className="h-5 w-5 text-[#3ea0ff]" />
                  </div>
                  <p className="text-sm text-white/80 leading-snug">
                    Identify active loans
                    <br />& credit accounts
                  </p>
                </div>

                <div className="flex items-center gap-3 px-4 py-3 lg:min-w-0 lg:justify-center lg:border-r-0 lg:px-5 lg:py-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1b2d6b]">
                    <IndianRupee className="h-5 w-5 text-[#3ea0ff]" />
                  </div>
                  <p className="text-sm text-white/80 leading-snug">
                    Auto-fill available
                    <br />
                    EMI information
                  </p>
                </div>
              </div>

              {/* Fetch button (same behavior as the old "Click here") */}
              <button
                type="button"
                onClick={() => setShowCibilScore(true)}
                className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl bg-[#2563ff] px-4 py-3 text-base sm:text-lg font-semibold text-white transition hover:bg-[#1f57e5]"
              >
                <ShieldCheck className="h-5 w-5" />
                Fetch Credit Report
                <ArrowRight className="h-5 w-5" />
              </button>

              {/* Secure note */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-white/70">
                <Lock className="h-4 w-4" />
                <span>Secure connection</span>
                <span>•</span>
                <span>Your permission is required</span>
              </div>
            </div>
            {/* =================== END CREDIT PROFILE CARD =================== */}

            {/* CIBIL Score + Active Loans: read-only, filled from the fetched credit report */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="CIBIL Score">
                <input
                  type="number"
                  name="cibilScore"
                  value={
                    hasValue(creditProfile.cibilScore)
                      ? creditProfile.cibilScore
                      : ""
                  }
                  readOnly
                  aria-readonly="true"
                  placeholder="Fetch CIBIL report to retrieve your score"
                  className={`${inputClass} cursor-not-allowed opacity-80`}
                />
                <p className="mt-1 text-[11px] text-[#4ea1ff]/90">
                  Automatically populated from your CIBIL report. Manual entry
                  is disabled.
                </p>
              </Field>

              <Field label="Active Loans">
                <input
                  type="number"
                  name="activeLoans"
                  value={
                    hasValue(creditProfile.activeLoans)
                      ? creditProfile.activeLoans
                      : ""
                  }
                  readOnly
                  aria-readonly="true"
                  placeholder="Fetch CIBIL report to retrieve active loans"
                  className={`${inputClass} cursor-not-allowed opacity-80`}
                />
                <p className="mt-1 text-[11px] text-[#4ea1ff]/90">
                  Automatically populated from your CIBIL report. Manual entry
                  is disabled.
                </p>
              </Field>
            </div>

            <div className="pt-2 text-center">
              <h3 className="text-[19px] font-medium text-white">
                Current Loan Overview
              </h3>
              <div className="mt-3 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <div className="min-w-[200px] rounded-[8px] border border-white/15 bg-white/[0.9] px-6 py-3">
                  <p className="text-[11px] text-[#6b7280]">Outstanding</p>
                  <p className="text-[38px] font-semibold leading-none text-[#1f2937]">
                    {formatINR(numbers.outstanding)}
                  </p>
                </div>
                <div className="min-w-[220px] rounded-[8px] border border-white/15 bg-white/[0.9] px-6 py-3">
                  <p className="text-[11px] text-[#6b7280]">
                    Remaining total Outflow
                  </p>
                  <p className="text-[38px] font-semibold leading-none text-[#04a36d]">
                    {formatINR(numbers.remainingOutflow)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[8px] border border-white/20 bg-white/[0.03] px-4 py-3 text-[11px] text-white/80">
              <h3 className="mb-3 text-[19px] font-medium text-white">
                Your Loan, Optimised for Savings
              </h3>
              <p>
                • Outstanding loan balance : {formatINR(numbers.outstanding)}.
              </p>
              <p className="mt-1">
                • Estimated remaining repayments:{" "}
                {formatINR(numbers.remainingOutflow)}.
              </p>
              <p className="mt-1">
                • Potential savings: {formatINR(numbers.estimatedSaving)} with a
                suitable lower interest rate.
              </p>
            </div>

            {error ? (
              <p className="text-center text-sm text-red-400">{error}</p>
            ) : null}

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleAnalyzeLoan}
                disabled={loading}
                className="rounded-[9px] bg-[#1f6bff] px-7 py-2.5 text-[14px] font-medium text-white transition hover:bg-[#1c5ee0] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Analyzing..." : "Explore Bank Offers"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-white/90">
        {label}
      </label>
      {children}
    </div>
  );
}
