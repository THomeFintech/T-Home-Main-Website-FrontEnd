import React, { useState } from "react";
import { Link } from "react-router-dom";

function Footer() {

  /* ================= STATE ================= */
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_URL;

  /* ================= SUBSCRIBE ================= */
  const handleSubscribe = async () => {

    if (!email) {
      setMsg("❌ Please enter email");
      return;
    }

    try {
      setLoading(true);
      setMsg("");

      console.log("📩 Sending:", email);

      const res = await fetch(`${BASE_URL}/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      console.log("✅ Response:", data);

      if (data.status === "success") {
        setMsg("✅ Subscribed successfully!");
        setEmail("");
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
        <div className="grid gap-8 md:grid-cols-[1.25fr_0.8fr_0.9fr_0.9fr_1.6fr]">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3">
              <img src="/home/logo.png" className="h-10 w-10" alt="T-HOME logo" />
              <h2 className="text-4xl font-semibold text-white">T-HOME</h2>
            </div>

            <p className="mt-4 max-w-[290px] text-[30px] leading-[1.5] text-[#aebad4]" style={{ fontSize: "clamp(15px,0.82vw,30px)" }}>
              T-HOME provides innovative and reliable financial solutions for your home needs.
              We combine technology, trust, and expertise to simplify your financial journey.
            </p>

            <div className="mt-4 flex gap-3">
            <a href="https://www.instagram.com/thomefintech/" target="_blank" rel="noopener noreferrer">
            <img src="/home/instagram icon.png" className="h-6 w-6 cursor-pointer" alt="Instagram" />
            </a>
              <a href="https://www.facebook.com/share/17bB3HmT2u/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
                <img src="/home/facebook icon.png" className="h-6 w-6 cursor-pointer" alt="Facebook" />
              </a>
              <a href="https://www.linkedin.com/company/thomefintech" target="_blank" rel="noopener noreferrer">
            <img src="/home/linkedin con.png" className="h-6 w-6 cursor-pointer" alt="LinkedIn" />
          </a>
              </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-4xl font-semibold text-white" style={{ fontSize: "clamp(20px,1.08vw,40px)" }}>Quick Links</h3>
            <ul className="space-y-2 text-[29px] text-[#b4c2de]" style={{ fontSize: "clamp(14px,0.8vw,29px)" }}>
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/career" className="hover:text-white transition">Careers</Link></li>
              <li><Link to="/collaborate" className="hover:text-white transition">Collaborate</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-3 text-4xl font-semibold text-white" style={{ fontSize: "clamp(20px,1.08vw,40px)" }}>Services</h3>
            <ul className="space-y-2 text-[29px] text-[#b4c2de]" style={{ fontSize: "clamp(14px,0.8vw,29px)" }}>
              <li><Link to="/tools?tool=loan-prediction" className="hover:text-white transition">Home Loans</Link></li>
              <li><Link to="/tools?tool=loan-prediction" className="hover:text-white transition">Loan Against Property</Link></li>
              <li><Link to="/itr-filing" className="hover:text-white transition">Income Tax Filing</Link></li>
              <li><Link to="/company-registration" className="hover:text-white transition">Business Registration</Link></li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="mb-3 text-4xl font-semibold text-white" style={{ fontSize: "clamp(20px,1.08vw,40px)" }}>Tools</h3>
            <ul className="space-y-2 text-[29px] text-[#b4c2de]" style={{ fontSize: "clamp(14px,0.8vw,29px)" }}>
              <li><Link to="/tools" className="hover:text-white transition">EMI Calculator</Link></li>
              <li><Link to="/tools" className="hover:text-white transition">Loan Prediction System</Link></li>
              <li><Link to="/balance-transfer" className="hover:text-white transition">Balance Transfer</Link></li>
              <li><Link to="/tools" className="hover:text-white transition">Calculator</Link></li>
            </ul>
          </div>

          {/* Subscribe */}
          <div>
            <h3 className="mb-2 text-4xl font-semibold text-white" style={{ fontSize: "clamp(20px,1.08vw,40px)" }}>Subscribe to Updates</h3>
            <p className="mb-3 max-w-[430px] text-[27px] leading-[1.45] text-[#aebad4]" style={{ fontSize: "clamp(13px,0.74vw,27px)" }}>
              Subscribe to receive updates and financial tips directly to your inbox.
            </p>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-[10px] border border-[#2f466f] bg-[#1a2c4f] px-4 py-3 text-white placeholder:text-[#93a6ca] outline-none focus:border-[#3b78ff]"
            />

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="mt-3 w-full rounded-[10px] bg-[#2b67f0] py-3 text-sm font-semibold text-white transition hover:bg-[#3472ff] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Submitting..." : "SUBSCRIBE NOW"}
            </button>

            {msg && (
              <p className="mt-2 text-sm text-[#b8d0ff]">
                {msg}
              </p>
            )}

            <p className="mt-3 text-xs text-[#8ea1c7]">
              © We respect your privacy and never share your email.
            </p>
          </div>
        </div>

        <div className="mt-5 border-t border-[#5a6588]/60 pt-4">
          <div className="flex flex-col items-start justify-between gap-3 text-[#dde6ff] md:flex-row md:items-center">
            <p className="text-4xl font-semibold" style={{ fontSize: "clamp(19px,1vw,40px)" }}>All Rights Reserved by T-HOME@2026</p>
            <div className="flex gap-8 text-4xl font-semibold" style={{ fontSize: "clamp(19px,1vw,40px)" }}>
              <Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
              <Link to="/terms-and-conditions" className="hover:text-white transition">Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
