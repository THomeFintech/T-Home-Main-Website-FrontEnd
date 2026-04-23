import React, { useState, useCallback } from "react";
import { FileText, ChevronDown, Zap } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL;



function numberToWords(num) {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
    "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen",
    "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty",
    "Sixty", "Seventy", "Eighty", "Ninety"];

  if (!num || num === 0) return "Zero";
  num = Math.floor(Number(num));

  function convert(n) {
    if (n < 20)       return ones[n];
    if (n < 100)      return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000)     return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convert(n % 100) : "");
    if (n < 100000)   return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + convert(n % 1000) : "");
    if (n < 10000000) return convert(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + convert(n % 100000) : "");
    return convert(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + convert(n % 10000000) : "");
  }

  return convert(num) + " Rupees";
}

export default function LoanForm({ onSubmit, loading, onOpenCibil }) {
  const [formData, setFormData] = useState({
    age: "",
    employmentType: "",
    annualIncome: "",
    loanType: "",
    loanAmount: "",
    activeLoans: "",
    cibilScore: "",
    tenure: 3,
  });

  const [activeLoanDetails, setActiveLoanDetails] = useState([]);
  const [currentLoanIndex, setCurrentLoanIndex] = useState(0);

  const handleChange = useCallback((e) => {
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

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    if (name === "activeLoans") {
      const count = Number(value) || 0;

      setActiveLoanDetails(
        Array.from({ length: count }, () => ({
          emi: "",
          outstandingAmount: "",
          tenureLeft: "",
        }))
      );

      setCurrentLoanIndex(0);
    }
  }, []);

  const handleLoanDetailChange = useCallback(
    (field, value) => {
      setActiveLoanDetails((prev) =>
        prev.map((loan, index) =>
          index === currentLoanIndex ? { ...loan, [field]: value } : loan
        )
      );
    },
    [currentLoanIndex]
  );

  const nextLoan = () => {
    setCurrentLoanIndex((prev) =>
      prev < activeLoanDetails.length - 1 ? prev + 1 : prev
    );
  };

  const prevLoan = () => {
    setCurrentLoanIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    console.log("Sending to /predict:", processedData);

    try {
      // 1) Predict eligibility
      const predictRes = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(processedData),
      });

      if (!predictRes.ok) {
        const errorText = await predictRes.text();
        console.error("Prediction API Error:", errorText);
        throw new Error("Prediction API failed");
      }

      const predictionData = await predictRes.json();
      console.log("Prediction Response:", predictionData);

      // normalize decision keys from backend
      const decision =
        predictionData.decision ||
        predictionData.status ||
        "";

      const normalizedDecision = String(decision).toLowerCase();

      // support different backend key styles
      const predictedLoanId =
        predictionData.loan_id ||
        predictionData.loanId ||
        null;

      if (predictedLoanId) {
        localStorage.setItem("loan_id", predictedLoanId);
      }

      // 2) Create loan record so application flow has application_id + stable loan_id
      const loanCreatePayload = {
        loan_id: predictedLoanId || localStorage.getItem("loan_id"),
        age: Number(formData.age) || 0,
        employment_type: formData.employmentType,
        income: Number(formData.annualIncome) || 0,
        loan_type: formData.loanType.toLowerCase(),
        loan_amount: Number(formData.loanAmount) || 0,
        tenure: Number(formData.tenure) || 1,
        cibil: Number(formData.cibilScore) || 300,
      };

      console.log("Sending to /applications/loan/create:", loanCreatePayload);
      const token = localStorage.getItem("token");

if (!token) {
  alert("Please login first");
  return;
}

      const loanCreateRes = await fetch(`${API_BASE}/applications/loan/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify(loanCreatePayload),
      });

      if (!loanCreateRes.ok) {
        const errorText = await loanCreateRes.text();
        console.error("Loan Create API Error:", errorText);
        throw new Error("Loan creation failed");
      }

      const loanCreateData = await loanCreateRes.json();
      console.log("Loan Create Response:", loanCreateData);

      if (loanCreateData.loan_id) {
        localStorage.setItem("loan_id", loanCreateData.loan_id);
      }
      if (loanCreateData.application_id) {
        localStorage.setItem(
          "application_id",
          String(loanCreateData.application_id)
        );
      }

      const mergedResult = {
        ...predictionData,
        loan_id:
          loanCreateData.loan_id ||
          predictedLoanId ||
          predictionData.loan_id ||
          predictionData.loanId,
        application_id:
          loanCreateData.application_id || predictionData.application_id || null,
        form_snapshot: processedData,
      };

      // clear stale bank selection when a new form is submitted
      localStorage.removeItem("bank_selection_id");

      if (onSubmit) {
  onSubmit(mergedResult, formData); // 🔥 SEND FORM DATA ALSO
}
      // optional console guidance
      if (
        normalizedDecision !== "approved" &&
        normalizedDecision !== "partially approved"
      ) {
        console.warn("User is not approved/partially approved:", mergedResult);
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
    }
  };

  const currentLoan = activeLoanDetails[currentLoanIndex];

  const inputClass =
    "w-full rounded-xl border border-white/15 bg-[rgba(255,255,255,0.08)] px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-[15px] text-white outline-none transition placeholder:text-white/50 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/30 [&>option]:text-slate-900";

  const labelClass =
    "mb-2 block text-sm sm:text-[15px] font-medium text-white/90";

  return (
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
                    fontFamily="Arial"
                    fontWeight="bold"
                  >
                    i
                  </text>
                </svg>
                <span className="absolute left-1/2 z-10 hidden group-hover:block w-[320px] -translate-x-1/2 mt-2 px-3 py-2 rounded bg-gray-900 text-white text-xs shadow-lg whitespace-normal">
                  Monthly Total Income = Income of Applicant + Income of
                  Co-Applicant(if Available) + Rental Income + Any Other Monthly
                  income.
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
          </div>

          <div>
            <label htmlFor="loanType" className={labelClass}>
              Loan Type
            </label>
            <div className="relative">
              <select
                id="loanType"
                name="loanType"
                value={formData.loanType}
                onChange={handleChange}
                required
                className={`${inputClass} appearance-none pr-10 sm:pr-12`}
              >
                <option value="">Select</option>
                <option value="Personal">Personal Loan</option>
                <option value="Home">Home Loan</option>
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

        <div>
          <label htmlFor="cibilScore" className={labelClass}>
            CIBIL Score
          </label>
          <input
            type="number"
            id="cibilScore"
            name="cibilScore"
            placeholder="Enter CIBIL score (300-900)"
            value={formData.cibilScore}
            onChange={handleChange}
            required
            min="300"
            max="900"
            className={inputClass}
          />

          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <small className="text-xs sm:text-sm text-white/65">
              Don&apos;t know your CIBIL Score ?
            </small>

            <button
              type="button"
              onClick={onOpenCibil}
              className="self-start sm:self-auto text-sm font-semibold text-[#1d78ff] transition hover:text-[#57a3ff]"
            >
              Click here
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="activeLoans" className={labelClass}>
            Active Loans
          </label>
          <input
            type="number"
            id="activeLoans"
            name="activeLoans"
            placeholder="Number of active loans"
            value={formData.activeLoans}
            onChange={handleChange}
            required
            min="0"
            max="50"
            className={inputClass}
          />
        </div>

        {activeLoanDetails.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 md:p-6">
            <div className="mb-5 text-center">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">
                Active Loan Details
              </h3>
              <p className="mt-1 text-sm sm:text-base md:text-lg text-white/80">
                Loan {currentLoanIndex + 1} of {activeLoanDetails.length}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className={labelClass}>Monthly EMI (₹)</label>
                <input
                  type="number"
                  value={currentLoan.emi}
                  onChange={(e) =>
                    handleLoanDetailChange("emi", Number(e.target.value))
                  }
                  min="0"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Outstanding Amount (₹)</label>
                <input
                  type="number"
                  value={currentLoan.outstandingAmount}
                  onChange={(e) =>
                    handleLoanDetailChange(
                      "outstandingAmount",
                      Number(e.target.value)
                    )
                  }
                  min="0"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Tenure Left (Years)</label>
                <input
                  type="number"
                  value={currentLoan.tenureLeft}
                  onChange={(e) =>
                    handleLoanDetailChange("tenureLeft", Number(e.target.value))
                  }
                  min="0"
                  max="30"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
              {currentLoanIndex > 0 && (
                <button
                  type="button"
                  onClick={prevLoan}
                  className="w-full sm:w-auto rounded-2xl bg-[#53a8ff] px-5 sm:px-7 py-3 text-sm sm:text-base font-semibold text-[#07152f] shadow-lg transition hover:scale-[1.02]"
                >
                  ← Previous Loan
                </button>
              )}

              {currentLoanIndex < activeLoanDetails.length - 1 && (
                <button
                  type="button"
                  onClick={nextLoan}
                  className="w-full sm:w-auto rounded-2xl bg-[#53a8ff] px-5 sm:px-7 py-3 text-sm sm:text-base font-semibold text-[#07152f] shadow-lg transition hover:scale-[1.02]"
                >
                  Next Loan →
                </button>
              )}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2563ff] px-4 sm:px-6 py-3.5 sm:py-4 text-base sm:text-lg font-semibold text-white shadow-[0_12px_30px_rgba(37,99,255,0.35)] transition hover:bg-[#1f57e5] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
              Processing...
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
  );
}
