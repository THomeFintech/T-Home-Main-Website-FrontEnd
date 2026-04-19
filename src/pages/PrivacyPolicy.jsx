import React from "react";
import { Mail, MapPin, ShieldCheck } from "lucide-react";

const dataCards = [
  {
    title: "Identity Data",
    points: [
      "First name, middle name (if applicable), and last name",
      "Username or unique user identifier",
      "Title (Mr./Ms./Mrs.), date of birth, and gender",
    ],
  },
  {
    title: "Contact Data",
    points: [
      "Residential address and communication address",
      "Email address",
      "Mobile number / contact numbers",
    ],
  },
  {
    title: "Financial Data",
    points: [
      "Payment-related information for transactions",
      "T-Home does not store full debit or credit card details",
      "All sensitive card data is securely handled by trusted third-party gateways",
    ],
  },
  {
    title: "Technical Data",
    points: [
      "Internet Protocol (IP) address",
      "Login details, browser type/version, and time zone",
      "Device information, operating system, and location data",
    ],
  },
];

const usageRows = [
  {
    activity: "To register you as a new customer",
    dataType: "(a) Identity, (b) Contact",
    lawfulBasis: "Performance of a contract with you",
  },
  {
    activity: "To process and deliver your service request",
    dataType: "(a) Identity, (b) Contact, (c) Financial, (d) Transaction",
    lawfulBasis: "Performance of a contract with you",
  },
  {
    activity: "To manage our relationship with you",
    dataType: "(a) Identity, (b) Contact, (c) Profile",
    lawfulBasis: "Necessary to comply with legal obligations",
  },
];

