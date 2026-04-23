import React, { useMemo, useState, useRef } from "react";
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
  const openRolesRef = useRef(null);
  const scrollToOpenRoles = () => {
  openRolesRef.current?.scrollIntoView({ behavior: "smooth" });
};
  const categories = ["All Roles", "Engineering", "Design", "Marketing", "Operations"];

  const filteredJobs = useMemo(() => {
    if (activeCategory === "All Roles") return jobRoles;
    return jobRoles.filter((job) => job.category === activeCategory);
  }, [activeCategory]);

  return (
    <div
      className="relative min-h-screen overflow-hidden text-white font-['Outfit',sans-serif]"
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
  className="mt-5 rounded-[10px] bg-[#2f73ff] px-6 py-2.5 text-[13px] font-semibold transition hover:bg-[#2b69eb]"
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
                  className="shrink-0 rounded-[11px] bg-[#2f73ff] px-5 py-2 text-[12px] font-semibold transition hover:bg-[#2b69eb]"
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
          <span className="inline-flex rounded-full border border-[#4f84ff]/35 bg-[#2459c8]/18 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#7badff]">
            Employee Testimonials
          </span>
          <h2 className="mt-3 text-[46px] font-semibold">Real Experiences. Real Growth.</h2>
          <p className="mt-2 text-[14px] text-[#d7def3]">
            Our employees share how their careers have evolved and how they&apos;ve found purpose here.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {testimonials.map((person) => (
              <article
                key={person.name}
                className="rounded-[12px] border border-white/10 bg-white/[0.04] px-5 py-5 text-left backdrop-blur-[12px] shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
              >
                <p className="text-[13px] leading-[1.55] text-[#d6e1f7]">“{person.text}”</p>

                <div className="mt-4 flex items-center gap-3">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#4f84ff]/35 bg-[#2459c8]/18 text-[#9fc1ff]">
                    <User size={16} />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-semibold">{person.name}</h4>
                    <p className="text-[12px] text-[#b8c9eb]">{person.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-3.5 flex justify-center gap-1.5">
            {[0, 1, 2, 3, 4].map((dot) => (
              <span
                key={dot}
                className={`h-1.5 w-1.5 rounded-full ${dot === 2 ? "bg-white" : "bg-white/30"}`}
              />
            ))}
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-[760px] rounded-[14px] border border-white/10 bg-white/[0.04] px-6 py-9 text-center backdrop-blur-[12px] shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
          <h2 className="text-[48px] font-semibold">Ready to make an impact?</h2>
          <p className="mx-auto mt-2 max-w-[620px] text-[15px] text-[#e0e9ff]">
            Join T-Home and help us build financial infrastructure that empowers millions of users globally.
          </p>
          <button
  onClick={scrollToOpenRoles}
  className="mt-6 rounded-[10px] bg-[#2f73ff] px-7 py-2.5 text-[13px] font-semibold transition hover:bg-[#2b69eb]"
>
  Join Us Now
</button>
        </section>
      </div>
    </div>
  );
}
