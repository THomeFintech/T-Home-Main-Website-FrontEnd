import React, { useState, useEffect, useCallback } from "react";
import { Mail, Phone, MessageCircle, ShieldCheck } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import DigiLockerVerificationStep from "../components/DigiLockerVerificationStep";

export default function ContactPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const services = [
    "Home Loans",
    "Mortgage Loan",
    "Loan Against Property",
    "Personal Loan",
    "Balance Transfer",
    "PAN & Aadhaar Linking",
    "Company Registration",
    "GST Registration",
    "UDYAM/MSME Registration",
    "ITR Tax Filing",
    "Food License",
  ];

  const searchParams = new URLSearchParams(location.search);
  const serviceParam = searchParams.get("service");

  // Normalise serviceParam to match one in our services list
  const matchedService =
    services.find(
      (s) =>
        serviceParam &&
        (s.toLowerCase() === serviceParam.toLowerCase() ||
          s.toLowerCase().includes(serviceParam.toLowerCase()) ||
          serviceParam.toLowerCase().includes(s.toLowerCase()))
    ) ||
    serviceParam ||
    services[0];

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: matchedService,
    message: "",
    consent: false,
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(Boolean(serviceParam));
  const [digilockerConnected, setDigilockerConnected] = useState(false);
  const [verifiedIdentity, setVerifiedIdentity] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Check login and DigiLocker status when service is requested
  useEffect(() => {
    const token =
      sessionStorage.getItem("access_token") ||
      localStorage.getItem("access_token");

    if (serviceParam && !token) {
      try {
        const currentPath = `${location.pathname}${location.search}`;
        localStorage.setItem("digilocker_return_url", currentPath);
        localStorage.setItem("digilocker_selected_service", matchedService);
      } catch {}
      navigate("/login");
      return;
    }

    if (token) {
      fetch(`${API_BASE}/digilocker/status`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.connected && data?.verified_identity) {
            setDigilockerConnected(true);
            setVerifiedIdentity(data.verified_identity);
            setFormData((prev) => ({
              ...prev,
              name: prev.name || data.verified_identity.name || "",
              phone: prev.phone || data.verified_identity.phone || "",
              email: prev.email || data.verified_identity.email || "",
              service: matchedService,
            }));
          } else {
            setDigilockerConnected(false);
          }
        })
        .catch(() => {
          setDigilockerConnected(false);
        })
        .finally(() => {
          setCheckingAuth(false);
        });
    } else {
      setCheckingAuth(false);
    }
  }, [serviceParam, matchedService, API_BASE, location.pathname, location.search, navigate]);

  const handleDigiLockerVerified = useCallback(
    (identity) => {
      setDigilockerConnected(true);
      setVerifiedIdentity(identity);
      setFormData((prev) => ({
        ...prev,
        name: identity.name || prev.name || "",
        phone: identity.phone || prev.phone || "",
        email: identity.email || prev.email || "",
        service: matchedService,
      }));
    },
    [matchedService]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === "phone") {
      finalValue = value.replace(/\D/g, "").slice(0, 10);
    }
    setFormData((p) => ({ ...p, [name]: finalValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!formData.message.trim()) {
      setErrorMsg("Message is required.");
      return;
    }

    if (!formData.consent) {
      setErrorMsg(
        "Please confirm that you agree to the Privacy Policy before submitting."
      );
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setErrorMsg("Enter a valid 10-digit mobile number (starts with 6-9)");
      return;
    }

    setLoading(true);

    const payload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      service: formData.service,
      message: formData.message.trim(),
    };

    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        const detail = errData?.detail || `Server error: ${res.status}`;
        throw new Error(
          typeof detail === "string" ? detail : JSON.stringify(detail)
        );
      }

      await res.json();
      setSuccessMsg(
        `Thank you ${formData.name}. Your application for ${formData.service} has been received. Our team will contact you shortly.`
      );
      setFormData({
        name: "",
        phone: "",
        email: "",
        service: matchedService,
        message: "",
        consent: false,
      });
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // If serviceParam is present and user is not verified via DigiLocker, show mandatory DigiLocker gate
  if (serviceParam && !digilockerConnected) {
    if (checkingAuth) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#071327] text-white">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-blue-400" />
            <p className="mt-3 text-sm text-white/60">
              Checking verification status...
            </p>
          </div>
        </div>
      );
    }

    return (
      <div
        className="min-h-screen text-slate-100 font-sans"
        style={{
          background:
            "radial-gradient(1200px 680px at 20% -10%, rgba(90,140,255,0.18), transparent 62%), radial-gradient(980px 580px at 100% 0%, rgba(36,107,198,0.14), transparent 60%), linear-gradient(180deg, #071327 0%, #08162b 100%)",
        }}
      >
        <div className="pt-24 pb-12">
          <DigiLockerVerificationStep
            serviceName={matchedService}
            onVerified={handleDigiLockerVerified}
            onBack={() => navigate(-1)}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden text-white"
      style={{
        background:
          "radial-gradient(1200px 680px at 20% -10%, rgba(90,140,255,0.18), transparent 62%), radial-gradient(980px 580px at 100% 0%, rgba(36,107,198,0.14), transparent 60%), linear-gradient(180deg, #071327 0%, #08162b 100%)",
      }}
    >
      <SEO
        title={`Contact Us - ${matchedService}`}
        description="Contact T-Home Fintech for expert assistance with loans, business registrations, tax filing, and financial services. Our team is ready to help you."
        path="/contact"
        keywords="contact T-Home Fintech, customer support, loan assistance, business registration help"
      />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[440px] w-[980px] -translate-x-1/2 rounded-full bg-[#2f73ff]/20 blur-[140px]" />
        <div className="absolute bottom-[18%] left-[8%] h-[300px] w-[300px] rounded-full bg-[#4f84ff]/14 blur-[120px]" />
        <div className="absolute bottom-[22%] right-[8%] h-[280px] w-[280px] rounded-full bg-[#315cc9]/12 blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_45%,transparent_76%)]" />
      </div>

      <div className="relative z-10 font-outfit selection:bg-blue-500/30">
        {/* 1. HERO SECTION */}
        <section className="relative pt-[180px] md:pt-[130px] pb-8 md:pb-12 text-center overflow-hidden">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] md:w-[1000px] h-[300px] md:h-[500px] bg-blue-600/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mt-16 md:mt-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              {serviceParam ? `Apply for ${matchedService}` : "Contact Us"}
            </h1>
            <p className="text-gray-200 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-light px-2">
              Comprehensive financial solutions detailed to meet your personal and
              business growth needs.
            </p>
          </div>
        </section>

        {/* 2. MAIN CONTACT SECTION */}
        <div className="relative bg-transparent">
          <section className="relative z-10 px-4 sm:px-6 md:px-20 pt-10 md:pt-16 pb-12">
            <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[0.7fr_1.3fr] gap-12 lg:gap-16 items-stretch text-center lg:text-left">
              {/* Left Side: Text and Image */}
              <div className="flex flex-col h-full">
                <div className="mb-8">
                  <span className="inline-block px-3 py-1 rounded bg-blue-500/10 text-blue-400 text-[10px] md:text-[11px] font-bold tracking-[0.2em] mb-4 border border-blue-500/20 uppercase">
                    {matchedService}
                  </span>
                  <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold leading-[1.2] lg:leading-[1.1] mb-4">
                    Expert Financial <br className="hidden sm:block" />
                    <span className="text-blue-500">Solutions for You</span>
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto lg:mx-0 font-light">
                    Apply with zero physical paperwork. Your details have been
                    retrieved securely from DigiLocker.
                  </p>
                </div>

                <div className="w-full max-w-[480px]">
                  <img
                    src="/home/contact img.png"
                    alt="Support Specialist"
                    className="w-full h-auto rounded-[32px] shadow-2xl border border-white/5"
                  />
                </div>
              </div>

              {/* Right Side: Form Card */}
              <div className="bg-white/[0.05] backdrop-blur-[24px] border border-white/10 rounded-[16px] p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full mx-auto lg:mx-0 text-left">
                {verifiedIdentity && (
                  <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-400" />
                    <div>
                      <p className="font-semibold text-white">
                        ✓ Verified via DigiLocker
                      </p>
                      <p className="text-[11px] text-emerald-300/80">
                        Applicant: {verifiedIdentity.name || "Verified"}{" "}
                        {verifiedIdentity.pan && `• PAN: ${verifiedIdentity.pan}`}
                      </p>
                    </div>
                  </div>
                )}

                {successMsg && (
                  <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/15 p-4 text-sm text-emerald-300">
                    {successMsg}
                  </div>
                )}

                {errorMsg && (
                  <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/15 p-4 text-sm text-red-300">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <FormInput
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                    />
                    <FormInput
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      maxLength={10}
                      inputMode="numeric"
                      pattern="[6-9][0-9]{9}"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter 10-digit mobile"
                    />
                  </div>

                  <FormInput
                    label="Your Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email@Example.com"
                    type="email"
                  />

                  <div>
                    <label className="text-[10px] md:text-[11px] text-gray-400 mb-1.5 block font-semibold uppercase tracking-widest">
                      Select Your Service
                    </label>
                    <div className="relative">
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full h-12 md:h-13 px-4 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer font-light"
                      >
                        {services.map((s) => (
                          <option key={s} value={s} className="bg-[#020617]">
                            {s}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">
                        ▼
                      </div>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 text-xs leading-5 text-gray-400">
                    <input
                      type="checkbox"
                      name="consent"
                      checked={formData.consent}
                      onChange={(event) =>
                        setFormData((current) => ({
                          ...current,
                          consent: event.target.checked,
                        }))
                      }
                      className="mt-1 h-4 w-4 shrink-0 rounded border-white/20 bg-white/5 accent-blue-500"
                    />
                    <span>
                      I agree that T-Home may use my details to respond to this
                      request, in accordance with the{" "}
                      <Link
                        to="/privacy-policy"
                        className="text-blue-400 underline hover:text-blue-300"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>

                  <div>
                    <label className="text-[10px] md:text-[11px] text-gray-400 mb-1.5 block font-semibold uppercase tracking-widest">
                      Message / Notes
                    </label>
                    <textarea
                      name="message"
                      rows="3"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please add any specific instructions or requirements..."
                      className="w-full p-4 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-all font-light resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 md:h-13 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Processing...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </section>

          {/* 3. TRUST & ICON SECTION */}
          <section className="relative z-10 pt-4 pb-12 border-t border-white/5">
            <p className="text-gray-300 text-center text-[10px] sm:text-xs md:text-sm mb-8 md:mb-12 font-bold uppercase tracking-[0.2em] px-4">
              Contact options
            </p>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row flex-wrap items-center md:items-start justify-center gap-10 md:gap-20 lg:gap-36 px-6">
              <ContactDetail
                icon={<Mail size={32} className="md:w-[42px] md:h-[42px]" />}
                title="Email Support"
                value="info@thome.co.in"
              />
              <ContactDetail
                icon={<Phone size={32} className="md:w-[42px] md:h-[42px]" />}
                title="Phone"
                value="+91 70321 83836"
              />
              <ContactDetail
                icon={
                  <MessageCircle
                    size={32}
                    className="md:w-[42px] md:h-[42px]"
                  />
                }
                title="Live Chat"
                value="Availability to be confirmed"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function FormInput({ label, ...props }) {
  return (
    <div className="w-full">
      <label className="text-[10px] md:text-[11px] text-gray-400 mb-1.5 block font-semibold uppercase tracking-widest">
        {label}
      </label>
      <input
        {...props}
        className="w-full h-12 md:h-13 px-4 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-all font-light"
        required
      />
    </div>
  );
}

function ContactDetail({ icon, title, value }) {
  return (
    <div className="flex items-center gap-4 md:gap-6 group cursor-default w-full md:w-auto justify-start sm:justify-center md:justify-start max-w-[250px] md:max-w-none mx-auto md:mx-0">
      <div className="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 shrink-0">
        <div className="absolute inset-0 bg-blue-600/25 blur-[25px] md:blur-[35px] rounded-full scale-150 group-hover:bg-blue-500/40 transition-all duration-500" />
        <div className="absolute inset-0 bg-blue-400/20 blur-[10px] md:blur-[15px] rounded-full scale-100 group-hover:bg-blue-400/50 transition-all duration-500" />
        <div className="relative z-10 text-blue-400 group-hover:text-blue-200 transition-colors drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="flex flex-col text-left">
        <h4 className="text-base md:text-lg font-bold text-white leading-tight tracking-tight">
          {title}
        </h4>
        <p className="text-gray-400 text-[18px] font-normal mt-1 group-hover:text-gray-200 transition-colors">
          {value}
        </p>
      </div>
    </div>
  );
}
