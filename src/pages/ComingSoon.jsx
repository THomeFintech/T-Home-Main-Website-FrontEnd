import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock3, Sparkles } from "lucide-react";

export default function ComingSoon() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen overflow-hidden px-4 pb-10 pt-28 font-['Outfit',sans-serif] sm:px-6 md:pt-32 lg:px-8">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,#1E2447_0%,#000000_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(132,172,237,0.72),transparent_60%)] opacity-70" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_30%,rgba(255,255,255,0.01))]" />

      {/* Floating glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/20 blur-[120px]" />

      <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center">
        <div className="w-full max-w-3xl rounded-[32px] border border-white/10 bg-white/5 p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-10 md:p-14">
          {/* Badge */}
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-blue-100 backdrop-blur-md">
            <Sparkles size={16} className="text-blue-300" />
            New feature in progress
          </div>

          {/* Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/10 shadow-[0_0_30px_rgba(96,165,250,0.25)]">
            <Clock3 className="h-10 w-10 text-blue-300" />
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
            Coming Soon
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base md:text-lg">
            We’re working on something exciting for you. This page will be available
            soon with the same seamless T-Home experience.
          </p>

          {/* Info cards */}
          <div className="mt-10 flex justify-center">
            <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-lg">
              <p className="text-base font-semibold text-blue-200">Launching Soon</p>
              <p className="mt-3 text-sm leading-6 text-white/60">
                We’re currently finalizing this module for release. Stay tuned!
              </p>
            </div>
          </div>
          {/* Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/15"
            >
              <ArrowLeft size={16} />
              Go Back
            </button>

            <button
              onClick={() => navigate("/")}
              className="rounded-full bg-gradient-to-r from-[#3e8fee] to-[#2869df] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_34px_rgba(46,113,218,0.45)] transition hover:scale-[1.02]"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}