import React from "react";
import { useNavigate } from "react-router-dom";

import EligibilityCriteria from "../components/EligibilityCriteria";
import ServiceProcess from "../components/ServiceProcess";
import FaqAccordion from "../components/FaqAccordion";
import RelatedServices from "../components/RelatedServices";

import itrFilingImg from "../assets/ITR Filing.png";

import SEO from "../components/SEO";
import financialServiceSchema from "../schema/financialServiceSchema";
import createBreadcrumbSchema from "../schema/breadcrumbSchema";

export default function ITRFiling() {
  const navigate = useNavigate();

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "https://thomefintech.com/" },
    {
      name: "Income Tax Return Filing",
      url: "https://thomefintech.com/itr-filing",
    },
  ]);

  // ITR Filing Process
  const processSteps = [
    {
      title: "Document Collection",
      desc: "Share your PAN, Aadhaar, Form 16, bank statements and other applicable income and tax documents.",
    },
    {
      title: "Expert Review",
      desc: "Review your income details, deductions, tax credits and applicable tax information with the filing professional.",
    },
    {
      title: "Filing and Confirmation",
      desc: "Prepare the applicable income tax return, obtain your approval and submit it through the authorized income tax portal.",
    },
    {
      title: "Verification and Updates",
      desc: "Complete the required return verification and track your filing status, processing updates and any applicable refund.",
    },
  ];

  // ITR Filing Eligibility
  const eligibilityItems = [
    {
      icon: "wallet",
      heading: "Individuals with Taxable Income",
      description:
        "Individuals whose income exceeds the applicable exemption limit may be required to file an income tax return.",
    },
    {
      icon: "briefcase",
      heading: "Salaried Professionals",
      description:
        "Salaried individuals can file returns using salary details, Form 16, tax deductions and other applicable income information.",
    },
    {
      icon: "building",
      heading: "Business Owners and Freelancers",
      description:
        "Individuals earning business or professional income may have applicable income tax return filing requirements.",
    },
    {
      icon: "file",
      heading: "Other Filing Requirements",
      description:
        "Certain individuals may need to file returns even when their income is below the basic exemption limit, depending on conditions specified under income-tax law.",
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
        title="Income Tax Return Filing"
        description="File your Income Tax Return online with T-Home Fintech. Accurate tax filing, expert guidance, and timely submission for individuals and businesses."
        path="/itr-filing"
        keywords="ITR filing, income tax return, online tax filing, tax consultant, income tax"
        structuredData={[financialServiceSchema, breadcrumbSchema]}
      />

      {/* HERO */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-blue-400 text-xs mb-3 tracking-wide">
            TAX SERVICES
          </p>

          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Accurate &amp; Guided Income Tax Filing
          </h1>

          <p className="text-gray-400 mb-6 text-sm leading-relaxed">
            Starting at ₹499 (excl. GST and government fees; applies to standard
            salaried filings). Maximise eligible deductions and file on time.
          </p>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => navigate("/contact")}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              File Now
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
              <p className="text-xl font-bold text-white">₹499</p>
              <p>Starting (excl. GST)</p>
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
            src={itrFilingImg}
            alt="Income Tax Return Filing"
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
              title: "Starting at ₹499",
              desc: "Excluding GST and government fees. Applies to standard salaried filings.",
              icon: "💰",
            },
            {
              title: "Clear Fee Disclosure",
              desc: "Fees are explained before you proceed.",
              icon: "🧾",
            },
            {
              title: "Streamlined Process",
              desc: "Guided steps to help you file on time.",
              icon: "⚡",
            },
            {
              title: "Expert Guidance",
              desc: "Get help from tax professionals.",
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
        title="ITR Filing Process"
        subtitle="Get your income tax return prepared, reviewed and filed with guided assistance."
        steps={processSteps}
      />

      {/* ELIGIBILITY */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <EligibilityCriteria
          title="ITR Filing Eligibility"
          subtitle="Filing requirements depend on income, taxpayer category and applicable income-tax provisions."
          customItems={eligibilityItems}
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
              q: "Who should file an income tax return?",
              a: "Individuals whose income exceeds the applicable exemption limit may need to file an income tax return. Other filing conditions may also apply to individuals, businesses and professionals.",
            },
            {
              q: "What documents are required for ITR filing?",
              a: "PAN card, Aadhaar, Form 16, bank statements and income-related documents are commonly required. Additional documents depend on your income sources and deductions.",
            },
            {
              q: "What happens if I file ITR after the due date?",
              a: "Late filing may result in applicable late fees, interest and other consequences under income-tax law. Certain losses may also be subject to restrictions on carry-forward.",
            },
          ]}
        />
      </div>

      {/* CTA */}
      <div className="max-w-5xl mx-auto px-6 pb-12">
        <div className="rounded-[28px] border border-white/20 bg-[linear-gradient(135deg,rgba(63,117,203,0.40),rgba(40,80,180,0.30))] backdrop-blur-2xl p-7 text-center shadow-[0_14px_40px_rgba(4,18,52,0.38),inset_0_1px_0_rgba(255,255,255,0.18)]">
          <h2 className="text-2xl font-bold mb-2">Ready to file your taxes?</h2>

          <p className="text-white/80 mb-6 text-sm">
            Get expert help and file your ITR on time.
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate("/contact")}
              className="bg-white text-black px-6 py-2 rounded-full text-sm"
            >
              Start Filing
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
            title: "GST Registration",
            path: "/gst-registration",
            description:
              "Manage GST compliance alongside your income tax obligations.",
          },
          {
            title: "PAN Aadhaar Linking",
            path: "/pan-aadhaar-linking",
            description:
              "Link your PAN and Aadhaar to avoid tax-related issues.",
          },
          {
            title: "Company Registration",
            path: "/company-registration",
            description:
              "Set up your business with a legally registered entity.",
          },
        ]}
      />
    </div>
  );
}
