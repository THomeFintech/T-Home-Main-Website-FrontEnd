import React from "react";
import { 
  Calendar, 
  Briefcase, 
  Wallet, 
  CreditCard
} from "lucide-react";

const eligibilityItems = [
  {
    icon: Calendar,
    heading: "Age Requirement",
    description: "Applicant must be between 21 to 65 years old at the time of loan maturity."
  },
  {
    icon: Briefcase,
    heading: "Employment Status",
    description: "Salaried professionals or self-employed individuals with stable income."
  },
  {
    icon: Wallet,
    heading: "Minimum Income",
    description: "₹25,000 net monthly income (may vary by city)."
  },
  {
    icon: CreditCard,
    heading: "Credit Score",
    description: "CIBIL score of 750+ recommended."
  }
];

export default function EligibilityCriteria({ 
  title = "Eligibility Criteria",
  subtitle = "Check if you meet our basic requirements for this loan product"
}) {
  return (
    <section className="w-full max-w-[1000px] mx-auto px-4">
      {/* Glass Effect Container with Enhanced White Morphism & Glow */}
      <div 
        className="rounded-2xl p-8"
        style={{
          background: 'rgba(255, 255, 255, 0.18)',
          backdropFilter: 'blur(32px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.35), 0 0 80px rgba(255, 255, 255, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
        }}
      >
        {/* Header Section with Increased Spacing */}
        <div className="text-center mb-10">
          <h1 
            className="text-2xl font-bold text-white mb-3"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {title}
          </h1>
          <p className="text-gray-400 text-base">
            {subtitle}
          </p>
        </div>

        {/* Free Text Format - Grid Layout with Increased Spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {eligibilityItems.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-3"
            >
              {/* Icon */}
              <div className="flex shrink-0 mt-1">
                <item.icon 
                  size={22} 
                  className="text-blue-400" 
                />
              </div>

              {/* Content with increased spacing */}
              <div>
                <h3 
                  className="font-semibold text-white text-base mb-1"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {item.heading}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
