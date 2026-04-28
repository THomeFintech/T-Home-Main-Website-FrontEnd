import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Safe navigate helper — works with ANY router version or no router at all

import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonialStart, setTestimonialStart] = useState(0);

  const circleItems = [
    { img: "/home/scrolling icons/personal loan.png", text: "Personal Loans" },
    { img: "/home/scrolling icons/home loan.png", text: "Home Loans" },
    { img: "/home/scrolling icons/mortgage loans.png", text: "Mortgage Loans" },
    { img: "/home/scrolling icons/balance transfer.png", text: "Balance Transfer" },
    { img: "/home/scrolling icons/company registration.png", text: "Company Registration" },
    { img: "/home/scrolling icons/Food License.png", text: "Food License" },
    { img: "/home/scrolling icons/gst services.png", text: "GST Services" },
    { img: "/home/scrolling icons/itr tax filing.png", text: "ITR Tax Filing" },
    { img: "/home/scrolling icons/loan against property.png", text: "Loan Against Property" },
    { img: "/home/scrolling icons/MSME.png", text: "MSME" },
    { img: "/home/scrolling icons/pan adhaar linking.png", text: "Pan Aadhaar Linking" },
  ];

  const services = [
    {
      title: "Loans",
      description: "Calculate your monthly EMI and understand your repayment plan.",
      button: "View All",
      path: "/services",
    },
    {
      title: "Tax & Compliance",
      description: "Understand your loan approval chances with smart predictions.",
      button: "View All",
      path: "/services",
    },
    {
      title: "Business Registrations",
      description: "See how much you can save by switching to a low-interest loan.",
      button: "View All",
      path: "/services",
    },
  ];

  const testimonials = [
    {
      text: `"Dear Mr. Ravinder, Your assistance in applying for, processing, and disbursing my SVC Indraprastha Apartments housing loan is amazing. You gave the list at once to prevent document submission disturbances."`,
      img: "/home/Srinivasa Acharya.png",
      name: "Srinivasa Acharya",
      location: "Hyderabad",
    },
    {
      text: `"Dear Mr. Ravinder, This is regarding my home loan for the flat purchased at svc indraprastha. The process of the house loan, ... you had done an outstanding performance to get the job done. Keep up the good work. Thank you."`,
      img: "/home/Murugan R.png",
      name: "Murgan R",
      location: "Hyderabad",
    },
    {
      text: `"I had a wonderful and seamless experience with Ravinder. They have managed the entire documentation and Coordination with Bank without any hassle of multiple visit to the bank for home loan."`,
      img: "/home/Pankaj Agarwal.png",
      name: "Pankaj Agarwal",
      location: "Hyderabad",
    },
  ];

  const nextTestimonials = () => {
    setTestimonialStart((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonials = () => {
    setTestimonialStart((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const testimonialTrack = [...testimonials, ...testimonials];

  const activeTestimonial = testimonials[testimonialStart];
  const renderTestimonialCard = (t, i, key) => {
    const isCenter = i % testimonials.length === (testimonialStart + 1) % testimonials.length;

    return (
    <div
      key={key}
      className={`rounded-[16px] border px-8 py-10 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_12px_34px_rgba(0,0,0,0.3)] backdrop-blur-md transition-transform duration-700 ease-in-out ${
        isCenter
          ? "border-[#7ea7ff]/70 bg-[linear-gradient(180deg,rgba(58,95,218,0.96)_0%,rgba(39,68,184,0.96)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_18px_40px_rgba(8,20,60,0.42)]"
          : "border-[#c9dcff]/52 bg-[linear-gradient(180deg,rgba(24,34,84,0.84)_0%,rgba(14,22,58,0.9)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_12px_34px_rgba(2,8,28,0.34)]"
      }`}
    >
      <div
        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full text-[28px] font-semibold leading-none ${
          isCenter ? "bg-[#3d59b6] text-[#cfe0ff]" : "bg-[#1b336f] text-[#4f7fd7]"
        }`}
      >
        <span className="block -translate-y-px leading-none">"</span>
      </div>
      <p
        className={`mx-auto mt-6 max-w-[320px] leading-[1.45] ${
          isCenter ? "text-white/95" : "text-white/75"
        }`}
        style={{ fontSize: "clamp(13px, 0.85vw, 16px)" }}
      >
        {t.text}
      </p>
  
      <img
        src={t.img}
        alt={t.name}
        className="mx-auto mt-4 h-16 w-16 rounded-full border border-white/30 object-cover"
      />
      <h3 className="mt-4 font-semibold text-white" style={{ fontSize: "clamp(14px, 0.95vw, 18px)" }}>
        {t.name}
      </h3>
      <p
        className={`mt-1 text-sm font-semibold uppercase tracking-wide ${
          isCenter ? "text-[#69bbff]" : "text-[#4e95ff]"
        }`}
      >
        {t.location}
      </p>
    </div>
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % circleItems.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [circleItems.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialStart((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* ── HERO SECTION ── */}
      <section className="relative flex min-h-[100svh] w-full items-start justify-center overflow-hidden py-[100px] text-center md:min-h-[100svh] md:py-[100px] bg-[#081a49]">
        <img
          src="/home/bg image.png"
          alt="background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_37%,#2a55c4_0%,#16367f_40%,#081a49_68%,#050d2a_100%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,12,38,0.78)_0%,rgba(4,18,58,0.88)_46%,rgba(2,8,28,0.94)_100%)] md:hidden"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(163,205,255,0.22)_0%,rgba(123,181,255,0.12)_38%,rgba(123,181,255,0)_72%)]"></div>
        <div className="absolute inset-0 bg-[#020b24]/35 md:hidden"></div>
        <div
          className="absolute inset-0 opacity-34"
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 22%, rgba(186,220,255,0.5) 0 2px, transparent 3px), radial-gradient(circle at 26% 36%, rgba(149,196,255,0.38) 0 1.6px, transparent 2.8px), radial-gradient(circle at 67% 18%, rgba(186,220,255,0.45) 0 1.8px, transparent 3px), radial-gradient(circle at 84% 30%, rgba(149,196,255,0.34) 0 1.6px, transparent 2.8px), radial-gradient(circle at 76% 72%, rgba(186,220,255,0.4) 0 2px, transparent 3.2px), radial-gradient(circle at 18% 76%, rgba(149,196,255,0.34) 0 1.8px, transparent 3px)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-screen"
          style={{
            backgroundImage:
              "repeating-radial-gradient(circle at center, rgba(255,255,255,0.45) 0 0.6px, transparent 0.6px 2px)",
          }}
        />

        <div className="absolute left-8 top-1/2 z-20 hidden -translate-y-1/2 md:block">
          <img
            src="/home/logo.png"
            alt="T-Home logo"
            className="h-32 w-32 object-contain drop-shadow-[0_10px_36px_rgba(0,0,0,0.38)]"
          />
        </div>

        <img
          src="/home/telangana map.png"
          alt="map"
          className="absolute left-1/2 top-[16%] w-[470px] -translate-x-1/2 opacity-36 mix-blend-screen md:left-[30%] md:top-[8%] md:w-[610px] md:translate-x-0"
        />

        <div className="relative z-30 max-w-4xl px-6">
          <div className="mx-auto mb-2 inline-flex items-center gap-3 rounded-full border border-[#4b9dff]/30 bg-black/65 px-4 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <span className="rounded-full bg-[#4ea3ff] px-2 py-[3px] text-[10px] font-bold uppercase tracking-wide text-black">
              NEW
            </span>
            <span className="text-sm font-medium text-[#6fb7ff]">
              Latest integration just arrived
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-semibold text-white leading-tight mb-6 drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]" style={{fontFamily: "'Outfit', sans-serif"}}>
            Get Your Home Loan
            <br />
            <span className="bg-gradient-to-b from-[#e4f0ff] via-[#9ac6ff] to-[#66abff] bg-clip-text text-transparent">
              Approved Faster
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-[640px] text-base font-normal leading-8 text-[#dfeeff] drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] md:text-[17px] md:leading-8">
            Low interest rates, quick approvals, and zero hidden charges. Apply online in just 5 minutes.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button
             onClick={() => navigate("/home-loans")}
              className="rounded-full bg-gradient-to-r from-[#3e8fee] to-[#2869df] px-9 py-2.5 text-sm font-semibold text-white shadow-[0_12px_34px_rgba(46,113,218,0.5)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_14px_44px_rgba(55,128,232,0.6)]"
            >
              Apply Now
            </button>
            <button
              onClick={() => navigate("/emi-calculator")}
              className="rounded-full border border-white/75 bg-transparent px-9 py-2.5 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/12"
            >
              Calculate EMI
            </button>
          </div>
        </div>

        {/* GLASS RINGS */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center">
          <div className="absolute bottom-[-398px] h-[930px] w-[930px] rounded-full bg-[radial-gradient(circle,rgba(50,105,220,0.5)_0%,rgba(32,77,181,0.42)_44%,rgba(15,49,132,0.3)_70%,rgba(8,28,84,0.18)_88%,rgba(6,18,52,0)_100%)] animate-pulseSlow md:bottom-[-384px] md:h-[980px] md:w-[980px]" />
          <div className="absolute bottom-[-320px] h-[760px] w-[760px] rounded-full bg-[radial-gradient(circle,rgba(52,110,216,0.48)_0%,rgba(28,79,184,0.44)_44%,rgba(13,53,154,0.36)_72%,rgba(7,27,87,0.24)_90%,rgba(6,18,46,0)_100%)] animate-pulseSlow delay-150 md:bottom-[-306px] md:h-[800px] md:w-[800px]" />
          <div className="absolute bottom-[-245px] h-[610px] w-[610px] rounded-full bg-[radial-gradient(circle,rgba(84,143,232,0.32)_0%,rgba(56,113,210,0.3)_26%,rgba(33,89,188,0.3)_56%,rgba(16,58,162,0.25)_78%,rgba(7,21,62,0)_100%)] backdrop-blur-[1.5px] animate-pulseSlow delay-300 md:bottom-[-232px] md:h-[650px] md:w-[650px]" />

          <div className="absolute bottom-[-10px] flex h-[310px] w-[310px] animate-mainFloat flex-col items-center justify-center rounded-full bg-[linear-gradient(160deg,rgba(255,255,255,0.4)_0%,rgba(224,238,255,0.24)_44%,rgba(186,214,255,0.18)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_0_46px_rgba(169,208,255,0.34),0_18px_42px_rgba(7,20,58,0.32)] backdrop-blur-2xl">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-white/55 bg-[linear-gradient(160deg,rgba(255,255,255,0.46)_0%,rgba(220,236,255,0.24)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-xl">
              <img
                src={circleItems[currentIndex].img}
                alt="loan"
                className="h-20 w-20 object-contain brightness-125 contrast-125 drop-shadow-[0_4px_14px_rgba(170,215,255,0.4)] transition-all duration-700 ease-in-out"
              />
            </div>
            <p className="mt-5 text-2xl font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
              {circleItems[currentIndex].text}
            </p>
          </div>
        </div>
      </section>

      {/* ── RECOGNITION SECTION ── */}
      <section
        className="relative w-full overflow-hidden bg-cover bg-center py-[100px]"
        style={{ backgroundImage: "url('/home/bg image.png')" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(33,74,174,0.34)_0%,rgba(15,35,96,0.64)_52%,rgba(5,13,40,0.88)_100%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,12,36,0.42)_0%,rgba(4,10,31,0.76)_100%)]"></div>

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 text-center">
          <h2 className="mb-10 text-4xl md:text-5xl font-semibold text-white drop-shadow-[0_10px_24px_rgba(0,0,0,0.45)]" style={{fontFamily: "'Outfit', sans-serif"}}>
            Officially Recognized. Nationally Trusted.
          </h2>

          <div className="relative w-full max-w-[760px] rounded-[28px] border border-[#d8e7ff]/42 bg-[linear-gradient(145deg,rgba(255,255,255,0.32)_0%,rgba(208,226,255,0.16)_35%,rgba(157,193,245,0.1)_100%)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.52),0_30px_70px_rgba(3,10,36,0.52)] backdrop-blur-2xl md:p-4">
            <div className="pointer-events-none absolute inset-[1px] rounded-[26px] border border-white/28"></div>
            <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.34)_0%,rgba(255,255,255,0)_58%)]"></div>

            <img
              src="/home/dpiit certified.png"
              alt="Official certification"
              className="relative z-10 h-auto w-full rounded-[20px]"
            />
          </div>
        </div>
      </section>

      {/* ── SERVICES SECTION ── */}
      <section className="relative w-full overflow-hidden bg-[linear-gradient(90deg,#000000_0%,#1E2447_50%,#000000_100%)] py-[100px]">
        <div className="mx-auto max-w-[1500px] px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-semibold text-white leading-tight mb-8" style={{fontFamily: "'Outfit', sans-serif"}}>
              Smart Financial Services for
              <br />
              Individuals & Businesses
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base md:text-2xl leading-8 text-white/80">
              Expert solution to streamlines and optimize
              <br className="hidden md:block" />
              your company's financial operations
            </p>
          </div>

          <div className="relative mt-16 flex items-center justify-center">
            <button
              className="hidden"
              aria-hidden="true"
            >
              <span className="block -translate-y-px leading-none">‹</span>
            </button>

            <div className="w-full max-w-6xl overflow-hidden">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {services.map((service, index) => (
                    <div
                      key={index}
                      className={`group h-[280px] rounded-[16px] p-7 text-center backdrop-blur-md grid grid-rows-[auto_1fr_auto] transition-all duration-300 hover:border-[#63a9ff]/75 hover:bg-[linear-gradient(180deg,rgba(65,124,235,0.96)_0%,rgba(38,87,214,0.92)_100%)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.32),0_0_34px_rgba(72,149,255,0.38),0_18px_44px_rgba(0,0,0,0.36)] ${
                        index === 1
                          ? "border border-[#213972]/36 bg-[linear-gradient(180deg,rgba(43,75,163,0.76)_0%,rgba(19,36,91,0.82)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_18px_42px_rgba(0,0,0,0.42)]"
                          : "border border-[#536dff]/80 bg-[linear-gradient(180deg,rgba(19,27,63,0.58)_0%,rgba(9,15,38,0.64)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_14px_38px_rgba(0,0,0,0.28)]"
                      }`}
                    >
                      <div>
                        <h3 className="min-h-[48px] text-[20px] font-semibold leading-snug text-[#f5f9ff] transition-colors duration-300 group-hover:text-white">
                          {service.title}
                        </h3>
                        <p className="mt-4 h-[96px] overflow-hidden text-[15px] leading-7 text-[#e3eeff]/86 transition-colors duration-300 group-hover:text-white/95">
                          {service.description}
                        </p>
                      </div>
                      <div className="self-end">
                        <button
  onClick={() => navigate(service.path)}
  className="rounded-lg border border-[#83bcff]/55 bg-[linear-gradient(180deg,rgba(77,143,255,0.58)_0%,rgba(47,105,236,0.48)_100%)] px-6 py-2 text-sm font-medium text-[#f3f8ff] shadow-[inset_0_1px_0_rgba(255,255,255,0.24)] transition duration-300 hover:border-white/50 hover:bg-[linear-gradient(180deg,rgba(100,173,255,0.9)_0%,rgba(56,130,255,0.86)_100%)] hover:shadow-[0_0_26px_rgba(86,156,255,0.42)]"
>
  {service.button}
</button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <button
              className="hidden"
              aria-hidden="true"
            >
              <span className="block -translate-y-px leading-none">›</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── HOW T-HOME WORKS ── */}
      <section className="relative w-full py-[100px] bg-[linear-gradient(90deg,#000000_0%,#1E2447_50%,#000000_100%)]">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <h2 className="text-center text-4xl md:text-5xl font-semibold text-white mb-8" style={{fontFamily: "'Outfit', sans-serif"}}>
            How T-Home Works
          </h2>

          <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                number: "1",
                icon: "/home/upload.png",
                title: "Upload Documents",
                desc: "Submit ID, income & property proofs.",
                active: false,
              },
              {
                number: "2",
                icon: "/home/check eligibility icon.png",
                title: "Check Eligibility",
                desc: "Submit ID, income & property proofs.",
                active: false,
              },
              {
                number: "3",
                icon: "/home/get offer.png",
                title: "Get Offer",
                desc: "Know your loan options instantly.",
                active: true,
              },
              {
                number: "4",
                icon: "/home/Quick Approval.png",
                title: "Quick Approval",
                desc: "Fast, hassle-free verification.",
                active: false,
              },
              {
                number: "5",
                icon: "/home/money-disbursement.png",
                title: "Money Disbursement",
                desc: "Get funds directly in your account.",
                active: false,
              },
            ].map((step, index) => (
              <div key={index} className="group flex flex-col items-center text-center">
                <div className="relative">
                  <div
                    className="flex h-24 w-24 items-center justify-center rounded-2xl border border-[#c9dcff]/36 bg-[linear-gradient(180deg,rgba(33,46,97,0.42)_0%,rgba(20,30,74,0.36)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-md transition-all duration-300 group-hover:border-[#5ea6ff]/55 group-hover:bg-[linear-gradient(180deg,rgba(46,88,182,0.58)_0%,rgba(25,52,127,0.52)_100%)] group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_0_24px_rgba(66,132,235,0.28)]"
                  >
                    <img
                      src={step.icon}
                      alt={step.title}
                      className="h-8 w-8 object-contain opacity-80 transition-all duration-300 group-hover:opacity-100 group-hover:brightness-110"
                    />
                  </div>
                  <div className="absolute -right-2 -top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[#2f73ff] text-sm font-semibold text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
                    {step.number}
                  </div>
                </div>
                <h3 className="mt-4 text-base font-semibold text-white transition-colors duration-300 group-hover:text-[#dbe8ff]">{step.title}</h3>
                <p className="mt-2 max-w-[200px] text-sm leading-6 text-white/85 transition-colors duration-300 group-hover:text-white">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SMART FINANCIAL TOOLS ── */}
      <section className="relative w-full py-20 bg-[linear-gradient(90deg,#000000_0%,#1E2447_50%,#000000_100%)]">
        <div className="absolute inset-0 bg-black/12"></div>
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <h2 className="text-center text-2xl md:text-4xl font-semibold text-white">
            Smart Financial Tools
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm md:text-base leading-7 text-white/90">
            Use our powerful tools to plan and manage
            <br className="hidden md:block" />
            your finances better.
          </p>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: "EMI Calculator",
                desc: "Calculate your monthly EMI and understand your repayment plan.",
                btn: "Calculate Now",
                path: "/emi-calculator",
              },
              {
                title: "Loan Prediction System",
                desc: "Find out how much home loan you can get instantly.",
                btn: "Check Eligibility",
                path: "/tools?tool=loan-prediction",
              },
              {
                title: "Balance Transfer",
                desc: "Estimate your savings quickly and plan your loan transfer better.",
                btn: "Calculate Transfer",
                path: "/coming-soon",
              },
            ].map((tool, i) => (
              <div
                key={i}
                className="group rounded-[18px] border border-[#c9dcff]/36 bg-[linear-gradient(180deg,rgba(30,45,95,0.5)_0%,rgba(20,31,76,0.44)_100%)] px-6 py-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_10px_28px_rgba(0,0,0,0.2)] backdrop-blur-md transition-colors duration-300 hover:border-[#4e83ff]/60 hover:bg-[linear-gradient(180deg,rgba(50,78,205,0.84)_0%,rgba(33,52,159,0.8)_100%)]"
              >
                <h3 className="text-base md:text-lg font-semibold text-white">{tool.title}</h3>
                <p className="mx-auto mt-4 max-w-[220px] text-sm leading-6 text-white/90">
                  {tool.desc}
                </p>
                <button
                  onClick={() => navigate(tool.path)}
                  className="mt-6 rounded-lg border border-[#5ea6ff]/45 bg-[linear-gradient(180deg,rgba(58,108,197,0.46)_0%,rgba(36,73,148,0.4)_100%)] px-5 py-2 text-sm font-medium text-[#e8f2ff] shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]"
                >
                  {tool.btn}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE T-HOME ── */}
      <section
        className="relative w-full overflow-hidden py-[100px] bg-cover bg-center"
        style={{ backgroundImage: "url('/home/bg image.png')" }}
      >
        <div className="absolute inset-0 bg-[#040814]/84"></div>
        <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-8" style={{fontFamily: "'Outfit', sans-serif"}}>Why Choose T-Home</h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm md:text-lg text-white/70 leading-relaxed">
            Everything you need to manage payments, compliance, and finances —
            all powered by intelligent automation.
          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: "⚙️",
                iconBg: "bg-[#0f2a5c]",
                iconColor: "text-blue-400",
                hoverClass: "hover:border-blue-500/40 hover:shadow-[0_20px_60px_rgba(37,99,235,0.25)]",
                title: "Instant Loan Comparison",
                desc: "Compare loan interest rates from multiple banks and choose the best option instantly.",
              },
              {
                icon: "⚡",
                iconBg: "bg-[#1a1045]",
                iconColor: "text-purple-400",
                hoverClass: "hover:border-purple-500/40 hover:shadow-[0_20px_60px_rgba(168,85,247,0.25)]",
                title: "Fast Approval Process",
                desc: "Our digital process ensures faster approvals and minimal paperwork.",
              },
              {
                icon: "🛡️",
                iconBg: "bg-[#0f3d2e]",
                iconColor: "text-green-400",
                hoverClass: "hover:border-green-500/40 hover:shadow-[0_20px_60px_rgba(34,197,94,0.25)]",
                title: "Secure Document Handling",
                desc: "Your financial documents are protected with bank-level encryption and secure storage.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className={`group rounded-2xl border border-white/10 bg-gradient-to-b from-[#0b1a3a]/80 to-[#050c1f]/80 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 ${card.hoverClass}`}
              >
                <div className={`mb-6 mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor}`}>
                  {card.icon}
                </div>
                <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                <p className="mt-3 text-sm text-white/70">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { value: "5k+", label: "Loans Approved" },
              { value: "95%", label: "Approval Rate" },
              { value: "10+", label: "Years Experience" },
              { value: "100%", label: "Certified Experts" },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 backdrop-blur-xl"
              >
                <h4 className="text-3xl font-semibold text-white">{item.value}</h4>
                <p className="mt-2 text-sm text-white/70">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section
        className="relative w-full overflow-hidden py-[100px] bg-cover bg-center"
        style={{ backgroundImage: "url('/home/bg image.png')" }}
      >
        <div className="absolute inset-0 bg-[#040814]/82"></div>
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="flex justify-center">
            <span className="rounded-full bg-[#1f4fa3]/80 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-[#7eb6ff]">
              Testimonials
            </span>
          </div>
          <h2 className="mt-6 text-center text-4xl md:text-5xl font-semibold text-white mb-8" style={{fontFamily: "'Outfit', sans-serif"}}>
            What Our Client Says
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-center text-sm md:text-xl leading-7 md:leading-9 text-white/75">
            Our clients trust us for hassle-free home loans with quick approvals and excellent service.
          </p>

          <div className="relative mx-auto mt-14 hidden max-w-7xl items-center justify-center md:flex">
            <button
              onClick={prevTestimonials}
              className="absolute left-0 z-20 flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-[linear-gradient(180deg,rgba(34,41,66,0.98)_0%,rgba(18,22,37,0.98)_100%)] text-4xl text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_10px_24px_rgba(5,9,28,0.42)] transition hover:border-[#4f72e0]/55 hover:bg-[linear-gradient(180deg,rgba(47,67,160,0.96)_0%,rgba(36,53,136,0.96)_100%)]"
            >
              ‹
            </button>

            <div className="mx-16 w-full overflow-hidden">
               <div
                 className="grid auto-cols-[calc((100%-48px)/3)] grid-flow-col gap-6"
                 style={{
                   transform: `translateX(calc(-${testimonialStart} * ((100% - 48px) / 3 + 24px)))`,
                   transition: 'none'
                 }}
               >
                 {testimonialTrack.map((t, i) => renderTestimonialCard(t, i, `${i}-${t.name}`))}
               </div>
            </div>

            <button
              onClick={nextTestimonials}
              className="absolute right-0 z-20 flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-[linear-gradient(180deg,rgba(34,41,66,0.98)_0%,rgba(18,22,37,0.98)_100%)] text-4xl text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_10px_24px_rgba(5,9,28,0.42)] transition hover:border-[#4f72e0]/55 hover:bg-[linear-gradient(180deg,rgba(47,67,160,0.96)_0%,rgba(36,53,136,0.96)_100%)]"
            >
              ›
            </button>
          </div>

          <div className="mx-auto mt-10 w-full max-w-[360px] md:hidden">
            <div className="rounded-[16px] border border-[#d6e6ff]/62 bg-[linear-gradient(180deg,rgba(44,66,132,0.74)_0%,rgba(25,42,102,0.68)_100%)] p-7 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_14px_38px_rgba(0,0,0,0.34)] backdrop-blur-md">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1b336f] text-[28px] font-semibold leading-none text-[#4f7fd7]">
                <span className="block -translate-y-px leading-none">"</span>
              </div>
              <p className="mx-auto mt-6 max-w-[320px] text-[15px] leading-7 text-[#e3eeff]/90">
                {activeTestimonial.text}
              </p>
              <div className="mt-5 flex justify-center gap-1 text-lg text-[#ffcc33]">
                ★ ★ ★ ★ ★
              </div>
              <img
                src={activeTestimonial.img}
                alt={activeTestimonial.name}
                className="mx-auto mt-4 h-16 w-16 rounded-full border border-white/30 object-cover"
              />
              <h3 className="mt-4 text-lg font-semibold text-white">{activeTestimonial.name}</h3>
              <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-[#4e95ff]">
                📍 {activeTestimonial.location}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="relative flex w-full justify-center overflow-hidden px-6 py-[100px]">
        <div className="w-full max-w-6xl rounded-[14px] border border-[#5374df]/55 bg-[linear-gradient(90deg,#2438c8_0%,#3249d6_52%,#2438c8_100%)] px-6 py-12 text-center shadow-[0_22px_55px_rgba(6,14,44,0.45)] md:px-12 md:py-16">

          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-8" style={{fontFamily: "'Outfit', sans-serif"}}>
            Start Your Financial Journey Today
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/85 md:text-[34px]" style={{ fontSize: "clamp(18px, 1.05vw, 34px)" }}>
            Join thousands of satisfied users who have transformed their financial experience with T-Home.
          </p>
         <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
  <button
    onClick={() => navigate("/get-started")}
    className="rounded-lg border border-white/70 bg-white px-7 py-3 font-semibold text-[#1f4de2] shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition hover:bg-[#f2f6ff]"
  >
    Create Free Account
  </button>

  <button
    onClick={() => navigate("/contact")}
    className="rounded-lg border border-[#7e96f0]/85 bg-[linear-gradient(180deg,#425ac9_0%,#344bb6_100%)] px-7 py-3 font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition hover:bg-[linear-gradient(180deg,#4d67db_0%,#3e57c7_100%)]"
  >
    Speak to an Expert
  </button>
</div>
        </div>
      </section>
    </div>
  );
}

export default Home;
