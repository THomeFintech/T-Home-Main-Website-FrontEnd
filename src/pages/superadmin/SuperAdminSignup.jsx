import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export default function SuperAdminSignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/super-admin/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to create account."
        );
      }

      // Save email temporarily for OTP page
      sessionStorage.setItem(
        "superadmin_verification_email",
        formData.email.trim().toLowerCase()
      );

      // Go to OTP verification
      navigate("/super-admin/verify-otp");

    } catch (error) {
      console.error("Super Admin signup error:", error);
      setError(error.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f7fb] flex flex-col">

      {/* HEADER / BRAND */}
      <div className="pt-14 text-center">

        <div className="flex justify-center mb-3">

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

      </div>

      {/* SIGNUP CARD */}
      <div className="flex justify-center px-4 mt-7 pb-12">

        <div className="w-full max-w-[385px] bg-white rounded-xl border border-slate-200 shadow-sm p-6">

          <div className="mb-6">

            <h2 className="text-[20px] font-semibold text-slate-800">
              Create Super Admin account
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Create an account to access the admin dashboard.
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            {/* FULL NAME */}
            <div className="mb-4">

              <label className="block text-[12px] font-semibold tracking-wide text-slate-500 mb-2">
                FULL NAME
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full h-10 px-3 border border-slate-200 rounded-md bg-white text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />

            </div>

            {/* EMAIL */}
            <div className="mb-4">

              <label className="block text-[12px] font-semibold tracking-wide text-slate-500 mb-2">
                WORK EMAIL
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@thome.in"
                className="w-full h-10 px-3 border border-slate-200 rounded-md bg-white text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />

            </div>

            {/* PASSWORD */}
            <div className="mb-4">

              <label className="block text-[12px] font-semibold tracking-wide text-slate-500 mb-2">
                PASSWORD
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full h-10 px-3 border border-slate-200 rounded-md bg-white text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full h-10 px-3 border border-slate-200 rounded-md bg-white text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />

            </div>

            {/* ERROR */}
            {error && (
              <div className="mb-4 px-3 py-2 rounded-md bg-red-50 border border-red-100 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* CREATE ACCOUNT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium shadow-sm transition"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

          </form>

          {/* LOGIN LINK */}
          <div className="text-center mt-5">

            <span className="text-sm text-slate-500">
              Already have an account?{" "}
            </span>

            <button
              type="button"
              onClick={() => navigate("/super-admin")}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              Sign in
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}