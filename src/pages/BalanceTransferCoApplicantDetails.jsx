import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Lightbulb } from "lucide-react";
import { BT_API_BASE } from "../config";

const initialForm = {
  full_name: "",
  mobile: "",
  email: "",
  relationship: "",
  monthly_income: "",
  employment_type: "",
  pan_number: "",
  aadhaar_number: "",
};

export default function BalanceTransferCoApplicantDetails() {
  const navigate = useNavigate();

  const [addCoApplicant, setAddCoApplicant] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedDraft = JSON.parse(localStorage.getItem("btApplicationDraft") || "{}");

    if (typeof savedDraft?.has_co_applicant === "boolean") {
      setAddCoApplicant(savedDraft.has_co_applicant);
    }

    if (savedDraft?.co_applicant_details) {
      setFormData({
        ...initialForm,
        ...savedDraft.co_applicant_details,
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const validateCoApplicant = () => {
    if (!addCoApplicant) return true;

    if (!formData.full_name.trim()) {
      setError("Please enter co-applicant full name.");
      return false;
    }

    if (!formData.mobile.trim()) {
      setError("Please enter co-applicant mobile number.");
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobile.trim())) {
      setError("Please enter a valid 10 digit mobile number.");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Please enter co-applicant email.");
      return false;
    }

    if (!formData.relationship.trim()) {
      setError("Please select relationship.");
      return false;
    }

    if (!formData.monthly_income.trim()) {
      setError("Please enter monthly income.");
      return false;
    }

    if (!formData.employment_type.trim()) {
      setError("Please select employment type.");
      return false;
    }

    if (!formData.pan_number.trim()) {
      setError("Please enter PAN number.");
      return false;
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.pan_number.trim().toUpperCase())) {
      setError("Please enter a valid PAN number.");
      return false;
    }

    if (!formData.aadhaar_number.trim()) {
      setError("Please enter Aadhaar number.");
      return false;
    }

    if (!/^\d{12}$/.test(formData.aadhaar_number.trim())) {
      setError("Please enter a valid 12 digit Aadhaar number.");
      return false;
    }

    return true;
  };

  const handleNext = async () => {
    try {
      setLoading(true);
      setError("");

      if (!validateCoApplicant()) return;

const existingDraft = JSON.parse(
  localStorage.getItem("btApplicationDraft") || "{}"
);

localStorage.setItem(
  "btApplicationDraft",
  JSON.stringify({
    ...existingDraft,

    current_step: 4,

    has_co_applicant: addCoApplicant,

    co_applicant_details: addCoApplicant
      ? {
          ...formData,
          pan_number: formData.pan_number.toUpperCase(),
          monthly_income: Number(formData.monthly_income),
        }
      : null,
  })
);

navigate("/balance-transfer/application-portal/review-submit");
    } catch (err) {
      const detail = err?.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(detail.map((d) => d?.msg || "Validation error").join(", "));
      } else if (typeof detail === "object" && detail !== null) {
        setError(detail?.msg || detail?.message || "Validation error");
      } else {
        setError(detail || err?.message || "Failed to save co-applicant details");
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

        <div className="mx-auto mt-6 max-w-[850px] rounded-[12px] border border-white/15 bg-[rgba(255,255,255,0.05)] p-4 sm:p-5">
          <h2 className="text-center text-[24px] font-semibold text-white sm:text-[28px]">
            Co-Applicant Details <span className="text-white/60">(Optional)</span>
          </h2>

          <div className="mt-6 flex items-center gap-3 rounded-[10px] border border-white/15 bg-[rgba(255,255,255,0.08)] px-4 py-3">
            <Users size={22} className="text-[#5ea0ff]" />

            <div className="flex-1">
              <div className="text-[15px] font-medium text-white">
                Add a Co-Applicant
              </div>
              <div className="text-[12px] text-white/60">
                Enable this to enter co-applicant details
              </div>
            </div>

            <input
              type="checkbox"
              checked={addCoApplicant}
              onChange={() => {
                setAddCoApplicant((prev) => !prev);
                setError("");
              }}
              className="h-5 w-5"
            />
          </div>

          {addCoApplicant && (
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Full Name*"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
              />

              <Input
                label="Mobile Number*"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                maxLength={10}
              />

              <Input
                label="Email*"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
              />

              <Select
                label="Relationship*"
                name="relationship"
                value={formData.relationship}
                onChange={handleChange}
                options={[
                  "Spouse",
                  "Father",
                  "Mother",
                  "Brother",
                  "Sister",
                  "Adult Child",
                  "Business Partner",
                ]}
              />

              <Input
                label="Monthly Income*"
                name="monthly_income"
                value={formData.monthly_income}
                onChange={handleChange}
                type="number"
              />

              <Select
                label="Employment Type*"
                name="employment_type"
                value={formData.employment_type}
                onChange={handleChange}
                options={["Salaried", "Self-employed", "Business Owner"]}
              />

              <Input
                label="PAN Number*"
                name="pan_number"
                value={formData.pan_number}
                onChange={handleChange}
                maxLength={10}
              />

              <Input
                label="Aadhaar Number*"
                name="aadhaar_number"
                value={formData.aadhaar_number}
                onChange={handleChange}
                maxLength={12}
              />
            </div>
          )}

          <div className="mt-6 flex items-start gap-3 rounded-[10px] border border-white/15 bg-[rgba(255,255,255,0.10)] p-4">
            <Lightbulb size={22} className="mt-1 text-[#f7c948]" />
            <p className="text-[13px] text-white/80">
              Adding a co-applicant may improve eligibility by combining income.
            </p>
          </div>

          {error && <p className="mt-4 text-[12px] text-red-400">{error}</p>}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-[8px] border border-white/25 bg-white px-4 py-2 text-[13px] font-medium text-[#0f172a]"
            >
              ← Back
            </button>

            <div className="w-full px-2 sm:w-[260px]">
              <div className="h-1.5 w-full rounded-full bg-white/25">
                <div className="h-full w-[80%] rounded-full bg-[#2f78ff]" />
              </div>
              <p className="mt-1 text-center text-[10px] text-white/60">
                Step 4 of 5
              </p>
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="rounded-[8px] bg-[#1f6bff] px-5 py-2 text-[13px] font-medium text-white hover:bg-[#1c5ee0] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : "Review Application →"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Input({ label, name, value, onChange, type = "text", maxLength }) {
  return (
    <div>
      <label className="mb-1 block text-[12px] font-medium text-white/80">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        maxLength={maxLength}
        onChange={onChange}
        className="w-full rounded-[8px] border border-white/15 bg-white/10 px-3 py-2 text-[13px] text-white outline-none placeholder:text-white/40"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="mb-1 block text-[12px] font-medium text-white/80">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-[8px] border border-white/15 bg-[#101936] px-3 py-2 text-[13px] text-white outline-none"
      >
        <option value="">Select</option>
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}
