import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthCardShell from "../components/AuthCardShell";
import { IconMail } from "../components/AuthIcons";
import TurnstileWidget from "../components/TurnstileWidget";
import "../App.css";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!turnstileToken) {
      alert("Please complete the security verification challenge.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({ email, turnstileToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to send reset code");
        turnstileRef.current?.reset();
        setTurnstileToken("");
        return;
      }

      // Carry email forward to the OTP screen
      localStorage.setItem("reset_email", email);
      navigate("/verify-reset-otp");
    } catch (error) {
      console.error("Forgot password error:", error);
      alert("Something went wrong. Please check your connection and try again.");
      turnstileRef.current?.reset();
      setTurnstileToken("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCardShell compactLogo withSideImage>
      <div className="signup-wrap">
        <h1 className="signup-title">T-HOME</h1>
        <p className="signup-headline">Forgot Password?</p>
        <p className="otp-sub" style={{ marginBottom: "1.5rem" }}>
          Enter the email linked to your account and we&apos;ll send you a 6-digit code to reset your password.
        </p>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <div className="field">
            <label className="field-lbl">Email</label>
            <div className="input-box">
              <IconMail />
              <input
                className="inp"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <TurnstileWidget
            ref={turnstileRef}
            onSuccess={setTurnstileToken}
            onExpire={() => setTurnstileToken("")}
            action="forgot_password"
          />

          <button type="submit" className="btn-continue" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Code"}
          </button>
        </form>

        <button className="btn-back" onClick={() => navigate("/login")}>
          ← &nbsp; Back to Login
        </button>
      </div>
    </AuthCardShell>
  );
}
