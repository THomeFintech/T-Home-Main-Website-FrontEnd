import React from "react";
import { useNavigate } from "react-router-dom";

import EligibilityCriteria from "../components/EligibilityCriteria";
import ServiceProcess from "../components/ServiceProcess";
import FaqAccordion from "../components/FaqAccordion";
import RelatedServices from "../components/RelatedServices";

import panAadhaarLinkImg from "../assets/PAN & Aadhaar Linking.png";

import SEO from "../components/SEO";
import financialServiceSchema from "../schema/financialServiceSchema";
import createBreadcrumbSchema from "../schema/breadcrumbSchema";

export default function PanAadhaarLinking() {
  const navigate = useNavigate();

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "https://thomefintech.com/" },
    {
      name: "PAN Aadhaar Linking",
      url: "https://thomefintech.com/pan-aadhaar-linking",
    },
  ]);

  // PAN-Aadhaar Linking Process
  const processSteps = [
    {
      title: "Enter PAN and Aadhaar Details",
      desc: "Provide your PAN number, Aadhaar number and required personal details.",
    },
    {
      title: "Check Your Linking Status",
      desc: "Check whether your PAN and Aadhaar are already linked through the official Income Tax portal.",
    },
    {
      title: "Complete Applicable Payment",
      desc: "If a late fee is applicable, complete the payment through the authorized government portal.",
    },
    {
      title: "Submit Linking Request",
      desc: "Enter the required details, submit your linking request and complete Aadhaar OTP verification when prompted.",
    },
    {
      title: "Verify Linking Status",
      desc: "Check the official portal again to confirm whether your PAN-Aadhaar linking request has been processed.",
    },
  ];

  // PAN-Aadhaar Eligibility
  const eligibilityItems = [
    {
      icon: "file",
      heading: "Valid PAN",
      description:
        "Individuals holding a PAN should check whether Aadhaar linking is applicable to them under current income-tax rules.",
    },
    {
      icon: "check",
      heading: "Valid Aadhaar",
      description:
        "Eligible individuals should have a valid Aadhaar number issued by UIDAI.",
    },
    {
      icon: "shield",
      heading: "Applicable Exemptions",
      description:
        "Certain categories of individuals may be exempt from mandatory PAN-Aadhaar linking under applicable government rules.",
    },
    {
      icon: "calendar",
      heading: "Compliance Requirements",
      description:
        "Check applicable deadlines, fees and linking requirements through the official Income Tax Department portal.",
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
      {/* SEO */}
      <SEO
        title="PAN Aadhaar Linking"
        description="Link your PAN with Aadhaar with expert assistance from T-Home Fintech to stay compliant with government regulations."
        path="/pan-aadhaar-linking"
        keywords="PAN Aadhaar linking, link PAN to Aadhaar, Aadhaar PAN update"
        structuredData={[financialServiceSchema, breadcrumbSchema]}
      />

      {/* HERO */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-blue-400 text-xs mb-3 tracking-wide">
            TAX COMPLIANCE
          </p>

          <h1 className="text-5xl font-bold mb-4 leading-tight">
            PAN & Aadhaar Linking
          </h1>

          <p className="text-gray-400 mb-6 text-sm leading-relaxed">
            Link your PAN with Aadhaar to stay compliant with income tax
            regulations and avoid penalties, with guided support.
          </p>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => navigate("/contact")}
              className="bg-blue-600 px-6 py-2 rounded-full text-sm"
            >
              Link Now
            </button>

            <button
              onClick={() => navigate("/contact")}
              className="bg-white/10 px-6 py-2 rounded-full text-sm"
            >
              Get Help
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

        <div className="rounded-[28px] overflow-hidden border border-white/20 bg-white/[0.06] backdrop-blur-2xl shadow-[0_12px_32px_rgba(5,16,38,0.45),inset_0_1px_0_rgba(255,255,255,0.14)] h-[360px]">
          <img
            src={panAadhaarLinkImg}
            alt="PAN and Aadhaar Linking"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* WHY CHOOSE */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-center text-lg font-semibold mb-10">
          Why Choose T-Home?
        </h2>

        <div className="grid md:grid-cols-4 gap-4">
          {[
            {
              title: "Consent-Based Data Handling",
              desc: "Your information is shared only with your consent.",
              icon: "🔐",
            },
            {
              title: "Clear Fee Disclosure",
              desc: "Fees are explained before you proceed.",
              icon: "🧾",
            },
            {
              title: "Streamlined Process",
              desc: "Guided steps for linking your PAN with Aadhaar.",
              icon: "⚡",
            },
            {
              title: "Expert Support",
              desc: "Assistance whenever you need.",
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

      {/* PROCESS */}
      <ServiceProcess
        title="PAN-Aadhaar Linking Process"
        subtitle="Follow these steps to check and complete your PAN-Aadhaar linking."
        steps={processSteps}
      />

      {/* ELIGIBILITY */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <EligibilityCriteria
          title="PAN-Aadhaar Linking Eligibility"
          subtitle="Eligibility and exemptions are governed by applicable income-tax rules."
          customItems={eligibilityItems}
        />
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="text-center text-lg font-semibold mb-6">
          Frequently Asked Questions
        </h2>

        <FaqAccordion
          items={[
            {
              q: "Why should PAN be linked with Aadhaar?",
              a: "Linking helps maintain valid tax records and identity verification compliance. An inoperative PAN may face restrictions under applicable income-tax rules.",
            },
            {
              q: "Is there a deadline for PAN-Aadhaar linking?",
              a: "The applicable deadline and late fee depend on current government rules. Check the official Income Tax Department portal for the latest requirements.",
            },
            {
              q: "Can linking be completed online?",
              a: "Yes. Eligible individuals can use the official Income Tax Department e-filing portal to submit their PAN-Aadhaar linking request.",
            },
          ]}
        />
      </div>

      {/* CTA */}
      <div className="max-w-5xl mx-auto px-6 pb-12">
        <div className="rounded-[28px] border border-white/20 bg-[linear-gradient(135deg,rgba(63,117,203,0.40),rgba(40,80,180,0.30))] backdrop-blur-2xl p-7 text-center shadow-[0_14px_40px_rgba(4,18,52,0.38),inset_0_1px_0_rgba(255,255,255,0.18)]">
          <h2 className="text-2xl font-bold mb-2">
            Ready to link your PAN & Aadhaar?
          </h2>

          <p className="text-white/80 mb-6 text-sm">
            Complete your compliance in minutes with expert assistance.
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

      {/* RELATED SERVICES */}
      <RelatedServices
        services={[
          {
            title: "ITR Filing",
            path: "/itr-filing",
            description:
              "Ensure smooth tax filing by keeping your PAN and Aadhaar linked.",
          },
          {
            title: "GST Registration",
            path: "/gst-registration",
            description:
              "Stay compliant with GST regulations for your business.",
          },
          {
            title: "Company Registration",
            path: "/company-registration",
            description:
              "Begin your entrepreneurial journey with a legally registered business.",
          },
        ]}
      />
    </div>
  );
}
