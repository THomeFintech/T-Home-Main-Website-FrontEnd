import React from "react";
import { useNavigate } from "react-router-dom";
import EligibilityCriteria from "../components/EligibilityCriteria";
import FaqAccordion from "../components/FaqAccordion";
import gstRegistrationImg from "../assets/GST Services.png";

import SEO from "../components/SEO";
import financialServiceSchema from "../schema/financialServiceSchema";
import createBreadcrumbSchema from "../schema/breadcrumbSchema";
import RelatedServices from "../components/RelatedServices";

const gstEligibilityItems = [
  {
    icon: "wallet",
    heading: "Turnover Threshold",
    description:
      "Mandatory for businesses with aggregate annual turnover exceeding ₹40 lakh (goods) or ₹20 lakh (services) in most states.",
  },
  {
    icon: "building",
    heading: "Inter-State & E-Commerce",
    description:
      "Required for businesses making inter-state taxable supplies or selling goods/services through e-commerce operators.",
  },
  {
    icon: "file",
    heading: "Required Business Documents",
    description:
      "PAN of business/applicant, Aadhaar, proof of business place, bank account statement/cancelled cheque, and incorporation proof.",
  },
  {
    icon: "check",
    heading: "Voluntary Registration",
    description:
      "Businesses below the threshold can register voluntarily to claim Input Tax Credit (ITC) and issue GST-compliant invoices.",
  },
];

