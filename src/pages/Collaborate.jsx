import { useState, useRef } from "react";

// Icons using SVG inline
const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21h18M3 10.5V21m18-10.5V21M3 10.5L12 3l9 7.5M9 21v-6h6v6" />
  </svg>
);
const BriefcaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
  </svg>
);
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const RocketIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.819m2.562-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
  </svg>
);
const TrendingUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);
const TargetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const BoltIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
const HeadsetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 18v-6a9 9 0 0118 0v6M3 18a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H5a2 2 0 00-2 2v3zm16 0a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h1a2 2 0 012 2v3z" />
  </svg>
);
const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CollaboratePage = () => {
  const formRef = useRef(null);

  const [form, setForm] = useState({
    fullName: "",
    companyName: "",
    partnerType: "",
    experience: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    alert("Application submitted!");
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden text-white"
      style={{
        background: "linear-gradient(269.67deg, #000000 0.26%, #1E2447 49.98%, #000000 99.69%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[440px] w-[980px] -translate-x-1/2 rounded-full bg-[#2f73ff]/20 blur-[140px]" />
        <div className="absolute bottom-[18%] left-[8%] h-[300px] w-[300px] rounded-full bg-[#4f84ff]/14 blur-[120px]" />
        <div className="absolute bottom-[22%] right-[8%] h-[280px] w-[280px] rounded-full bg-[#315cc9]/12 blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_45%,transparent_76%)]" />
      </div>

      <div className="relative z-10">

        {/* ─── HERO SECTION ─── */}
        <section
          className="relative flex flex-col items-center justify-center px-6 py-28 text-center"
          style={{ background: "linear-gradient(180deg, #0e2244 0%, #0a1628 100%)" }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(100,160,255,0.3) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
          <h1 className="relative mb-4 text-4xl font-bold leading-tight md:text-5xl">
            Partner with <span className="text-blue-400">T-Home</span> to Grow Together
          </h1>
          <p className="relative mb-8 max-w-xl text-base text-gray-300">
            Join our network of financial experts, institutions, and partners to deliver smarter, faster, and more accessible financial solutions.
          </p>
          <div className="relative flex flex-wrap justify-center gap-4">
            <button
              onClick={scrollToForm}
              className="rounded-full bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
            >
              Become A Partner
            </button>
            <button
              onClick={scrollToForm}
              className="rounded-full border border-gray-500 px-6 py-3 font-semibold text-white transition hover:border-gray-300"
            >
              Talk to Us
            </button>
          </div>
        </section>

        {/* ─── WHO CAN COLLABORATE ─── */}
        <section className="px-6 py-20 text-center">
          <h2 className="mb-2 text-3xl font-bold md:text-4xl">Who Can Collaborate</h2>
          <p className="mb-12 text-sm text-blue-400">
            Our platform is designed for a diverse ecosystem of financial professionals.
          </p>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <BuildingIcon />,
                title: "Financial Institutions",
                desc: "Banks and credit unions looking to expand their reach and digitize lending.",
              },
              {
                icon: <BriefcaseIcon />,
                title: "Loan Agents & Brokers-(DSA's)",
                desc: "Professionals seeking access to better rates, fast approvals, and verified leads.",
              },
              {
                icon: <UserIcon />,
                title: "Freelancers",
                desc: "Independent advisors referring clients and earning top-tier commissions.",
              },
              {
                icon: <RocketIcon />,
                title: "Startups",
                desc: "Fintech innovators looking to integrate our embedded finance API solutions.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 text-left"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
                }}
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-blue-400"
                  style={{
                    background: "rgba(59,130,246,0.15)",
                    border: "1px solid rgba(59,130,246,0.25)",
                  }}
                >
                  {card.icon}
                </div>
                <h3 className="mb-2 text-base font-semibold">{card.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── WHY PARTNER WITH US ─── */}
        <section className="px-6 py-20 text-center" style={{ background: "rgba(0,0,0,0.25)" }}>
          <h2 className="mb-2 text-3xl font-bold md:text-4xl">Why Partner With Us</h2>
          <p className="mb-14 text-sm text-gray-400">
            We provide the tools, support, and financial incentives to help you succeed.
          </p>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <TrendingUpIcon />,
                title: "High Commission",
                desc: "Earn industry-leading payouts for every successful referral or closed deal.",
              },
              {
                icon: <TargetIcon />,
                title: "Verified Leads",
                desc: "Access a steady stream of pre-qualified, high-intent customer leads.",
              },
              {
                icon: <BoltIcon />,
                title: "Fast Onboarding",
                desc: "Get verified and start collaborating within 24 hours through our digital portal.",
              },
              {
                icon: <HeadsetIcon />,
                title: "Dedicated Support",
                desc: "Your own account manager to ensure smooth operations and fast payouts.",
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full text-blue-400"
                  style={{
                    background: "rgba(59,130,246,0.12)",
                    border: "1px solid rgba(59,130,246,0.3)",
                  }}
                >
                  {item.icon}
                </div>
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="text-xs leading-relaxed text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section className="px-6 py-20 text-center">
          <h2 className="mb-2 text-3xl font-bold md:text-4xl">How It Works</h2>
          <p className="mb-14 text-sm text-gray-400">
            A simple, transparent process to get you up and running quickly.
          </p>
          <div className="relative mx-auto flex max-w-3xl flex-col items-center justify-center gap-0 md:flex-row md:gap-0">
            <div
              className="absolute left-[16.5%] right-[16.5%] top-7 hidden h-px md:block"
              style={{
                background:
                  "linear-gradient(90deg, rgba(59,130,246,0.5) 0%, rgba(59,130,246,0.5) 100%)",
              }}
            />
            {[
              { num: 1, title: "Apply", desc: "Submit your partnership application form." },
              { num: 2, title: "Get Verified", desc: "Our team reviews and approves your profile." },
              { num: 3, title: "Start Collaborating", desc: "Access the portal and begin earning." },
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-1 flex-col items-center px-6">
                <div
                  className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold ${
                    step.num === 2 ? "bg-blue-500 text-white" : "text-blue-400"
                  }`}
                  style={
                    step.num !== 2
                      ? {
                          border: "2px solid rgba(59,130,246,0.6)",
                          background: "rgba(59,130,246,0.1)",
                        }
                      : {}
                  }
                >
                  {step.num}
                </div>
                <h3 className="mb-1 text-sm font-semibold">{step.title}</h3>
                <p className="text-xs text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── TESTIMONIALS ─── */}
        <section className="px-6 py-20 text-center" style={{ background: "rgba(0,0,0,0.2)" }}>
          <h2 className="mb-2 text-3xl font-bold md:text-4xl">Trusted by Partners</h2>
          <p className="mb-12 text-sm text-gray-400">
            Hear from professionals who are already growing with T-Home.
          </p>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                quote:
                  "Partnering with T-Home transformed our lead flow. The platform is seamless, and the commission structure is exactly what we needed to scale our agency.",
                name: "Jane D.",
                role: "Independent Broker",
                initials: "JD",
                color: "#6366f1",
              },
              {
                quote:
                  "The embedded finance API was incredibly easy to integrate. Our startup can now offer direct lending solutions without the regulatory headache.",
                name: "Mark S.",
                role: "Fintech Founder",
                initials: "MS",
                color: "#3b82f6",
              },
              {
                quote:
                  "Fastest onboarding I've ever experienced. Within two days, I was referring clients and tracking my earnings in real-time on the dashboard.",
                name: "Sarah L.",
                role: "Financial Consultant",
                initials: "SL",
                color: "#8b5cf6",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 text-left"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
                }}
              >
                <p className="mb-5 text-sm leading-relaxed text-gray-300">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ background: t.color }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── APPLICATION FORM ─── */}
        <section ref={formRef} className="px-6 py-20">
          <div className="mx-auto flex max-w-5xl flex-col items-start gap-12 md:flex-row">
            <div className="flex-1">
              <h2 className="mb-4 text-3xl font-bold">Ready to take next step?</h2>
              <p className="mb-8 text-sm leading-relaxed text-gray-400">
                Fill out the application form to express your interest. Our partnership team will review your details and reach out within 24 hours to discuss the next steps.
              </p>
              <ul className="space-y-3">
                {[
                  "No upfront fees or commitments",
                  "Customized commission structures",
                  "Full access to marketing resources",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                    <span className="text-blue-400">
                      <CheckCircleIcon />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="w-full flex-1 rounded-2xl p-8"
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs text-gray-400">Full Name</label>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-blue-500"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-gray-400">Company Name</label>
                  <input
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    placeholder="Enter your company name"
                    className="w-full rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-blue-500"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="mb-1 block text-xs text-gray-400">Type of Partner</label>
                    <select
                      name="partnerType"
                      value={form.partnerType}
                      onChange={handleChange}
                      className="w-full rounded-lg px-4 py-3 text-sm text-gray-300 outline-none focus:ring-1 focus:ring-blue-500"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <option value="">Select partner type</option>
                      <option value="institution">Financial Institution</option>
                      <option value="broker">Loan Agent / Broker</option>
                      <option value="freelancer">Freelancer</option>
                      <option value="startup">Startup</option>
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className="mb-1 block text-xs text-gray-400">Experience Level</label>
                    <select
                      name="experience"
                      value={form.experience}
                      onChange={handleChange}
                      className="w-full rounded-lg px-4 py-3 text-sm text-gray-300 outline-none focus:ring-1 focus:ring-blue-500"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <option value="">Years of experience</option>
                      <option value="0-1">0–1 years</option>
                      <option value="1-3">1–3 years</option>
                      <option value="3-5">3–5 years</option>
                      <option value="5+">5+ years</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs text-gray-400">Message (Optional)</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about your goals..."
                    className="w-full resize-none rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-blue-500"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full rounded-lg bg-blue-500 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
                >
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA BANNER ─── */}
        <section className="mb-12 px-6 py-16">
          <div
            className="mx-auto max-w-3xl rounded-2xl px-8 py-14 text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(30,58,138,0.5) 0%, rgba(17,24,80,0.6) 100%)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(59,130,246,0.2)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
            }}
          >
            <h2 className="mb-3 text-3xl font-bold">Let's Build Financial Growth Together</h2>
            <p className="mb-8 text-sm text-gray-400">
              Join the fastest growing network of financial professionals today.
            </p>
            <button
              onClick={scrollToForm}
              className="rounded-full bg-blue-500 px-8 py-3 font-semibold text-white transition hover:bg-blue-600"
            >
              Apply Now
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CollaboratePage;
