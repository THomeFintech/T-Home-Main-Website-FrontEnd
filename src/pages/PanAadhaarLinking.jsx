import React from "react";
import { useNavigate } from "react-router-dom";
import EligibilityCriteria from "../components/EligibilityCriteria";
import panAadhaarLinkImg from "../assets/PAN & Aadhaar Linking.png";
import FaqAccordion from "../components/FaqAccordion";

import SEO from "../components/SEO";
import financialServiceSchema from "../schema/financialServiceSchema";
import createBreadcrumbSchema from "../schema/breadcrumbSchema";
import RelatedServices from "../components/RelatedServices";

export default function PanAadhaarLinking() {
  const navigate = useNavigate();

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "https://thomefintech.com/" },
    { name: "PAN Aadhaar Linking", url: "https://thomefintech.com/pan-aadhaar-linking" },
  ]);

  return (
    <div
      className="min-h-screen pt-24 text-slate-100 font-sans"
      style={{ background: "radial-gradient(1200px 680px at 20% -10%, rgba(90,140,255,0.18), transparent 62%), radial-gradient(980px 580px at 100% 0%, rgba(36,107,198,0.14), transparent 60%), linear-gradient(180deg, #071327 0%, #08162b 100%)" }}
    >
      <SEO
  title="PAN Aadhaar Linking"
  description="Link your PAN with Aadhaar quickly and securely with expert assistance from T-Home Fintech to stay compliant with government regulations."
  path="/pan-aadhaar-linking"
  keywords="PAN Aadhaar linking, link PAN to Aadhaar, Aadhaar PAN update"
  structuredData={[
    financialServiceSchema,
    breadcrumbSchema,
  ]}
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
            Link your PAN with Aadhaar easily to stay compliant with income tax regulations. Avoid penalties and ensure seamless financial transactions.
          </p>

          <div className="flex gap-4 mb-6">
            <button
  onClick={() => navigate("/contact")}
  className="bg-blue-600 px-6 py-2 rounded-full text-sm"
>
  Link Now
</button>
            <button className="bg-white/10 px-6 py-2 rounded-full text-sm">
              Get Help
            </button>
          </div>

          <div className="flex gap-6 text-sm text-gray-300">
            <div>
              <p className="text-xl font-bold text-white">99%</p>
              <p>Success</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">Fast</p>
              <p>Processing</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">Zero</p>
              <p>Errors</p>
            </div>
          </div>
        </div>

                <div className="rounded-[28px] overflow-hidden border border-white/20 bg-white/[0.06] backdrop-blur-2xl shadow-[0_12px_32px_rgba(5,16,38,0.45),inset_0_1px_0_rgba(255,255,255,0.14)] h-[360px]">
          <img
            src={panAadhaarLinkImg}
            alt="pan aadhaar"
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
            { title: "Secure Process", desc: "Your data is protected with encryption.", icon: "🔐" },
            { title: "Zero Hidden Fees", desc: "Transparent pricing always.", icon: "🧾" },
            { title: "Quick Linking", desc: "Instant processing and updates.", icon: "⚡" },
            { title: "Expert Support", desc: "Assistance whenever you need.", icon: "👨‍💼" }
          ].map((item, i) => (
            <div key={i} className="rounded-2xl border border-white/20 bg-white/[0.07] backdrop-blur-2xl shadow-[0_12px_32px_rgba(5,16,38,0.35),inset_0_1px_0_rgba(255,255,255,0.12)] p-4 flex flex-col gap-2.5 hover:bg-white/[0.11] transition">
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
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-center text-lg font-semibold mb-2">Simple Process</h2>
        <p className="text-center text-gray-400 text-xs mb-12">
          Getting your home loan is easier than ever
        </p>

        {/* MOBILE (vertical timeline) */}
        <div className="space-y-6 md:hidden">
          {[
            { title: "Application", desc: "Fill out the online application form with basic details." },
            { title: "Document Collection", desc: "Submit KYC, income proof, and property papers." },
            { title: "Verification", desc: "Bank verifies documents and credit score." },
            { title: "Sanction", desc: "Loan is approved with terms and conditions." },
            { title: "Disbursement", desc: "Loan amount is disbursed after agreement." }
          ].map((step, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                  {String(i + 1).padStart(2, "0")}
                </div>
                {i !== 4 && <div className="w-[2px] h-16 bg-white/20"></div>}
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

          {[
            { title: "Application", desc: "Fill out the online application form with basic details." },
            { title: "Document Collection", desc: "Submit KYC, income proof, and property papers." },
            { title: "Verification", desc: "Bank verifies documents and credit score." },
            { title: "Sanction", desc: "Loan is approved with terms and conditions." },
            { title: "Disbursement", desc: "Loan amount is disbursed after agreement." }
          ].map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center w-full">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold z-10">
                {String(i + 1).padStart(2, "0")}
              </div>

              <p className="text-blue-400 text-xs mt-4">
                STEP {String(i + 1).padStart(2, "0")}
              </p>
              <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
              <p className="text-gray-400 text-xs max-w-[140px]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>


{/* ELIGIBILITY */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <EligibilityCriteria />
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
        a: "Linking helps maintain valid tax records and identity verification compliance. Unlinked PAN cards may face restrictions in certain services.",
      },
      {
        q: "Is there a deadline for PAN-Aadhaar linking?",
        a: "Government authorities periodically announce official linking deadlines. Late linking may attract penalties or service interruptions.",
      },
      {
        q: "Can linking be completed online?",
        a: "The process is available through official government online portals. Basic identity details must match correctly in both records.",
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
