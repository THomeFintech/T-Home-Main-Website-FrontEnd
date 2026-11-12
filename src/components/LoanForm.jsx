import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FileText,
  ChevronDown,
  Zap,
  ShieldCheck,
  Gauge,
  IndianRupee,
  Lock,
  ArrowRight,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL;
const LPS_API_BASE = import.meta.env.VITE_LPS_API_URL;

function numberToWords(num) {
  const ones = [
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
  const tens = [
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

  if (!num || num === 0) return "Zero";
  num = Math.floor(Number(num));

  function convert(n) {
    if (n < 20) return ones[n];
    if (n < 100)
      return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000)
      return (
        ones[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 ? " " + convert(n % 100) : "")
      );
    if (n < 100000)
      return (
        convert(Math.floor(n / 1000)) +
        " Thousand" +
        (n % 1000 ? " " + convert(n % 1000) : "")
      );
    if (n < 10000000)
      return (
        convert(Math.floor(n / 100000)) +
        " Lakh" +
        (n % 100000 ? " " + convert(n % 100000) : "")
      );
    return (
      convert(Math.floor(n / 10000000)) +
      " Crore" +
      (n % 10000000 ? " " + convert(n % 10000000) : "")
    );
  }

  return convert(num) + " Rupees";
}

function ReportField({ label, value }) {
  const displayValue =
    value === null || value === undefined || value === ""
      ? "Not Available"
      : String(value);

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-white/45">
        {label}
      </p>

      <p className="mt-1.5 break-words text-sm font-medium leading-6 text-white">
        {displayValue}
      </p>
    </div>
  );
}

const hasValue = (v) => v !== "" && v !== null && v !== undefined;

