import React from "react";
import { useNavigate } from "react-router-dom";
import EligibilityCriteria from "../components/EligibilityCriteria";
import UdyamImage from "../assets/UDYAM.png";
import FaqAccordion from "../components/FaqAccordion";

import SEO from "../components/SEO";
import financialServiceSchema from "../schema/financialServiceSchema";
import createBreadcrumbSchema from "../schema/breadcrumbSchema";
import RelatedServices from "../components/RelatedServices";

const udyamSteps = [
  {
    title: "Business Information Submission",
    desc: "Fill in your business name, type, and contact details. Ensure PAN and Aadhaar are correct for a smooth start.",
  },
  {
    title: "Document Upload",
    desc: "Upload Aadhaar, PAN, bank details, and business address proof securely for verification.",
  },
  {
    title: "Verification & Approval",
    desc: "Our experts review your application and notify you of any issues before approval.",
  },
  {
    title: "Certificate Delivery",
    desc: "Receive your official digital Udyam Certificate and access MSME benefits.",
  },
];

const msmeEligibilityItems = [
  {
    icon: "building",
    heading: "Micro Enterprise",
    description:
      "Investment in plant & machinery or equipment up to ₹1 crore and annual turnover not exceeding ₹5 crore.",
  },
  {
    icon: "briefcase",
    heading: "Small Enterprise",
    description:
      "Investment in plant & machinery or equipment up to ₹10 crore and annual turnover not exceeding ₹50 crore.",
  },
  {
    icon: "wallet",
    heading: "Medium Enterprise",
    description:
      "Investment in plant & machinery or equipment up to ₹50 crore and annual turnover not exceeding ₹250 crore.",
  },
  {
    icon: "file",
    heading: "Eligible Entities & Documents",
    description:
      "Proprietorships, Partnerships, LLPs, and Companies with valid Aadhaar, PAN, GSTIN (if applicable), and bank details.",
  },
];

export default function UdyamMSMERegistration() {
  const navigate = useNavigate();

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "https://thomefintech.com/" },
    {
      name: "Udyam MSME Registration",
      url: "https://thomefintech.com/udyam-msme-registration",
    },
  ]);

  return (
    <div
      className="min-h-screen pt-24 text-slate-100 font-sans"
      style={{
        background:
          "radial-gradient(1200px 680px at 20% -10%, rgba(90,140,255,0.18), transparent 62%), radial-gradient(980px 580px at 100% 0%, rgba(36,107,198,0.14), transparent 60%), linear-gradient(180deg, #071327 0%, #08162b 100%)",
      }}
    >
      <SEO
        title="Udyam MSME Registration"
        description="Register your business under Udyam MSME with T-Home Fintech. Unlock government benefits, subsidies, and business growth opportunities."
        path="/udyam-msme-registration"
        keywords="Udyam registration, MSME registration, MSME certificate, small business registration"
        structuredData={[financialServiceSchema, breadcrumbSchema]}
      />

      {/* HERO */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-blue-400 text-xs mb-3 tracking-wide">
            GOVERNMENT REGISTRATION
          </p>

          <h1 className="text-5xl font-bold mb-4 leading-tight">
            UDYAM / MSME Registration
          </h1>

          <p className="text-gray-400 mb-6 text-sm leading-relaxed">
            Register your business under Udyam (MSME) and unlock benefits like
            subsidies, tax advantages, and easier access to credit. We handle
            the complete process seamlessly.
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

          <div className="flex gap-10 text-sm text-gray-300">
            <div>
              <p className="text-xl font-bold text-white">Streamlined</p>
              <p>Registration</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">Easy</p>
              <p>Process</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">Clear</p>
              <p>Fee Disclosure</p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] overflow-hidden border border-white/20 bg-white/[0.06] backdrop-blur-2xl shadow-[0_12px_32px_rgba(5,16,38,0.45),inset_0_1px_0_rgba(255,255,255,0.14)] h-[340px]">
          <img
            src={UdyamImage}
            alt="Udyam MSME Registration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* WHY CHOOSE */}
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
              title: "Expert Support",
              desc: "Guidance from professionals.",
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
          How to Register for Udyam in 4 Simple Steps
        </h2>
        <p className="text-center text-gray-400 text-xs mb-12">
          Our streamlined process makes your registration quick and hassle-free.
        </p>

        {/* MOBILE (vertical timeline) */}
        <div className="space-y-6 md:hidden">
          {udyamSteps.map((step, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                  {String(i + 1).padStart(2, "0")}
                </div>
                {i !== udyamSteps.length - 1 && (
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

        {/* DESKTOP (horizontal timeline) */}
        <div className="relative hidden items-start justify-between md:flex">
          <div className="absolute top-4 left-0 w-full h-[2px] bg-white/20"></div>

          {udyamSteps.map((step, i) => (
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
              <p className="text-gray-400 text-xs max-w-[185px]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ELIGIBILITY */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <EligibilityCriteria
          title="MSME Classification & Eligibility"
          subtitle="Businesses are classified under Udyam based on composite criteria of investment in plant & machinery/equipment and annual turnover."
          customItems={msmeEligibilityItems}
        />
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="text-center text-3xl font-bold mb-10 text-white">
          Frequently Asked Questions
        </h2>

        <FaqAccordion
          items={[
            {
              q: "What is Udyam MSME Registration?",
              a: "Udyam Registration is the official Government of India certification for Micro, Small, and Medium Enterprises, providing a permanent registration number and a dynamic QR-coded Udyam Certificate.",
            },
            {
              q: "Who is eligible to apply for Udyam Registration?",
              a: "Proprietorships, Partnership Firms, LLPs, Private Limited Companies, and Cooperative Societies engaged in manufacturing or service activities within prescribed investment and turnover limits are eligible.",
            },
            {
              q: "Is Aadhaar and PAN mandatory for Udyam Registration?",
              a: "Yes, the Aadhaar number of the proprietor, managing partner, or authorized signatory—along with the business PAN and GSTIN (where applicable)—is required for online verification.",
            },
            {
              q: "What key benefits do MSMEs get after Udyam Registration?",
              a: "Registered MSMEs gain access to collateral-free bank loans under CGTMSE, lower interest rates, protection against delayed buyer payments, government tender preferences, and subsidy schemes.",
            },
            {
              q: "Does the Udyam Registration Certificate ever expire?",
              a: "No, Udyam Registration has lifetime validity and does not require renewal, though enterprise details are automatically updated annually via linked PAN and GST records.",
            },
          ]}
        />
      </div>

      {/* CTA */}
      <div className="max-w-5xl mx-auto px-6 pb-12">
        <div className="rounded-[28px] border border-white/20 bg-[linear-gradient(135deg,rgba(63,117,203,0.40),rgba(40,80,180,0.30))] backdrop-blur-2xl p-7 text-center shadow-[0_14px_40px_rgba(4,18,52,0.38),inset_0_1px_0_rgba(255,255,255,0.18)]">
          <h2 className="text-2xl font-bold mb-2">
            Ready to register your MSME?
          </h2>

          <p className="text-white/80 mb-6 text-sm">
            Get recognized and unlock government benefits today.
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
              "Complete your business registration before applying for MSME benefits.",
          },
          {
            title: "GST Registration",
            path: "/gst-registration",
            description:
              "Fulfill GST requirements for your registered business.",
          },
          {
            title: "Food License",
            path: "/food-license",
            description:
              "Apply for an FSSAI license if your business operates in the food sector.",
          },
        ]}
      />
    </div>
  );
}
