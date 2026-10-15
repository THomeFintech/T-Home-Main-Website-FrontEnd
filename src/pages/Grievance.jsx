import React from "react";
import { Shield, Mail, Phone, MapPin, Clock } from "lucide-react";
import SEO from "../components/SEO";


const contactDetails = [
  {
    icon: Mail,
    label: "Email",
    value: "info@thome.co.in",
    href: "mailto:info@thome.co.in",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 70321 83836",
    href: "tel:+917032183836",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Hyderabad, Telangana",
  },
];

const serviceLevels = [
  {
    icon: Clock,
    title: "Acknowledgment",
    text: "We acknowledge your grievance within 24 hours of receiving it.",
  },
  {
    icon: Clock,
    title: "Resolution",
    text: "We aim to resolve your grievance within 15 working days.",
  },
];

export default function Grievance() {
  return (
    <div
      className="min-h-screen text-white font-['Outfit',sans-serif]"
      style={{
        background:
          "radial-gradient(1200px 680px at 20% -10%, rgba(90,140,255,0.18), transparent 62%), radial-gradient(980px 580px at 100% 0%, rgba(36,107,198,0.14), transparent 60%), linear-gradient(180deg, #071327 0%, #08162b 100%)",
      }}
    >
      <SEO
        title="Grievance Redressal"
        description="Contact the T-HOME Fintech grievance team. Find our grievance email, phone, address and response timelines."
        path="/grievance"
      />

      <div className="mx-auto max-w-[1180px] px-6 pb-20 pt-28">
        <header className="mx-auto max-w-[900px] text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#2a6bff]/35 bg-[#1b55d3]/20 px-4 py-1 text-[12px] font-medium text-[#8cb8ff]">
            <Shield size={13} />
            LEGAL CENTER
          </span>

          <h1 className="mt-4 text-[38px] font-extrabold leading-[1.05] tracking-[-0.02em] text-white sm:text-[48px] md:text-[54px]">
            Grievance Redressal
          </h1>

          <p className="mx-auto mt-7 max-w-[760px] text-[14px] leading-[1.6] text-[#d6ddf6] sm:text-[15px]">
            If you have a complaint about our services, please contact our grievance team using the
            details below.
          </p>
        </header>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* CONTACT DETAILS */}
          <section className="rounded-[14px] border border-[#2f5fbe] bg-[linear-gradient(180deg,rgba(33,87,196,0.2)_0%,rgba(17,45,112,0.14)_100%)] px-6 py-5 shadow-[0_16px_32px_rgba(0,0,0,0.22)]">
            <h2 className="mb-4 text-[22px] font-semibold text-[#d8e7ff]">Contact the Grievance Team</h2>

            <ul className="space-y-4">
              {contactDetails.map(({ icon, label, value, href }) => (
                <li key={label} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1e63ff]/25 text-[#8cb8ff]">
                    {React.createElement(icon, { size: 16 })}
                  </span>
                  <div>
                    <p className="text-[12px] uppercase tracking-wide text-[#99a6cf]">{label}</p>
                    {href ? (
                      <a href={href} className="text-[15px] text-[#d5dcf5] hover:text-white">
                        {value}
                      </a>
                    ) : (
                      <p className="text-[15px] text-[#d5dcf5]">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* SERVICE LEVELS */}
          <section className="rounded-[14px] border border-[#2f5fbe] bg-[linear-gradient(180deg,rgba(33,87,196,0.2)_0%,rgba(17,45,112,0.14)_100%)] px-6 py-5 shadow-[0_16px_32px_rgba(0,0,0,0.22)]">
            <h2 className="mb-4 text-[22px] font-semibold text-[#d8e7ff]">Our Response Timelines</h2>

            <ul className="space-y-4">
              {serviceLevels.map(({ icon, title, text }) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1e63ff]/25 text-[#8cb8ff]">
                    {React.createElement(icon, { size: 16 })}
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold text-white">{title}</p>
                    <p className="text-[14px] leading-[1.55] text-[#d5dcf5]">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}