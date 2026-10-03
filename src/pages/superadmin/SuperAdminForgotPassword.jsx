import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export default function SuperAdminForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // SEND RESET OTP
  // ==========================================

  const handleSendOTP = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/super-admin/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to send reset OTP. Please try again."
        );
      }

      setMessage(
        data?.message ||
          "If an account exists with this email, a reset OTP has been sent."
      );

      setStep(2);
    } catch (error) {
      console.error("Forgot password error:", error);

      setError(
        error.message ||
          "Unable to process password reset request."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // VERIFY RESET OTP
  // ==========================================

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    if (otp.trim().length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/super-admin/auth/verify-reset-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            otp: otp.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Invalid or expired OTP."
        );
      }

      setMessage(
        data?.message ||
          "OTP verified successfully."
      );

      setStep(3);
    } catch (error) {
      console.error("OTP verification error:", error);

      setError(
        error.message ||
          "Unable to verify OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RESET PASSWORD
  // ==========================================

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!newPassword || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/super-admin/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            otp: otp.trim(),
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to reset password."
        );
      }

      setMessage(
        data?.message ||
          "Password reset successfully."
      );

      // Clear password fields
      setNewPassword("");
      setConfirmPassword("");

      // Show success for a moment, then go to login
      setTimeout(() => {
        navigate("/super-admin");
      }, 1500);
    } catch (error) {
      console.error("Password reset error:", error);

      setError(
        error.message ||
          "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GO BACK
  // ==========================================

  const handleBackToLogin = () => {
    navigate("/super-admin");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

      <div className="w-full max-w-[385px]">

        {/* BRANDING */}
        <div className="text-center mb-7">

          <div className="pt-10 text-center">

            <div className="flex justify-center mb-4">
              <img
                src="/apple-touch-icon.png"
                alt="T-HOME Fintech"
                className="w-[72px] h-[72px] object-contain"
              />
            </div>

            <h1 className="text-[20px] font-semibold text-slate-800">
              T-Home <span className="font-normal">Fintech</span>
            </h1>

            <p className="text-sm text-slate-400 mt-1">
              Internal operations console
            </p>

          </div>

        </div>

        {/* CARD */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-7">

          {/* ======================================
              STEP 1 - EMAIL
          ====================================== */}

          {step === 1 && (
            <form onSubmit={handleSendOTP}>

              <h2 className="text-xl font-semibold text-slate-800 mb-2">
                Forgot Password?
              </h2>

              <p className="text-sm text-slate-500 mb-6">
                Enter your registered work email and
                we will send you a password reset OTP.
              </p>

              {/* EMAIL */}

              <div className="mb-5">

                <label className="block text-[12px] font-semibold tracking-wide text-slate-500 mb-2">
                  WORK EMAIL
                </label>

                <div className="relative">

                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="2"
                    />

                    <path d="m3 7 9 6 9-6" />
                  </svg>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="Enter your work email"
                    className="w-full h-10 border border-slate-200 rounded-md pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                    required
                  />

                </div>

              </div>

              {/* ERROR */}

              {error && (
                <div className="mb-4 px-3 py-2 rounded-md bg-red-50 border border-red-100 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* SEND OTP */}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md text-sm font-medium shadow-sm transition"
              >
                {loading
                  ? "Sending OTP..."
                  : "Send OTP"}
              </button>

              {/* BACK */}

              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                Back to Login
              </button>

            </form>
          )}

          {/* ======================================
              STEP 2 - OTP
          ====================================== */}

          {step === 2 && (
            <form onSubmit={handleVerifyOTP}>

              <h2 className="text-xl font-semibold text-slate-800 mb-2">
                Verify OTP
              </h2>

              <p className="text-sm text-slate-500 mb-2">
                Enter the 6-digit OTP sent to:
              </p>

              <p className="text-sm font-medium text-slate-700 mb-6 break-all">
                {email}
              </p>

              {/* OTP */}

              <div className="mb-5">

                <label className="block text-[12px] font-semibold tracking-wide text-slate-500 mb-2">
                  OTP
                </label>

                <input
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOtp(
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6)
                    )
                  }
                  placeholder="Enter 6-digit OTP"
                  inputMode="numeric"
                  maxLength={6}
                  className="w-full h-10 border border-slate-200 rounded-md px-3 text-sm text-slate-700 text-center tracking-[0.4em] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  required
                />

              </div>

              {/* MESSAGE */}

              {message && (
                <div className="mb-4 px-3 py-2 rounded-md bg-green-50 border border-green-100 text-sm text-green-600">
                  {message}
                </div>
              )}

              {/* ERROR */}

              {error && (
                <div className="mb-4 px-3 py-2 rounded-md bg-red-50 border border-red-100 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* VERIFY */}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md text-sm font-medium shadow-sm transition"
              >
                {loading
                  ? "Verifying..."
                  : "Verify OTP"}
              </button>

              {/* CHANGE EMAIL */}

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtp("");
                  setError("");
                  setMessage("");
                }}
                className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                Change Email
              </button>

            </form>
          )}

          {/* ======================================
              STEP 3 - NEW PASSWORD
          ====================================== */}

          {step === 3 && (
            <form onSubmit={handleResetPassword}>

              <h2 className="text-xl font-semibold text-slate-800 mb-2">
                Create New Password
              </h2>

              <p className="text-sm text-slate-500 mb-6">
                Create a new password for your Super
                Admin account.
              </p>

              {/* NEW PASSWORD */}

              <div className="mb-4">

                <label className="block text-[12px] font-semibold tracking-wide text-slate-500 mb-2">
                  NEW PASSWORD
                </label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  placeholder="Enter new password"
                  className="w-full h-10 border border-slate-200 rounded-md px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  required
                />

              </div>

              {/* CONFIRM PASSWORD */}

              <div className="mb-5">

                <label className="block text-[12px] font-semibold tracking-wide text-slate-500 mb-2">
                  CONFIRM PASSWORD
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Confirm new password"
                  className="w-full h-10 border border-slate-200 rounded-md px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  required
                />

              </div>

              {/* MESSAGE */}

              {message && (
                <div className="mb-4 px-3 py-2 rounded-md bg-green-50 border border-green-100 text-sm text-green-600">
                  {message}
                </div>
              )}

              {/* ERROR */}

              {error && (
                <div className="mb-4 px-3 py-2 rounded-md bg-red-50 border border-red-100 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* RESET */}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md text-sm font-medium shadow-sm transition"
              >
                {loading
                  ? "Resetting Password..."
                  : "Reset Password"}
              </button>

            </form>
          )}

        </div>

      </div>

    </div>
  );
}