import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

function formatINR(value) {
  return `Rs${Math.round(value).toLocaleString("en-IN")}`;
}

export default function BalanceTransferDetails() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [loanResult, setLoanResult] = useState(null);
  
  const handleAddOffers = async () => {
  try {
    const payload = {
      loan_type: formData.loanType,
      current_bank_name: formData.bankName,
      original_principal: Number(formData.originalPrincipal),
      amount_paid: Number(formData.amountPaid),
      remaining_tenure_months: Number(formData.remainingTenure),
      current_interest_rate: Number(formData.currentInterestRate),
      net_monthly_income: Number(formData.monthlyIncome),
      cibil_score: Number(formData.cibilScore),
      foreclosure_fee: Number(formData.foreclosureFee),
    };

    console.log("Sending Loan Data:", payload);

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

    const data = await res.json();

    console.log("Loan Response:", data);
    setLoanResult(data);

    localStorage.setItem(
      "bt_loan_reference",
      data.loan_reference
    );

    localStorage.setItem(
      "bt_loan_id",
      data.loan_id
    );

    navigate("/balance-transfer/offers");

  } catch (err) {
    console.error(err);
    alert("Failed to save loan details");
  }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const inputClass =
    "h-[44px] w-full rounded-[9px] border border-white/20 bg-[rgba(255,255,255,0.08)] px-3 text-[13px] text-white placeholder:text-white/50 outline-none transition focus:border-[#4e8fff]";

  return (
    <section className="relative min-h-screen overflow-hidden px-4 pb-12 pt-28 sm:px-6 md:pt-32 lg:px-8 lg:pt-36">
      <div className="pointer-events-none absolute inset-0 bg-[#030a1a]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(44,78,173,0.36),transparent_58%)]" />

      <div className="relative z-10 mx-auto max-w-[1300px] rounded-[16px] border border-white/15 bg-[linear-gradient(90deg,rgba(255,255,255,0.11)_0%,rgba(255,255,255,0.06)_100%)] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
        <div className="mx-auto max-w-[1160px]">
          <div className="text-center">
            <h1 className="text-[32px] font-semibold leading-tight text-white sm:text-[54px]">
              Your <span className="text-[#2572ff]">Current Loan</span> Details
            </h1>
            <p className="mt-2 text-[12px] text-white/70 sm:text-[13px]">
              This helps us understand your existing loan and calculate accurate savings.
            </p>
            <div className="mt-3 inline-flex items-center rounded-full border border-[#4f84ff]/55 bg-[#1c4fbf]/20 px-3 py-1 text-[10px] text-[#7db2ff]">
              256-bit SSL secured • No data sharing • No spam calls
            </div>
          </div>

          <form className="mt-8 space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Loan Type *">
                <select name="loanType" value={formData.loanType} onChange={handleChange} className={inputClass}>
                  <option value="">Select Loan Type</option>
                  <option>Personal Loan</option>
                  <option>Home Loan</option>
                  <option>Loan Against Property</option>
                </select>
              </Field>
              <Field label="Current Bank Name *">
                <input name="bankName" value={formData.bankName} onChange={handleChange} className={inputClass} />
              </Field>
              <Field label="Original Principal (Rs) *">
                <input name="originalPrincipal" value={formData.originalPrincipal} onChange={handleChange} className={inputClass} />
              </Field>
              <Field label="Amount Paid (Rs) *">
                <input name="amountPaid" value={formData.amountPaid} onChange={handleChange} className={inputClass} />
              </Field>
              <Field label="Remaining Tenure(Months) *">
                <input name="remainingTenure" value={formData.remainingTenure} onChange={handleChange} className={inputClass} />
              </Field>
              <Field label="Current Interest Rate (%) *">
                <input name="currentInterestRate" value={formData.currentInterestRate} onChange={handleChange} className={inputClass} />
              </Field>
              <Field label="Net Monthly Income (Rs) *">
                <input name="monthlyIncome" value={formData.monthlyIncome} onChange={handleChange} className={inputClass} />
              </Field>
              <Field label="Foreclosure Fee (Rs) *">
                <input name="foreclosureFee" value={formData.foreclosureFee} onChange={handleChange} className={inputClass} />
              </Field>
            </div>

            <Field label="CIBIL Score">
              <input name="cibilScore" value={formData.cibilScore} onChange={handleChange} className={inputClass} />
              <div className="mt-1 flex items-center justify-between text-[10px] text-white/45">
                <span>Don&apos;t know your CIBIL Score ?</span>
                <span className="text-[#3f8bff]">Click here</span>
              </div>
            </Field>

            <div className="pt-2 text-center">
              <h3 className="text-[19px] font-medium text-white">Current Loan Overview</h3>
              <div className="mt-3 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <div className="min-w-[200px] rounded-[8px] border border-white/15 bg-white/[0.9] px-6 py-3">
                  <p className="text-[11px] text-[#6b7280]">Outstanding</p>
                  <p className="text-[38px] font-semibold leading-none text-[#1f2937]">
  {loanResult
    ? formatINR(loanResult.outstanding_principal)
    : "Rs0"}
</p>
                </div>
                <div className="min-w-[220px] rounded-[8px] border border-white/15 bg-white/[0.9] px-6 py-3">
                  <p className="text-[11px] text-[#6b7280]">Remaining total Outflow</p>
                  <p className="text-[38px] font-semibold leading-none text-[#04a36d]">
  {loanResult
    ? formatINR(loanResult.remaining_outflow_current)
    : "Rs0"}
</p>
                </div>
              </div>
            </div>

            <div className="rounded-[8px] border border-white/20 bg-white/[0.03] px-4 py-3 text-[11px] text-white/80">
              <p>• You are eligible for a higher loan</p>
              <p className="mt-1">• Consider balance transfer to reduce EMI</p>
              <p className="mt-1">
  • Maximum eligible loan amount:
  {" "}
  {loanResult
    ? formatINR(loanResult.max_eligible_loan_amount)
    : "Rs0"}
</p>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleAddOffers}
                className="rounded-[9px] bg-[#1f6bff] px-7 py-2.5 text-[14px] font-medium text-white transition hover:bg-[#1c5ee0]"
              >
                Add Bank Offers {"->"}
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
      <label className="mb-1.5 block text-[12px] font-medium text-white/90">{label}</label>
      {children}
    </div>
  );
}
