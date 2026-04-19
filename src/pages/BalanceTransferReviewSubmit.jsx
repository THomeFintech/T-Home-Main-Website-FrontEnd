import React from "react";
import { useNavigate } from "react-router-dom";
import { User, FileText, CheckCircle, Users } from "lucide-react";

export default function BalanceTransferReviewSubmit() {
  const navigate = useNavigate();
  // Demo data for UI only
  const mainApplicant = {
    fullName: "Siddhartha",
    mobile: "+91 6546543566",
    email: "you@gmail.com",
    aadhaar: "XXXX XXXX 3262",
    pan: "AB*****F",
  };
  const loanDetails = {
    loanType: "Personal Loan",
    loanAmount: "₹ 5,00,000",
    tenure: "36 Months",
    employmentType: "Salaried",
  };
  const kycFiles = [
    { name: "Aadhaar Card", status: "Verified" },
    { name: "PAN Card", status: "Verified" },
    { name: "Passport Photo", status: "Ready" },
  ];
  const incomeDocs = [
    { name: "Salary Slips (Last 6 Months)", status: "All files verified" },
    { name: "Bank Statement", status: "Latest 12 months combined PDF" },
    { name: "Form 16", status: "Latest Financial Year" },
  ];
  const loanDocs = [
    { name: "Loan Sanction Letter", status: "Uploaded and verified" },
    { name: "Loan Statement", status: "Uploaded and verified" },
    { name: "Foreclosure letter (Outstanding Amount)", status: "Uploaded and verified" },
  ];
  return (
    <section className="relative min-h-screen overflow-hidden px-4 pb-10 pt-24 font-['Outfit',sans-serif] sm:px-6 md:pt-28 lg:px-8 lg:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[#020918]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,77,167,0.34),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-[900px] rounded-[14px] border border-white/15 bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.06)_100%)] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.48)] backdrop-blur-xl sm:p-6">
        <h1 className="text-center text-[30px] font-semibold leading-tight text-white sm:text-[38px] md:text-[52px]">
          Balance Transfer <span className="text-[#1f6bff]">Application</span> Portal
        </h1>

        {/* Stepper */}
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
                    <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border text-[12px] font-semibold ${active ? "border-[#2f78ff] bg-white text-[#1f6bff]" : done ? "border-emerald-500 bg-emerald-500 text-white" : "border-white/70 bg-white text-slate-700"}`}>
                      {done ? "✓" : step}
                    </div>
                    <p className={`mt-4 text-[10px] font-semibold ${active ? "text-[#2f78ff]" : done ? "text-emerald-400" : "text-white/55"}`}>{labels[step - 1]}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-[800px] rounded-[12px] border border-white/15 bg-[rgba(255,255,255,0.05)] p-4 sm:p-6">
          <h2 className="text-center text-[24px] font-semibold text-white sm:text-[28px]">Review & Submit</h2>
          <p className="text-center text-[14px] text-white/70 mb-4">Verify all details before submitting your loan application</p>

          {/* Main Applicant */}
          <div className="border-b border-white/15 pb-2 mb-2">
            <div className="flex items-center gap-2 mb-2">
              <User size={18} className="text-[#5ea0ff]" />
              <span className="text-[15px] font-semibold text-white">Main Applicant</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px] text-white/90">
              <div>Full Name<br /><span className="font-medium text-white/80">{mainApplicant.fullName}</span></div>
              <div>Mobile Number<br /><span className="font-medium text-white/80">{mainApplicant.mobile}</span></div>
              <div>Email Address<br /><span className="font-medium text-white/80">{mainApplicant.email}</span></div>
              <div>Aadhaar Number<br /><span className="font-medium text-white/80">{mainApplicant.aadhaar}</span></div>
              <div>PAN Number<br /><span className="font-medium text-[#1f6bff] underline cursor-pointer">{mainApplicant.pan}</span></div>
            </div>
          </div>

          {/* Loan Details */}
          <div className="border-b border-white/15 pb-2 mb-2">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={18} className="text-[#5ea0ff]" />
              <span className="text-[15px] font-semibold text-white">Loan Details</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px] text-white/90">
              <div>Loan Type<br /><span className="font-medium text-white/80">{loanDetails.loanType}</span></div>
              <div>Loan Amount<br /><span className="font-medium text-white/80">{loanDetails.loanAmount}</span></div>
              <div>Tenure<br /><span className="font-medium text-white/80">{loanDetails.tenure}</span></div>
              <div>Employment Type<br /><span className="font-medium text-white/80">{loanDetails.employmentType}</span></div>
            </div>
          </div>

          {/* Documents Uploaded */}
          <div className="border-b border-white/15 pb-2 mb-2">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={18} className="text-[#5ea0ff]" />
              <span className="text-[15px] font-semibold text-white">Documents Uploaded</span>
            </div>
            {/* KYC */}
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[13px] font-semibold text-white/80">KYC & PHOTO</span>
                <span className="ml-auto text-[12px] text-emerald-400 font-semibold">3 FILES</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                {kycFiles.map((file) => (
                  <div key={file.name} className="flex-1 flex items-center gap-2 rounded-[8px] border border-white/20 bg-[rgba(255,255,255,0.08)] p-2">
                    <FileText size={14} className="text-[#5ea0ff]" />
                    <span className="text-[13px] text-white font-medium">{file.name}</span>
                    <span className="ml-auto text-[11px] text-emerald-400 font-semibold">{file.status}</span>
                    <CheckCircle size={16} className="text-emerald-400 ml-1" />
                  </div>
                ))}
              </div>
            </div>
            {/* Income Docs */}
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[13px] font-semibold text-white/80">INCOME DOCUMENTS - SALARIED</span>
                <span className="ml-auto text-[12px] text-emerald-400 font-semibold">3 FILES</span>
              </div>
              <div className="flex flex-col gap-2">
                {incomeDocs.map((file) => (
                  <div key={file.name} className="flex items-center gap-2 rounded-[8px] border border-white/20 bg-[rgba(255,255,255,0.08)] p-2">
                    <FileText size={14} className="text-[#5ea0ff]" />
                    <span className="text-[13px] text-white font-medium">{file.name}</span>
                    <span className="ml-auto text-[11px] text-emerald-400 font-semibold">{file.status}</span>
                    <CheckCircle size={16} className="text-emerald-400 ml-1" />
                  </div>
                ))}
              </div>
            </div>
            {/* Loan Docs */}
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[13px] font-semibold text-white/80">EXISTING LOAN DOCUMENTS</span>
                <span className="ml-auto text-[12px] text-emerald-400 font-semibold">3 FILES</span>
              </div>
              <div className="flex flex-col gap-2">
                {loanDocs.map((file) => (
                  <div key={file.name} className="flex items-center gap-2 rounded-[8px] border border-white/20 bg-[rgba(255,255,255,0.08)] p-2">
                    <FileText size={14} className="text-[#5ea0ff]" />
                    <span className="text-[13px] text-white font-medium">{file.name}</span>
                    <span className="ml-auto text-[11px] text-emerald-400 font-semibold">{file.status}</span>
                    <CheckCircle size={16} className="text-emerald-400 ml-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Co-applicant Details */}
          <div className="border-b border-white/15 pb-2 mb-2">
            <div className="flex items-center gap-2 mb-2">
              <Users size={18} className="text-[#5ea0ff]" />
              <span className="text-[15px] font-semibold text-white">Co-applicant Details</span>
            </div>
            <div className="rounded-[10px] border border-white/15 bg-[rgba(255,255,255,0.10)] p-4 flex flex-col items-center justify-center text-center">
              <div className="text-[13px] text-white/70 mb-1">No co-applicant added</div>
              <div className="text-[12px] text-white/50">Co-applicant can help improve loan eligibility</div>
            </div>
          </div>

          {/* Declaration */}
          <div className="text-[12px] text-white/60 mt-2 mb-4">
            By submitting this application, I confirm that all information provided is accurate and truthful. I authorize the lender to verify my credit history and contact me regarding this application and future financial products.
          </div>

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
              onClick={() => navigate("/balance-transfer/application-portal/submitted")}
              className="rounded-[8px] bg-[#1f6bff] px-5 py-2 text-[13px] font-medium text-white hover:bg-[#1c5ee0]"
            >
              Submit Application →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
