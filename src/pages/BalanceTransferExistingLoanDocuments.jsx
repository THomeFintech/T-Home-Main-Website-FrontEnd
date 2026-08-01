import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import { BT_API_BASE } from "../config";

const requiredDocs = [
  { title: "Loan Sanction Letter*", key: "sanctionLetter" },
  { title: "Loan Statement*", key: "loanStatement" },
  { title: "Foreclosure Letter (Outstanding Amount)*", key: "foreclosureLetter" },
];

export default function BalanceTransferExistingLoanDocuments() {
  const navigate = useNavigate();

  const [uploaded, setUploaded] = useState({});
  const [filesMap, setFilesMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const heading = "Existing Loan Details";

  const onUpload = (key, file) => {
    if (!file) return;

    setUploaded((prev) => ({
      ...prev,
      [key]: file.name,
    }));

    setFilesMap((prev) => ({
      ...prev,
      [key]: file,
    }));

    setError("");
  };

  const handleNext = async () => {
    try {
      setLoading(true);
      setError("");

       const requiredKeys = requiredDocs.map((doc) => doc.key);
const missingKeys = requiredKeys.filter((key) => !filesMap[key]);

if (missingKeys.length > 0) {
  setError("Please upload all required documents");
  return;
}

// Save filenames
const uploadedMap = {};
requiredKeys.forEach((key) => {
  uploadedMap[key] = filesMap[key].name;
});

localStorage.setItem(
  "btExistingLoanDocumentsDraft",
  JSON.stringify({
    uploaded: uploadedMap,
  })
);

// Save File objects for final submission
window.btExistingLoanFiles = filesMap;

navigate("/balance-transfer/application-portal/co-applicant-details");

      
    } catch (err) {
      const detail = err?.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(detail.map((d) => d?.msg || "Validation error").join(", "));
      } else if (typeof detail === "object" && detail !== null) {
        setError(detail?.msg || detail?.message || "Validation error");
      } else {
        setError(detail || err?.message || "Failed to upload documents");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden px-4 pb-10 pt-24 font-['Outfit',sans-serif] sm:px-6 md:pt-28 lg:px-8 lg:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[#020918]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,77,167,0.34),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-[1320px] rounded-[14px] border border-white/15 bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.06)_100%)] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.48)] backdrop-blur-xl sm:p-6">
        <h1 className="text-center text-[30px] font-semibold leading-tight text-white sm:text-[38px] md:text-[52px]">
          Balance Transfer <span className="text-[#1f6bff]">Application</span> Portal
        </h1>

        <div className="mt-5 overflow-x-auto">
          <div className="relative mx-auto min-w-[560px] px-1 sm:min-w-[760px]">
            <div className="absolute left-[6%] right-[6%] top-4 h-px bg-white/30" />

            <div className="relative flex items-start justify-between">
              {[1, 2, 3, 4, 5].map((step) => {
                const active = step === 3;
                const done = step < 3;

                const labels = [
                  "PERSONAL DETAILS",
                  "INCOME DOCUMENTS",
                  "EXISTING LOAN DOCUMENTS",
                  "CO-APPLICANT DETAILS",
                  "REVIEW & SUBMIT",
                ];

                return (
                  <div
                    key={step}
                    className="flex w-full flex-col items-center text-center"
                  >
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
                        active
                          ? "text-[#2f78ff]"
                          : done
                          ? "text-emerald-400"
                          : "text-white/55"
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

        <div className="mx-auto mt-6 max-w-[980px] rounded-[12px] border border-white/15 bg-[rgba(255,255,255,0.05)] p-4 sm:p-5">
          <h2 className="text-center text-[24px] font-semibold text-white sm:text-[28px]">
            {heading}
          </h2>

          <div className="mt-4 border-b border-white/25 pb-2">
            <p className="text-[13px] font-semibold text-white/90">
              Required Documents
            </p>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {requiredDocs.map((doc) => (
              <UploadCard
                key={doc.key}
                title={doc.title}
                subtitle={uploaded?.[doc.key]}
                onChange={(file) => onUpload(doc.key, file)}
              />
            ))}
          </div>

          {error ? (
            <p className="mt-4 text-[12px] text-red-400">
              {typeof error === "string" ? error : "Something went wrong"}
            </p>
          ) : null}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-[8px] border border-white/25 bg-white px-4 py-2 text-[13px] font-medium text-[#0f172a]"
            >
              ← Back
            </button>

            <div className="w-full px-2 sm:w-[260px]">
              <div className="h-1.5 w-full rounded-full bg-white/25">
                <div className="h-full w-[60%] rounded-full bg-[#2f78ff]" />
              </div>

              <p className="mt-1 text-center text-[10px] text-white/60">
                Step 3 of 5
              </p>
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="rounded-[8px] bg-[#1f6bff] px-5 py-2 text-[13px] font-medium text-white hover:bg-[#1c5ee0] disabled:opacity-60"
            >
              {loading ? "Uploading..." : "Co-Applicant Details →"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function UploadCard({ title, subtitle, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-[8px] border border-white/20 bg-[rgba(255,255,255,0.08)] p-3">
      <FileText size={14} className="text-[#5ea0ff]" />

      <div>
        <p className="text-[12px] font-semibold text-white">{title}</p>

        <p className="text-[10px] text-white/60">
          {typeof subtitle === "string" && subtitle.trim() !== ""
            ? subtitle
            : "Drag & Drop or Click to Upload"}
        </p>

        <p className="text-[9px] text-white/45">PDF or image</p>
      </div>

      <input
        type="file"
        className="hidden"
        accept=".pdf,image/*"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
    </label>
  );
}
