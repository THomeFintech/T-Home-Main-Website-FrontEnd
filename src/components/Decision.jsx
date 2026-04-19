import React from "react";
import {
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";

export default function DecisionPanel({ result, loading }) {

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="p-8 text-center text-white">
        <div className="animate-spin h-12 w-12 border-4 border-blue-400 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4">Analyzing your application...</p>
      </div>
    );
  }

  /* ================= EMPTY ================= */
  if (!result || !result.decision) {
    return (
      <div className="p-8 text-center text-white">
        <FileText className="mx-auto mb-4" />
        <h3>Loan Prediction</h3>
        <p className="text-white/60">
          Submit the form to see your loan prediction
        </p>
      </div>
    );
  }

  console.log("API RESULT:", result);

  /* ================= SAFE VALUES ================= */

  // Decision
  const decisionText = result.decision || "Pending";
  const decision = decisionText.toLowerCase();

  // Probability (backend gives 0–1 → convert to %)
  const probabilityRaw = Number(result.approval_probability ?? 0);

  const safeApproval =
    probabilityRaw <= 1
      ? probabilityRaw * 100
      : probabilityRaw;

  // Clamp to 0–100
  const finalProbability = Math.min(100, Math.max(0, safeApproval));

  // Loan ID
  const loanId = result.loan_id || "Generating...";

  /* ================= DECISION TYPES ================= */

  const isApproved =
    decision.includes("approved") &&
    !decision.includes("partially");

  const isPartiallyApproved = decision.includes("partially");
  const isRejected = decision.includes("rejected");

  /* ================= BADGE ================= */

  let badgeClass =
    "bg-blue-500/20 text-blue-400 border border-blue-400/30";
  let icon = <Clock3 className="h-4 w-4" />;

  if (isApproved) {
    badgeClass =
      "bg-green-500/20 text-green-400 border border-green-400/30";
    icon = <CheckCircle2 className="h-4 w-4" />;
  } else if (isPartiallyApproved) {
    badgeClass =
      "bg-yellow-500/20 text-yellow-400 border border-yellow-400/30";
    icon = <AlertCircle className="h-4 w-4" />;
  } else if (isRejected) {
    badgeClass =
      "bg-red-500/20 text-red-400 border border-red-400/30";
    icon = <XCircle className="h-4 w-4" />;
  }

  /* ================= AMOUNT ================= */

  const formattedAmount =
    result.approved_amount &&
    (isApproved || isPartiallyApproved)
      ? `₹${Number(result.approved_amount).toLocaleString("en-IN")}`
      : null;

  return (
    <div className="p-6 rounded-xl bg-[#0f172a] text-white">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl">Loan Prediction</h2>
        <div className={`px-3 py-1 rounded-full flex items-center gap-2 ${badgeClass}`}>
          {icon}
          {decisionText}
        </div>
      </div>

      {/* LOAN ID */}
      <div className="bg-white/10 p-4 rounded-lg text-center mb-6">
        <p className="text-sm text-white/60">Loan ID</p>
        <h2 className="text-2xl font-bold">
          {loanId}
        </h2>
      </div>

      {/* PROBABILITY */}
      <div className="text-center mb-6">
        <h1 className="text-5xl font-bold">
          {finalProbability.toFixed(1)}%
        </h1>
      </div>

      {/* APPROVED AMOUNT */}
      {formattedAmount && (
        <div className="bg-white/10 p-4 rounded-lg mb-6 text-center">
          Approved Amount: {formattedAmount}
        </div>
      )}

      {/* REASONS */}
      {Array.isArray(result?.reasons) && result.reasons.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-2">Reasons:</h3>
          {result.reasons.map((r, i) => (
            <p key={i} className="text-white/70 text-sm">
              • {r}
            </p>
          ))}
        </div>
      )}

      {/* GUIDANCE (NEW) */}
      {Array.isArray(result?.guidance) && result.guidance.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-2">Suggestions:</h3>
          {result.guidance.map((g, i) => (
            <p key={i} className="text-green-300 text-sm">
              ✔ {g}
            </p>
          ))}
        </div>
      )}

      {/* BANKS */}
      {Array.isArray(result?.recommended_banks) &&
        result.recommended_banks.length > 0 && (
          <div className="grid md:grid-cols-3 gap-4">
            {result.recommended_banks.map((bank, index) => (
              <div key={index} className="p-4 bg-white/5 rounded-lg">
                <h3 className="font-semibold">
                  {bank.name || "Bank"}
                </h3>
                <p>Interest: {bank.interestRate || "N/A"}</p>
                <p>EMI: {bank.monthlyEmi || "N/A"}</p>
              </div>
            ))}
          </div>
        )}

    </div>
  );
}