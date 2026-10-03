import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";
export default function SuperAdminVerifyOTP() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem(
      "superadmin_verification_email"
    );

    if (!storedEmail) {
      navigate("/super-admin/signup", { replace: true });
      return;
    }

    setEmail(storedEmail);
  }, [navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/super-admin/auth/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "OTP verification failed."
        );
      }

      sessionStorage.removeItem(
        "superadmin_verification_email"
      );

      setMessage(
        "Email verified successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/super-admin");
      }, 1200);

    } catch (error) {
      console.error("OTP verification error:", error);
      setError(error.message || "Unable to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");

    if (!email) return;

    try {
      setResending(true);

      const response = await fetch(
        `${API_URL}/super-admin/auth/resend-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to resend OTP."
        );
      }

      setMessage("A new OTP has been sent to your email.");
      setOtp("");

    } catch (error) {
      console.error("Resend OTP error:", error);
      setError(error.message || "Unable to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

      <div className="w-full max-w-[385px]">

        {/* BRAND */}
        <div className="text-center mb-7">

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

        {/* CARD */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-7">

          <h2 className="text-[20px] font-semibold text-slate-800">
            Verify your email
          </h2>

          <p className="text-sm text-slate-500 mt-2 mb-6">
            We sent a 6-digit verification code to:
          </p>

          <p className="text-sm font-medium text-slate-700 mb-6 break-all">
            {email}
          </p>

          <form onSubmit={handleVerify}>

            <label className="block text-[12px] font-semibold tracking-wide text-slate-500 mb-2">
              VERIFICATION CODE
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setOtp(value);
                setError("");
              }}
              placeholder="Enter 6-digit OTP"
              className="w-full h-11 border border-slate-200 rounded-md px-3 text-center text-lg tracking-[0.4em] text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />

            {/* ERROR */}
            {error && (
              <div className="mt-4 px-3 py-2 rounded-md bg-red-50 border border-red-100 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* SUCCESS */}
            {message && (
              <div className="mt-4 px-3 py-2 rounded-md bg-green-50 border border-green-100 text-sm text-green-600">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 mt-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md text-sm font-medium shadow-sm transition"
            >
              {loading ? "Verifying..." : "Verify email"}
            </button>

          </form>

          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 disabled:text-blue-400"
          >
            {resending ? "Sending..." : "Resend OTP"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/super-admin")}
            className="w-full mt-4 text-sm text-slate-500 hover:text-slate-700"
          >
            Back to login
          </button>

        </div>

      </div>

    </div>
  );
}