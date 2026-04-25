import React, { useState } from "react";
import { ShieldCheck, ChevronDown } from "lucide-react";

export default function ContactForm({
  contactData = {},
  setContactData = () => {},
  onNext = () => {},
  title = "Loan Prediction System",
  submitText = "Submit Form",
}) {
  const [formData, setFormData] = useState({
    name: contactData.name || "",
    phone: contactData.phone || "",
    email: contactData.email || "",
    service: contactData.service || "",
    agree: contactData.agree || false,
    policyAgree: contactData.policyAgree || false,
  });

  const [errors, setErrors] = useState({});

  const services = [
    "Home Loan",
    "Personal Loan",
    "Business Loan",
    "Loan Against Property",
  ];

  const validateField = (name, value) => {
    let error = "";

    if (name === "name") {
      if (!value.trim()) {
        error = "Name is required";
      } else if (!/^[A-Za-z\s]+$/.test(value.trim())) {
        error = "Name should contain only letters";
      } else if (value.trim().length < 2) {
        error = "Name must be at least 2 characters";
      }
    }

    if (name === "phone") {
      if (!value.trim()) {
        error = "Phone number is required";
      } else if (!/^[6-9]\d{9}$/.test(value)) {
        error = "Enter a valid 10-digit mobile number";
      }
    }

    if (name === "email") {
      if (!value.trim()) {
        error = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Enter a valid email address";
      }
    }

    if (name === "service") {
      if (!value) {
        error = "Please select a service";
      }
    }

    if (name === "agree") {
      if (!value) {
        error = "Please accept the terms to continue";
      }
    }

    if (name === "policyAgree") {
      if (!value) {
        error = "Please accept the privacy policy to continue";
      }
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let finalValue = type === "checkbox" ? checked : value;

    if (name === "name") {
      finalValue = value.replace(/[^A-Za-z\s]/g, "");
    }

    if (name === "phone") {
      finalValue = value.replace(/\D/g, "").slice(0, 10);
    }

    const updatedData = {
      ...formData,
      [name]: finalValue,
    };

    setFormData(updatedData);
    setContactData(updatedData);

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, finalValue),
    }));
  };

  const validateForm = () => {
    const newErrors = {
      name: validateField("name", formData.name),
      phone: validateField("phone", formData.phone),
      email: validateField("email", formData.email),
      service: validateField("service", formData.service),
      agree: validateField("agree", formData.agree),
      policyAgree: validateField("policyAgree", formData.policyAgree),
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setContactData(formData);
localStorage.setItem("contact_data", JSON.stringify(formData));
onNext(formData.service);
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#040814] px-4 pt-28 pb-10 sm:px-6 md:pt-32 lg:px-8 lg:pt-36">
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(52,84,168,0.45),transparent_42%)]" />
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1f3c88]/20 blur-3xl sm:h-[520px] sm:w-[520px] md:h-[620px] md:w-[620px] lg:h-[680px] lg:w-[680px]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center">
        {/* HEADER */}
        <div className="mb-8 text-center md:mb-10">
          <h1 className="text-[22px] sm:text-[28px] md:text-[40px] lg:text-[52px] font-semibold leading-tight tracking-[-0.02em] text-white">
            {title}
          </h1>

          <p className="mt-2 text-xs sm:text-sm md:text-[15px] font-normal text-white/85 px-2">
            Provide your details to access our advanced financial planning tools.
          </p>
        </div>

        {/* FORM CARD */}
        <div className="w-full max-w-[92%] sm:max-w-[420px] md:max-w-[480px] lg:max-w-[520px] rounded-[20px] sm:rounded-[24px] border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.06)_100%)] px-4 py-5 sm:px-6 sm:py-6 md:px-7 md:py-7 shadow-[0_20px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl">
          <h2 className="text-center text-[20px] sm:text-[24px] md:text-[28px] font-semibold text-white">
            Fill This form
          </h2>

          <div className="mt-4 flex justify-center">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#3f7dff] bg-[rgba(37,99,235,0.10)] px-3 py-1.5 text-[10px] sm:text-[11px] text-[#6fb0ff] shadow-[0_0_18px_rgba(59,130,246,0.35)]">
              <ShieldCheck size={12} className="shrink-0" />
              <span className="whitespace-normal sm:whitespace-nowrap text-center">
                256-bit SSL secured · No data sharing · No spam calls
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-3 sm:space-y-4">
            {/* NAME */}
            <div>
              <label className="mb-1.5 block text-[12px] sm:text-[13px] font-normal text-white/85">
                Name as per Adhaar
              </label>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className={`h-[44px] sm:h-[46px] w-full rounded-[10px] border bg-[rgba(255,255,255,0.08)] px-3 sm:px-4 text-[13px] sm:text-[14px] text-white placeholder:text-white/50 outline-none transition ${
                  errors.name
                    ? "border-red-400 focus:border-red-400"
                    : "border-white/15 focus:border-[#4d8cff]"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-[11px] text-red-400">{errors.name}</p>
              )}
            </div>

            {/* PHONE */}
            <div>
              <label className="mb-1.5 block text-[12px] sm:text-[13px] font-normal text-white/85">
                Phone
              </label>
              <div
                className={`flex h-[44px] sm:h-[46px] w-full overflow-hidden rounded-[10px] border bg-[rgba(255,255,255,0.08)] ${
                  errors.phone
                    ? "border-red-400"
                    : "border-white/15 focus-within:border-[#4d8cff]"
                }`}
              >
                <div className="flex w-[40px] sm:w-[48px] items-center justify-center border-r border-white/20 text-[13px] sm:text-[14px] text-white/75">
                  +91
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="h-full w-full bg-transparent px-3 sm:px-4 text-[13px] sm:text-[14px] text-white placeholder:text-white/50 outline-none"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-[11px] text-red-400">{errors.phone}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="mb-1.5 block text-[12px] sm:text-[13px] font-normal text-white/85">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                className={`h-[44px] sm:h-[46px] w-full rounded-[10px] border bg-[rgba(255,255,255,0.08)] px-3 sm:px-4 text-[13px] sm:text-[14px] text-white placeholder:text-white/50 outline-none transition ${
                  errors.email
                    ? "border-red-400 focus:border-red-400"
                    : "border-white/15 focus:border-[#4d8cff]"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-[11px] text-red-400">{errors.email}</p>
              )}
            </div>

            {/* SERVICE */}
            <div>
              <label className="mb-1.5 block text-[12px] sm:text-[13px] font-normal text-white/85">
                Service
              </label>
              <div className="relative">
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className={`h-[44px] sm:h-[46px] w-full appearance-none rounded-[10px] border bg-[rgba(255,255,255,0.08)] px-3 sm:px-4 pr-10 text-[13px] sm:text-[14px] text-white outline-none transition ${
                    errors.service
                      ? "border-red-400 focus:border-red-400"
                      : "border-white/20 focus:border-[#4d8cff]"
                  }`}
                >
                  <option value="" className="text-black">
                    Select a service
                  </option>
                  {services.map((service) => (
                    <option key={service} value={service} className="text-black">
                      {service}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/80"
                />
              </div>
              {errors.service && (
                <p className="mt-1 text-[11px] text-red-400">{errors.service}</p>
              )}
            </div>

            {/* CHECKBOX 1 */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 rounded border border-white/30 bg-transparent accent-[#2f73ff]"
                />
                <span className="text-[11px] sm:text-[12px] leading-5 text-white/65">
                  I Solely agree the T&C and the predictions are Totally basing on my Inputs given.
                </span>
              </label>

              {errors.agree && (
                <p className="mt-1 text-[11px] text-red-400">{errors.agree}</p>
              )}
            </div>

            {/* CHECKBOX 2 (with links) */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  name="policyAgree"
                  checked={formData.policyAgree || false}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 rounded border border-white/30 bg-transparent accent-[#2f73ff]"
                />
                <span className="text-[11px] sm:text-[12px] leading-5 text-white/65">
                  * I agree to the{' '}
                  <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#50a2ff] underline hover:text-[#2563ff]">Privacy Policy</a>
                  {' '}and{' '}
                  <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="text-[#50a2ff] underline hover:text-[#2563ff]">Terms & Conditions</a>
                  {' '}of T-Home Fintech.
                </span>
              </label>
              {errors.policyAgree && (
                <p className="mt-1 text-[11px] text-red-400">{errors.policyAgree}</p>
              )}
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="mt-2 flex h-[44px] sm:h-[46px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#2563ff] text-[14px] sm:text-[16px] font-medium text-white shadow-[0_10px_30px_rgba(37,99,255,0.45)] transition hover:bg-[#1d56e4]"
            >
              {submitText}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