export default function LoanForm({
  loanData,
  setLoanData,
  onSubmit,
  loading,
  service,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const mapServiceToLoanType = (service) => {
    if (!service) return "";

    const clean = service.trim().toLowerCase();

    const map = {
      personal: "Personal",
      "personal loan": "Personal",

      home: "Home",
      "home loan": "Home",

      lap: "LAP",
      "loan against property": "LAP",

      mortgage: "Mortgage",
      "mortgage loan": "Mortgage",

      business: "Business",
      "business loan": "Business",
    };

    return map[clean] || "";
  };

  const passedLoanType = mapServiceToLoanType(service);
  console.log("Raw service:", JSON.stringify(service));
  console.log("passedLoanType =", passedLoanType);
  const formData = loanData || {};

  const [activeLoanDetails, setActiveLoanDetails] = useState(
    Array.isArray(formData.activeLoanDetails) ? formData.activeLoanDetails : [],
  );
  const [currentLoanIndex, setCurrentLoanIndex] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (passedLoanType && setLoanData) {
      setLoanData((prev) => ({
        ...prev,
        loanType: prev?.loanType || passedLoanType,
        tenure: prev?.tenure ?? 3,
      }));
    }
  }, [passedLoanType, setLoanData]);

  // Active loan details come from the latest CIBIL report and are stored
  // in the parent loanData so they survive navigation/remounts.
  useEffect(() => {
    const count = Number(formData.activeLoans) || 0;
    const bureauLoans = Array.isArray(formData.activeLoanDetails)
      ? formData.activeLoanDetails
      : [];

    setActiveLoanDetails(bureauLoans.slice(0, count));
    setCurrentLoanIndex(0);
  }, [formData.activeLoans, formData.activeLoanDetails]);

  // The CIBIL score comes from the latest fetched credit report (read-only).
  // GetCibilScore saves it in loanData / localStorage and fires a
  // "cibilScoreUpdated" event, so it is picked up here when the form opens
  // again, or immediately if the score is fetched while this form is mounted.
  useEffect(() => {
    if (!setLoanData) return undefined;

    const syncScore = (rawScore) => {
      const score = Number(rawScore);

      if (!Number.isFinite(score) || score <= 0) return;

      setLoanData((prev) =>
        Number(prev?.cibilScore) === score
          ? prev
          : { ...prev, cibilScore: score },
      );
    };

    if (!hasValue(formData.cibilScore)) {
      let savedScore = null;

      try {
        savedScore = JSON.parse(
          localStorage.getItem("loanData") || "{}",
        )?.cibilScore;
      } catch {
        savedScore = null;
      }

      syncScore(savedScore || localStorage.getItem("dashboard_cibil_score"));
    }

    const handleScoreUpdated = (event) => syncScore(event?.detail?.score);

    window.addEventListener("cibilScoreUpdated", handleScoreUpdated);

    return () => {
      window.removeEventListener("cibilScoreUpdated", handleScoreUpdated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setLoanData]);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      const numericFields = [
        "age",
        "annualIncome",
        "loanAmount",
        "activeLoans",
        "cibilScore",
        "tenure",
      ];

      let processedValue = numericFields.includes(name)
        ? value === ""
          ? ""
          : Number(value)
        : value;

      if (name === "tenure") {
        if (processedValue > 30) processedValue = 30;
        if (processedValue < 0) processedValue = 0;
      }

      setLoanData((prev) => ({
        ...prev,
        [name]: processedValue,
      }));
    },
    [setLoanData],
  );

  // ---- Active loan detail helpers (were missing in the original) ----
  const handleLoanDetailChange = (field, value) => {
    setActiveLoanDetails((prev) =>
      prev.map((loan, idx) =>
        idx === currentLoanIndex ? { ...loan, [field]: value } : loan,
      ),
    );
  };

  const nextLoan = () => {
    setCurrentLoanIndex((i) => Math.min(i + 1, activeLoanDetails.length - 1));
  };

  const prevLoan = () => {
    setCurrentLoanIndex((i) => Math.max(i - 1, 0));
  };

  // ---- Form completeness check (controls Calculate button state) ----
  const isFormComplete = (() => {
    const age = Number(formData.age);
    const loanTypeValue = passedLoanType || formData.loanType;

    const baseFilled =
      hasValue(formData.age) &&
      age >= 18 &&
      age <= 75 &&
      hasValue(formData.employmentType) &&
      hasValue(formData.annualIncome) &&
      Number(formData.annualIncome) > 0 &&
      hasValue(loanTypeValue) &&
      hasValue(formData.loanAmount) &&
      Number(formData.loanAmount) > 0 &&
      hasValue(formData.tenure) &&
      Number(formData.tenure) > 0 &&
      hasValue(formData.activeLoans);

    if (!baseFilled) return false;

    const count = Number(formData.activeLoans) || 0;
    if (count === 0) return true;

    if (activeLoanDetails.length !== count) return false;

    return activeLoanDetails.every(
      (loan) =>
        hasValue(loan.emi) &&
        hasValue(loan.outstandingAmount) &&
        hasValue(loan.tenureLeft),
    );
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent duplicate clicks / incomplete form
    if (isCalculating || loading || !isFormComplete) {
      return;
    }

    const token = sessionStorage.getItem("access_token");

    if (!token) {
      alert("Please login first");
      return;
    }

    // Show calculating state immediately
    setIsCalculating(true);

    const processedData = {
      age: Number(formData.age) || 0,
      employment_type: formData.employmentType,
      net_monthly_income: Number(formData.annualIncome) || 0,
      loan_type: formData.loanType,
      loan_amount: Number(formData.loanAmount) || 0,
      tenure: Number(formData.tenure) || 1,
      cibil_score: Number(formData.cibilScore) || 300,

      existing_loans:
        Number(formData.activeLoans) === 0
          ? []
          : activeLoanDetails.map((loan) => ({
              monthly_emi: Number(loan.emi) || 0,
              outstanding_amount: Number(loan.outstandingAmount) || 0,
              tenure_left: Number(loan.tenureLeft) || 0,
            })),
    };

    try {
      // =====================================================
      // STEP 1: CALCULATE ELIGIBILITY
      // =====================================================

      const predictRes = await fetch(`${LPS_API_BASE}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(processedData),
      });

      if (!predictRes.ok) {
        const errorText = await predictRes.text();

        console.error("Prediction API Error:", errorText);

        throw new Error("Unable to calculate eligibility.");
      }

      const predictionData = await predictRes.json();

      console.log("Prediction Response:", predictionData);

      const decision = predictionData.decision || predictionData.status || "";

      const normalizedDecision = String(decision).toLowerCase();

      const predictedLoanId =
        predictionData.loan_id || predictionData.loanId || null;

      if (!predictedLoanId) {
        throw new Error(
          "Prediction did not return a valid loan ID. Please try again.",
        );
      }

      // Save fresh loan ID immediately
      localStorage.setItem("loan_id", String(predictedLoanId));

      // =====================================================
      // STEP 2: PREPARE LOAN CREATION
      // =====================================================

      const loanCreatePayload = {
        loan_id: predictedLoanId,
        age: Number(formData.age) || 0,
        employment_type: formData.employmentType,
        income: Number(formData.annualIncome) || 0,
        loan_type: formData.loanType,
        loan_amount: Number(formData.loanAmount) || 0,
        tenure: Number(formData.tenure) || 1,
        cibil: Number(formData.cibilScore) || 300,
      };

      console.log("Sending to /applications/loan/create:", loanCreatePayload);

      // =====================================================
      // STEP 3: CREATE LOAN IN BACKGROUND
      // =====================================================
      //
      // IMPORTANT:
      // Do NOT await this request here.
      // If this API is slow, it must NOT keep the
      // Calculate Eligibility button spinning.
      //

      fetch(`${API_BASE}/applications/loan/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(loanCreatePayload),
      })
        .then(async (response) => {
          const text = await response.text();

          let data = {};

          try {
            data = text ? JSON.parse(text) : {};
          } catch {
            data = {};
          }

          if (!response.ok) {
            throw new Error(
              data?.detail || data?.message || "Loan creation failed",
            );
          }

          return data;
        })
        .then((loanCreateData) => {
          console.log("Loan Create Response:", loanCreateData);

          // Update loan ID if backend returns one
          if (loanCreateData?.loan_id) {
            localStorage.setItem("loan_id", String(loanCreateData.loan_id));
          }

          // Save application ID
          if (loanCreateData?.application_id) {
            localStorage.setItem(
              "application_id",
              String(loanCreateData.application_id),
            );
          }

          // Notify other components
          window.dispatchEvent(
            new CustomEvent("loanCreated", {
              detail: loanCreateData,
            }),
          );
        })
        .catch((loanError) => {
          // Do NOT block eligibility result
          // Do NOT show alert to user
          console.error("Background loan creation failed:", loanError);
        });

      // =====================================================
      // STEP 4: RETURN ELIGIBILITY RESULT IMMEDIATELY
      // =====================================================

      const mergedResult = {
        ...predictionData,

        loan_id: predictedLoanId,

        application_id: predictionData.application_id || null,

        form_snapshot: processedData,
      };

      // Clear previous bank selection
      localStorage.removeItem("bank_selection_id");

      // =====================================================
      // STEP 5: STOP CALCULATING STATE IMMEDIATELY
      // =====================================================

      setIsCalculating(false);

      // Continue existing application flow
      if (onSubmit) {
        onSubmit(mergedResult, formData);
      }

      // Existing decision logging
      if (
        normalizedDecision !== "approved" &&
        normalizedDecision !== "partially approved"
      ) {
        console.warn("User is not approved/partially approved:", mergedResult);
      }
    } catch (err) {
      console.error("Eligibility calculation error:", err);

      // Stop spinner even if prediction fails
      setIsCalculating(false);

      alert(err.message || "Unable to calculate eligibility.");
    }
  };

  const currentLoan = activeLoanDetails[currentLoanIndex];

  const inputClass =
    "w-full rounded-xl border border-white/15 bg-[rgba(255,255,255,0.08)] px-3 sm:px-4 py-2.5 sm:py-3 text-[12px] sm:text-[16px] text-white outline-none transition placeholder:text-white/50 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/30 [&>option]:text-slate-900";

  const labelClass =
    "mb-2 block text-sm sm:text-[16px] font-medium text-white/90";

  const isButtonDisabled = loading || isCalculating || !isFormComplete;

  return (
    <div className="w-full pt-[45px] sm:pt-[55px] md:pt-[60px] lg:pt-0">
      <div className="w-full rounded-[22px] sm:rounded-[28px] border border-white/20 bg-[linear-gradient(135deg,rgba(15,23,42,0.88),rgba(52,64,110,0.82),rgba(17,24,39,0.88))] p-4 sm:p-6 md:p-8 lg:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3">
          <FileText className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-[#4ea1ff]" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#4ea1ff]">
            Loan Application Form
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="age" className={labelClass}>
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                placeholder="Enter your age"
                value={formData.age}
                onChange={handleChange}
                required
                min="18"
                max="75"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="employmentType" className={labelClass}>
                Employment Type
              </label>
              <div className="relative">
                <select
                  id="employmentType"
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  required
                  className={`${inputClass} appearance-none pr-10 sm:pr-12`}
                >
                  <option value="">Select</option>
                  <option value="Salaried">Salaried</option>
                  <option value="Self-employed">Self Employed</option>
                  <option value="Professional">Professional</option>
                  <option value="Freelancer">Freelancer</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 sm:right-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-white/70" />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="netMonthlyIncome" className={labelClass}>
                Monthly Net Income (₹)
                <span className="ml-2 cursor-pointer group relative align-middle">
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block text-blue-400"
                  >
                    <circle cx="12" cy="12" r="12" fill="#2563eb" />
                    <text
                      x="12"
                      y="16"
                      textAnchor="middle"
                      fontSize="14"
                      fill="#fff"
                      fontFamily="'Outfit', sans-serif"
                      fontWeight="bold"
                    >
                      i
                    </text>
                  </svg>
                  <span className="absolute left-1/2 z-10 hidden group-hover:block w-[320px] -translate-x-1/2 mt-2 px-3 py-2 rounded bg-gray-900 text-white text-xs shadow-lg whitespace-normal">
                    Monthly Total Income = Income of Applicant + Income of
                    Co-Applicant(if Available) + Rental Income + Any Other
                    Monthly income.
                  </span>
                </span>
              </label>
              <input
                type="number"
                id="netMonthlyIncome"
                name="annualIncome"
                placeholder="Enter your income"
                value={formData.annualIncome}
                onChange={handleChange}
                required
                className={inputClass}
              />
              {formData.annualIncome > 0 && (
                <p className="mt-1.5 text-xs text-blue-400/80 font-medium">
                  ₹ {numberToWords(formData.annualIncome)}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="loanType" className={labelClass}>
                Loan Type
              </label>
              <div className="relative">
                <select
                  id="loanType"
                  name="loanType"
                  value={passedLoanType || formData.loanType}
                  onChange={handleChange}
                  required
                  disabled={!!passedLoanType}
                  className={`${inputClass} appearance-none pr-10 sm:pr-12 ${
                    passedLoanType ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  <option value="">Select</option>
                  <option value="Personal">Personal Loan</option>
                  <option value="Home">Home Loan</option>
                  <option value="Business">Business Loan</option>
                  <option value="LAP">Loan Against Property</option>
                  <option value="Mortgage">Mortgage Loan</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 sm:right-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-white/70" />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="loanAmount" className={labelClass}>
              Loan Amount (₹)
            </label>
            <input
              type="number"
              id="loanAmount"
              name="loanAmount"
              placeholder="Enter Loan amount"
              value={formData.loanAmount}
              onChange={handleChange}
              required
              min="0"
              className={inputClass}
            />
            {formData.loanAmount > 0 && (
              <p className="mt-1.5 text-xs text-blue-400/80 font-medium">
                ₹ {numberToWords(formData.loanAmount)}
              </p>
            )}
          </div>

          <div>
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label
                htmlFor="tenure"
                className="text-sm sm:text-[15px] font-medium text-white/90"
              >
                Loan Tenure (Years)
              </label>

              <input
                type="number"
                name="tenure"
                min="0"
                max="30"
                step="1"
                value={formData.tenure ?? 0}
                onChange={handleChange}
                className="h-10 w-full sm:w-20 rounded-lg border border-white/20 bg-[rgba(255,255,255,0.08)] text-center text-sm font-semibold text-white outline-none placeholder:text-white/50 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/30"
              />
            </div>

            <input
              type="range"
              id="tenure"
              name="tenure"
              min="0"
              max="30"
              step="1"
              value={formData.tenure ?? 0}
              onChange={handleChange}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/80 accent-[#2563eb]"
            />

            <div className="mt-2 flex items-center justify-between text-xs sm:text-sm text-white/60">
              <span>0 Year</span>
              <span>30 Years</span>
            </div>
          </div>

          {/* ===================== CREDIT PROFILE CARD ===================== */}
          <div className="w-full min-w-0 rounded-2xl border border-[#2563ff] bg-[#0b1a4a]/40 p-3 sm:p-4 lg:p-5 shadow-[0_0_0_1px_rgba(37,99,255,0.25)]">
            {/* Header */}
            <div className="flex min-w-0 items-start justify-between gap-2 sm:gap-3">
              <div className="flex min-w-0 items-start gap-2 sm:gap-4">
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#1b2d6b]">
                  <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-[#4ea1ff]" />
                </div>
                <div className="min-w-0">
                  <h3 className="break-words text-base sm:text-lg lg:text-xl font-semibold text-white">
                    Credit Profile
                  </h3>
                  {/* Tablet and desktop description */}
                  <p className="mt-1 hidden max-w-md text-xs sm:block sm:text-sm lg:text-[15px] leading-snug text-white/75">
                    Connect your credit report to automatically retrieve your
                    CIBIL score and existing loan information.
                  </p>
                </div>
              </div>

              <span className="shrink-0 whitespace-nowrap rounded-full bg-[#1b3a8a] px-2.5 sm:px-3 lg:px-4 py-1.5 text-[10px] sm:text-xs lg:text-sm font-semibold text-[#3ea0ff]">
                Recommended
              </span>
            </div>

            {/* Mobile description: full card width for a compact two-line layout */}
            <p className="mt-2 w-full text-xs leading-snug text-white/75 sm:hidden">
              Connect your credit report to automatically retrieve your CIBIL
              score and existing loan information.
            </p>

            {/* Features strip */}
            <div className="mt-4 grid grid-cols-1 divide-y divide-white/10 rounded-xl border border-white/10 bg-white/[0.03] lg:grid-cols-3 lg:divide-y-0 lg:divide-x">
              <div className="flex min-w-0 items-center gap-3 px-3 sm:px-4 py-3 sm:py-3.5 lg:py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1b2d6b]">
                  <Gauge className="h-5 w-5 text-[#3ea0ff]" />
                </div>
                <p className="min-w-0 text-sm sm:text-[15px] text-white/80 leading-snug">
                  Get your actual
                  <br />
                  CIBIL score
                </p>
              </div>

              <div className="flex min-w-0 items-center gap-3 px-3 sm:px-4 py-3 sm:py-3.5 lg:py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1b2d6b]">
                  <FileText className="h-5 w-5 text-[#3ea0ff]" />
                </div>
                <p className="min-w-0 text-sm sm:text-[15px] text-white/80 leading-snug">
                  Identify active loans
                  <br />& credit accounts
                </p>
              </div>

              <div className="flex min-w-0 items-center gap-3 px-3 sm:px-4 py-3 sm:py-3.5 lg:py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1b2d6b]">
                  <IndianRupee className="h-5 w-5 text-[#3ea0ff]" />
                </div>
                <p className="min-w-0 text-sm sm:text-[15px] text-white/80 leading-snug">
                  Auto-fill available
                  <br />
                  EMI information
                </p>
              </div>
            </div>

            {/* Fetch button */}
            <button
              type="button"
              onClick={() =>
                navigate("/get-cibil-score", {
                  // LoanForm is rendered inside Tools at step 3.
                  // Preserve the internal Loan Application Form view on return.
                  state: { from: `${location.pathname}?tool=loan-prediction` },
                })
              }
              className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 sm:gap-3 rounded-xl bg-[#2563ff] px-3 sm:px-4 py-3 text-sm sm:text-base lg:text-lg font-semibold text-white transition hover:bg-[#1f57e5]"
            >
              <ShieldCheck className="h-5 w-5" />
              Fetch Credit Report
              <ArrowRight className="h-5 w-5" />
            </button>

            {/* Secure note */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs lg:text-sm text-white/70">
              <Lock className="h-4 w-4" />
              <span>Secure connection</span>
              <span>•</span>
              <span>Your permission is required</span>
            </div>
          </div>
          {/* =================== END CREDIT PROFILE CARD =================== */}

          {/* CIBIL Score: read-only, filled from the fetched credit report */}
          <div>
            <label htmlFor="cibilScore" className={labelClass}>
              CIBIL Score
            </label>
            <input
              type="number"
              id="cibilScore"
              name="cibilScore"
              value={hasValue(formData.cibilScore) ? formData.cibilScore : ""}
              readOnly
              aria-readonly="true"
              placeholder="Fetch CIBIL report to retrieve your score"
              className={`${inputClass} cursor-not-allowed opacity-80`}
            />
            <p className="mt-2 text-xs sm:text-sm text-[#4ea1ff]/90">
              Automatically populated from your CIBIL report. Manual entry is
              disabled.
            </p>
          </div>

          <div>
            <label htmlFor="activeLoans" className={labelClass}>
              Active Loans
            </label>
            <input
              type="number"
              id="activeLoans"
              name="activeLoans"
              value={hasValue(formData.activeLoans) ? formData.activeLoans : ""}
              readOnly
              aria-readonly="true"
              placeholder="Fetch CIBIL report to retrieve active loans"
              className={`${inputClass} cursor-not-allowed opacity-80`}
            />
            <p className="mt-2 text-xs sm:text-sm text-[#4ea1ff]/90">
              Automatically populated from your CIBIL report. Manual entry is
              disabled.
            </p>
          </div>

          {/* Calculate Eligibility: dull until all fields are filled */}
          <button
            type="submit"
            disabled={isButtonDisabled}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 sm:px-6 py-3.5 sm:py-4 text-base sm:text-lg font-semibold transition ${
              isButtonDisabled
                ? "cursor-not-allowed bg-[#2563ff]/30 text-white/40 shadow-none"
                : "bg-[#2563ff] text-white shadow-[0_12px_30px_rgba(37,99,255,0.35)] hover:bg-[#1f57e5]"
            }`}
          >
            {loading || isCalculating ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
                Calculating Eligibility...
              </>
            ) : (
              <>
                Calculate Eligibility
                <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
