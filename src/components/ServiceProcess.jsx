import React from "react";

export default function ServiceProcess({
  title = "Simple Process",
  subtitle,
  steps = [],
}) {
  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      <h2 className="text-center text-lg font-semibold mb-2">{title}</h2>

      <p className="text-center text-gray-400 text-xs mb-12">{subtitle}</p>

      {/* Mobile timeline */}
      <div className="space-y-6 md:hidden">
        {steps.map((step, index) => (
          <div key={step.title} className="flex gap-4 items-start">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                {String(index + 1).padStart(2, "0")}
              </div>

              {index !== steps.length - 1 && (
                <div className="w-[2px] h-16 bg-white/20" />
              )}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 w-full hover:bg-white/10 transition">
              <p className="text-blue-400 text-xs mb-1">
                STEP {String(index + 1).padStart(2, "0")}
              </p>

              <h4 className="font-semibold text-sm mb-1">{step.title}</h4>

              <p className="text-gray-400 text-xs leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop timeline */}
      <div className="relative hidden md:flex justify-between items-start gap-3">
        <div className="absolute top-4 left-0 w-full h-[2px] bg-white/20" />

        {steps.map((step, index) => (
          <div
            key={step.title}
            className="relative flex flex-col items-center text-center flex-1"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold z-10">
              {String(index + 1).padStart(2, "0")}
            </div>

            <p className="text-blue-400 text-xs mt-4">
              STEP {String(index + 1).padStart(2, "0")}
            </p>

            <h4 className="font-semibold text-sm mb-1">{step.title}</h4>

            <p className="text-gray-400 text-xs max-w-[160px]">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
