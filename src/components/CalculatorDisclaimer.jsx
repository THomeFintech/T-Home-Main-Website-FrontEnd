import React from "react";
import { CALCULATOR_DISCLAIMER } from "../constants/legalNotices";

/* Show directly under every calculator result (Change Document, Section 3). */
export default function CalculatorDisclaimer({ className = "" }) {
  return (
    <div className={`flex items-start gap-2 rounded-lg border border-yellow-400/20 bg-yellow-400/[0.04] px-3 py-2 ${className}`}>
      <span className="mt-0.5 text-sm text-yellow-400">⚠</span>
      <p className="text-[11px] leading-5 text-white/60 sm:text-xs">
        <span className="font-semibold text-yellow-400">Disclaimer: </span>
        {CALCULATOR_DISCLAIMER}
      </p>
    </div>
  );
}
