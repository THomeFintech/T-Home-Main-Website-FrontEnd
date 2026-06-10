import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  FileText,
  Briefcase,
  Upload,
  ChevronDown,
} from "lucide-react";
import { BT_API_BASE } from "../config";

const stepLabels = [
  "PERSONAL DETAILS",
  "INCOME DOCUMENTS",
  "EXISTING LOAN DOCUMENTS",
  "CO-APPLICANT DETAILS",
  "REVIEW & SUBMIT",
];

export default function BalanceTransferApplicationPortal() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    employmentType: "",
    aadhaar: "",
    pan: "",
    aadhaarFile: "",
    panFile: "",
    passportPhoto: "",
    aadhaarFileObj: null,
    panFileObj: null,
    passportPhotoObj: null,
    loanReference: "",
    loanType: "",
    loanAmount: "",
    tenure: "",
  });

  useEffect(() => {
    const loanForm = JSON.parse(localStorage.getItem("btLoanForm") || "{}");
    const loanResult = JSON.parse(localStorage.getItem("btLoanResult") || "{}");
    const finalReport = JSON.parse(localStorage.getItem("btFinalReport") || "{}");
    const existingDraft = JSON.parse(
      localStorage.getItem("btApplicationDraft") || "{}"
    );

    setFormData((prev) => ({
      ...prev,
      fullName: existingDraft.full_name || existingDraft.fullName || "",
      mobile: existingDraft.mobile_number || existingDraft.mobile || "",
      email: existingDraft.email || "",
      employmentType:
        existingDraft.employment_type || existingDraft.employmentType || "",
      aadhaar: existingDraft.aadhaar_number || existingDraft.aadhaar || "",
      pan: existingDraft.pan_number || existingDraft.pan || "",
      aadhaarFile: existingDraft.aadhaarFile || "",
      panFile: existingDraft.panFile || "",
      passportPhoto: existingDraft.passportPhoto || "",
      loanReference:
        loanResult?.loan_reference ||
        localStorage.getItem("btLoanReference") ||
        existingDraft.loan_reference ||
        existingDraft.loanReference ||
        "",
      loanType:
        existingDraft.loan_type ||
        existingDraft.loanType ||
        loanForm?.loan_type ||
        "",
      loanAmount:
        existingDraft.loan_amount !== undefined &&
        existingDraft.loan_amount !== null &&
        existingDraft.loan_amount !== ""
          ? String(existingDraft.loan_amount)
          : loanForm?.original_principal !== undefined &&
            loanForm?.original_principal !== null
          ? String(loanForm.original_principal)
          : "",
      tenure:
        existingDraft.tenure_months !== undefined &&
        existingDraft.tenure_months !== null &&
        existingDraft.tenure_months !== ""
          ? String(existingDraft.tenure_months)
          : loanForm?.remaining_tenure_months !== undefined &&
            loanForm?.remaining_tenure_months !== null
          ? String(loanForm.remaining_tenure_months)
          : "",
    }));

    if (loanResult?.loan_reference) {
      localStorage.setItem("btLoanReference", loanResult.loan_reference);
    }

    if (finalReport?.recommended_bank_name) {
      localStorage.setItem(
        "btRecommendedBank",
        finalReport.recommended_bank_name
      );
    }
  }, []);

  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem("btApplicationDraft") || "{}");

    const updatedDraft = {
      ...existing,
      full_name: formData.fullName,
      mobile_number: formData.mobile,
      email: formData.email,
      aadhaar_number: formData.aadhaar,
      pan_number: formData.pan,
      employment_type: formData.employmentType,
      loan_reference: formData.loanReference,
      loan_type: formData.loanType,
      loan_amount: formData.loanAmount,
      tenure_months: formData.tenure,
      fullName: formData.fullName,
      mobile: formData.mobile,
      aadhaar: formData.aadhaar,
      pan: formData.pan,
      employmentType: formData.employmentType,
      loanReference: formData.loanReference,
      loanType: formData.loanType,
      loanAmount: formData.loanAmount,
      tenure: formData.tenure,
      aadhaarFile: formData.aadhaarFile,
      panFile: formData.panFile,
      passportPhoto: formData.passportPhoto,
    };

    localStorage.setItem("btApplicationDraft", JSON.stringify(updatedDraft));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let next = value;

    if (name === "mobile") next = value.replace(/\D/g, "").slice(0, 10);
    if (name === "aadhaar") next = value.replace(/\D/g, "").slice(0, 12);
    if (name === "pan") next = value.toUpperCase().slice(0, 10);

    setFormData((prev) => ({ ...prev, [name]: next }));
  };

  const onUpload = (name, file) => {
    if (!file) return;

    const fileObjectField = `${name}Obj`;

    setFormData((prev) => ({
      ...prev,
      [name]: file.name,
      [fileObjectField]: file,
    }));
  };

  const handleContinue = async () => {
    try {
      setSubmitting(true);
      setError("");

      const loanReference = localStorage.getItem("btLoanReference") || "";
      const report = JSON.parse(localStorage.getItem("btFinalReport") || "{}");

      const payload = {
        loan_reference: loanReference,
        recommended_bank_name: report?.recommended_bank_name || "",
        estimated_savings: Number(report?.best_net_savings || 0),
        personal_details: {
          full_name: formData.fullName,
          mobile_number: formData.mobile,
          email: formData.email,
          aadhaar_number: formData.aadhaar,
          pan_number: formData.pan,
        },
        loan_details: {
          loan_type: formData.loanType,
          loan_amount: Number(formData.loanAmount || 0),
          tenure_months: Number(formData.tenure || 0),
          employment_type: formData.employmentType,
        },
        current_step: activeStep,
      };

      const response = await fetch(
  `${BT_API_BASE}/application/draft`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }
);

const data = await response.json();
     const applicationReference =
  data?.application_reference ||
  localStorage.getItem("btApplicationReference") ||
  "";

      if (applicationReference) {
        localStorage.setItem("btApplicationReference", applicationReference);
      }

      const kycFiles = [];
      const kycKeys = [];

      if (formData.aadhaarFileObj) {
        kycKeys.push("aadhaarCard");
        kycFiles.push(formData.aadhaarFileObj);
      }
      if (formData.panFileObj) {
        kycKeys.push("panCard");
        kycFiles.push(formData.panFileObj);
      }
      if (formData.passportPhotoObj) {
  kycKeys.push("passportPhoto");
  kycFiles.push(formData.passportPhotoObj);
}

     if (applicationReference && kycFiles.length > 0) {
  const uploadForm = new FormData();

  uploadForm.append("document_group", "kyc");

  kycKeys.forEach((key) => {
    uploadForm.append("document_keys", key);
  });

  kycFiles.forEach((file) => {
    uploadForm.append("files", file);
  });

  const uploadResponse = await fetch(
    `${BT_API_BASE}/application/${applicationReference}/documents`,
    {
      method: "POST",
      body: uploadForm,
    }
  );
  console.log("Upload status:", uploadResponse.status);

const responseData = await uploadResponse.json();
console.log("Upload response:", responseData);

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload KYC documents");
  }
}

      const existingDraft = JSON.parse(
        localStorage.getItem("btApplicationDraft") || "{}"
      );

      localStorage.setItem(
        "btApplicationDraft",
        JSON.stringify({
          ...existingDraft,
          full_name: formData.fullName,
          mobile_number: formData.mobile,
          email: formData.email,
          aadhaar_number: formData.aadhaar,
          pan_number: formData.pan,
          employment_type: formData.employmentType,
          loan_reference: formData.loanReference,
          loan_type: formData.loanType,
          loan_amount: formData.loanAmount,
          tenure_months: formData.tenure,
          recommended_bank_name: report?.recommended_bank_name || "",
          estimated_savings: Number(report?.best_net_savings || 0),
          current_step: 1,
          application_reference: applicationReference,
          aadhaarFile: formData.aadhaarFile,
          panFile: formData.panFile,
          passportPhoto: formData.passportPhoto,
        })
      );

      setActiveStep((prev) => Math.min(prev + 1, 5));

      navigate("/balance-transfer/application-portal/income-documents", {
        state: {
          employmentType: formData.employmentType || "Salaried",
        },
      });
    } catch (err) {
      const detail = err?.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(detail.map((item) => item?.msg || "Validation error").join(", "));
      } else if (typeof detail === "object" && detail !== null) {
        setError(detail?.msg || detail?.message || "Validation error");
      } else {
        setError(detail || err?.message || "Failed to create application draft");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden px-4 pb-10 pt-24 font-['Outfit',sans-serif] sm:px-6 md:pt-28 lg:px-8 lg:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[#020918]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,77,167,0.34),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-[1320px] rounded-[14px] border border-white/15 bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.06)_100%)] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.48)] backdrop-blur-xl sm:p-6">
        <h1 className="text-center text-[32px] font-semibold leading-tight text-white sm:text-[40px] md:text-[52px]">
          Balance Transfer <span className="text-[#1f6bff]">Application</span>{" "}
          Portal
        </h1>

        <div className="mt-5 overflow-x-auto">
          <div className="relative mx-auto min-w-[560px] px-1 sm:min-w-[760px]">
            <div className="absolute left-[6%] right-[6%] top-4 h-px bg-white/30" />
            <div className="relative flex items-start justify-between">
              {stepLabels.map((label, idx) => {
                const step = idx + 1;
                const active = step === activeStep;
                const done = step < activeStep;

                return (
                  <div
                    key={label}
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
                      {step}
                    </div>
                    <p
                      className={`mt-4 text-[10px] font-semibold ${
                        active ? "text-[#2f78ff]" : "text-white/55"
                      }`}
                    >
                      {label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-[1040px] rounded-[12px] border border-white/15 bg-[rgba(255,255,255,0.05)] p-4 sm:p-5">
          <SectionTitle icon={<User size={15} />} title="Personal Information" />

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Full Name *">
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="As per Aadhaar"
                className={inputClass}
              />
            </Field>

            <Field label="Mobile Number *">
              <input
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                className={inputClass}
              />
            </Field>

            <Field label="Email ID *">
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={inputClass}
              />
            </Field>

            <Field label="Employment Type *">
              <div className="relative">
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none pr-10`}
                >
                  <option value="" className="text-slate-900">
                    Select employment type
                  </option>
                  <option value="Salaried" className="text-slate-900">
                    Salaried
                  </option>
                  <option value="Self-employed" className="text-slate-900">
                    Self Employed
                  </option>
                  <option value="Professional" className="text-slate-900">
                    Professional
                  </option>
                  <option value="Freelancer" className="text-slate-900">
                    Freelancer
                  </option>
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/65"
                />
              </div>
            </Field>
          </div>

          <SectionTitle
            icon={<FileText size={15} />}
            title="KYC Documents"
            className="mt-4"
          />

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Aadhaar Number *">
              <input
                name="aadhaar"
                value={formData.aadhaar}
                onChange={handleChange}
                placeholder="Enter your 12-digit Aadhaar number"
                className={inputClass}
              />
            </Field>
            <Field label="PAN Number *">
              <input
                name="pan"
                value={formData.pan}
                onChange={handleChange}
                placeholder="ABCDE1234F"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <UploadCard
              title="Upload Aadhaar Card"
              subtitle={formData.aadhaarFile || "Drag & Drop or Click to Upload"}
              onChange={(file) => onUpload("aadhaarFile", file)}
            />
            <UploadCard
              title="Upload PAN Card"
              subtitle={formData.panFile || "Drag & Drop or Click to Upload"}
              onChange={(file) => onUpload("panFile", file)}
            />
          </div>

          <div className="mt-3">
            <UploadCard
              title="Upload Passport Size Photo"
              subtitle={formData.passportPhoto || "Drag & Drop or Click to Upload"}
              onChange={(file) => onUpload("passportPhoto", file)}
            />
          </div>

          <p className="mt-2 text-[11px] text-emerald-300">
            Your information is encrypted and secure
          </p>

          <SectionTitle
            icon={<Briefcase size={15} />}
            title="Loan Details"
            badge="Auto-filled from records"
            className="mt-4"
          />

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Loan Reference">
              <input
                name="loanReference"
                value={formData.loanReference}
                readOnly
                className={`${inputClass} cursor-not-allowed bg-white/10`}
              />
            </Field>

            <Field label="Loan Type">
              <input
                name="loanType"
                value={formData.loanType}
                onChange={handleChange}
                placeholder="-"
                className={inputClass}
              />
            </Field>

            <Field label="Loan Amount">
              <input
                name="loanAmount"
                value={formData.loanAmount}
                onChange={handleChange}
                placeholder="-"
                className={inputClass}
              />
            </Field>

            <Field label="Tenure (Months)">
              <input
                name="tenure"
                value={formData.tenure}
                onChange={handleChange}
                placeholder="-"
                className={inputClass}
              />
            </Field>
          </div>

          {error ? (
            <p className="mt-4 text-sm text-red-400">{error}</p>
          ) : null}

          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => navigate("/balance-transfer/ready")}
              className="rounded-[8px] border border-white/25 bg-white px-4 py-2 text-[13px] font-medium text-[#0f172a]"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleContinue}
              disabled={submitting}
              className="rounded-[8px] bg-[#1f6bff] px-5 py-2 text-[13px] font-medium text-white hover:bg-[#1c5ee0] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Saving..."
                : `Continue to ${
                    stepLabels[Math.min(activeStep, 4)] || "Review & Submit"
                  } →`}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

const inputClass =
  "h-11 w-full rounded-[8px] border border-white/20 bg-[rgba(255,255,255,0.08)] px-3 text-[13px] text-white placeholder:text-white/45 outline-none focus:border-[#5b93ff]";

function SectionTitle({ icon, title, className = "", badge }) {
  return (
    <div
      className={`flex items-center gap-2 border-b border-white/20 pb-2 ${className}`}
    >
      <span className="text-[#5ea0ff]">{icon}</span>
      <h3 className="text-[14px] font-semibold text-white">{title}</h3>
      {badge ? (
        <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
          {badge}
        </span>
      ) : null}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-[12px] font-medium text-white/90">
        {label}
      </label>
      {children}
    </div>
  );
}

function UploadCard({ title, subtitle, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-[8px] border border-white/20 bg-[rgba(255,255,255,0.08)] p-3">
      <Upload size={14} className="text-[#5ea0ff]" />
      <div>
        <p className="text-[12px] font-semibold text-white">{title}</p>
        <p className="text-[10px] text-white/60">
          {typeof subtitle === "string" && subtitle.trim() !== ""
            ? subtitle
            : "Drag & Drop or Click to Upload"}
        </p>
      </div>
      <input
        type="file"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
    </label>
  );
}
