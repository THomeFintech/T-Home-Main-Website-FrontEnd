
import React from "react";
import { motion } from "framer-motion";
import { Flag, Eye, Linkedin } from "lucide-react";
import SEO from "../components/SEO";

const About = () => {
  return (
    <div
      className="relative min-h-screen overflow-hidden text-white font-['Outfit',sans-serif]"
      style={{
        background: "radial-gradient(1200px 680px at 20% -10%, rgba(90,140,255,0.18), transparent 62%), radial-gradient(980px 580px at 100% 0%, rgba(36,107,198,0.14), transparent 60%), linear-gradient(180deg, #071327 0%, #08162b 100%)",
      }}
    >
      <SEO
  title="About Us"
  description="Learn about T-Home Fintech, our mission, vision, and commitment to providing trusted financial solutions, business registration services, and customer-focused support across India."
  path="/about"
  keywords="about T-Home Fintech, fintech company, financial services, business registration, home loans, loan experts"
/>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[440px] w-[980px] -translate-x-1/2 rounded-full bg-[#2f73ff]/20 blur-[140px]" />
        <div className="absolute bottom-[18%] left-[8%] h-[300px] w-[300px] rounded-full bg-[#4f84ff]/14 blur-[120px]" />
        <div className="absolute bottom-[22%] right-[8%] h-[280px] w-[280px] rounded-full bg-[#315cc9]/12 blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_45%,transparent_76%)]" />
      </div>

      <div className="relative z-10">
        <section className="relative flex min-h-[72svh] items-center justify-center overflow-hidden px-6 pt-36 pb-20 text-center md:pt-32 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 mx-auto mt-4 md:mt-0 max-w-4xl"
          >
            <div className="mx-auto mt-14 md:mt-0 inline-flex items-center gap-2 rounded-full border border-[#89b6ff]/35 bg-white/5 px-4 py-2 text-[12px] font-medium tracking-wide text-[#cfe0ff] backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-[#4ea3ff]" />
              About T-Home
            </div>

            <h1 className="mt-6 text-[42px] leading-[1.15] font-bold md:text-6xl">
              Empowering Your <span className="text-[#2d8bff]">Financial Future</span>
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[#d7def3] md:text-lg">
              We simplify financial services by combining trust, speed, and intelligent automation so home ownership,
              business growth, and compliance services feel straightforward instead of overwhelming.
            </p>

            <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-3">
              {[
                { value: "2025", label: "Founded" },
                { value: "5k+", label: "Happy Clients" },
                { value: "24/7", label: "Fast Support" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[18px] border border-[#d6e6ff]/18 bg-[linear-gradient(180deg,rgba(44,66,132,0.74)_0%,rgba(25,42,102,0.68)_100%)] px-6 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_14px_38px_rgba(0,0,0,0.34)] backdrop-blur-md"
                >
                  <p className="text-3xl font-bold text-white">{item.value}</p>
                  <p className="mt-2 text-sm text-[#c8d5ef]">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="relative w-full pt-1 pb-20">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-semibold text-white md:text-4xl">A Journey of Trust and Innovation</h2>
              <p className="mx-auto mt-3 max-w-3xl text-[15px] leading-7 text-[#d7def3]">
                Founded in 2025, T-Home bridges complex financial systems and everyday goals with a platform designed
                to be transparent, intelligent, and easy to use.
              </p>
            </div>

            <div className="mx-auto mt-10 grid max-w-5xl gap-8 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="rounded-[20px] border border-[#c9dcff]/18 bg-[linear-gradient(180deg,rgba(30,45,95,0.5)_0%,rgba(20,31,76,0.44)_100%)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_10px_28px_rgba(0,0,0,0.2)] backdrop-blur-md"
              >
                <h3 className="text-2xl font-semibold text-white">What We Build</h3>
                <p className="mt-4 text-[15px] leading-7 text-[#e3eeff]/88">
                  Home loans, balance transfers, compliance services, and business registrations with a unified digital
                  experience that keeps users moving forward.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="rounded-[20px] border border-[#c9dcff]/18 bg-[linear-gradient(180deg,rgba(30,45,95,0.5)_0%,rgba(20,31,76,0.44)_100%)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_10px_28px_rgba(0,0,0,0.2)] backdrop-blur-md"
              >
                <h3 className="text-2xl font-semibold text-white">How We Work</h3>
                <p className="mt-4 text-[15px] leading-7 text-[#e3eeff]/88">
                  Clear guidance, responsive support, and smart automation built around trust so every interaction feels
                  consistent across the website.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="relative w-full pt-1 pb-20">
          <div className="mx-auto max-w-7xl px-6 text-center md:px-12">
            <h2 className="text-3xl font-semibold text-white md:text-4xl">Our Core Principles</h2>
            <p className="mx-auto mt-3 max-w-2xl text-[#d7def3]">
              The driving force behind everything we do at T-Home.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <motion.div className="rounded-[18px] border border-[#d6e6ff]/18 bg-[linear-gradient(180deg,rgba(44,66,132,0.74)_0%,rgba(25,42,102,0.68)_100%)] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_14px_38px_rgba(0,0,0,0.34)] backdrop-blur-md">
                <h3 className="mb-3 flex items-center justify-center gap-2 text-xl font-semibold text-white">
                  <Flag className="h-5 w-5 text-[#66abff]" />
                  Our Mission
                </h3>
                <p className="text-[15px] leading-7 text-[#d7def3]">
                  To simplify financial services and make home loans, taxation, and business registration accessible,
                  transparent, and hassle-free.
                </p>
              </motion.div>

              <motion.div className="rounded-[18px] border border-[#d6e6ff]/18 bg-[linear-gradient(180deg,rgba(44,66,132,0.74)_0%,rgba(25,42,102,0.68)_100%)] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_14px_38px_rgba(0,0,0,0.34)] backdrop-blur-md">
                <h3 className="mb-3 flex items-center justify-center gap-2 text-xl font-semibold text-white">
                  <Eye className="h-5 w-5 text-[#66abff]" />
                  Our Vision
                </h3>
                <p className="text-[15px] leading-7 text-[#d7def3]">
                  To be the nation’s most trusted financial platform.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

       <section className="relative w-full pt-1 pb-20">
  <div className="mx-auto max-w-7xl px-6 text-center md:px-12">
    <h2 className="text-3xl font-semibold text-white md:text-4xl">
      Leadership
    </h2>

    <p className="mx-auto mt-3 max-w-2xl text-[#d7def3]">
      The people shaping the platform and guiding the product direction.
    </p>

    <div className="mx-auto mt-8 max-w-xl">
      {[
        {
          image: "/ceo.png",
          name: "Ravinder Reddy Attapuram",
          role: "Founder & CEO",
          linkedin:
            "https://www.linkedin.com/in/ravinder-reddy-attapuram-a2676491/",
          email: "ravinder.reddy@thome.co.in",
          text:
            "Entrepreneur, strategist, and changemaker leading T-Home toward a future where finance is transparent, easy, and empowering.",
        },
      ].map((leader) => (
        <motion.div
          key={leader.name}
          whileHover={{ y: -6 }}
          transition={{ duration: 0.35 }}
          className="
            rounded-[18px]
            border border-[#274786]
            bg-[linear-gradient(180deg,#162347_0%,#101c39_100%)]
            px-8
            py-8
            text-center
            shadow-[0_20px_60px_rgba(0,0,0,.35)]
          "
        >
          {/* IMAGE */}

          <div className="relative mx-auto w-fit">
            <div
              className="
                h-40
                w-40
                rounded-full
                border-[4px]
                border-[#25b9ff]
                bg-white
                p-1
                shadow-[0_0_35px_rgba(37,185,255,.6)]
              "
            >
              <img
                src={leader.image}
                alt={leader.name}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          </div>

          {/* ICONS */}

          <div className="mt-4 flex justify-center gap-3">
            <a
              href={leader.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-[#0A66C2]
                text-white
                transition
                hover:scale-110
              "
            >
              <Linkedin size={16} />
            </a>

            <a
              href={`mailto:${leader.email}`}
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                border
                border-white/20
                text-white
                transition
                hover:scale-110
              "
            >
              ✉
            </a>
          </div>

          {/* ROLE */}

          <div
            className="
              mx-auto
              mt-4
              inline-flex
              rounded-full
              bg-[#20356f]
              px-4
              py-1
              text-[11px]
              font-medium
              uppercase
              tracking-wide
              text-[#b7d5ff]
            "
          >
            {leader.role}
          </div>

          {/* NAME */}

          <h3 className="mt-5 text-[28px] font-semibold text-white">
            {leader.name}
          </h3>

          {/* SUBTITLE */}

          <p className="mt-2 text-sm text-[#bdd1f7]">
            Entrepreneur • Strategist • Changemaker
          </p>

          {/* DESCRIPTION */}

          <p className="mx-auto mt-4 max-w-sm text-[14px] leading-7 text-[#d2def9]">
            {leader.text}
          </p>

          {/* FEATURE BOXES */}

          <div className="mt-7 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-[#2e4d86] bg-[#14254a] p-3">
              <p className="text-lg font-bold text-white">10+</p>
              <p className="text-[11px] text-[#9bb8ea]">
                Years Experience
              </p>
            </div>

            <div className="rounded-xl border border-[#2e4d86] bg-[#14254a] p-3">
              <p className="text-lg">🚀</p>
              <p className="text-[11px] text-[#9bb8ea]">
                Visionary Leadership
              </p>
            </div>

            <div className="rounded-xl border border-[#2e4d86] bg-[#14254a] p-3">
              <p className="text-lg">❤</p>
              <p className="text-[11px] text-[#9bb8ea]">
                Customer First
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>

  <div className="mt-10 flex items-center justify-center gap-2 text-sm text-[#9fb8e8]">
    <span>◎</span>

    <span>
      United by a shared vision to
      <span className="text-[#36a8ff]"> simplify finance </span>
      and
      <span className="text-[#36a8ff]"> empower lives.</span>
    </span>
  </div>
</section>
       
        <section className="relative w-full pt-1 pb-20 text-center">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <h2 className="text-3xl font-semibold text-white md:text-4xl">Why Choose T-Home</h2>
            <p className="mx-auto mt-3 max-w-2xl text-[#d7def3]">
              Everything you need in one place.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-6">
              {[
                { value: "5k+", label: "Loans Approved" },
                { value: "95%", label: "Approval Rate" },
                { value: "10+", label: "Years Experience" },
                { value: "100%", label: "Certified Experts" },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  className="rounded-[18px] border border-[#c9dcff]/18 bg-[linear-gradient(180deg,rgba(30,45,95,0.5)_0%,rgba(20,31,76,0.44)_100%)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_10px_28px_rgba(0,0,0,0.2)] backdrop-blur-md"
                  whileHover={{ scale: 1.03 }}
                >
                  <h3 className="text-2xl font-bold text-white md:text-3xl">{item.value}</h3>
                  <p className="mt-3 text-sm text-[#d7def3] md:text-base">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;