export default function GSTRegistration() {
  const navigate = useNavigate();

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "https://thomefintech.com/" },
    {
      name: "GST Registration",
      url: "https://thomefintech.com/gst-registration",
    },
  ]);

  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const updateViewport = () => setIsDesktop(window.innerWidth >= 768);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const steps = [
    {
      title: "Submit Your Details",
      desc: "Fill out a quick online form with your business and contact information to start your GST registration.",
    },
    {
      title: "Upload Required Documents",
      desc: "Share essential documents like PAN, Aadhaar, business address proof, and bank details for expert verification.",
    },
    {
      title: "Expert Filing",
      desc: "Our tax professionals prepare and file your GST application (REG-01) with the GST portal for faster approval.",
    },
    {
      title: "Receive Your GSTIN",
      desc: "Once approved, your GST Registration Certificate (REG-06) and GSTIN are issued and ready for invoicing and returns.",
    },
  ];

  return (
    <div
      className="min-h-screen pt-24 text-slate-100 font-sans"
      style={{
        background:
          "radial-gradient(1200px 680px at 20% -10%, rgba(90,140,255,0.18), transparent 62%), radial-gradient(980px 580px at 100% 0%, rgba(36,107,198,0.14), transparent 60%), linear-gradient(180deg, #071327 0%, #08162b 100%)",
      }}
    >
      <SEO
        title="GST Registration"
        description="Get your GST Registration with T-Home Fintech. Expert assistance for new GST registration, amendments, and GST compliance."
        path="/gst-registration"
        keywords="GST registration, online GST registration, GST certificate, GST consultant, GST filing"
        structuredData={[financialServiceSchema, breadcrumbSchema]}
      />

      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-blue-400 text-xs mb-3 tracking-wide">
            TAX SERVICES
          </p>
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            GST Registration &amp; Filing
          </h1>
          <p className="text-gray-400 mb-6 text-sm leading-relaxed">
            Register your business under GST and handle filings with ease. Stay
            compliant, reduce errors, and manage taxes efficiently with expert
            assistance.
          </p>
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => navigate("/contact")}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Apply Now
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300"
            >
              Get Assistance
            </button>
          </div>
          <div className="flex gap-6 text-sm text-gray-300">
            <div>
              <p className="text-xl font-bold text-white">Streamlined</p>
              <p>Process</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">Assisted</p>
              <p>Documentation</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">Clear</p>
              <p>Fee Disclosure</p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] overflow-hidden border border-white/20 bg-white/[0.06] backdrop-blur-2xl shadow-[0_12px_32px_rgba(5,16,38,0.45),inset_0_1px_0_rgba(255,255,255,0.14)] h-[340px]">
          <img
            src={gstRegistrationImg}
            alt="GST Registration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-center text-3xl font-bold mb-10 text-white">
          Why Choose T-Home?
        </h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            {
              title: "Assisted Documentation",
              desc: "Help preparing and submitting your documents.",
              icon: "💼",
            },
            {
              title: "Clear Fee Disclosure",
              desc: "Fees are explained before you proceed.",
              icon: "🧾",
            },
            {
              title: "Streamlined Process",
              desc: "Processing time depends on the service type and applicable government or third-party procedures.",
              icon: "⚡",
            },
            {
              title: "Expert Assistance",
              desc: "Professional tax guidance.",
              icon: "👨‍💼",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/20 bg-white/[0.07] backdrop-blur-2xl shadow-[0_12px_32px_rgba(5,16,38,0.35),inset_0_1px_0_rgba(255,255,255,0.12)] p-4 flex flex-col gap-2.5 hover:bg-white/[0.11] transition"
            >
              <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-600/20 text-base">
                {item.icon}
              </div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-gray-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS (4 STEPS) */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <p className="text-center text-blue-400 text-xs uppercase tracking-wider mb-1">
          How It Works
        </p>
        <h2 className="text-center text-3xl font-bold mb-3 text-white">
          Easy 4-Step Process to Get GST Ready
        </h2>
        <p className="text-center text-gray-400 text-xs mb-12">
          From registration to filing, we handle it all so you can focus on your
          business.
        </p>

        {isDesktop ? (
          <div className="relative flex justify-between items-start">
            <div className="absolute top-4 left-0 w-full h-[2px] bg-white/20"></div>
            {steps.map((step, i) => (
              <div
                key={i}
                className="relative flex flex-col items-center text-center w-full px-2"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold z-10">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <p className="text-blue-400 text-xs mt-4">
                  STEP {String(i + 1).padStart(2, "0")}
                </p>
                <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
                <p className="text-gray-400 text-xs max-w-[185px]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  {i !== steps.length - 1 && (
                    <div className="w-[2px] h-16 bg-white/20"></div>
                  )}
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 w-full hover:bg-white/10 transition">
                  <p className="text-blue-400 text-xs mb-1">
                    STEP {String(i + 1).padStart(2, "0")}
                  </p>
                  <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
                  <p className="text-gray-400 text-xs">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ELIGIBILITY */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <EligibilityCriteria
          title="GST Registration Eligibility & Requirements"
          subtitle="Applicability under the Goods and Services Tax Act based on annual turnover, business model, and inter-state operations."
          customItems={gstEligibilityItems}
        />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="text-center text-3xl font-bold mb-10 text-white">
          Frequently Asked Questions
        </h2>
        <FaqAccordion
          items={[
            {
              q: "When is GST Registration mandatory for a business?",
              a: "GST registration is mandatory if your aggregate annual turnover exceeds ₹40 lakh for goods or ₹20 lakh for services (₹20 lakh / ₹10 lakh in special category states), or if you sell inter-state or via e-commerce platforms.",
            },
            {
              q: "What documents are needed for GST Registration?",
              a: "You need the PAN and Aadhaar of the proprietor/directors, business incorporation/partnership proof, passport-size photo, bank account proof (cancelled cheque/statement), and principal place of business proof with NOC.",
            },
            {
              q: "Can a small business register for GST voluntarily?",
              a: "Yes. Voluntary GST registration allows businesses below the turnover threshold to claim Input Tax Credit (ITC) on purchases, issue tax invoices, and work seamlessly with B2B clients.",
            },
            {
              q: "How long does it take to receive a GSTIN after applying?",
              a: "With Aadhaar authentication enabled and complete documentation, the GSTIN and Registration Certificate (REG-06) are typically issued within 3 to 7 working days.",
            },
            {
              q: "What compliances apply after getting GST Registration?",
              a: "Once registered, you must issue GST-compliant invoices and file periodic returns (such as GSTR-1 and GSTR-3B monthly or quarterly under QRMP), even if there are zero transactions (Nil return).",
            },
          ]}
        />
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-12">
        <div className="rounded-[28px] border border-white/20 bg-[linear-gradient(135deg,rgba(63,117,203,0.40),rgba(40,80,180,0.30))] backdrop-blur-2xl p-7 text-center shadow-[0_14px_40px_rgba(4,18,52,0.38),inset_0_1px_0_rgba(255,255,255,0.18)]">
          <h2 className="text-2xl font-bold mb-2">
            Ready to register your GST?
          </h2>
          <p className="text-white/80 mb-6 text-sm">
            Get started today and stay compliant with ease.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate("/contact")}
              className="bg-white text-black px-6 py-2 rounded-full text-sm"
            >
              Start Now
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="border border-white px-6 py-2 rounded-full text-sm"
            >
              Talk to Expert
            </button>
          </div>
        </div>
      </div>

      <RelatedServices
        services={[
          {
            title: "Company Registration",
            path: "/company-registration",
            description:
              "Start your business with the right legal entity registration.",
          },
          {
            title: "ITR Filing",
            path: "/itr-filing",
            description:
              "Stay compliant by filing your income tax returns accurately.",
          },
          {
            title: "Udyam Registration",
            path: "/udyam-msme-registration",
            description: "Register your MSME to access government incentives.",
          },
        ]}
      />
    </div>
  );
}
