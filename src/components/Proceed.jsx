import React, { useState, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  User,
  FileText,
  WalletCards,
  Camera,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  Check,
  Shield,
  Users,
  CheckCircle2,
  CreditCard,
  Landmark,
  FileBadge,
  Image as ImageIcon,
  ToggleLeft,
  ToggleRight,
  UserX,
  Zap,
  ClipboardList,
  PhoneCall,
  ShieldCheck,
  Building2,
  Copy,
  Upload,
  Loader2,
  AlertCircle,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL;

function resolveApplicationId(result = {}) {
  const raw =
    result.applicationId ??
    result.application_id ??
    result.app_id ??
    null;

  if (raw !== null && raw !== undefined) return Number(raw);
  return null;
}

async function parseErrorResponse(res, fallbackMessage) {
  try {
    const text = await res.text();
    if (!text) return fallbackMessage;
    return text;
  } catch {
    return fallbackMessage;
  }
}

function normalizeEmploymentType(type = "") {
  const value = String(type).trim().toLowerCase();

  const mapping = {
    salaried: "salaried",
    salary: "salaried",

    professional: "professional",
    profession: "professional",

    "self-employed": "self-employed",
    selfemployed: "self-employed",
    self_employed: "self-employed",
    "self employed": "self-employed",

    business: "self-employed",
    businessman: "self-employed",
    owner: "self-employed",

    freelancer: "freelancer",

    "gig worker": "gig_worker",
    gigworker: "gig_worker",
    gig_worker: "gig_worker",
  };

  return mapping[value] || value;
}
function getEmploymentDocGroup(type = "") {
  const normalized = normalizeEmploymentType(type);

  if (normalized === "salaried") {
    return "salaried";
  }

  if (normalized === "self-employed") {
    return "self_employed";
  }

  if (normalized === "professional") {
    return "professional";
  }

  if (normalized === "freelancer" || normalized === "gig_worker") {
    return "freelancer";
  }

  return "unknown";
}

async function uploadKyc({ files, contactData, loan_id, bank_selection_id }) {
  const formData = new FormData();

  formData.append("loan_id", loan_id);
  formData.append("bank_selection_id", bank_selection_id);
  formData.append("aadhaar_number", contactData.aadhaarNumber || contactData.aadhaar || "");
  formData.append("pan_number", contactData.panNumber || contactData.pan || "");
  formData.append("aadhaar_card", files.aadhaar);
  formData.append("pan_card", files.pan);
  formData.append("passport_photo", files.passportPhoto);

  for (const [key, value] of formData.entries()) {
    console.log("KYC FormData:", key, value);
  }

  const res = await fetch(`${API_BASE}/applications/submit-kyc`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorText = await parseErrorResponse(res, "KYC failed");
    throw new Error(errorText);
  }

  return res.json();
}

async function uploadIncome({ files, employmentType, loan_id, bank_selection_id }) {
  const formData = new FormData();

  formData.append("loan_id", loan_id);
  formData.append("bank_selection_id", bank_selection_id);

  const type = normalizeEmploymentType(employmentType);

  if (type === "salaried") {
    if (files.payslip1) formData.append("payslip_1", files.payslip1);
    if (files.payslip2) formData.append("payslip_2", files.payslip2);
    if (files.bankStatement) formData.append("bank_statement", files.bankStatement);
    if (files.form16) formData.append("form_16", files.form16);
  } else if (type === "self-employed") {
    if (files.itr1) formData.append("itr_year1", files.itr1);
    if (files.itr2) formData.append("itr_year2", files.itr2);
    if (files.msmeCertificate) formData.append("msme_certificate", files.msmeCertificate);
    if (files.labourLicense) formData.append("labour_license", files.labourLicense);
    if (files.gst) formData.append("gst_certificate", files.gst);
    if (files.gstrStatement) formData.append("gstr_statement", files.gstrStatement);
  } else if (type === "professional") {
    if (files.itr1) formData.append("prof_itr_year1", files.itr1);
    if (files.itr2) formData.append("prof_itr_year2", files.itr2);
    if (files.degree) formData.append("degree_certificate", files.degree);
    if (files.professionalReg) formData.append("registration_cert", files.professionalReg);
    if (files.bankStatement) formData.append("practice_bank_stmt", files.bankStatement);
    if (files.addressProof) formData.append("office_address_proof", files.addressProof);
    if (files.gst) formData.append("prof_gst_reg", files.gst);
  } else if (type === "freelancer" || type === "gig_worker") {
    if (files.itr1) formData.append("fl_itr_year1", files.itr1);
    if (files.itr2) formData.append("fl_itr_year2", files.itr2);
    if (files.bankStatement) formData.append("fl_bank_statement", files.bankStatement);
    if (files.contracts) formData.append("fl_contracts", files.contracts);
    if (files.invoices) formData.append("fl_invoices", files.invoices);
    if (files.gst) formData.append("fl_gst_reg", files.gst);
    if (files.portfolio) formData.append("fl_portfolio", files.portfolio);
  } else {
    throw new Error(`Unsupported employment type: ${employmentType}`);
  }

  for (const [key, value] of formData.entries()) {
    console.log("Income FormData:", key, value);
  }

  const res = await fetch(`${API_BASE}/applications/submit-income-docs`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorText = await parseErrorResponse(res, "Income upload failed");
    throw new Error(errorText);
  }

  return res.json();
}
async function submitCoApplicant({ coApplicant, files, loan_id, bank_selection_id }) {
  const formData = new FormData();

  formData.append("loan_id", loan_id);
  formData.append("bank_selection_id", bank_selection_id);
  formData.append("name", coApplicant.name || "");
  formData.append("phone", coApplicant.phone || "");
  if (coApplicant.email) formData.append("email", coApplicant.email);
  formData.append("relation", coApplicant.relation || "");
  if (coApplicant.aadhaar) formData.append("aadhaar_number", coApplicant.aadhaar);
  if (coApplicant.pan) formData.append("pan_number", coApplicant.pan);
  if (files.coAadhaar) formData.append("aadhaar_file", files.coAadhaar);
  if (files.coPan) formData.append("pan_file", files.coPan);
  if (files.coPhoto) formData.append("passport_photo", files.coPhoto);

  const res = await fetch(`${API_BASE}/applications/add-co-applicant`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorText = await parseErrorResponse(res, "Co-applicant failed");
    throw new Error(errorText);
  }

  return res.json();
}

function useStepUpload() {
  const [state, setState] = useState({
    status: "idle",
    error: null,
    data: null,
  });

  const reset = () => setState({ status: "idle", error: null, data: null });

  const run = useCallback(async (fn) => {
    setState({ status: "uploading", error: null, data: null });
    try {
      const data = await fn();
      setState({ status: "success", error: null, data });
      return data;
    } catch (e) {
      setState({ status: "error", error: e.message, data: null });
      throw e;
    }
  }, []);

  return { ...state, run, reset };
}

function UploadZone({
  label,
  accept = "image/*,.pdf",
  multiple = false,
  file,
  files,
  onUpload,
  required = false,
  full = false,
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    (incoming) => {
      const arr = Array.from(incoming);
      if (!arr.length) return;
      onUpload(multiple ? arr : arr[0]);
    },
    [onUpload, multiple]
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const onDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = () => setDragging(false);
  const onInputChange = (e) => handleFiles(e.target.files);
  const open = () => inputRef.current?.click();

  const uploaded = multiple ? files && files.length > 0 : !!file;
  const displayFiles = multiple ? files || [] : file ? [file] : [];

  return (
    <div className={full ? "w-full" : ""}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={onInputChange}
      />

      {!uploaded ? (
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={open}
          className={`cursor-pointer rounded-[14px] border-2 border-dashed px-4 py-4 transition-colors sm:rounded-[16px] sm:px-5 sm:py-5 ${
            dragging
              ? "border-[#246BFF] bg-[#dceaff]/20"
              : "border-[#63A4FF] bg-[#f8f8f8] hover:border-[#246BFF] hover:bg-[#dceaff]/10"
          }`}
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#dceaff] sm:h-10 sm:w-10">
              <Upload className="h-4 w-4 text-[#246BFF] sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-medium uppercase tracking-[-0.01em] text-[#222834] sm:text-[15px]">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
              </h4>
              <p className="mt-1 text-sm text-[#2a3140]">
                {dragging ? "Drop to upload" : "Drag & Drop or Click to Upload"}
              </p>
              <p className="mt-1 text-xs text-[#8a94a6] sm:text-[13px]">
                PDF · JPG · PNG · max 5 MB
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-[14px] border border-[#08B981]/40 bg-[#08B981]/5 px-4 py-4 sm:rounded-[16px] sm:px-5 sm:py-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#2a3140] sm:text-[13px]">
              {label}
            </span>
            <button
              type="button"
              onClick={open}
              className="text-xs text-[#246BFF] underline underline-offset-2"
            >
              Replace
            </button>
          </div>

          <div className="space-y-3">
            {displayFiles.map((f, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 rounded-xl border border-[#08B981]/40 bg-[#08B981]/10 px-3 py-3"
              >
                <div className="flex items-center gap-3">
                  {f.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(f)}
                      alt="preview"
                      className="h-12 w-12 rounded-lg border object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-lg">
                      📄
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-[#1f2937]">{f.name}</p>
                    <p className="text-xs text-gray-500">
                      {(f.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#08B981]" />
                  <button
                    type="button"
                    onClick={open}
                    className="text-xs text-[#246BFF] underline"
                  >
                    Replace
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function UploadBanner({ status, error, successMsg }) {
  if (status === "idle") return null;

  if (status === "uploading") {
    return (
      <div className="mt-4 flex items-center gap-3 rounded-[12px] border border-[#246BFF]/30 bg-[#246BFF]/10 px-4 py-3">
        <Loader2 className="h-5 w-5 shrink-0 animate-spin text-[#246BFF]" />
        <span className="text-sm text-[#246BFF]">Uploading documents to server…</span>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="mt-4 flex items-center gap-3 rounded-[12px] border border-[#08B981]/40 bg-[#08B981]/10 px-4 py-3">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-[#08B981]" />
        <span className="text-sm text-[#08B981]">
          {successMsg || "Documents uploaded successfully!"}
        </span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mt-4 flex items-center gap-3 rounded-[12px] border border-red-500/30 bg-red-500/10 px-4 py-3">
        <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
        <span className="text-sm text-red-400">
          {error || "Upload failed. Please try again."}
        </span>
      </div>
    );
  }

  return null;
}

function NoAppIdWarning({ applicationId }) {
  if (applicationId !== null) return null;
  return (
    <div className="mb-6 flex items-start gap-3 rounded-[14px] border border-yellow-500/40 bg-yellow-500/10 px-4 py-4">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-400" />
      <div>
        <p className="text-sm font-semibold text-yellow-300">Application ID not found</p>
        <p className="mt-1 text-xs text-yellow-400/80">
          Documents will be uploaded in <strong>demo mode (ID: 1)</strong>.
        </p>
      </div>
    </div>
  );
}

export default function Proceed({
  selectedBank,
  contactData = {},
  loanData = {},
  result = {},
  onNext,
  onBack,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const loanDataFinal = location.state?.loanData || loanData || {};
  const contactDataFinal = location.state?.contactData || contactData || {};

  const applicationId = resolveApplicationId(result) ?? 1;
  const isRealAppId = resolveApplicationId(result) !== null;

  const [currentStep, setCurrentStep] = useState(1);
  const [addCoApplicant, setAddCoApplicant] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const [editableContact, setEditableContact] = useState({
    name: contactDataFinal?.name || contactDataFinal?.fullName || "",
    phone: contactDataFinal?.phone || contactDataFinal?.mobile || "",
    email: contactDataFinal?.email || contactDataFinal?.mail || "",
    aadhaar: contactDataFinal?.aadhaar || contactDataFinal?.aadhaarNumber || "",
    pan: contactDataFinal?.pan || contactDataFinal?.panNumber || "",
  });

  const [editableLoan, setEditableLoan] = useState({
    loanType: loanDataFinal?.loan_type || loanDataFinal?.loanType || "",
    loanAmount: loanDataFinal?.loan_amount || loanDataFinal?.loanAmount || "",
    employmentType: normalizeEmploymentType(
      loanDataFinal?.employment_type || loanDataFinal?.employmentType || ""
    ),
    tenureYears: loanDataFinal?.tenure || loanDataFinal?.tenureYears || "",
  });

  const [coApplicant, setCoApplicant] = useState({
    name: "",
    phone: "",
    email: "",
    relation: "",
    aadhaar: "",
    pan: "",
  });

  const kycUpload = useStepUpload();
  const incomeUpload = useStepUpload();

  const [files, setFiles] = useState({
    aadhaar: null,
    pan: null,
    passportPhoto: null,
    itr1: null,
    itr2: null,
    degree: null,
    payslip1: null,
    payslip2: null,
    form16: null,
    professionalReg: null,
    bankStatement: null,
    addressProof: null,
    gst: null,
    coAadhaar: null,
    coPan: null,
    coPhoto: null,
  });

  const setFile = (key) => (value) =>
    setFiles((prev) => ({ ...prev, [key]: value }));

  const displayTenureMonths = editableLoan.tenureYears
    ? `${Number(editableLoan.tenureYears) * 12} Months`
    : "";

  const loanReferenceId =
    result?.reference_id ||
    result?.loanId ||
    result?.loan_id ||
    `LN-${applicationId}`;

  const nextInternal = () => {
    if (currentStep < 4) setCurrentStep((p) => p + 1);
  };

  const prevInternal = () => {
    if (currentStep > 1) setCurrentStep((p) => p - 1);
  };

  const getStoredIds = () => {
    const loan_id = localStorage.getItem("loan_id");
    const bank_selection_id = localStorage.getItem("bank_selection_id");
    return { loan_id, bank_selection_id };
  };

  const handleStep1Next = async () => {
    const { loan_id, bank_selection_id } = getStoredIds();

    if (!loan_id || !bank_selection_id) {
      alert("Loan or Bank selection missing. Please go back and select bank again.");
      return;
    }

    const required = [files.aadhaar, files.pan, files.passportPhoto];
    if (required.some((f) => !f)) {
      alert("Please upload all KYC documents");
      return;
    }

    if (!editableContact.aadhaar || !editableContact.pan) {
      alert("Please enter Aadhaar Number and PAN Number");
      return;
    }

    try {
      await kycUpload.run(() =>
        uploadKyc({
          files,
          contactData: {
            ...editableContact,
            aadhaarNumber: editableContact.aadhaar,
            panNumber: editableContact.pan,
          },
          loan_id,
          bank_selection_id,
        })
      );
      nextInternal();
    } catch (err) {
      console.error("KYC upload failed:", err);
    }
  };

  const handleStep2Next = async () => {
  const { loan_id, bank_selection_id } = getStoredIds();

  if (!loan_id || !bank_selection_id) {
    alert("Loan or Bank selection missing. Please restart from bank selection.");
    return;
  }

  const type = normalizeEmploymentType(editableLoan.employmentType);
  const docGroup = getEmploymentDocGroup(type);
  let required = [];

  if (docGroup === "salaried") {
    required = [files.payslip1, files.payslip2, files.bankStatement, files.form16];
  } else if (docGroup === "self_employed") {
    required = [files.itr1, files.itr2];
  } else if (docGroup === "professional") {
    required = [
      files.itr1,
      files.degree,
      files.professionalReg,
    ];
  } else if (docGroup === "freelancer") {
    required = [files.itr1, files.bankStatement];
  } else {
    alert(`Unsupported employment type: ${editableLoan.employmentType}`);
    return;
  }

  if (required.some((f) => !f)) {
    alert("Please upload all required documents");
    return;
  }

  try {
    await incomeUpload.run(() =>
      uploadIncome({
        files,
        employmentType: type,
        loan_id,
        bank_selection_id,
      })
    );
    nextInternal();
  } catch (err) {
    console.error("Income upload failed:", err);
    alert(err.message || "Income upload failed");
  }
};
  const handleStep3Next = async () => {
    const { loan_id, bank_selection_id } = getStoredIds();

    if (!loan_id || !bank_selection_id) {
      alert("Loan or Bank selection missing. Please restart from bank selection.");
      return;
    }

    if (addCoApplicant) {
      if (!coApplicant.name || !coApplicant.phone || !coApplicant.relation) {
        alert("Please fill required co-applicant details");
        return;
      }

      try {
        await submitCoApplicant({
          coApplicant,
          files,
          loan_id,
          bank_selection_id,
        });
      } catch (err) {
        console.error("Co-applicant submission failed:", err);
        alert(err.message || "Co-applicant submission failed. Please try again.");
        return;
      }
    }

    nextInternal();

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const handleSubmitApplication = async () => {
    if (!agreed) {
      alert("Please agree to the terms before submitting.");
      return;
    }

    const { loan_id, bank_selection_id } = getStoredIds();

    if (!loan_id || !bank_selection_id) {
      alert("Missing application data. Please restart from bank selection.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/applications/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loan_id,
          bank_selection_id,
          has_co_applicant: addCoApplicant,
        }),
      });

      if (!res.ok) {
        const errorText = await parseErrorResponse(res, "Final submit failed");
        throw new Error(errorText);
      }

      const data = await res.json();
      console.log("✅ FINAL SUBMIT:", data);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert(err.message || "Submission failed");
    }
  };

  const handleViewAmortization = () => {
    if (onNext) onNext();
  };

  const handleGoToDashboard = () => {
  navigate("/dashboard");
};

  const stepMeta = [
    { id: 1, label: "PERSONAL DETAILS" },
    { id: 2, label: "INCOME DOCUMENTS" },
    { id: 3, label: "CO-APPLICANT DETAILS" },
    { id: 4, label: "REVIEW & SUBMIT" },
  ];

  const sectionTitle = (Icon, title, extra = null) => (
    <div className="mb-4 flex items-center gap-2 sm:gap-3">
      <Icon className="h-4 w-4 shrink-0 text-[#246BFF] sm:h-5 sm:w-5" />
      <span className="shrink-0 text-sm font-medium text-white/95 sm:text-base">
        {title}
      </span>
      {extra}
      <div className="h-px flex-1 bg-white/40" />
      <ChevronUp className="h-4 w-4 shrink-0 text-white/70" />
    </div>
  );

  const inputClass =
    "w-full rounded-[12px] border border-[#d8dbe5] bg-[#f8f8f8] px-4 py-3 text-sm text-[#445063] outline-none placeholder:text-[#667085] sm:rounded-[14px] sm:px-5 sm:py-3.5 sm:text-[15px]";

  const bottomNav = ({
    leftLabel = "Back",
    rightLabel = "Continue",
    onLeft,
    onRight,
    stepText,
    loading = false,
  }) => (
    <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <button
        type="button"
        onClick={onLeft}
        className="inline-flex w-full items-center justify-center gap-2 rounded-[12px] border border-[#e7e7ec] bg-white px-5 py-3 text-base font-medium text-[#667085] shadow-sm sm:w-auto sm:px-6 sm:text-[17px]"
      >
        <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        {leftLabel}
      </button>

      <div className="flex items-center gap-3 lg:flex-1 lg:justify-center">
        <div className="h-[3px] w-full max-w-[420px] overflow-hidden rounded-full bg-white/40">
          <div
            className="h-full rounded-full bg-[#246BFF]"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
        <span className="min-w-max text-xs text-white/50 sm:text-sm">{stepText}</span>
      </div>

      <button
        type="button"
        onClick={onRight}
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-[12px] bg-[#246BFF] px-5 py-3 text-base font-medium text-white shadow-[0_10px_25px_rgba(36,107,255,0.35)] disabled:opacity-60 sm:w-auto sm:px-6 sm:text-[17px]"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            {rightLabel}
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </>
        )}
      </button>
    </div>
  );

  const Stepper = () => (
    <div className="mb-8 sm:mb-10 lg:mb-12">
      <h1 className="text-center text-3xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-4xl md:text-5xl lg:text-6xl">
        Loan <span className="text-[#246BFF]">Application</span> Portal
      </h1>

      <div className="mx-auto mt-8 max-w-6xl">
        <div className="relative flex items-start justify-between gap-2 sm:gap-4">
          <div className="absolute left-[8%] right-[8%] top-[16px] h-[2px] bg-white/30 sm:top-[22px]" />
          {stepMeta.map((step) => {
            const isDone = currentStep > step.id;
            const isActive = currentStep === step.id;

            return (
              <div
                key={step.id}
                className="relative z-10 flex w-1/4 flex-col items-center text-center"
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold shadow-md sm:h-10 sm:w-10 sm:text-lg md:h-12 md:w-12 md:text-xl ${
                    isDone
                      ? "border-[#08B981] bg-[#08B981] text-white"
                      : isActive
                      ? "border-[#246BFF] bg-white text-[#606A78]"
                      : "border-[#d9dde7] bg-[#f8f8f8] text-[#606A78]"
                  }`}
                >
                  {isDone ? (
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                  ) : (
                    step.id
                  )}
                </div>
                <p
                  className={`mt-3 text-[9px] font-semibold leading-tight sm:mt-4 sm:text-[11px] md:text-[12px] lg:text-[13px] ${
                    isDone
                      ? "text-[#08B981]"
                      : isActive
                      ? "text-[#246BFF]"
                      : "text-white/40"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const Step1 = () => (
    <div className="rounded-[22px] border border-white/20 bg-[linear-gradient(135deg,rgba(31,40,74,0.95),rgba(66,77,125,0.92),rgba(26,30,46,0.95))] p-4 shadow-[0_25px_80px_rgba(0,0,0,0.45)] sm:p-6 md:rounded-[28px] md:p-8">
      <NoAppIdWarning applicationId={isRealAppId ? applicationId : null} />

      {sectionTitle(User, "Personal Information")}
      <div className="space-y-4 sm:space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-white sm:text-base">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            className={inputClass}
            value={editableContact.name}
            onChange={(e) =>
              setEditableContact((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>

        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-white sm:text-base">
              Mobile Number <span className="text-red-400">*</span>
            </label>
            <input
              className={inputClass}
              value={editableContact.phone}
              onChange={(e) =>
                setEditableContact((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white sm:text-base">
              Email ID <span className="text-red-400">*</span>
            </label>
            <input
              className={inputClass}
              value={editableContact.email}
              onChange={(e) =>
                setEditableContact((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        {sectionTitle(FileText, "KYC Documents")}
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-white sm:text-base">
              Aadhaar Number <span className="text-red-400">*</span>
            </label>
            <input
              className={inputClass}
              value={editableContact.aadhaar}
              onChange={(e) =>
                setEditableContact((prev) => ({ ...prev, aadhaar: e.target.value }))
              }
              placeholder="Enter Aadhaar Number"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white sm:text-base">
              PAN Number <span className="text-red-400">*</span>
            </label>
            <input
              className={inputClass}
              value={editableContact.pan}
              onChange={(e) =>
                setEditableContact((prev) => ({ ...prev, pan: e.target.value }))
              }
              placeholder="Enter PAN Number"
            />
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:gap-5 md:grid-cols-2">
          <UploadZone
            label="Upload Aadhaar Card"
            accept="image/*,.pdf"
            file={files.aadhaar}
            onUpload={setFile("aadhaar")}
            required
          />
          <UploadZone
            label="Upload PAN Card"
            accept="image/*,.pdf"
            file={files.pan}
            onUpload={setFile("pan")}
            required
          />
        </div>

        <div className="mt-4 flex items-start gap-2 text-xs text-white/70 sm:text-sm">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#08B981]" />
          <span>Your information is encrypted and secure</span>
        </div>

        <UploadBanner
          status={kycUpload.status}
          error={kycUpload.error}
          successMsg="KYC documents uploaded successfully!"
        />
      </div>

      <div className="mt-8">
        {sectionTitle(
          WalletCards,
          "Loan Details",
          <span className="ml-auto rounded-[8px] bg-[#DDF7DD] px-2 py-1 text-xs font-medium text-[#2D7F41] sm:px-3 sm:py-2 sm:text-sm">
            <span className="inline-flex items-center gap-1 sm:gap-2">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
              Auto-filled
            </span>
          </span>
        )}

        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-white sm:text-base">
              Loan Type
            </label>
            <input
              className={inputClass}
              value={editableLoan.loanType}
              onChange={(e) =>
                setEditableLoan((prev) => ({ ...prev, loanType: e.target.value }))
              }
              placeholder="Loan Type"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white sm:text-base">
              Loan Amount
            </label>
            <input
              className={inputClass}
              value={editableLoan.loanAmount}
              onChange={(e) =>
                setEditableLoan((prev) => ({ ...prev, loanAmount: e.target.value }))
              }
              placeholder="Loan Amount"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white sm:text-base">
              Tenure (Years)
            </label>
            <input
              className={inputClass}
              value={editableLoan.tenureYears}
              onChange={(e) =>
                setEditableLoan((prev) => ({ ...prev, tenureYears: e.target.value }))
              }
              placeholder="Tenure"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white sm:text-base">
              Employment Type
            </label>
            <input
              className={inputClass}
              value={editableLoan.employmentType}
              onChange={(e) =>
                setEditableLoan((prev) => ({
                  ...prev,
                  employmentType: e.target.value,
                }))
              }
              placeholder="Employment Type"
            />
          </div>
        </div>

        {!!displayTenureMonths && (
          <p className="mt-3 text-sm text-white/60">
            Auto-calculated tenure in months: {displayTenureMonths}
          </p>
        )}
      </div>

      <div className="mt-8">
        {sectionTitle(Camera, "Passport Size Photo")}
        <UploadZone
          label="Passport Size Photo"
          accept="image/jpeg,image/png"
          file={files.passportPhoto}
          onUpload={setFile("passportPhoto")}
          required
          full
        />
        <p className="mt-2 text-xs text-white/50">
          Clear face · white background · JPG/PNG · max 2 MB
        </p>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={handleStep1Next}
          disabled={kycUpload.status === "uploading"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#246BFF] px-6 py-3.5 text-base font-medium text-white shadow-[0_12px_30px_rgba(36,107,255,0.35)] disabled:opacity-60 sm:w-auto sm:px-8 sm:py-4 sm:text-[17px]"
        >
          {kycUpload.status === "uploading" ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Continue to Income Documents
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );

  const Step2 = () => (
    <div className="rounded-[22px] border border-white/20 bg-[linear-gradient(135deg,rgba(31,40,74,0.95),rgba(66,77,125,0.92),rgba(26,30,46,0.95))] p-4 shadow-[0_25px_80px_rgba(0,0,0,0.45)] sm:p-6 md:rounded-[28px] md:p-8">
      <h2 className="mb-8 text-center text-2xl font-semibold text-white sm:text-[28px] md:text-[30px]">
        Income Documents — {editableLoan.employmentType}
      </h2>

      <div>
        <div className="mb-5 flex items-center gap-3">
          <span className="shrink-0 text-base text-white/95 sm:text-[18px]">
            Required Documents
          </span>
          <div className="h-px flex-1 bg-white/40" />
        </div>

        {getEmploymentDocGroup(editableLoan.employmentType) === "salaried" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <UploadZone label="Payslip 1" file={files.payslip1} onUpload={setFile("payslip1")} required />
            <UploadZone label="Payslip 2" file={files.payslip2} onUpload={setFile("payslip2")} required />
            <UploadZone label="Bank Statement" file={files.bankStatement} onUpload={setFile("bankStatement")} required />
            <UploadZone label="Form 16" file={files.form16} onUpload={setFile("form16")} required />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <UploadZone label="ITR – Year 1" file={files.itr1} onUpload={setFile("itr1")} required />
            <UploadZone label="ITR – Year 2" file={files.itr2} onUpload={setFile("itr2")} required />
            <UploadZone label="Degree Certificate" file={files.degree} onUpload={setFile("degree")} required />
            <UploadZone label="Professional Registration" file={files.professionalReg} onUpload={setFile("professionalReg")} required />
            <UploadZone label="Bank Statement" file={files.bankStatement} onUpload={setFile("bankStatement")} required />
            <UploadZone label="Address Proof" file={files.addressProof} onUpload={setFile("addressProof")} required />
          </div>
        )}
      </div>

      <div className="mt-7">
        <div className="mb-5 flex items-center gap-3">
          <span className="shrink-0 text-base text-white/95 sm:text-[18px]">
            Optional Documents
          </span>
          <div className="h-px flex-1 bg-white/40" />
        </div>
        <UploadZone
          label="GST Registration (if applicable)"
          accept=".pdf,image/*"
          file={files.gst}
          onUpload={setFile("gst")}
          full
        />
      </div>

      <UploadBanner
        status={incomeUpload.status}
        error={incomeUpload.error}
        successMsg="Income documents uploaded successfully!"
      />

      {bottomNav({
        leftLabel: "Back",
        rightLabel: "Co-Applicant",
        onLeft: prevInternal,
        onRight: handleStep2Next,
        stepText: "Step 2 of 4",
        loading: incomeUpload.status === "uploading",
      })}
    </div>
  );

  const Step3 = () => (
    <div className="rounded-[22px] border border-white/20 bg-[linear-gradient(135deg,rgba(31,40,74,0.95),rgba(66,77,125,0.92),rgba(26,30,46,0.95))] p-4 shadow-[0_25px_80px_rgba(0,0,0,0.45)] sm:p-6 md:rounded-[28px] md:p-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white sm:text-[28px] md:text-[30px]">
          Co-Applicant Details (Optional)
        </h2>
        <p className="mt-2 text-base text-white/50 sm:text-lg">
          Increases joint loan eligibility
        </p>
      </div>

      <div className="mx-auto mt-8 rounded-[18px] border border-white/25 bg-transparent p-4 sm:rounded-[22px] sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <Users className="mt-1 h-5 w-5 shrink-0 text-[#246BFF] sm:h-6 sm:w-6" />
            <div>
              <h3 className="text-base font-semibold text-white sm:text-[18px]">
                Add a Co-Applicant
              </h3>
              <p className="mt-1 text-sm text-white/45 sm:text-[15px]">
                Spouse, parent, adult child or business partner
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAddCoApplicant((p) => !p)}
            className="shrink-0 text-white"
          >
            {addCoApplicant ? (
              <ToggleRight className="h-10 w-10 text-[#246BFF] sm:h-12 sm:w-12 md:h-14 md:w-14" />
            ) : (
              <ToggleLeft className="h-10 w-10 text-white/80 sm:h-12 sm:w-12 md:h-14 md:w-14" />
            )}
          </button>
        </div>
      </div>

      {addCoApplicant && (
        <div className="mt-6">
          {sectionTitle(Users, "CO-APPLICANT INFORMATION")}

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                FULL NAME <span className="text-red-400">*</span>
              </label>
              <input
                className={inputClass}
                placeholder="Co-applicant's full name"
                value={coApplicant.name}
                onChange={(e) =>
                  setCoApplicant({ ...coApplicant, name: e.target.value })
                }
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  MOBILE NUMBER <span className="text-red-400">*</span>
                </label>
                <input
                  className={inputClass}
                  placeholder="10-digit mobile"
                  value={coApplicant.phone}
                  onChange={(e) =>
                    setCoApplicant({ ...coApplicant, phone: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  EMAIL ID
                </label>
                <input
                  className={inputClass}
                  placeholder="co@example.com"
                  value={coApplicant.email}
                  onChange={(e) =>
                    setCoApplicant({ ...coApplicant, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                RELATIONSHIP <span className="text-red-400">*</span>
              </label>
              <select
                className={inputClass}
                value={coApplicant.relation}
                onChange={(e) =>
                  setCoApplicant({ ...coApplicant, relation: e.target.value })
                }
              >
                <option value="">Select...</option>
                <option value="spouse">Spouse</option>
                <option value="parent">Parent</option>
                <option value="child">Child</option>
                <option value="business_partner">Business Partner</option>
              </select>
            </div>
          </div>

          <div className="mt-8">
            {sectionTitle(FileText, "CO-APPLICANT KYC")}

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  AADHAAR NUMBER
                </label>
                <input
                  className={inputClass}
                  placeholder="12-digit Aadhaar"
                  value={coApplicant.aadhaar}
                  onChange={(e) =>
                    setCoApplicant({ ...coApplicant, aadhaar: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  PAN NUMBER
                </label>
                <input
                  className={inputClass}
                  placeholder="ABCDE1234F"
                  value={coApplicant.pan}
                  onChange={(e) =>
                    setCoApplicant({ ...coApplicant, pan: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <UploadZone
                label="Co-Applicant Aadhaar"
                accept="image/*,.pdf"
                file={files.coAadhaar}
                onUpload={setFile("coAadhaar")}
              />
              <UploadZone
                label="Co-Applicant PAN Card"
                accept="image/*,.pdf"
                file={files.coPan}
                onUpload={setFile("coPan")}
              />
            </div>

            <div className="mt-4">
              <UploadZone
                label="Co-Applicant Photo"
                accept="image/*"
                file={files.coPhoto}
                onUpload={setFile("coPhoto")}
              />
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 rounded-[18px] bg-[#f4f5f7] px-5 py-6 sm:rounded-[20px] sm:px-8 sm:py-8">
        <h3 className="text-lg font-semibold text-[#364152] sm:text-[22px]">
          Why add a co-applicant?
        </h3>
        <p className="mt-4 text-sm leading-7 text-[#667085] sm:text-[16px] sm:leading-8">
          Adding a co-applicant combines incomes for eligibility. A ₹40k/month
          income may qualify for ₹24L — adding a spouse earning ₹35k/month raises
          that to ₹45L+.
        </p>
      </div>

      {bottomNav({
        leftLabel: "Back",
        rightLabel: "Review Application",
        onLeft: prevInternal,
        onRight: handleStep3Next,
        stepText: "Step 3 of 4",
      })}
    </div>
  );

  const reviewRow = (label, value, blue = false) => (
    <div className="grid grid-cols-1 gap-1 border-b border-white/5 px-4 py-4 last:border-b-0 sm:grid-cols-[1fr_auto] sm:items-center">
      <span className="text-sm text-white/60 sm:text-[16px]">{label}</span>
      <span
        className={`text-left text-base sm:text-right sm:text-[17px] ${
          blue ? "text-[#246BFF]" : "text-white"
        }`}
      >
        {value || <span className="italic text-white/30">Not provided</span>}
      </span>
    </div>
  );

  const docChip = (Icon, title, sub, uploaded = false) => (
    <div className="flex items-center justify-between rounded-[14px] border border-white/10 bg-white/[0.03] px-4 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#dceaff]">
          <Icon className="h-4 w-4 text-[#246BFF]" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm text-white sm:text-[16px]">{title}</p>
          <p className="text-xs text-white/55 sm:text-[14px]">{sub}</p>
        </div>
      </div>
      {uploaded ? (
        <CheckCircle2 className="ml-3 h-5 w-5 shrink-0 text-[#08B981]" />
      ) : (
        <span className="ml-3 text-xs italic text-white/35">Not uploaded</span>
      )}
    </div>
  );

  const Step4 = () => (
    <div className="rounded-[22px] border border-white/20 bg-[linear-gradient(135deg,rgba(31,40,74,0.95),rgba(66,77,125,0.92),rgba(26,30,46,0.95))] p-4 shadow-[0_25px_80px_rgba(0,0,0,0.45)] sm:p-6 md:rounded-[28px] md:p-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white sm:text-[28px] md:text-[30px]">
          Review & Submit
        </h2>
        <p className="mt-2 text-base text-white/50 sm:text-lg">
          Verify all details before submitting your loan application
        </p>
      </div>

      <div className="mt-8">
        {sectionTitle(User, "Main Applicant")}
        <div className="overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.04]">
          {reviewRow("Full Name", editableContact.name)}
          {reviewRow("Mobile Number", editableContact.phone)}
          {reviewRow("Email Address", editableContact.email)}
          {reviewRow("Aadhaar Number", editableContact.aadhaar)}
          {reviewRow("PAN Number", editableContact.pan, true)}
        </div>
      </div>

      <div className="mt-8">
        {sectionTitle(CreditCard, "Loan Details")}
        <div className="grid gap-4 rounded-[18px] border border-white/10 bg-white/[0.04] p-4 sm:gap-5 sm:p-5 md:grid-cols-2">
          {[
            ["Loan Type", editableLoan.loanType],
            [
              "Loan Amount",
              editableLoan.loanAmount
                ? `₹ ${Number(editableLoan.loanAmount).toLocaleString("en-IN")}`
                : "",
            ],
            ["Tenure", displayTenureMonths],
            ["Employment Type", editableLoan.employmentType],
          ].map(([label, val]) => (
            <div key={label}>
              <p className="text-sm text-white/45 sm:text-[15px]">{label}</p>
              <p className="mt-1 text-lg text-white sm:text-[19px]">
                {val || <span className="text-base italic text-white/30">Not provided</span>}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {sectionTitle(FileBadge, "Documents Uploaded")}
        <div className="space-y-4">
          <div className="rounded-[18px] border border-white/10 bg-white/[0.04] p-4">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm uppercase text-white/65 sm:text-[15px]">KYC & Photo</p>
              <span className="w-fit rounded-full bg-[#0D8F61]/20 px-3 py-1 text-xs font-semibold text-[#08B981] sm:text-[13px]">
                {[files.aadhaar, files.pan, files.passportPhoto].filter(Boolean).length} / 3 FILES
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {docChip(Landmark, "Aadhaar Card", files.aadhaar?.name || "Not uploaded", !!files.aadhaar)}
              {docChip(CreditCard, "PAN Card", files.pan?.name || "Not uploaded", !!files.pan)}
              {docChip(ImageIcon, "Passport Photo", files.passportPhoto?.name || "Not uploaded", !!files.passportPhoto)}
            </div>
          </div>

          <div className="rounded-[18px] border border-white/10 bg-white/[0.04] p-4">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm uppercase text-white/65 sm:text-[15px]">Income Documents</p>
              <span className="w-fit rounded-full bg-[#0D8F61]/20 px-3 py-1 text-xs font-semibold text-[#08B981] sm:text-[13px]">
                {getEmploymentDocGroup(editableLoan.employmentType) === "salaried"
                  ? [files.payslip1, files.payslip2, files.bankStatement, files.form16].filter(Boolean).length
                  : [files.itr1, files.itr2, files.degree, files.professionalReg, files.bankStatement, files.addressProof].filter(Boolean).length}
                {" / "}
                {getEmploymentDocGroup(editableLoan.employmentType) === "salaried" ? 4 : 6}
                {" FILES"}
              </span>
            </div>

            <div className="space-y-3">
              {getEmploymentDocGroup(editableLoan.employmentType) === "salaried" ? (
                <>
                  {docChip(FileText, "Payslip 1", files.payslip1?.name || "Not uploaded", !!files.payslip1)}
                  {docChip(FileText, "Payslip 2", files.payslip2?.name || "Not uploaded", !!files.payslip2)}
                  {docChip(FileText, "Bank Statement", files.bankStatement?.name || "Not uploaded", !!files.bankStatement)}
                  {docChip(FileText, "Form 16", files.form16?.name || "Not uploaded", !!files.form16)}
                </>
              ) : (
                <>
                  {docChip(FileText, "ITR – Year 1", files.itr1?.name || "Not uploaded", !!files.itr1)}
                  {docChip(FileText, "ITR – Year 2", files.itr2?.name || "Not uploaded", !!files.itr2)}
                  {docChip(FileText, "Bank Statement", files.bankStatement?.name || "Not uploaded", !!files.bankStatement)}
                  {docChip(FileText, "Degree Certificate", files.degree?.name || "Not uploaded", !!files.degree)}
                  {docChip(FileText, "Professional Reg.", files.professionalReg?.name || "Not uploaded", !!files.professionalReg)}
                  {docChip(FileText, "Address Proof", files.addressProof?.name || "Not uploaded", !!files.addressProof)}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-5 flex items-center gap-3">
          <Users className="h-4 w-4 text-[#246BFF] sm:h-5 sm:w-5" />
          <span className="text-sm font-medium text-white/95 sm:text-base">
            Co-applicant Details
          </span>
          <div className="h-px flex-1 bg-white/40" />
        </div>

        {addCoApplicant ? (
          <div className="overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.04]">
            {reviewRow("Name", coApplicant.name)}
            {reviewRow("Phone", coApplicant.phone)}
            {reviewRow("Email", coApplicant.email)}
            {reviewRow("Relation", coApplicant.relation)}
            {reviewRow("Aadhaar", coApplicant.aadhaar)}
            {reviewRow("PAN", coApplicant.pan)}
          </div>
        ) : (
          <div className="rounded-[18px] border border-dashed border-white/15 bg-white/[0.03] px-6 py-8 text-center sm:py-10">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/5 sm:h-14 sm:w-14">
              <UserX className="h-6 w-6 text-white/35 sm:h-7 sm:w-7" />
            </div>
            <p className="mt-4 text-lg text-white/85 sm:text-[22px]">No co-applicant added</p>
            <p className="mt-2 text-sm text-white/40 sm:text-[16px]">
              Co-applicants can help improve loan eligibility
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-start gap-3">
        <input
          type="checkbox"
          checked={agreed}
          onChange={() => setAgreed((p) => !p)}
          className="mt-1 h-5 w-5 rounded border-white/20 accent-[#246BFF]"
        />
        <p className="text-sm leading-7 text-white/65 sm:text-[15px] sm:leading-8">
          By submitting this application, I confirm that all information
          provided is accurate and truthful.
        </p>
      </div>

      {bottomNav({
        leftLabel: "Back to Edit",
        rightLabel: "Submit Application",
        onLeft: prevInternal,
        onRight: handleSubmitApplication,
        stepText: "Step 4 of 4",
      })}
    </div>
  );

  const SubmittedScreen = () => (
    <div className="py-8 text-center sm:py-10">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#08B981]/40 bg-[#08B981]/10 sm:h-24 sm:w-24 md:h-28 md:w-28">
        <Check className="h-10 w-10 text-[#22c55e] sm:h-12 sm:w-12 md:h-14 md:w-14" />
      </div>

      <h2 className="mt-8 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl md:text-5xl lg:text-6xl">
        Application Submitted
      </h2>

      <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8 md:text-lg">
        Your loan application has been received.
      </p>

      <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-5 rounded-[20px] border border-white/20 bg-[linear-gradient(135deg,rgba(31,40,74,0.95),rgba(66,77,125,0.92),rgba(26,30,46,0.95))] p-5 shadow-[0_25px_80px_rgba(0,0,0,0.45)] sm:p-6 md:flex-row md:items-center md:justify-between md:rounded-[24px]">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] bg-[#90c2ff] sm:h-16 sm:w-16 sm:rounded-[16px]">
            <ClipboardList className="h-7 w-7 text-[#246BFF] sm:h-8 sm:w-8" />
          </div>
          <div className="min-w-0 text-left">
            <p className="text-sm text-white/55 sm:text-[15px]">Loan Reference ID</p>
            <p className="truncate text-lg font-semibold text-white sm:text-[22px] md:text-[24px]">
              {loanReferenceId}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigator.clipboard?.writeText(loanReferenceId)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#246BFF] px-5 py-3.5 text-base font-medium text-white shadow-[0_10px_25px_rgba(36,107,255,0.35)] sm:w-auto sm:px-6 sm:py-4 sm:text-[17px]"
        >
          <Copy className="h-5 w-5" />
          Copy ID
        </button>
      </div>

      <div className="mx-auto mt-12 max-w-6xl text-left">
        <div className="mb-6 flex items-center gap-3 sm:gap-4">
          <div className="h-1 w-10 rounded-full bg-[#1da1ff] sm:w-12" />
          <h3 className="text-2xl font-semibold text-white sm:text-3xl md:text-[34px]">
            Tracking Progress
          </h3>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            { Icon: ImageIcon, title: "Under Review", sub: "Status: Active", badge: null, active: true },
            { Icon: PhoneCall, title: "Team calls within 24h", sub: "Wait for call", badge: "Pending", active: false },
            { Icon: ShieldCheck, title: "Documents verified", sub: "Post-call stage", badge: "Queued", active: false },
            { Icon: Building2, title: "Bank matching starts", sub: "Final approval", badge: "Final", active: false },
          ].map(({ Icon, title, sub, badge, active }) => (
            <div
              key={title}
              className={`rounded-[22px] border p-5 sm:p-6 ${
                active
                  ? "border-[#4ea1ff] bg-[linear-gradient(135deg,rgba(90,98,120,0.7),rgba(66,77,125,0.35),rgba(26,30,46,0.55))] shadow-[0_0_25px_rgba(78,161,255,0.25)]"
                  : "border-white/15 bg-[linear-gradient(135deg,rgba(31,40,74,0.95),rgba(66,77,125,0.45),rgba(26,30,46,0.95))]"
              }`}
            >
              <div className="mb-8 flex items-start justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full sm:h-12 sm:w-12 ${
                    active ? "bg-[#8fb9ff]/20" : "bg-white/5"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 sm:h-6 sm:w-6 ${
                      active ? "text-[#4e8fff]" : "text-white/65"
                    }`}
                  />
                </div>

                {active ? (
                  <CheckCircle2 className="h-5 w-5 text-[#246BFF] sm:h-6 sm:w-6" />
                ) : (
                  <span className="text-[11px] font-semibold uppercase text-white/45">
                    {badge}
                  </span>
                )}
              </div>

              <h4
                className={`text-base font-semibold sm:text-[18px] ${
                  active ? "text-white" : "text-white/90"
                }`}
              >
                {title}
              </h4>
              <p
                className={`mt-2 text-sm sm:text-[15px] ${
                  active ? "text-white/80" : "text-white/55"
                }`}
              >
                {sub}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 md:flex-row">
          <button
            type="button"
            onClick={handleViewAmortization}
            className="w-full rounded-[16px] border border-white/40 bg-transparent px-6 py-3.5 text-base font-medium text-[#246BFF] sm:w-auto sm:px-8 sm:py-4 sm:text-[17px]"
          >
            View Amortization Schedule
          </button>

          <button
  type="button"
  onClick={handleGoToDashboard}
  className="inline-flex w-full items-center justify-center gap-2 rounded-[16px] bg-[#246BFF] px-6 py-3.5 text-base font-medium text-white shadow-[0_10px_25px_rgba(36,107,255,0.35)] sm:w-auto sm:px-8 sm:py-4 sm:text-[17px]"
>
  Go To Dashboard
  <ArrowRight className="h-5 w-5" />
</button>
        </div>
      </div>
    </div>
  );

  return (
    <section className="relative min-h-screen overflow-x-hidden bg-[#040814] px-4 pb-14 pt-24 sm:px-6 lg:px-8">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(52,84,168,0.45),transparent_42%)]" />
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1f3c88]/20 blur-3xl sm:h-[650px] sm:w-[650px] lg:h-[780px] lg:w-[780px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {!submitted ? (
          <>
            {Stepper()}
            {currentStep === 1 && Step1()}
            {currentStep === 2 && Step2()}
            {currentStep === 3 && Step3()}
            {currentStep === 4 && Step4()}
            {currentStep === 1 && onBack && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={onBack}
                  className="text-sm text-white/50 underline underline-offset-4"
                >
                  Back to bank selection
                </button>
              </div>
            )}
          </>
        ) : (
          SubmittedScreen()
        )}
      </div>
    </section>
  );
}
