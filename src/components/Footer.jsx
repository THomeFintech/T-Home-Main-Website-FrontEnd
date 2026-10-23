import React, { useState } from "react";
import { Link } from "react-router-dom";

const FACILITATOR_NOTICE =
  "T-HOME Fintech is a technology-enabled service facilitator and a referral partner to regulated financial institutions. T-HOME Fintech is not an NBFC or a direct lender. All loan sanctions, interest rates and terms are governed by partner lender policies.";

const COMING_SOON = "/coming-soon";

const columns = [
  {
    title: "Loans",
    links: [
      { label: "Home Loans", to: "/home-loans" },
      { label: "Personal Loans", to: "/personal-loans" },
      { label: "LAP", to: "/loan-against-property" },
      { label: "Business Loans", to: COMING_SOON }, // PLACEHOLDER: no business loan page yet
      { label: "Balance Transfer", to: "/balance-transfer" },
    ],
  },
  {
    title: "Business Services",
    links: [
      { label: "Company Registration", to: "/company-registration" },
      { label: "LLP Setup", to: "/company-registration" }, // PLACEHOLDER: shares the company registration page
      { label: "GST Registration", to: "/gst-registration" },
      { label: "MSME Udyam", to: "/udyam-msme-registration" },
      { label: "FSSAI", to: "/food-license" },
    ],
  },
  {
    title: "Tax & Tools",
    links: [
      { label: "ITR Filing", to: "/itr-filing" },
      { label: "GST Filing", to: COMING_SOON }, // PLACEHOLDER: no GST filing page yet
      { label: "EMI Calculator", to: "/emi-calculator" },
      { label: "Loan Eligibility", to: "/tools" },
      { label: "Affordability Check", to: "/financial-profile" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Leadership", to: "/about" },
      { label: "Careers", to: "/career" },
      { label: "Collaborate", to: "/collaborate" },
      { label: "Grievance", to: "/grievance" },
      { label: "Privacy Policy", to: "/privacy-policy" },
      { label: "Terms & Disclaimers", to: "/terms-and-conditions" },
    ],
  },
];

function Footer() {
  /* ================= STATE ================= */
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_URL;

  /* ================= SUBSCRIBE ================= */
  const handleSubscribe = async () => {
    if (!consent) {
      setMsg("Please accept the Privacy Policy to subscribe.");
      return;
    }
    if (!email) {
      setMsg("❌ Please enter email");
      return;
    }

    try {
      setLoading(true);
      setMsg("");

      const res = await fetch(`${BASE_URL}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.status === "success") {
        setMsg("✅ Subscribed successfully!");
        setEmail("");
        setConsent(false);
      } else if (data.status === "exists") {
        setMsg("⚠️ Already subscribed");
      } else {
        setMsg("❌ Failed to subscribe");
      }
    } catch (error) {
      console.error(error);
      setMsg("❌ Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="border-t-2 border-[#7b3ff8] bg-[#1f2750] text-[#b8c4df]">
      <div className="mx-auto max-w-7xl px-6 py-8 md:py-10">
        {/* Top row: company info + subscribe */}
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3">
              <img src="/home/logo.png" className="h-10 w-10" alt="T-HOME logo" />
              <h2 className="text-4xl font-semibold text-white">T-HOME</h2>
            </div>

            <p className="mt-4 max-w-[430px] leading-[1.5] text-[#aebad4]">
              T-HOME Fintech is an AI-Powered Financial Technology Platform that simplifies financial
              services across India, with a focus on AI-powered financial intelligence, loan
              eligibility assessment, balance transfer solutions and accessible digital financial
              services.
            </p>

            <div className="mt-4 flex gap-3">
              <a href="https://www.instagram.com/thomefintech/" target="_blank" rel="noopener noreferrer">
                <img src="/home/instagram icon.png" className="h-6 w-6 cursor-pointer" alt="Instagram" />
              </a>
              <a
                href="https://www.facebook.com/share/17bB3HmT2u/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/home/facebook icon.png" className="h-6 w-6 cursor-pointer" alt="Facebook" />
              </a>
              <a href="https://www.linkedin.com/company/thomefintech" target="_blank" rel="noopener noreferrer">
                <img src="/home/linkedin con.png" className="h-6 w-6 cursor-pointer" alt="LinkedIn" />
              </a>
            </div>
          </div>

          {/* Subscribe */}
          <div>
            <h3
              className="mb-2 text-4xl font-semibold text-white"
              style={{ fontSize: "clamp(20px,1.08vw,40px)" }}
            >
              Subscribe to Updates
            </h3>
            <p className="mb-3 max-w-[430px] leading-[1.45] text-[#aebad4]">
              Subscribe to receive updates and financial tips directly to your inbox.
            </p>

            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setMsg("");
              }}
              placeholder="Enter your email"
              className="w-full max-w-[430px] rounded-[10px] border border-[#2f466f] bg-[#1a2c4f] px-4 py-3 text-white placeholder:text-[#93a6ca] outline-none focus:border-[#3b78ff]"
            />

            {/* Privacy Consent */}
            <label className="mt-3 flex items-start gap-2 text-xs leading-5 text-[#aebad4]">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => {
                  setConsent(event.target.checked);
                  setMsg("");
                }}
                className="mt-1 h-4 w-4 shrink-0 accent-[#3b78ff]"
              />
              <span>
                I agree to receive updates and accept the{" "}
                <Link
                  to="/privacy-policy"
                  className="text-[#b8d0ff] underline hover:text-white"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="mt-3 block w-full max-w-[430px] rounded-[10px] bg-[#2b67f0] py-3 text-sm font-semibold text-white transition hover:bg-[#3472ff] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Submitting..." : "SUBSCRIBE NOW"}
            </button>

            {msg && <p className="mt-2 text-sm text-[#b8d0ff]">{msg}</p>}

            <p className="mt-3 text-[#8ea1c7]">We respect your privacy and never share your email.</p>
          </div>
        </div>

        {/* Four link columns (Document, Section 4.6) */}
        <div className="mt-8 grid gap-8 border-t border-[#5a6588]/60 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h3
                className="mb-3 text-4xl font-semibold text-white"
                style={{ fontSize: "clamp(20px,1.08vw,40px)" }}
              >
                {col.title}
              </h3>
              <ul className="space-y-2 text-[#b4c2de]" style={{ fontSize: "clamp(14px,0.8vw,29px)" }}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Facilitator notice + grievance contact (Document, Sections 3 and 4.6) */}
        <div className="mt-8 grid gap-6 border-t border-[#5a6588]/60 pt-6 md:grid-cols-[2fr_1fr]">
          <p className="text-[13px] leading-[1.6] text-[#c3cfe8] sm:text-[14px]">{FACILITATOR_NOTICE}</p>

          <div className="text-[13px] leading-[1.6] text-[#c3cfe8] sm:text-[14px]">
            <p className="font-semibold text-white">Grievance redressal</p>
            <p>
              <a href="mailto:info@thome.co.in" className="hover:text-white">
                info@thome.co.in
              </a>
            </p>
            <p>
              <a href="tel:+917032183836" className="hover:text-white">
                +91 70321 83836
              </a>
            </p>
            <p>Hyderabad, Telangana</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 border-t border-[#5a6588]/60 pt-4">
          <div className="flex flex-col items-start justify-between gap-3 text-[#dde6ff] md:flex-row md:items-center">
            <p style={{ fontSize: "clamp(12px,1vw,40px)" }}>© 2026 T-HOME Fintech. All Rights Reserved.</p>
            <div className="flex gap-8" style={{ fontSize: "clamp(12px,1vw,40px)" }}>
              <Link to="/privacy-policy" className="transition hover:text-white">
                Privacy Policy
              </Link>
              <Link to="/terms-and-conditions" className="transition hover:text-white">
                Terms & Disclaimers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;