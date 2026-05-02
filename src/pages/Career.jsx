import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  CalendarClock,
  CircleDollarSign,
  HeartPulse,
  Laptop,
  Lightbulb,
  MapPin,
  Shield,
  Sparkles,
  TrendingUp,
  User,
  Users,
  BookOpen,
  Clock3,
} from "lucide-react";

const cultureCards = [
  {
    title: "Innovation First",
    description: "We challenge the status quo and build solutions that redefine the industry standard.",
    icon: Lightbulb,
  },
  {
    title: "Customer-Centric",
    description: "Every feature we build and every decision we make starts with our users in mind.",
    icon: Users,
  },
  {
    title: "Ownership & Growth",
    description: "Take charge of your work, learn continuously, and grow alongside the company.",
    icon: TrendingUp,
  },
  {
    title: "Transparency & Trust",
    description: "Open communication and honest feedback are the foundation of our team dynamic.",
    icon: Shield,
  },
];

const jobRoles = [
  {
    title: "UI/UX Designer",
    category: "Design",
    mode: "REMOTE",
    type: "FULL-TIME",
    exp: "1-2 YEARS",
    description: "Lead the design of our core financial products and shape the future of digital banking experiences.",
  },
  {
    title: "Frontend Engineer",
    category: "Engineering",
    mode: "REMOTE",
    type: "FULL-TIME",
    exp: "2-4 YEARS",
    description: "Build fast, secure, and accessible user interfaces using modern web technologies.",
  },
  {
    title: "Product Marketing Manager",
    category: "Marketing",
    mode: "REMOTE",
    type: "FULL-TIME",
    exp: "5+ YEARS",
    description: "Drive go-to-market strategies and craft compelling narratives for our new feature rollouts.",
  },
];

const joinBenefits = [
  {
    title: "Flexible Work Environment",
    description: "Work from where you feel most productive. We support hybrid and fully remote setups.",
    icon: Laptop,
  },
  {
    title: "Competitive Salary",
    description: "Top-of-market compensation packages reflecting your skills, experience, and impact.",
    icon: CircleDollarSign,
  },
  {
    title: "Learning & Growth",
    description: "Annual stipends for courses, books, and conferences to keep your skills sharp.",
    icon: BookOpen,
  },
  {
    title: "Health & Wellness",
    description: "Comprehensive health insurance covering you and your dependents fully.",
    icon: HeartPulse,
  },
  {
    title: "Startup Ownership",
    description: "Equity options for all employees. When the company wins, we all win together.",
    icon: Clock3,
  },
  {
    title: "Work-Life Balance",
    description: "Generous paid time off, mental health days, and flexible daily schedules.",
    icon: Sparkles,
  },
];

const testimonials = [
  {
    name: "Shivani",
    role: "ML Intern",
    image: "/home/testimonial-1.png",
    text: "My journey at T-Home has been enriching, with strong mentorship improving my skills. The supportive culture inspired growth, collaboration, and continuous improvement every day.",
  },
  {
    name: "Bhanu Sri",
    role: "UI/UX Design Intern",
    image: "/home/testimonial-2.png",
    text: "My journey at T-Home has been enriching, with strong mentorship improving my skills. The supportive culture inspired growth, collaboration, and continuous improvement every day.",
  },
  {
    name: "Waseem Ahmed",
    role: "ML Intern",
    image: "/home/testimonial-3.png",
    text: "My journey at T-Home has been enriching, with strong mentorship improving my skills. The supportive culture inspired growth, collaboration, and continuous improvement every day.",
  },
];

