import React, { useState } from "react";
import { Link } from "react-router-dom";

function Footer() {
  /* ================= STATE ================= */
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_URL;

  /* ================= SUBSCRIBE ================= */
  const handleSubscribe = async () => {
    const trimmedEmail = email.trim();

    // Email required
    if (!trimmedEmail) {
      setMsg("❌ Please enter email");
      return;
    }

    // Email format validation - Nikhil's bug fix
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(trimmedEmail)) {
      setMsg("❌ Please enter a valid email");
      return;
    }

    // Privacy consent - Mary's content change
    if (!consent) {
      setMsg("Please agree to the Privacy Policy before subscribing.");
      return;
    }

    try {
      setLoading(true);
      setMsg("");

      console.log("📩 Sending:", trimmedEmail);

      const res = await fetch(`${BASE_URL}/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
        }),
      });

      const data = await res.json();

      console.log("✅ Response:", data);

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
      console.error("Subscription error:", error);
      setMsg("❌ Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="border-t-2 border-[#7b3ff8] bg-[#1f2750] text-[#b8c4df]">
      <div className="mx-auto max-w-7xl px-6 py-8 md:py-10">

        <div className="grid gap-8 md:grid-cols-[1.25fr_0.8fr_0.9fr_0.9fr_1.6fr]">

          {/* ================= COMPANY INFO ================= */}
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/home/logo.png"
                className="h-10 w-10"
                alt="T-HOME logo"
              />

              <h2 className="text-4xl font-semibold text-white">
                T-HOME
              </h2>
            </div>

            <p className="mt-4 max-w-[290px] leading-[1.5] text-[#aebad4]">
              T-HOME provides innovative and reliable financial solutions for
              your home needs. We combine technology, trust, and expertise to
              simplify your financial journey.
            </p>

            <div className="mt-4 flex gap-3">

              {/* Instagram */}
              <a
                href="https://www.instagram.com/thomefintech/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/home/instagram icon.png"
                  className="h-6 w-6 cursor-pointer"
                  alt="Instagram"
                />
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/17bB3HmT2u/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/home/facebook icon.png"
                  className="h-6 w-6 cursor-pointer"
                  alt="Facebook"
                />
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/thomefintech"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/home/linkedin con.png"
                  className="h-6 w-6 cursor-pointer"
                  alt="LinkedIn"
                />
              </a>

            </div>
          </div>

          {/* ================= QUICK LINKS ================= */}
          <div>
            <h3
              className="mb-3 text-4xl font-semibold text-white"
              style={{
                fontSize: "clamp(20px,1.08vw,40px)",
              }}
            >
              Quick Links
            </h3>

            <ul
              className="space-y-2 text-[29px] text-[#b4c2de]"
              style={{
                fontSize: "clamp(14px,0.8vw,29px)",
              }}
            >
              <li>
                <Link
                  to="/about"
                  className="hover:text-white transition"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/career"
                  className="hover:text-white transition"
                >
                  Careers
                </Link>
              </li>

              <li>
                <Link
                  to="/collaborate"
                  className="hover:text-white transition"
                >
                  Collaborate
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="hover:text-white transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* ================= SERVICES ================= */}
          <div>
            <h3
              className="mb-3 text-4xl font-semibold text-white"
              style={{
                fontSize: "clamp(20px,1.08vw,40px)",
              }}
            >
              Services
            </h3>

            <ul
              className="space-y-2 text-[29px] text-[#b4c2de]"
              style={{
                fontSize: "clamp(14px,0.8vw,29px)",
              }}
            >
              <li>
                <Link
                  to="/home-loans"
                  className="hover:text-white transition"
                >
                  Home Loans
                </Link>
              </li>

              <li>
                <Link
                  to="/loan-against-property"
                  className="hover:text-white transition"
                >
                  Loan Against Property
                </Link>
              </li>

              <li>
                <Link
                  to="/itr-filing"
                  className="hover:text-white transition"
                >
                  Income Tax Filing
                </Link>
              </li>

              <li>
                <Link
                  to="/company-registration"
                  className="hover:text-white transition"
                >
                  Business Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools */}
<div>
  <h3
    className="mb-3 text-4xl font-semibold text-white"
    style={{ fontSize: "clamp(20px,1.08vw,40px)" }}
  >
    Tools
  </h3>

  <ul
    className="space-y-2 text-[29px] text-[#b4c2de]"
    style={{ fontSize: "clamp(14px,0.8vw,29px)" }}
  >
    <li>
      <Link
        to="/emi-calculator"
        className="hover:text-white transition"
      >
        EMI Calculator
      </Link>
    </li>

    <li>
      <Link
        to="/tools?tool=loan-prediction"
        className="hover:text-white transition"
      >
        Loan Prediction System
      </Link>
    </li>

    <li>
      <Link
        to="/balance-transfer-contact"
        className="hover:text-white transition"
      >
        Balance Transfer Calculator
      </Link>
    </li>
  </ul>
</div>

          {/* ================= SUBSCRIBE ================= */}
          <div>
            <h3
              className="mb-2 text-4xl font-semibold text-white"
              style={{
                fontSize: "clamp(20px,1.08vw,40px)",
              }}
            >
              Subscribe to Updates
            </h3>

            <p className="mb-3 max-w-[430px] leading-[1.45] text-[#aebad4]">
              Subscribe to receive updates and financial tips directly to your
              inbox.
            </p>

            {/* Email */}
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setMsg("");
              }}
              placeholder="Enter your email"
              className="w-full rounded-[10px] border border-[#2f466f] bg-[#1a2c4f] px-4 py-3 text-white placeholder:text-[#93a6ca] outline-none focus:border-[#3b78ff]"
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

            {/* Subscribe Button */}
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="mt-3 w-full rounded-[10px] bg-[#2b67f0] py-3 text-sm font-semibold text-white transition hover:bg-[#3472ff] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Submitting..." : "SUBSCRIBE NOW"}
            </button>

            {/* Message */}
            {msg && (
              <p className="mt-2 text-sm text-[#b8d0ff]">
                {msg}
              </p>
            )}

            {/* Unsubscribe text */}
            <p className="mt-3 text-[#8ea1c7]">
              You can unsubscribe from updates at any time.
            </p>
          </div>
        </div>

        {/* ================= BOTTOM BAR ================= */}
        <div className="mt-5 border-t border-[#5a6588]/60 pt-4">

          <div className="flex flex-col items-start justify-between gap-3 text-[#dde6ff] md:flex-row md:items-center">

            <p
              className="text-4xl"
              style={{
                fontSize: "clamp(12px,1vw,40px)",
              }}
            >
              All Rights Reserved by T-HOME@2026
            </p>

            <div
              className="flex gap-8 text-4xl"
              style={{
                fontSize: "clamp(12px,1vw,40px)",
              }}
            >
              <Link
                to="/privacy-policy"
                className="hover:text-white transition"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms-and-conditions"
                className="hover:text-white transition"
              >
                Terms & Conditions
              </Link>
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;