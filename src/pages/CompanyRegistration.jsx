import { useNavigate } from "react-router-dom";
import React from "react";
import EligibilityCriteria from "../components/EligibilityCriteria";
import FaqAccordion from "../components/FaqAccordion";
import companyRegImg from "../assets/Company Registration.png";

import SEO from "../components/SEO";
import financialServiceSchema from "../schema/financialServiceSchema";
import createBreadcrumbSchema from "../schema/breadcrumbSchema";
import RelatedServices from "../components/RelatedServices";

const companySteps = [
  {
    title: "Consult with Our Experts",
    desc: "Share your business idea to choose the right structure — Private Limited, LLP, or OPC — based on your goals.",
  },
  {
    title: "Document Collection & Verification",
    desc: "Upload PAN, Aadhaar, and address proof. Our team verifies accuracy and prepares the required legal drafts.",
  },
  {
    title: "Application Filing & MCA Approval",
    desc: "Our professionals file your incorporation application with the Ministry of Corporate Affairs (MCA) and track approval.",
  },
  {
    title: "Receive Certificate & Start Operations",
    desc: "Receive your Certificate of Incorporation along with PAN, TAN, and GST to begin operations legally.",
  },
];

const companyEligibilityItems = [
  {
    icon: "building",
    heading: "Private Limited Company",
    description:
      "Requires a minimum of 2 directors and 2 shareholders (at least one resident Indian director) with a registered office address in India.",
  },
  {
    icon: "briefcase",
    heading: "Limited Liability Partnership (LLP)",
    description:
      "Requires a minimum of 2 designated partners with zero minimum capital requirement and flexible compliance.",
  },
  {
    icon: "check",
    heading: "One Person Company (OPC)",
    description:
      "Ideal for solo founders — requires 1 Indian resident director/shareholder and 1 appointed nominee.",
  },
  {
    icon: "file",
    heading: "KYC & Registered Office Proofs",
    description:
      "PAN, Aadhaar, passport-size photos of directors/partners, plus utility bill and NOC/rent agreement for the office address.",
  },
];

export default function CompanyRegistration() {
  const navigate = useNavigate();

  const breadcrumbSchema = createBreadcrumbSchema([
    {
      name: "Home",
      url: "https://thomefintech.com/",
    },
    {
      name: "Company Registration",
      url: "https://thomefintech.com/company-registration",
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
        title="Company Registration"
        description="Register your company with T-Home Fintech through a simple, hassle-free process. Get expert guidance for Private Limited, LLP, OPC, and other business registrations."
        path="/company-registration"
        keywords="company registration, private limited company registration, LLP registration, OPC registration, startup registration"
        structuredData={[financialServiceSchema, breadcrumbSchema]}
      />

      {/* HERO */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-blue-400 text-xs mb-3 tracking-wide">
            BUSINESS SERVICES
          </p>

          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Company Registration
          </h1>

          <p className="text-gray-400 mb-6 text-sm leading-relaxed">
            Register your company with ease and compliance. We handle
            documentation, approvals, and legal formalities so you can focus on
            growing your business.
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
              <p className="text-xl font-bold text-white">Paperless</p>
              <p>Process</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">Clear</p>
              <p>Fee Disclosure</p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] overflow-hidden border border-white/20 bg-white/[0.06] backdrop-blur-2xl shadow-[0_12px_32px_rgba(5,16,38,0.45),inset_0_1px_0_rgba(255,255,255,0.14)] h-[360px]">
          <img
            src={companyRegImg}
            alt="Company Registration"
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
              desc: "Guidance from legal professionals.",
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
          How Our Registration Process Works
        </h2>
        <p className="text-center text-gray-400 text-xs mb-12">
          A seamless, end-to-end process designed to get your company registered
          quickly and correctly.
        </p>

        {/* MOBILE (vertical timeline) */}
        <div className="space-y-6 md:hidden">
          {companySteps.map((step, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                  {String(i + 1).padStart(2, "0")}
                </div>
                {i !== companySteps.length - 1 && (
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
        <div className="relative justify-between items-start hidden md:flex">
          <div className="absolute top-4 left-0 w-full h-[2px] bg-white/20"></div>
          {companySteps.map((step, i) => (
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
          title="Company Registration Eligibility & Structures"
          subtitle="Choose the right entity structure based on your founders, liability protection, and compliance goals."
          customItems={companyEligibilityItems}
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
              q: "Which company structure should I choose: Private Limited, LLP, or OPC?",
              a: "Private Limited is best for startups planning to raise funding and scale; LLP suits professional firms and partners wanting low compliance with limited liability; and OPC is ideal for solo founders seeking corporate status.",
            },
            {
              q: "What is the minimum requirement to register a Private Limited Company?",
              a: "You need at least 2 directors and 2 shareholders (the same individuals can hold both roles, with at least one director being a resident in India) and a valid registered office address in India.",
            },
            {
              q: "Which documents are required for company incorporation?",
              a: "You need PAN, Aadhaar, address proof (bank statement/utility bill), and passport photos of all directors/partners, along with a utility bill and NOC/rent agreement for the registered office.",
            },
            {
              q: "Are PAN, TAN, and Digital Signatures included in the registration process?",
              a: "Yes. Through the MCA SPICe+ integrated filing, Digital Signature Certificates (DSC), Director Identification Numbers (DIN), Certificate of Incorporation, PAN, and TAN are all processed together.",
            },
            {
              q: "What post-incorporation compliances are required after registration?",
              a: "After incorporation, you must open a company current bank account, deposit paid-up share capital, appoint an auditor within 30 days, and file commencement of business (INC-20A) and annual MCA returns.",
            },
          ]}
        />
      </div>

      {/* CTA */}
      <div className="max-w-5xl mx-auto px-6 pb-12">
        <div className="rounded-[28px] border border-white/20 bg-[linear-gradient(135deg,rgba(63,117,203,0.40),rgba(40,80,180,0.30))] backdrop-blur-2xl p-7 text-center shadow-[0_14px_40px_rgba(4,18,52,0.38),inset_0_1px_0_rgba(255,255,255,0.18)]">
          <h2 className="text-2xl font-bold mb-2">
            Ready to start your business?
          </h2>

          <p className="text-white/80 mb-6 text-sm">
            Register your company today and build your future.
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate("/contact")}
              className="bg-white text-black px-6 py-2 rounded-full text-sm"
            >
              Start Registration
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
            title: "GST Registration",
            path: "/gst-registration",
            description:
              "Register for GST to ensure legal tax compliance for your business.",
          },
          {
            title: "Udyam Registration",
            path: "/udyam-msme-registration",
            description: "Get MSME recognition and unlock government benefits.",
          },
          {
            title: "Food License",
            path: "/food-license",
            description:
              "Obtain an FSSAI license to legally operate your food business.",
          },
        ]}
      />
    </div>
  );
}
