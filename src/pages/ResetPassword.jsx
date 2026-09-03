import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCardShell from "../components/AuthCardShell";
import { IconLock, IconEye, IconEyeOff } from "../components/AuthIcons";
import "../App.css";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function ResetPassword() {
  const navigate = useNavigate();
  const email = localStorage.getItem("reset_email") || "";
  

  const [showPw, setShowPw] = useState(false);
  const [showRePw, setShowRePw] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
    email,
    newPassword: password,
})
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to reset password");
        return;
      }

      localStorage.removeItem("reset_email");
      

      alert("Password reset successfully. Please log in with your new password.");
      navigate("/login");
    } catch (error) {
      console.error("Reset password error:", error);
      alert("Something went wrong. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCardShell compactLogo withSideImage>
      <div className="signup-wrap">
        <h1 className="signup-title">T-HOME</h1>
        <p className="signup-headline">Reset Password</p>
        <p className="otp-sub" style={{ marginBottom: "1.5rem" }}>
          Create a new password for your account.
        </p>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <div className="field">
            <label className="field-lbl">New Password</label>
            <div className="input-box input-glass">
              <IconLock />
              <input
                className="inp inp-glass"
                type={showPw ? "text" : "password"}
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
              <button className="eye-btn" type="button" onClick={() => setShowPw((v) => !v)}>
                {showPw ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </div>

          <div className="field">
            <label className="field-lbl">Confirm Password</label>
            <div className="input-box input-glass">
              <IconLock />
              <input
                className="inp inp-glass"
                type={showRePw ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={8}
                required
              />
              <button className="eye-btn" type="button" onClick={() => setShowRePw((v) => !v)}>
                {showRePw ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-continue" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <button className="btn-back" onClick={() => navigate("/login")}>
          ← &nbsp; Back to Login
        </button>
      </div>
    </AuthCardShell>
  );
}
