import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, FileText, CheckCircle, Users } from "lucide-react";
import { BT_API_BASE } from "../config";

export default function BalanceTransferReviewSubmit() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [mainApplicant, setMainApplicant] = useState({
    fullName: "-",
    mobile: "-",
    email: "-",
    aadhaar: "-",
    pan: "-",
  });

  const [loanDetails, setLoanDetails] = useState({
    loanType: "-",
    loanAmount: "-",
    tenure: "-",
    employmentType: "-",
  });

  const [kycFiles, setKycFiles] = useState([]);
  const [incomeDocs, setIncomeDocs] = useState([]);
  const [loanDocs, setLoanDocs] = useState([]);
  const [hasCoApplicant, setHasCoApplicant] = useState(false);

  useEffect(() => {
    const draft = JSON.parse(localStorage.getItem("btApplicationDraft") || "{}");
    const incomeDraft = JSON.parse(
      localStorage.getItem("btIncomeDocumentsDraft") || "{}"
    );
    const existingLoanDraft = JSON.parse(
      localStorage.getItem("btExistingLoanDocumentsDraft") || "{}"
    );

    const fullName = draft.full_name || draft.fullName || "-";
    const mobile = draft.mobile_number || draft.mobile || "-";
    const email = draft.email || "-";
    const aadhaarRaw = draft.aadhaar_number || draft.aadhaar || "";
    const pan = draft.pan_number || draft.pan || "-";
    const employmentType =
      draft.employment_type || draft.employmentType || "-";

    setMainApplicant({
      fullName,
      mobile,
      email,
      aadhaar: aadhaarRaw
        ? `XXXX XXXX ${String(aadhaarRaw).slice(-4)}`
        : "-",
      pan,
    });

    setLoanDetails({
      loanType: draft.loan_type || draft.loanType || "-",
      loanAmount:
        draft.loan_amount !== undefined &&
        draft.loan_amount !== null &&
        draft.loan_amount !== ""
          ? Number(draft.loan_amount).toLocaleString("en-IN")
          : draft.loanAmount !== undefined &&
            draft.loanAmount !== null &&
            draft.loanAmount !== ""
          ? Number(draft.loanAmount).toLocaleString("en-IN")
          : "-",
      tenure: draft.tenure_months || draft.tenure || "-",
      employmentType,
    });

    setHasCoApplicant(Boolean(draft.has_co_applicant));

    setKycFiles([
      {
        name: "Aadhaar Card",
        status: aadhaarRaw ? "Ready" : "Pending",
      },
      {
        name: "PAN Card",
        status: pan !== "-" ? "Ready" : "Pending",
      },
      {
        name: "Passport Photo",
        status:
          draft.passportPhoto || draft.passport_photo ? "Ready" : "Pending",
      },
    ]);

    const incomeUploaded = incomeDraft?.uploaded || {};
    const incomeNames = Object.keys(incomeUploaded);

    setIncomeDocs(
      incomeNames.length
        ? incomeNames.map((name) => ({
            name,
            status: "Ready",
          }))
        : []
    );

    const loanUploaded = existingLoanDraft?.uploaded || {};
    const loanNames = Object.keys(loanUploaded);

    setLoanDocs(
      loanNames.length
        ? loanNames.map((name) => ({
            name,
            status: "Ready",
          }))
        : []
    );
  }, []);

  const buildUpdatePayload = () => {
    const draft = JSON.parse(localStorage.getItem("btApplicationDraft") || "{}");

    return {
      recommended_bank_name:
        draft.recommended_bank_name ||
        draft.recommendedBankName ||
        draft.bank_name ||
        draft.bankName ||
        "",

      estimated_savings:
        draft.estimated_savings ??
        draft.estimatedSavings ??
        draft.savings ??
        0,

      personal_details: {
        full_name: draft.full_name || draft.fullName || "",
        mobile_number: draft.mobile_number || draft.mobile || "",
        email: draft.email || "",
        aadhaar_number: draft.aadhaar_number || draft.aadhaar || "",
        pan_number: draft.pan_number || draft.pan || "",
      },

      loan_details: {
        loan_type: draft.loan_type || draft.loanType || "",
        loan_amount:
          draft.loan_amount !== undefined &&
          draft.loan_amount !== null &&
          draft.loan_amount !== ""
            ? Number(draft.loan_amount)
            : draft.loanAmount !== undefined &&
              draft.loanAmount !== null &&
              draft.loanAmount !== ""
            ? Number(draft.loanAmount)
            : null,
        tenure_months:
          draft.tenure_months !== undefined &&
          draft.tenure_months !== null &&
          draft.tenure_months !== ""
            ? Number(draft.tenure_months)
            : draft.tenure !== undefined &&
              draft.tenure !== null &&
              draft.tenure !== ""
            ? Number(draft.tenure)
            : null,
        employment_type: draft.employment_type || draft.employmentType || "",
      },

      current_step: 5,
    };
  };

  const handleSubmit = async () => {
  try {
    setLoading(true);
    setError("");

    const applicationReference =
      localStorage.getItem("btApplicationReference");

    if (!applicationReference) {
      setError("Application reference missing.");
      return;
    }

    const payload = buildUpdatePayload();
    console.log("PATCH Payload:", payload);

    // Update Application
    const updateResponse = await fetch(
      `${BT_API_BASE}/application/${applicationReference}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!updateResponse.ok) {
      const errData = await updateResponse.json();
      throw new Error(
        errData?.detail || "Failed to update application"
      );
    }

    // Submit Application
    const submitResponse = await fetch(
      `${BT_API_BASE}/application/${applicationReference}/submit`,
      {
        method: "POST",
      }
    );

    if (!submitResponse.ok) {
      const errData = await submitResponse.json();
      throw new Error(
        errData?.detail || "Failed to submit application"
      );
    }
    console.log("BT_API_BASE =", BT_API_BASE);
console.log("Reference =", applicationReference);

    navigate("/balance-transfer/application-portal/submitted");
  } catch (err) {
    setError(err.message || "Submission failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <section className="relative min-h-screen overflow-hidden px-4 pb-10 pt-24 font-['Outfit',sans-serif] sm:px-6 md:pt-28 lg:px-8 lg:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[#020918]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,77,167,0.34),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-[900px] rounded-[14px] border border-white/15 bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.06)_100%)] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.48)] backdrop-blur-xl sm:p-6">
        <h1 className="text-center text-[30px] font-semibold leading-tight text-white sm:text-[38px] md:text-[52px]">
          Balance Transfer <span className="text-[#1f6bff]">Application</span> Portal
        </h1>

        <div className="mt-5 overflow-x-auto">
          <div className="relative mx-auto min-w-[560px] px-1 sm:min-w-[760px]">
            <div className="absolute left-[6%] right-[6%] top-4 h-px bg-white/30" />
            <div className="relative flex items-start justify-between">
              {[1, 2, 3, 4, 5].map((step) => {
                const active = step === 5;
                const done = step < 5;
                const labels = [
                  "PERSONAL DETAILS",
                  "INCOME DOCUMENTS",
                  "EXISTING LOAN DOCUMENTS",
                  "CO-APPLICANT DETAILS",
                  "REVIEW & SUBMIT",
                ];
                return (
                  <div key={step} className="flex w-full flex-col items-center text-center">
                    <div
                      className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border text-[12px] font-semibold ${
                        active
                          ? "border-[#2f78ff] bg-white text-[#1f6bff]"
                          : done
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-white/70 bg-white text-slate-700"
                      }`}
                    >
                      {done ? "✓" : step}
                    </div>
                    <p
                      className={`mt-4 text-[10px] font-semibold ${
                        active ? "text-[#2f78ff]" : done ? "text-emerald-400" : "text-white/55"
                      }`}
                    >
                      {labels[step - 1]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-[800px] rounded-[12px] border border-white/15 bg-[rgba(255,255,255,0.05)] p-4 sm:p-6">
          <h2 className="text-center text-[24px] font-semibold text-white sm:text-[28px]">
            Review & Submit
          </h2>
          <p className="mb-4 text-center text-[14px] text-white/70">
            Verify all details before submitting your loan application
          </p>

          <div className="mb-2 border-b border-white/15 pb-2">
            <div className="mb-2 flex items-center gap-2">
              <User size={18} className="text-[#5ea0ff]" />
              <span className="text-[15px] font-semibold text-white">Main Applicant</span>
            </div>
            <div className="grid grid-cols-1 gap-2 text-[13px] text-white/90 sm:grid-cols-2">
              <div>
                Full Name
                <br />
                <span className="font-medium text-white/80">{mainApplicant.fullName}</span>
              </div>
              <div>
                Mobile Number
                <br />
                <span className="font-medium text-white/80">{mainApplicant.mobile}</span>
              </div>
              <div>
                Email Address
                <br />
                <span className="font-medium text-white/80">{mainApplicant.email}</span>
              </div>
              <div>
                Aadhaar Number
                <br />
                <span className="font-medium text-white/80">{mainApplicant.aadhaar}</span>
              </div>
              <div>
                PAN Number
                <br />
                <span className="cursor-pointer font-medium text-[#1f6bff] underline">
                  {mainApplicant.pan}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-2 border-b border-white/15 pb-2">
            <div className="mb-2 flex items-center gap-2">
              <FileText size={18} className="text-[#5ea0ff]" />
              <span className="text-[15px] font-semibold text-white">Loan Details</span>
            </div>
            <div className="grid grid-cols-1 gap-2 text-[13px] text-white/90 sm:grid-cols-2">
              <div>
                Loan Type
                <br />
                <span className="font-medium text-white/80">{loanDetails.loanType}</span>
              </div>
              <div>
                Loan Amount
                <br />
                <span className="font-medium text-white/80">₹ {loanDetails.loanAmount}</span>
              </div>
              <div>
                Tenure
                <br />
                <span className="font-medium text-white/80">{loanDetails.tenure} months</span>
              </div>
              <div>
                Employment Type
                <br />
                <span className="font-medium text-white/80">{loanDetails.employmentType}</span>
              </div>
            </div>
          </div>

          <div className="mb-2 border-b border-white/15 pb-2">
            <div className="mb-2 flex items-center gap-2">
              <FileText size={18} className="text-[#5ea0ff]" />
              <span className="text-[15px] font-semibold text-white">Documents Uploaded</span>
            </div>

            <div className="mb-2">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-[13px] font-semibold text-white/80">KYC & PHOTO</span>
                <span className="ml-auto text-[12px] font-semibold text-emerald-400">
                  {kycFiles.length} FILES
                </span>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                {kycFiles.map((file) => (
                  <div
                    key={file.name}
                    className="flex flex-1 items-center gap-2 rounded-[8px] border border-white/20 bg-[rgba(255,255,255,0.08)] p-2"
                  >
                    <FileText size={14} className="text-[#5ea0ff]" />
                    <span className="text-[13px] font-medium text-white">{file.name}</span>
                    <span className="ml-auto text-[11px] font-semibold text-emerald-400">
                      {file.status}
                    </span>
                    <CheckCircle size={16} className="ml-1 text-emerald-400" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-2">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-[13px] font-semibold text-white/80">
                  INCOME DOCUMENTS - {loanDetails.employmentType?.toUpperCase?.() || "-"}
                </span>
                <span className="ml-auto text-[12px] font-semibold text-emerald-400">
                  {incomeDocs.length} FILES
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {incomeDocs.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center gap-2 rounded-[8px] border border-white/20 bg-[rgba(255,255,255,0.08)] p-2"
                  >
                    <FileText size={14} className="text-[#5ea0ff]" />
                    <span className="text-[13px] font-medium text-white">{file.name}</span>
                    <span className="ml-auto text-[11px] font-semibold text-emerald-400">
                      {file.status}
                    </span>
                    <CheckCircle size={16} className="ml-1 text-emerald-400" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-2">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-[13px] font-semibold text-white/80">
                  EXISTING LOAN DOCUMENTS
                </span>
                <span className="ml-auto text-[12px] font-semibold text-emerald-400">
                  {loanDocs.length} FILES
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {loanDocs.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center gap-2 rounded-[8px] border border-white/20 bg-[rgba(255,255,255,0.08)] p-2"
                  >
                    <FileText size={14} className="text-[#5ea0ff]" />
                    <span className="text-[13px] font-medium text-white">{file.name}</span>
                    <span className="ml-auto text-[11px] font-semibold text-emerald-400">
                      {file.status}
                    </span>
                    <CheckCircle size={16} className="ml-1 text-emerald-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-2 border-b border-white/15 pb-2">
            <div className="mb-2 flex items-center gap-2">
              <Users size={18} className="text-[#5ea0ff]" />
              <span className="text-[15px] font-semibold text-white">Co-applicant Details</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-[10px] border border-white/15 bg-[rgba(255,255,255,0.10)] p-4 text-center">
              <div className="mb-1 text-[13px] text-white/70">
                {hasCoApplicant ? "Co-applicant added" : "No co-applicant added"}
              </div>
              <div className="text-[12px] text-white/50">
                {hasCoApplicant
                  ? "Co-applicant details were included in this application."
                  : "Co-applicant can help improve loan eligibility"}
              </div>
            </div>
          </div>

          <div className="mb-4 mt-2 text-[12px] text-white/60">
            By submitting this application, I confirm that all information provided is accurate and truthful. I authorize the lender to verify my credit history and contact me regarding this application and future financial products.
          </div>

          {error ? (
            <p className="mb-4 text-[12px] text-red-400">
              {typeof error === "string" ? error : "Something went wrong"}
            </p>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-[8px] border border-white/25 bg-white px-4 py-2 text-[13px] font-medium text-[#0f172a]"
            >
              ← Back to Edit
            </button>

            <div className="w-full px-2 sm:w-[260px]">
              <div className="h-1.5 w-full rounded-full bg-white/25">
                <div className="h-full w-[100%] rounded-full bg-[#2f78ff]" />
              </div>
              <p className="mt-1 text-center text-[10px] text-white/60">Step 5 of 5</p>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-[8px] bg-[#1f6bff] px-5 py-2 text-[13px] font-medium text-white hover:bg-[#1c5ee0] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Application →"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
