import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthCardShell from "../components/AuthCardShell";
import { IconLockSmall } from "../components/AuthIcons";
import "../App.css";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function VerifyResetOtp() {
  const navigate = useNavigate();
  const email = localStorage.getItem("reset_email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(43);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  // No email on file (e.g. page refreshed / direct nav) -> send back to start
  useEffect(() => {
    if (!email) navigate("/forgot-password");
  }, [email, navigate]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handleResend = async () => {
    setOtp(["", "", "", "", "", ""]);
    setTimer(43);
    inputRefs.current[0]?.focus();
    try {
      await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch (error) {
      console.error("Resend error:", error);
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length < 6) {
      alert("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/verify-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpString }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "OTP verification failed");
        return;
      }

      
      navigate("/reset-password");
    } catch (error) {
      console.error("OTP verify error:", error);
      alert("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCardShell compactLogo withSideImage>
      <div className="otp-wrap">
        <h1 className="signup-title">T-HOME</h1>
        <h2 className="otp-heading">Enter OTP</h2>
        <p className="otp-sub">
          We sent a 6-digit verification code to{" "}
          <span className="otp-email">{email}</span>
          <br />
          Enter it below to reset your password
        </p>

        <div className="otp-field-label">Verification code</div>
        <div className="otp-boxes">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              className={`otp-box${digit ? " otp-box-filled" : ""}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
            />
          ))}
        </div>

        <div className="otp-timer-row">
          <span className="otp-timer-txt">Code expires in {formatTime(timer)}</span>
          <button className="txt-link otp-resend" onClick={handleResend} disabled={timer > 0}>
            Resend code
          </button>
        </div>

        <button className="btn-continue" onClick={handleVerify} disabled={loading}>
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>

        <button className="btn-back" onClick={() => navigate("/forgot-password")}>
          ← &nbsp; Back
        </button>

        <div className="otp-notice">
          <IconLockSmall />
          <span>Your verification code is encrypted and used only for this password reset.</span>
        </div>
      </div>
    </AuthCardShell>
  );
}