export default function PrivacyPolicy() {
  return (
    <div
      className="min-h-screen text-white font-['Outfit',sans-serif]"
      style={{
        background: "linear-gradient(269.67deg, #000000 0.26%, #1E2447 49.98%, #000000 99.69%)",
      }}
    >
      <div className="mx-auto max-w-[1180px] px-6 pb-20 pt-28">
        <header className="mx-auto max-w-[820px] text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#2a6bff]/35 bg-[#1b55d3]/20 px-4 py-1 text-[12px] font-medium text-[#8cb8ff]">
            <ShieldCheck size={13} />
            Policy Update 2.4
          </span>

          <h1 className="mt-4 text-[40px] font-extrabold leading-[1.05] tracking-[-0.02em] text-white sm:text-[52px]">
            Privacy Policy
          </h1>

          <p className="mx-auto mt-4 max-w-[760px] text-[15px] leading-[1.55] text-[#d6ddf6] sm:text-[16px]">
            At T-Home, we believe transparency is essential to building trust. This document explains how we collect,
            use, and protect your personal and financial information when you use our platform and services.
          </p>

          <p className="mt-4 text-[14px] text-[#99a6cf]">Last Updated: February 15, 2026</p>
        </header>

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="mb-3 flex items-center gap-3 text-[28px] font-bold text-white sm:text-[32px]">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1e63ff] text-[18px]">1</span>
              Introduction
            </h2>
            <p className="max-w-[1080px] text-[15px] leading-[1.6] text-[#d5dcf5] sm:text-[16px]">
              Welcome to the T-Home Privacy Policy. We respect your privacy and are committed to protecting your
              personal and financial data. This policy explains how we collect, use, and safeguard your information when
              you access our website or mobile application, regardless of your location. It also outlines your privacy
              rights and how applicable laws protect you.
            </p>
            <p className="mt-2 max-w-[1080px] text-[15px] leading-[1.6] text-[#d5dcf5] sm:text-[16px]">
              This Privacy Policy is presented in a structured format, allowing you to easily navigate through specific
              sections. You may also refer to the Glossary to better understand certain terms used in this policy.
            </p>
          </section>

          <section>
            <h2 className="mb-3 flex items-center gap-3 text-[28px] font-bold text-white sm:text-[32px]">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1e63ff] text-[18px]">2</span>
              Data We Collect
            </h2>

            <div className="rounded-[14px] border border-[#2f5fbe] bg-[linear-gradient(180deg,rgba(33,87,196,0.28)_0%,rgba(17,45,112,0.2)_100%)] px-5 py-4">
              <h3 className="text-[16px] font-semibold text-[#d8e7ff]">Key Takeaway</h3>
              <p className="mt-1 text-[14px] leading-[1.55] text-[#cedbfb] sm:text-[15px]">
                We collect only the information required to provide secure and efficient financial services on the
                T-Home platform. We do not sell your personal or financial data to advertisers or any third parties.
              </p>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {dataCards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-[14px] border border-[#7f8eb4]/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.03)_100%)] px-5 py-5"
                >
                  <h3 className="text-[22px] font-semibold text-white">{card.title}</h3>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-[14px] leading-[1.5] text-[#c8d4f1] sm:text-[15px]">
                    {card.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 flex items-center gap-3 text-[28px] font-bold text-white sm:text-[32px]">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1e63ff] text-[18px]">3</span>
              How We Use Your Data
            </h2>

            <div className="overflow-hidden rounded-[12px] border border-[#8a97bc]/50">
              <div className="grid grid-cols-3 bg-[#d9deea] px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#2b3247] sm:text-[12px]">
                <div>Purpose/Activity</div>
                <div>Type of Data</div>
                <div>Lawful Basis</div>
              </div>
              {usageRows.map((row, idx) => (
                <div
                  key={row.activity}
                  className={`grid grid-cols-3 px-4 py-3 text-[12px] text-[#1f2740] sm:text-[13px] ${idx % 2 === 0 ? "bg-[#f0f2f7]" : "bg-[#e4e8f1]"}`}
                >
                  <div>{row.activity}</div>
                  <div>{row.dataType}</div>
                  <div>{row.lawfulBasis}</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 flex items-center gap-3 text-[28px] font-bold text-white sm:text-[32px]">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1e63ff] text-[18px]">4</span>
              Third-Party Sharing
            </h2>

            <div className="rounded-[14px] border border-[#7f8eb4]/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.03)_100%)] px-5 py-5">
              <p className="text-[14px] leading-[1.6] text-[#d2dbf5] sm:text-[15px]">
                We may share your personal and financial data with the parties listed below for the purposes described
                in the relevant sections of this policy, such as service delivery, verification, and regulatory
                compliance.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[8px] border border-[#dce4f7]/25 bg-[#f2f5fb] px-4 py-2 text-center text-[13px] font-medium text-[#26304a]">
                  Delivery Partners
                </div>
                <div className="rounded-[8px] border border-[#dce4f7]/25 bg-[#f2f5fb] px-4 py-2 text-center text-[13px] font-medium text-[#26304a]">
                  Payment Processors
                </div>
                <div className="rounded-[8px] border border-[#dce4f7]/25 bg-[#f2f5fb] px-4 py-2 text-center text-[13px] font-medium text-[#26304a]">
                  Analytics Providers
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-[720px] rounded-[16px] border border-[#3a6be4]/60 bg-[linear-gradient(180deg,#2e66ec_0%,#2357d5_100%)] p-7 shadow-[0_18px_44px_rgba(14,41,111,0.55)]">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-[28px] font-bold leading-tight text-white">Have questions about your data?</h3>
                <p className="mt-2 max-w-[430px] text-[14px] leading-[1.5] text-[#deebff] sm:text-[15px]">
                  Our dedicated Data Protection Officer (DPO) is available to assist you in understanding your privacy
                  rights and how your personal and financial information is collected, used, and protected on the T-Home
                  platform.
                </p>

                <div className="mt-5 space-y-2 text-[13px] text-[#e8f0ff] sm:text-[14px]">
                  <div className="flex items-center gap-2">
                    <Mail size={15} />
                    privacy@thome.com
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={15} />
                    privacy@thome.com
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                <button
                  type="button"
                  className="w-full rounded-[10px] border border-white/40 bg-white/15 px-7 py-3 text-[13px] font-semibold text-white backdrop-blur-md transition hover:bg-white/20 md:w-auto"
                >
                  Contact DPO
                </button>
                <p className="mt-2 text-center text-[11px] text-[#d4e3ff]">Response Time: Usually within 24 hours</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
