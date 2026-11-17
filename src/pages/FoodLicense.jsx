import React from "react";
import { useNavigate } from "react-router-dom";

import EligibilityCriteria from "../components/EligibilityCriteria";
import ServiceProcess from "../components/ServiceProcess";
import FaqAccordion from "../components/FaqAccordion";
import RelatedServices from "../components/RelatedServices";

import foodLicenseImg from "../assets/Food License.png";

import SEO from "../components/SEO";
import financialServiceSchema from "../schema/financialServiceSchema";
import createBreadcrumbSchema from "../schema/breadcrumbSchema";

export default function FoodLicense() {
  const navigate = useNavigate();

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "https://thomefintech.com/" },
    {
      name: "FSSAI Food License",
      url: "https://thomefintech.com/food-license",
    },
  ]);

  // Food License Process
  const processSteps = [
    {
      title: "Submit Business Details",
      desc: "Provide your business name, address, contact details and food business activities.",
    },
    {
      title: "Identify License Category",
      desc: "Determine the applicable FSSAI registration or license category based on your business activity and scale.",
    },
    {
      title: "Prepare Required Documents",
      desc: "Collect applicable identity, business registration, premises and other supporting documents.",
    },
    {
      title: "Submit Application",
      desc: "Complete the application with the required details and submit it through the authorized FSSAI portal.",
    },
    {
      title: "Track Application Status",
      desc: "Monitor your application and respond to any clarification, inspection or additional document requests.",
    },
  ];

  // Food License Eligibility
  const eligibilityItems = [
    {
      icon: "building",
      heading: "Food Business Operators",
      description:
        "Restaurants, food manufacturers, retailers, distributors, caterers and other applicable food businesses must obtain the appropriate FSSAI registration or license.",
    },
    {
      icon: "file",
      heading: "Business Documentation",
      description:
        "Applicants must provide applicable identity, business and premises-related documents according to their business category.",
    },
    {
      icon: "check",
      heading: "Applicable License Category",
      description:
        "The appropriate registration or license depends on business activities, turnover, production capacity and applicable FSSAI classification.",
    },
    {
      icon: "shield",
      heading: "Food Safety Compliance",
      description:
        "Food businesses must follow applicable food safety, hygiene, storage and regulatory requirements.",
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
        title="FSSAI Food License"
        description="Apply for your FSSAI Food License online with T-Home Fintech. Expert support and compliance guidance for food businesses."
        path="/food-license"
        keywords="FSSAI registration, food license, FSSAI license online, food business license"
        structuredData={[financialServiceSchema, breadcrumbSchema]}
      />

      {/* HERO */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-blue-400 text-xs mb-3 tracking-wide">
            FOOD SAFETY SERVICES
          </p>

          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Food License Registration
          </h1>

          <p className="text-gray-400 mb-6 text-sm leading-relaxed">
            Get your FSSAI Food License and ensure compliance with food safety
            regulations. We simplify the process so you can focus on your
            business.
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

        <div className="rounded-[28px] overflow-hidden border border-white/20 bg-white/[0.06] backdrop-blur-2xl shadow-[0_12px_32px_rgba(5,16,38,0.45),inset_0_1px_0_rgba(255,255,255,0.14)] h-[360px]">
          <img
            src={foodLicenseImg}
            alt="FSSAI Food License Registration"
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
              icon: "🍽️",
            },
            {
              title: "Clear Fee Disclosure",
              desc: "Fees are explained before you proceed.",
              icon: "🧾",
            },
            {
              title: "Streamlined Process",
              desc: "A step-by-step process, subject to government processing times.",
              icon: "⚡",
            },
            {
              title: "Expert Guidance",
              desc: "Support with applicable food business compliance requirements.",
              icon: "👨‍🍳",
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
        title="FSSAI Food License Process"
        subtitle="Follow these steps to apply for the appropriate food business registration or license."
        steps={processSteps}
      />

      {/* ELIGIBILITY */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <EligibilityCriteria
          title="FSSAI Food License Eligibility"
          subtitle="Food business registration and licensing requirements depend on the nature and scale of business operations."
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
              q: "Why is a food license important?",
              a: "FSSAI registration or licensing is required for applicable food business operators under food safety regulations. It helps businesses meet regulatory requirements and maintain food safety standards.",
            },
            {
              q: "Who needs FSSAI registration?",
              a: "Food manufacturers, restaurants, retailers, distributors, caterers and other food business operators may require registration or licensing. The applicable category depends on the nature and scale of operations.",
            },
            {
              q: "How long does food license approval take?",
              a: "Processing time depends on the application category, document verification and any inspection or clarification requirements. Government processing timelines may vary.",
            },
          ]}
        />
      </div>

      {/* CTA */}
      <div className="max-w-5xl mx-auto px-6 pb-12">
        <div className="rounded-[28px] border border-white/20 bg-[linear-gradient(135deg,rgba(63,117,203,0.40),rgba(40,80,180,0.30))] backdrop-blur-2xl p-7 text-center shadow-[0_14px_40px_rgba(4,18,52,0.38),inset_0_1px_0_rgba(255,255,255,0.18)]">
          <h2 className="text-2xl font-bold mb-2">
            Ready to get your Food License?
          </h2>

          <p className="text-white/80 mb-6 text-sm">
            Ensure compliance and grow your food business confidently.
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
            title: "Company Registration",
            path: "/company-registration",
            description:
              "Register your business before applying for operational licenses.",
          },
          {
            title: "GST Registration",
            path: "/gst-registration",
            description: "Complete your GST registration for tax compliance.",
          },
          {
            title: "ITR Filing",
            path: "/itr-filing",
            description:
              "Maintain tax compliance with timely income tax filing.",
          },
        ]}
      />
    </div>
  );
}
