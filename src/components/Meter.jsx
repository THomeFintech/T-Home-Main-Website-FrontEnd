import React, { useMemo } from "react";

export default function ConfidenceGauge({ result, loading = false }) {

  /* =========================
     🔥 EXTRACT FROM BACKEND
  ========================= */
  const probabilityRaw = Number(result?.approval_probability ?? 0);

  // convert 0–1 → %
  const confidence =
    probabilityRaw <= 1
      ? probabilityRaw * 100
      : probabilityRaw;

  /* =========================
     🔥 SAFE VALUE
  ========================= */
  const safeConfidence = useMemo(() => {
    const num = Number(confidence);
    if (!Number.isFinite(num)) return 0;
    return Math.min(100, Math.max(0, Math.round(num)));
  }, [confidence]);

  /* =========================
     🔥 NEEDLE ANGLE
  ========================= */
  const needleAngle = useMemo(() => {
    return -90 + (safeConfidence / 100) * 180;
  }, [safeConfidence]);

  const needleRotation = `rotate(${needleAngle} 150 150)`;

  /* =========================
     🔥 STATUS LOGIC
  ========================= */
  const status = useMemo(() => {
    if (safeConfidence < 30) {
      return {
        text: "POOR",
        color: "#ef4444",
        tag: "LOW ELIGIBILITY",
        badgeClass: "border-red-400 text-red-400 bg-red-400/10",
      };
    }

    if (safeConfidence < 60) {
      return {
        text: "FAIR",
        color: "#f59e0b",
        tag: "AVERAGE",
        badgeClass: "border-amber-400 text-amber-400 bg-amber-400/10",
      };
    }

    if (safeConfidence < 80) {
      return {
        text: "GOOD",
        color: "#22c55e",
        tag: "ELIGIBLE",
        badgeClass: "border-green-400 text-green-400 bg-green-400/10",
      };
    }

    return {
      text: "EXCELLENT",
      color: "#16a34a",
      tag: "HIGHLY ELIGIBLE",
      badgeClass: "border-emerald-400 text-emerald-400 bg-emerald-400/10",
    };
  }, [safeConfidence]);

  /* =========================
     🔥 LOADING STATE
  ========================= */
  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        <p className="mt-4 text-sm text-white/70">
          Calculating eligibility...
        </p>
      </div>
    );
  }

  /* =========================
     🔥 EMPTY STATE
  ========================= */
  if (!result || !result.decision) {
    return (
      <div className="text-white text-center">
        <p className="text-white/60">
          Submit details to see eligibility
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center px-4 py-4">

      <h2 className="text-xl md:text-2xl font-semibold text-white mb-5">
        Eligibility Status
      </h2>

      <div className="relative w-[260px] md:w-[320px] lg:w-[360px]">
        <svg viewBox="0 0 300 200" className="w-full h-auto">

          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="30%" stopColor="#f59e0b" />
              <stop offset="60%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>

          <path
            d="M 50 150 A 100 100 0 0 1 250 150"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="18"
            strokeLinecap="round"
          />

          <path
            d="M 50 150 A 100 100 0 0 1 250 150"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="18"
            strokeLinecap="round"
          />

          <g
            transform={needleRotation}
            style={{ transition: "transform 0.8s ease-in-out" }}
          >
            <line
              x1="150"
              y1="150"
              x2="150"
              y2="65"
              stroke="#e5e7eb"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <polygon points="150,52 144,68 156,68" fill="#e5e7eb" />
          </g>

          <circle cx="150" cy="150" r="8" fill="#e5e7eb" />
          <circle cx="150" cy="150" r="4" fill="#94a3b8" />

        </svg>
      </div>

      <div className="mt-5">
        <div
          className="text-4xl md:text-5xl font-bold"
          style={{ color: status.color }}
        >
          {safeConfidence}%
        </div>

        <div
          className="text-lg md:text-xl font-semibold mt-1"
          style={{ color: status.color }}
        >
          {status.text}
        </div>

        <div className="mt-3">
          <span
            className={`inline-block px-4 py-1.5 rounded-full border text-sm font-medium ${status.badgeClass}`}
          >
            ● {status.tag}
          </span>
        </div>
      </div>

    </div>
  );
}