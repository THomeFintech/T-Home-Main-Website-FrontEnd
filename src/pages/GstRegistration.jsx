import React from "react";
import { useNavigate } from "react-router-dom";
import EligibilityCriteria from "../components/EligibilityCriteria";
import FaqAccordion from "../components/FaqAccordion";
import gstRegistrationImg from "../assets/GST Services.png";

import SEO from "../components/SEO";
import financialServiceSchema from "../schema/financialServiceSchema";
import createBreadcrumbSchema from "../schema/breadcrumbSchema";
import RelatedServices from "../components/RelatedServices";


export default function GSTRegistration() {
  const navigate = useNavigate();

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "https://thomefintech.com/" },
    { name: "GST Registration", url: "https://thomefintech.com/gst-registration" },
  ]);

  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const updateViewport = () => setIsDesktop(window.innerWidth >= 768);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const steps = [
    { title: "Application", desc: "Fill out the online application form with basic details." },
    { title: "Document Collection", desc: "Submit KYC, income proof, and business papers." },
    { title: "Verification", desc: "Authorities verify documents and business details." },
    { title: "Registration", desc: "GST number is issued after approval." },
    { title: "Filing", desc: "Continue periodic filings to stay compliant." },
  ];

  return (
    <div className="min-h-screen pt-24 text-slate-100 font-sans" style={{ background: "radial-gradient(1200px 680px at 20% -10%, rgba(90,140,255,0.18), transparent 62%), radial-gradient(980px 580px at 100% 0%, rgba(36,107,198,0.14), transparent 60%), linear-gradient(180deg, #071327 0%, #08162b 100%)" }}>
      <SEO
  title="GST Registration"
  description="Get your GST Registration completed quickly with T-Home Fintech. Expert assistance for new GST registration, amendments, and GST compliance."
  path="/gst-registration"
  keywords="GST registration, online GST registration, GST certificate, GST consultant, GST filing"
  structuredData={[
    financialServiceSchema,
    breadcrumbSchema,
  ]}
/>
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-blue-400 text-xs mb-3 tracking-wide">TAX SERVICES</p>
          <h1 className="text-5xl font-bold mb-4 leading-tight">GST Registration & Filing</h1>
          <p className="text-gray-400 mb-6 text-sm leading-relaxed">Register your business under GST and handle filings with ease. Stay compliant, reduce errors, and manage taxes efficiently with expert assistance.</p>
          <div className="flex gap-4 mb-6">
            <button onClick={() => navigate("/contact")} className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">Apply Now</button>
            <button className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300">Get Assistance</button>
          </div>
          <div className="flex gap-6 text-sm text-gray-300">
            <div><p className="text-xl font-bold text-white">100%</p><p>Compliance</p></div>
            <div><p className="text-xl font-bold text-white">Fast</p><p>Processing</p></div>
            <div><p className="text-xl font-bold text-white">Zero</p><p>Errors</p></div>
          </div>
        </div>

        <div className="rounded-[28px] overflow-hidden border border-white/20 bg-white/[0.06] backdrop-blur-2xl shadow-[0_12px_32px_rgba(5,16,38,0.45),inset_0_1px_0_rgba(255,255,255,0.14)] h-[340px]"><img src={gstRegistrationImg} alt="gst registration" className="w-full h-full object-cover" /></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-center text-3xl font-bold mb-10 text-white">Why Choose T-Home?</h1>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { title: "Lowest Pricing", desc: "Affordable GST registration packages.", icon: "💼" },
            { title: "Zero Hidden Fees", desc: "Transparent pricing with no surprises.", icon: "🧾" },
            { title: "Quick Processing", desc: "Fast approvals and filings.", icon: "⚡" },
            { title: "Expert Assistance", desc: "Professional tax guidance.", icon: "👨‍💼" },
          ].map((item, i) => (
            <div key={i} className="rounded-2xl border border-white/20 bg-white/[0.07] backdrop-blur-2xl shadow-[0_12px_32px_rgba(5,16,38,0.35),inset_0_1px_0_rgba(255,255,255,0.12)] p-4 flex flex-col gap-2.5 hover:bg-white/[0.11] transition">
              <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-600/20 text-base">{item.icon}</div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-gray-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-center text-3xl font-bold mb-10 text-white">Simple Process</h1>
        <p className="text-center text-gray-400 text-xs mb-12">Getting GST set up is easier than ever</p>

        {isDesktop ? (
          <div className="relative flex justify-between items-start">
            <div className="absolute top-4 left-0 w-full h-[2px] bg-white/20"></div>
            {steps.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center w-full">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">{String(i + 1).padStart(2, "0")}</div>
                <p className="text-blue-400 text-xs mt-4">STEP {String(i + 1).padStart(2, "0")}</p>
                <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
                <p className="text-gray-400 text-xs max-w-[140px]">{step.desc}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="flex flex-col items-center"><div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">{String(i + 1).padStart(2, "0")}</div>{i !== 4 && <div className="w-[2px] h-16 bg-white/20"></div>}</div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 w-full hover:bg-white/10 transition"><p className="text-blue-400 text-xs mb-1">STEP {String(i + 1).padStart(2, "0")}</p><h4 className="font-semibold text-sm mb-1">{step.title}</h4><p className="text-gray-400 text-xs">{step.desc}</p></div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10"><EligibilityCriteria /></div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-center text-3xl font-bold mb-10 text-white">Frequently Asked Questions</h1>
        <FaqAccordion items={[{ q: "Is GST mandatory for all businesses?", a: "GST is mandatory based on turnover and the nature of the business. Many businesses must register once they cross the threshold or fall under specific categories." }, { q: "Can I register online?", a: "Yes. GST registration can be completed online through the official GST portal with documents like PAN, address proof, and bank account details." }]} />
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-12">
        <div className="rounded-[28px] border border-white/20 bg-[linear-gradient(135deg,rgba(63,117,203,0.40),rgba(40,80,180,0.30))] backdrop-blur-2xl p-7 text-center shadow-[0_14px_40px_rgba(4,18,52,0.38),inset_0_1px_0_rgba(255,255,255,0.18)]">
          <h2 className="text-2xl font-bold mb-2">Ready to register your GST?</h2>
          <p className="text-white/80 mb-6 text-sm">Get started today and stay compliant with ease.</p>
          <div className="flex justify-center gap-4">
            <button onClick={() => navigate("/contact")} className="bg-white text-black px-6 py-2 rounded-full text-sm">Start Now</button>
            <button onClick={() => navigate("/contact")} className="border border-white px-6 py-2 rounded-full text-sm">Talk to Expert</button>
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
      path: "/udyam-registration",
      description:
        "Register your MSME to access government incentives.",
    },
  ]}
/>
    </div>
  );
}