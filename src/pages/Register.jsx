import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleAuthButton from "../components/GoogleAuthButton";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    // Always prevent default FIRST before anything else
    e.preventDefault();
    e.stopPropagation();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!form.agree) {
      alert("Please accept the Terms and Privacy Policy");
      return;
    }

    const payload = {
      name: form.fullName,
      email: form.email,
      phone: form.phone,
      password: form.password,
    };

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Registration failed");
        return;
      }

      // Save email for OTP page
      localStorage.setItem("user_email", form.email);
      navigate("/verify-otp");

    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1c3b]">
      <div className="flex w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-[#2a3d6a] bg-[#11245a]/90">
        {/* Left: Illustration */}
        <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-br from-[#1f4de2] to-[#0a1c3b] p-8">
          <img
            src="/assets/home/register-illustration.png"
            alt="Register Illustration"
            className="max-h-[520px] w-auto rounded-2xl shadow-xl"
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Right: Form */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-[#0a1c3b]">
          <div className="flex flex-col items-center mb-6">
            <img src="/assets/home/t-home-logo.png" alt="T-Home Logo" className="h-14 mb-2" />
            <h2 className="text-2xl font-bold text-white">T-HOME</h2>
            <p className="text-white/80 font-semibold text-lg mt-1">Create your account!</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="block text-white/80 mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full rounded-lg px-4 py-2 bg-[#162a4d] text-white border border-[#2a3d6a] focus:outline-none focus:ring-2 focus:ring-[#1f4de2]"
                required
              />
            </div>

            <div>
              <label className="block text-white/80 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className="w-full rounded-lg px-4 py-2 bg-[#162a4d] text-white border border-[#2a3d6a] focus:outline-none focus:ring-2 focus:ring-[#1f4de2]"
                required
              />
            </div>

            <div>
              <label className="block text-white/80 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your mobile number"
                className="w-full rounded-lg px-4 py-2 bg-[#162a4d] text-white border border-[#2a3d6a] focus:outline-none focus:ring-2 focus:ring-[#1f4de2]"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-white/80 mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                className="w-full rounded-lg px-4 py-2 bg-[#162a4d] text-white border border-[#2a3d6a] focus:outline-none focus:ring-2 focus:ring-[#1f4de2] pr-10"
                minLength={8}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-white/60"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                <span className="material-icons">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>

            <div className="relative">
              <label className="block text-white/80 mb-1">Re-Enter Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className="w-full rounded-lg px-4 py-2 bg-[#162a4d] text-white border border-[#2a3d6a] focus:outline-none focus:ring-2 focus:ring-[#1f4de2] pr-10"
                minLength={8}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-white/60"
                onClick={() => setShowConfirmPassword((v) => !v)}
                tabIndex={-1}
              >
                <span className="material-icons">
                  {showConfirmPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
                className="accent-[#1f4de2] mr-2"
              />
              <span className="text-white/70 text-sm">
                I agree to{" "}
                <Link to="/terms" className="underline text-[#7e96f0]">Terms</Link>{" "}
                and{" "}
                <Link to="/privacy-policy" className="underline text-[#7e96f0]">Privacy Policy</Link>{" "}
                and want a simple, secure registration experience.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded-lg bg-[#1f4de2] hover:bg-[#274fd6] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 text-lg shadow-md transition"
            >
              {loading ? "Please wait..." : "Continue"}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-[#2a3d6a]" />
            <span className="mx-4 text-white/60 text-sm">OR SIGNUP WITH</span>
            <div className="flex-1 h-px bg-[#2a3d6a]" />
          </div>

          <div className="flex justify-center gap-4">
            <GoogleAuthButton
  className="rounded-full bg-white/10 p-3 hover:bg-white/20 transition"
  iconOnly={true}
/>
            <button className="rounded-full bg-white/10 p-3 hover:bg-white/20 transition">
              <img src="/assets/home/facebook.svg" alt="Facebook" className="h-6 w-6" />
            </button>
            <button className="rounded-full bg-white/10 p-3 hover:bg-white/20 transition">
              <img src="/assets/home/apple.svg" alt="Apple" className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}