import React from "react";
import { motion } from "framer-motion";
import { Flag, Eye } from "lucide-react";
import Aboutus from "../assets/Aboutus.png";

const About = () => {
  return (
    <div
      className="relative min-h-screen overflow-hidden text-white font-sans"
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

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">

        <img
          src={Aboutus}
          alt="hero"
          className="absolute w-full h-full object-cover brightness-110"
        />

        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>

        <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl px-6"
        >
          <span className="px-4 py-1 border border-gray-400 rounded-full text-sm">
            About Us
          </span>

          <h1 className="text-4xl md:text-6xl font-bold mt-6 leading-tight">
            Empowering Your{" "}
            <span className="text-blue-500">Financial Future</span>
          </h1>

          <p className="mt-5 text-gray-300 leading-relaxed text-base md:text-lg">
            We are on a mission to simplify financial services, making home
            ownership and business growth accessible, transparent, and
            hassle-free for everyone.
          </p>
        </motion.div>
      </section>

      {/* JOURNEY */}
      <section className="-mt-16 relative z-20 bg-transparent py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 md:gap-20 items-center">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">
              A Journey of Trust and Innovation
            </h2>

            <p className="text-gray-400 leading-relaxed mb-5 text-sm md:text-base">
              Founded in 2025, T-Home started with a simple vision: to bridge the
              gap between complex financial systems and the everyday dreams of
              individuals and businesses.
            </p>

            <p className="text-gray-400 leading-relaxed mb-8 text-sm md:text-base">
              Today, we leverage intelligent automation and deep industry
              expertise to offer a comprehensive suite of financial solutions.
            </p>

            <div className="border-t border-gray-800 mb-6"></div>

            <motion.div
              className="flex gap-24 md:gap-40"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div>
                <h3 className="text-2xl md:text-3xl font-bold text-blue-500">
                  2025
                </h3>
                <p className="text-gray-500 text-sm mt-1">Year Founded</p>
              </motion.div>

              <motion.div>
                <h3 className="text-2xl md:text-3xl font-bold text-blue-500">
                  5k+
                </h3>
                <p className="text-gray-500 text-sm mt-1">Happy Clients</p>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex justify-center md:justify-end"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-2xl"></div>

              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf"
                alt="team"
                className="relative w-full max-w-[420px] md:max-w-[480px] rounded-2xl shadow-2xl"
              />
            </div>
          </motion.div>

        </div>
      </section>

      {/* CORE PRINCIPLES */}
      <section className="py-20 md:py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-2">
          Our Core Principles
        </h2>
        <p className="text-gray-400 mb-10 md:mb-14">
          The driving force behind everything we do at T-Home.
        </p>

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 md:gap-10">

          <motion.div className="bg-[#0f172a] p-6 md:p-8 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-3 flex items-center justify-center gap-2">
              <Flag className="text-blue-500 w-5 h-5" />
              Our Mission
            </h3>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              To simplify financial services and make home loans, taxation, and
              business registration accessible, transparent, and hassle-free.
            </p>
          </motion.div>

          <motion.div className="bg-[#0f172a] p-6 md:p-8 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-3 flex items-center justify-center gap-2">
              <Eye className="text-blue-500 w-5 h-5" />
              Our Vision
            </h3>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              To be the nation’s most trusted financial platform.
            </p>
          </motion.div>

        </div>
      </section>

      {/* ✅ UPDATED TEAM SECTION */}
      <section className="py-24 md:py-28 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-3">
          The Faces Behind Our Success
        </h2>

        <p className="text-gray-400 mb-12 md:mb-16 max-w-2xl mx-auto">
          Experienced specialists guiding you with care and expertise.
        </p>

        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-10">

          {/* CARD 1 */}
          <motion.div
            className="relative bg-gradient-to-b from-gray-900/80 to-gray-800/80 backdrop-blur-xl p-10 rounded-2xl border border-gray-700 shadow-xl hover:shadow-2xl transition"
            whileHover={{ scale: 1.03 }}
          >
            <div className="absolute inset-0 rounded-2xl bg-white/5 blur-xl"></div>

            <img
              src="ceo.png"
              className="relative w-24 h-24 mx-auto rounded-full mb-5 border-2 border-gray-600"
            />

            <h3 className="text-xl font-semibold">
              Ravinder Reddy Attapuram
            </h3>

            <p className="text-sm text-gray-400 mb-4">
              Founder & CEO
            </p>

            <p className="text-gray-400 text-sm leading-relaxed">
              Entrepreneur, strategist, and changemaker leading T-Home towards a
              future where finance is transparent, easy, and empowering for every
              individual and business.
            </p>
          </motion.div>

          {/* CARD 2 */}
          <motion.div
            className="relative bg-gradient-to-b from-gray-900/80 to-gray-800/80 backdrop-blur-xl p-10 rounded-2xl border border-gray-700 shadow-xl hover:shadow-2xl transition"
            whileHover={{ scale: 1.03 }}
          >
            <div className="absolute inset-0 rounded-2xl bg-white/5 blur-xl"></div>

            <img
              src="cto.jpeg"
              className="relative w-24 h-24 mx-auto rounded-full mb-5 border-2 border-gray-600"
            />

            <h3 className="text-xl font-semibold">
              K C Pratheek Reddy
            </h3>

            <p className="text-sm text-gray-400 mb-4">
              Co-Founder & CTO
            </p>

            <p className="text-gray-400 text-sm leading-relaxed">
              The tech visionary behind T-Home’s digital transformation. Leads
              platform innovation and fintech initiatives to build scalable and
              intelligent solutions.
            </p>
          </motion.div>

        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="py-20 md:py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-2">
          Why Choose T-Home
        </h2>
        <p className="text-gray-400 mb-10 md:mb-14">
          Everything you need in one place.
        </p>

        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
  {[
    { value: "5k+", label: "Loans Approved" },
    { value: "95%", label: "Approval Rate" },
    { value: "10+", label: "Years Experience" },
    { value: "100%", label: "Certified Experts" },
  ].map((item, i) => (
    <motion.div
      key={i}
      className="bg-gradient-to-br from-gray-900 to-blue-900 p-6 md:p-8 rounded-2xl shadow-lg text-center"
      whileHover={{ scale: 1.05 }}
    >
      <h3 className="text-2xl md:text-3xl font-bold">{item.value}</h3>
      <p className="mt-3 text-sm md:text-base text-gray-300">{item.label}</p>
    </motion.div>
  ))}
</div>
      </section>

      </div>
    </div>
  );
};

export default About;
