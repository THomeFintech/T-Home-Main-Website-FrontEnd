import React from "react";
import { Shield } from "lucide-react";

const sections = [
  {
    number: 1,
    title: "User Agreement",
    paragraphs: [
      "By creating an account or using the T-Home platform (\"Platform\"), you confirm that you are at least 18 years old or have obtained consent from a legal parent or guardian. You also confirm that you are fully capable of entering into financial agreements, including all terms, conditions, representations, and obligations outlined on the platform.",
      "T-Home acts as a digital financial services platform that connects users (\"Users\") with banks, NBFCs, and financial institutions (\"Partners\") for loan and financial product services. T-Home does not directly provide loans but facilitates the application, verification, and approval process through its trusted partners.",
    ],
  },
  {
    number: 2,
    title: "Account Responsibility",
    paragraphs: [
      "You are responsible for maintaining the confidentiality of your account credentials, including your password and OTPs. You agree to accept responsibility for all activities that occur under your account. T-Home reserves the right to refuse service, suspend or terminate accounts, restrict access, or cancel applications at its sole discretion.",
    ],
    bullets: [
      "You must provide accurate, complete, and up-to-date information during registration and loan application processes.",
      "You must not use the Platform for any illegal, fraudulent, or unauthorized financial activities.",
      "You agree not to access or use the Platform through automated means (such as bots, scripts, or scraping tools).",
    ],
  },
  {
    number: 3,
    title: "Ordering & Payments",
    paragraphs: [
      "Interest rates, processing fees, and other charges displayed on the T-Home platform are determined by our partner banks, NBFCs, or financial institutions. These charges are subject to change without prior notice.",
    ],
    callout: {
      title: "Payment Security",
      content: [
        "All payments and transactions on the T-Home platform are processed through secure and trusted third-party payment gateways. T-Home does not store your complete debit or credit card details.",
        "Refunds or reversals (if applicable) are handled on a case-by-case basis, depending on the nature of the transaction. If you face any issues (such as failed transactions, incorrect deductions, or payment-related concerns), please contact our customer support team promptly for assistance.",
      ],
    },
  },
  {
    number: 4,
    title: "Intellectual Property",
    paragraphs: [
      "The T-Home platform and all materials available on or through it, including but not limited to software, design elements, text, graphics, logos, trademarks, service marks, images, videos, and all related Intellectual Property Rights, are the exclusive property of T-Home and its licensors.",
      "Except as explicitly permitted, nothing in these Terms grants you any rights or licenses to use such Intellectual Property. You agree not to copy, reproduce, modify, distribute, transmit, display, perform, publish, sell, license, or create derivative works from any content or materials available on the T-Home platform without prior written permission.",
    ],
  },
  {
    number: 5,
    title: "Limitation of Liability",
    paragraphs: [
      "To the maximum extent permitted under applicable law, T-Home, its affiliates, partners, directors, employees, agents, or licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages. This includes, without limitation, loss of profits, financial losses, loss of data, goodwill, or any other intangible losses arising out of or related to the use of, or inability to use, the platform or services.",
      "T-Home assumes no liability or responsibility for any (i) errors, inaccuracies, or omissions in the content available on the platform; (ii) any financial loss, personal loss, or damages resulting from your access to or use of our services; and (iii) any unauthorized access to or use of our secure servers and/or any personal or financial information stored therein.",
    ],
  },
  {
    number: 6,
    title: "Governing Law",
    paragraphs: [
      "These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or relating to these Terms shall be subject to the jurisdiction of the courts in [Your City/State].",
      "Our failure to enforce any right or provision of these Terms shall not be considered a waiver of those rights.",
    ],
  },
];

export default function TermsAndConditions() {
  return (
    <div
      className="min-h-screen text-white font-['Outfit',sans-serif]"
      style={{
        background: "linear-gradient(269.67deg, #000000 0.26%, #1E2447 49.98%, #000000 99.69%)",
      }}
    >
      <div className="mx-auto max-w-[1180px] px-6 pb-20 pt-28">
        <header className="mx-auto max-w-[900px] text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#2a6bff]/35 bg-[#1b55d3]/20 px-4 py-1 text-[12px] font-medium text-[#8cb8ff]">
            <Shield size={13} />
            LEGAL CENTER
          </span>

          <h1 className="mt-4 text-[38px] font-extrabold leading-[1.05] tracking-[-0.02em] text-white sm:text-[48px] md:text-[54px]">
            Terms & Conditions
          </h1>

          <p className="mt-4 text-[14px] text-[#99a6cf]">Last Updated: February 15, 2026</p>

          <p className="mx-auto mt-7 max-w-[1080px] text-[14px] leading-[1.6] text-[#d6ddf6] sm:text-[15px]">
            Welcome to T-Home. Your privacy is important to us. This Privacy Policy explains how we collect, use, and
            protect your personal information when you use our website, mobile app, or financial services.
          </p>
        </header>

        <div className="mt-10 space-y-7">
          {sections.map((section) => (
            <section key={section.number}>
              <h2 className="mb-3 flex items-center gap-3 text-[26px] font-bold text-white sm:text-[30px]">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1e63ff] text-[18px]">
                  {section.number}
                </span>
                {section.title}
              </h2>

              <div className="space-y-2">
                {section.paragraphs.map((text) => (
                  <p key={text} className="max-w-[1100px] text-[14px] leading-[1.58] text-[#d5dcf5] sm:text-[15px]">
                    {text}
                  </p>
                ))}
              </div>

              {section.bullets && (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] leading-[1.58] text-[#d5dcf5] sm:text-[15px]">
                  {section.bullets.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              )}

              {section.callout && (
                <div className="mt-4 rounded-[14px] border border-[#2f5fbe] bg-[linear-gradient(180deg,rgba(33,87,196,0.2)_0%,rgba(17,45,112,0.14)_100%)] px-5 py-4 shadow-[0_16px_32px_rgba(0,0,0,0.22)]">
                  <h3 className="text-[19px] font-semibold text-[#d8e7ff]">{section.callout.title}</h3>
                  <div className="mt-1 space-y-2">
                    {section.callout.content.map((contentText) => (
                      <p key={contentText} className="text-[13px] leading-[1.55] text-[#cedbfb] sm:text-[14px]">
                        {contentText}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