export default function CareerSection() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All Roles");
  const [testimonialStart, setTestimonialStart] = useState(0);
  const openRolesRef = useRef(null);
  const scrollToOpenRoles = () => {
  openRolesRef.current?.scrollIntoView({ behavior: "smooth" });
};
  
  const nextTestimonials = () => {
    setTestimonialStart((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonials = () => {
    setTestimonialStart((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const testimonialTrack = [...testimonials, ...testimonials];

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialStart((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const categories = ["All Roles", "Engineering", "Design", "Marketing", "Operations"];

  const filteredJobs = useMemo(() => {
    if (activeCategory === "All Roles") return jobRoles;
    return jobRoles.filter((job) => job.category === activeCategory);
  }, [activeCategory]);

  return (
    <div
      className="relative min-h-screen overflow-hidden text-white font-['Outfit',sans-serif]"
      style={{
        background:
          "radial-gradient(1200px 680px at 20% -10%, rgba(90,140,255,0.18), transparent 62%), radial-gradient(980px 580px at 100% 0%, rgba(36,107,198,0.14), transparent 60%), linear-gradient(180deg, #071327 0%, #08162b 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[440px] w-[980px] -translate-x-1/2 rounded-full bg-[#2f73ff]/20 blur-[140px]" />
        <div className="absolute bottom-[18%] left-[8%] h-[300px] w-[300px] rounded-full bg-[#4f84ff]/14 blur-[120px]" />
        <div className="absolute bottom-[22%] right-[8%] h-[280px] w-[280px] rounded-full bg-[#315cc9]/12 blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_45%,transparent_76%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 pb-14 pt-24">
        <section className="text-center">
          <h1 className="text-[44px] font-bold leading-tight sm:text-[52px]">
            Build the <span className="text-[#2d8bff]">Future of Finance</span> with Us
          </h1>
          <p className="mx-auto mt-2.5 max-w-[780px] text-[15px] text-[#d7def3]">
            Join a fast-growing team that&apos;s redefining financial services with innovation, trust, and bleeding-edge technology.
          </p>
<button
  onClick={scrollToOpenRoles}
  className="mt-5 rounded-full bg-[#2f73ff] px-6 py-2.5 text-[13px] font-semibold transition hover:bg-[#2b69eb]"
>
  Explore Open Roles
</button>
        </section>

        <section className="mt-12">
          <h2 className="text-center text-[40px] font-semibold">Our Culture</h2>
          <p className="mt-2 text-center text-[14px] text-[#d7def3]">
            We believe great products are built by empowered people.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cultureCards.map((card) => {
              const Icon = card.icon;
              return (
                <article
                  key={card.title}
                  className="min-h-[162px] rounded-[10px] border border-white/10 bg-white/[0.04] px-5 py-5 backdrop-blur-[12px] shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
                >
                  <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-[7px] border border-[#4f84ff]/35 bg-[#2459c8]/18 text-[#76a9ff]">
                    <Icon size={15} />
                  </div>
                  <h3 className="text-[17px] font-semibold leading-tight">{card.title}</h3>
                  <p className="mt-2 text-[12px] leading-[1.45] text-[#c8d5ef]">{card.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section ref={openRolesRef} className="mt-12 text-center">
          <h2 className="text-[40px] font-semibold">Open Positions</h2>

          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-[9px] border px-3 py-1 text-[11px] font-medium transition backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] ${
                  activeCategory === category
                    ? "border-[#89b6ff]/70 bg-[linear-gradient(180deg,rgba(74,130,255,0.52)_0%,rgba(48,100,220,0.42)_100%)] text-white"
                    : "border-white/30 bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.09)_100%)] text-[#e3ebff] hover:bg-white/25"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mx-auto mt-6 max-w-[760px] space-y-2.5 text-left">
            {filteredJobs.map((job) => (
              <article
                key={job.title}
                className="flex flex-col justify-between gap-2 rounded-[10px] border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-[12px] shadow-[0_4px_30px_rgba(0,0,0,0.3)] md:flex-row md:items-center"
              >
                <div>
                  <h3 className="text-[15px] font-semibold leading-tight">{job.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2.5 text-[9px] uppercase tracking-wide text-[#e2e8f7]">
                    <span className="inline-flex items-center gap-1"><MapPin size={10} /> {job.mode}</span>
                    <span className="inline-flex items-center gap-1"><Briefcase size={10} /> {job.type}</span>
                    <span className="inline-flex items-center gap-1"><CalendarClock size={10} /> {job.exp}</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-[1.45] text-[#d0dbf4]">{job.description}</p>
                </div>

<button
                  type="button"
                  onClick={() => {
                    localStorage.setItem("selectedJob", JSON.stringify(job));
                    navigate("/apply", { state: job });
                  }}
                  className="shrink-0 rounded-full bg-[#2f73ff] px-5 py-2 text-[12px] font-semibold transition hover:bg-[#2b69eb]"
                >
                  Apply
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-center text-[48px] font-semibold">Why Join Us ?</h2>
          <p className="mt-2 text-center text-[14px] text-[#d7def3]">
            We take care of our team so they can focus on doing their best work.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {joinBenefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <article
                  key={benefit.title}
                  className="rounded-[12px] border border-white/10 bg-white/[0.04] px-5 py-6 text-center backdrop-blur-[12px] shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
                >
                  <div className="mx-auto mb-4 inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#4f84ff]/35 bg-[#2459c8]/18 text-[#76a9ff]">
                    <Icon size={16} />
                  </div>
                  <h3 className="text-[22px] font-semibold">{benefit.title}</h3>
                  <p className="mt-2 text-[13px] leading-[1.5] text-[#c8d5ef]">{benefit.description}</p>
                </article>
              );
            })}
          </div>
        </section>

<section className="mt-12 text-center">
          <span className="inline-flex rounded-full border  bg-[#1f4fa3]/80 border-[#4f84ff]/35 bg-[#2459c8]/18 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#7badff]">
            Employee Testimonials
          </span>
          <h2 className="mt-3 text-[46px] font-semibold">Real Experiences. Real Growth.</h2>
          <p className="mt-2 text-[14px] text-[#d7def3]">
            Our employees share how their careers have evolved and how they&apos;ve found purpose here.
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
                 {testimonialTrack.map((t, i) => {
                   const isCenter = i % testimonials.length === (testimonialStart + 1) % testimonials.length;
                   return (
                     <article
                       key={`${i}-${t.name}`}
                       className={`rounded-[16px] border px-6 py-7 text-center backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_12px_34px_rgba(0,0,0,0.3)] transition-transform duration-700 ease-in-out ${
                         isCenter
                           ? "border-[#7ea7ff]/70 bg-[linear-gradient(180deg,rgba(58,95,218,0.96)_0%,rgba(39,68,184,0.96)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_18px_40px_rgba(8,20,60,0.42)]"
                           : "border-[#c9dcff]/52 bg-[linear-gradient(180deg,rgba(24,34,84,0.84)_0%,rgba(14,22,58,0.9)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_12px_34px_rgba(2,8,28,0.34)]"
                       }`}
                     >
                       <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full text-[28px] font-semibold leading-none ${
                         isCenter ? "bg-[#3d59b6] text-[#cfe0ff]" : "bg-[#1b336f] text-[#4f7fd7]"
                       }`}>
                         <span className="block -translate-y-px leading-none">"</span>
                       </div>
                       <p className={`mx-auto mt-6 max-w-[320px] text-[15px] leading-7 ${
                         isCenter ? "text-white/95" : "text-white/75"
                       }`}>{t.text}</p>

                       <div className="mt-5 flex items-center justify-center gap-3">
                         <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#4f84ff]/35 bg-[#2459c8]/18 text-[#9fc1ff]">
                           <User size={16} />
                         </div>
                         <div className="text-left">
                           <h4 className="text-[14px] font-semibold">{t.name}</h4>
                           <p className="text-[12px] text-[#b8c9eb]">{t.role}</p>
                         </div>
                       </div>
                     </article>
                   );
                 })}
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
                {testimonials[testimonialStart].text}
              </p>
              <img
                src={testimonials[testimonialStart].image}
                alt={testimonials[testimonialStart].name}
                className="mx-auto mt-4 h-16 w-16 rounded-full border border-white/30 object-cover"
              />
              <h3 className="mt-4 text-lg font-semibold text-white">{testimonials[testimonialStart].name}</h3>
              <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-[#4e95ff]">
                {testimonials[testimonialStart].role}
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-[760px] rounded-[14px] border border-white/10 bg-white/[0.04] px-6 py-9 text-center backdrop-blur-[12px] shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
          <h2 className="text-[48px] font-semibold">Ready to make an impact?</h2>
          <p className="mx-auto mt-2 max-w-[620px] text-[15px] text-[#e0e9ff]">
            Join T-Home and help us build financial infrastructure that empowers millions of users globally.
          </p>
<button
  onClick={scrollToOpenRoles}
  className="mt-6 rounded-full bg-[#2f73ff] px-7 py-2.5 text-[13px] font-semibold transition hover:bg-[#2b69eb]"
>
  Join Us Now
</button>
        </section>
      </div>
    </div>
  );
}

