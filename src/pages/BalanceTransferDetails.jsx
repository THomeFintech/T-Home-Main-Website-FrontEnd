import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BT_API_BASE } from "../config";

const initialState = {
  loanType: "",
  bankName: "",
  originalPrincipal: "",
  amountPaid: "",
  remainingTenure: "",
  currentInterestRate: "",
  monthlyIncome: "",
  foreclosureFee: "",
  cibilScore: "",
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

export default function BalanceTransferDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedService = location.state?.service || "";
  const [formData, setFormData] = useState({
    ...initialState,
    loanType: selectedService,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleAnalyzeLoan = async () => {
    try {
      setLoading(true);
      setError("");

      const payload = {
        loan_type: formData.loanType,
        current_bank_name: formData.bankName,
        original_principal: Number(formData.originalPrincipal),
        amount_paid: Number(formData.amountPaid),
        remaining_tenure_months: Number(formData.remainingTenure),
        current_interest_rate: Number(formData.currentInterestRate),
        net_monthly_income: Number(formData.monthlyIncome),
        foreclosure_fee: Number(formData.foreclosureFee || 0),
        cibil_score: Number(formData.cibilScore),
      };

      if (
        !payload.loan_type ||
        !payload.current_bank_name ||
        !payload.original_principal ||
        (!payload.amount_paid && payload.amount_paid !== 0) ||
        !payload.remaining_tenure_months ||
        !payload.current_interest_rate ||
        !payload.net_monthly_income ||
        !payload.cibil_score
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
      localStorage.setItem("currentBankName", formData.bankName);

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

              <Field label="Net Monthly Income (₹) *">
                <input
                  type="number"
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleChange}
                  placeholder="Enter monthly income"
                  className={inputClass}
                />
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
              </Field>
            </div>

            <Field label="CIBIL Score * ">
              <input
                type="number"
                name="cibilScore"
                value={formData.cibilScore}
                onChange={handleChange}
                placeholder="Enter CIBIL score"
                className={inputClass}
              />
              <div className="mt-1 flex items-center justify-between text-[10px] text-white/45">
                <span>Don&apos;t know your CIBIL Score ?</span>
                <span className="text-[#3f8bff]">Click here</span>
              </div>
            </Field>

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
              <p>• You are eligible for a higher loan</p>
              <p className="mt-1">• Consider balance transfer to reduce EMI</p>
              <p className="mt-1">
                • You can save {formatINR(numbers.estimatedSaving)} with a lower
                interest rate
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
                {loading ? "Analyzing..." : "Add Bank Offers"}
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
