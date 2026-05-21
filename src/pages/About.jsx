import React from "react";
import { motion } from "framer-motion";
import { Flag, Eye } from "lucide-react";

const About = () => {
  return (
    <div
      className="relative min-h-screen overflow-hidden text-white font-['Outfit',sans-serif]"
      style={{
        background: "radial-gradient(1200px 680px at 20% -10%, rgba(90,140,255,0.18), transparent 62%), radial-gradient(980px 580px at 100% 0%, rgba(36,107,198,0.14), transparent 60%), linear-gradient(180deg, #071327 0%, #08162b 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[440px] w-[980px] -translate-x-1/2 rounded-full bg-[#2f73ff]/20 blur-[140px]" />
        <div className="absolute bottom-[18%] left-[8%] h-[300px] w-[300px] rounded-full bg-[#4f84ff]/14 blur-[120px]" />
        <div className="absolute bottom-[22%] right-[8%] h-[280px] w-[280px] rounded-full bg-[#315cc9]/12 blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_45%,transparent_76%)]" />
      </div>

      <div className="relative z-10">
        <section className="relative flex min-h-[88svh] items-center justify-center overflow-hidden px-6 py-24 text-center md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 mx-auto max-w-4xl"
          >
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#89b6ff]/35 bg-white/5 px-4 py-2 text-[12px] font-medium tracking-wide text-[#cfe0ff] backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-[#4ea3ff]" />
              About T-Home
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
              Empowering Your <span className="text-[#66abff]">Financial Future</span>
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[#d7def3] md:text-lg">
              We simplify financial services by combining trust, speed, and intelligent automation so home ownership,
              business growth, and compliance services feel straightforward instead of overwhelming.
            </p>

            <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
              {[
                { value: "2025", label: "Founded" },
                { value: "5k+", label: "Happy Clients" },
                { value: "24h", label: "Fast Support" },
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

        <section className="relative w-full py-[100px]">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-semibold text-white md:text-4xl">A Journey of Trust and Innovation</h2>
              <p className="mx-auto mt-4 max-w-3xl text-[15px] leading-7 text-[#d7def3]">
                Founded in 2025, T-Home bridges complex financial systems and everyday goals with a platform designed
                to be transparent, intelligent, and easy to use.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="rounded-[20px] border border-[#c9dcff]/18 bg-[linear-gradient(180deg,rgba(30,45,95,0.5)_0%,rgba(20,31,76,0.44)_100%)] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_10px_28px_rgba(0,0,0,0.2)] backdrop-blur-md"
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
                className="rounded-[20px] border border-[#c9dcff]/18 bg-[linear-gradient(180deg,rgba(30,45,95,0.5)_0%,rgba(20,31,76,0.44)_100%)] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_10px_28px_rgba(0,0,0,0.2)] backdrop-blur-md"
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

        <section className="relative w-full py-[100px]">
          <div className="mx-auto max-w-7xl px-6 text-center md:px-12">
            <h2 className="text-3xl font-semibold text-white md:text-4xl">Our Core Principles</h2>
            <p className="mx-auto mt-3 max-w-2xl text-[#d7def3]">
              The driving force behind everything we do at T-Home.
            </p>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
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

        <section className="relative w-full py-[100px]">
          <div className="mx-auto max-w-7xl px-6 text-center md:px-12">
            <h2 className="text-3xl font-semibold text-white md:text-4xl">Leadership</h2>
            <p className="mx-auto mt-3 max-w-2xl text-[#d7def3]">
              The people shaping the platform and guiding the product direction.
            </p>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {[
                {
                  initials: "RR",
                  name: "Ravinder Reddy Attapuram",
                  role: "Founder & CEO",
                  text: "Entrepreneur, strategist, and changemaker leading T-Home toward a future where finance is transparent, easy, and empowering.",
                },
                {
                  initials: "KP",
                  name: "K C Pratheek Reddy",
                  role: "Co-Founder & CTO",
                  text: "The tech visionary behind T-Home’s digital transformation, focused on scalable, intelligent, and reliable product experiences.",
                },
              ].map((leader) => (
                <motion.div
                  key={leader.name}
                  className="rounded-[20px] border border-[#c9dcff]/18 bg-[linear-gradient(180deg,rgba(30,45,95,0.5)_0%,rgba(20,31,76,0.44)_100%)] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_10px_28px_rgba(0,0,0,0.2)] backdrop-blur-md"
                  whileHover={{ y: -4 }}
                >
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#89b6ff]/30 bg-[linear-gradient(180deg,rgba(58,108,197,0.46)_0%,rgba(36,73,148,0.4)_100%)] text-2xl font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.24)]">
                    {leader.initials}
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-white">{leader.name}</h3>
                  <p className="mt-2 text-sm text-[#9fb8e8]">{leader.role}</p>
                  <p className="mt-4 text-[15px] leading-7 text-[#d7def3]">{leader.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative w-full py-[100px] text-center">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <h2 className="text-3xl font-semibold text-white md:text-4xl">Why Choose T-Home</h2>
            <p className="mx-auto mt-3 max-w-2xl text-[#d7def3]">
              Everything you need in one place.
            </p>

            <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
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
