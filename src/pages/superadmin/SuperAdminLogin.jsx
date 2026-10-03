import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";
export default function SuperAdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/super-admin/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Login failed. Please try again."
        );
      }

      if (!data.token) {
        throw new Error("Authentication token was not received.");
      }

      // Store the real JWT token
      localStorage.setItem("superadmin_token", data.token);

      // Store admin information for UI use
      if (data.admin) {
        localStorage.setItem(
          "superadmin_admin",
          JSON.stringify(data.admin)
        );
      }

      // Remove old temporary authentication flag if it exists
      localStorage.removeItem("superadmin_authenticated");

      navigate("/super-admin/dashboard");
    } catch (error) {
      console.error("Super Admin login error:", error);
      setError(error.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
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

        {/* LOGIN CARD */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-7">

          <form onSubmit={handleLogin}>

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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email"
                  className="w-full h-10 border border-slate-200 rounded-md pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  required
                />

              </div>

            </div>

            {/* PASSWORD */}
            <div className="mb-4">

              <label className="block text-[12px] font-semibold tracking-wide text-slate-500 mb-2">
                PASSWORD
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
                    x="5"
                    y="10"
                    width="14"
                    height="10"
                    rx="2"
                  />

                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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

            {/* FORGOT PASSWORD */}
            <div className="flex justify-end mb-5">

              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                onClick={() =>
                  navigate("/super-admin/forgot-password")
                }
              >
                Forgot password?
              </button>

            </div>

            {/* SIGN IN */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md text-sm font-medium shadow-sm transition"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </form>

          {/* SIGNUP */}
          <p className="text-center text-sm text-slate-500 mt-5">

            Don't have an account?{" "}

            <button
              type="button"
              onClick={() => navigate("/super-admin/signup")}
              className="text-blue-600 font-medium hover:text-blue-700 hover:underline"
            >
              Sign Up
            </button>

          </p>

        </div>

      </div>

    </div>
  );
}