import React, { useState } from "react";
import { Mail, Phone, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const services = ["Home Loans", "Loan Against Property", "Income Tax Filing", "Business Registration"];

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: services[0],
    message: "",
  });

  const [loading, setLoading] = useState(false);

 const handleChange = (e) => {
  const { name, value } = e.target;

  let finalValue = value;

  // ✅ PHONE VALIDATION
  if (name === "phone") {
    finalValue = value.replace(/\D/g, "").slice(0, 10);
  }

  setFormData((p) => ({ ...p, [name]: finalValue }));
};

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden text-white"
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

      <div className="relative z-10 font-outfit selection:bg-blue-500/30">

      {/* 1. HERO SECTION */}
      <section className="relative pt-24 md:pt-32 pb-8 md:pb-12 text-center overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] md:w-[1000px] h-[300px] md:h-[500px] bg-blue-600/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">Contact Us</h1>
          <p className="text-gray-200 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-light px-2">
            Comprehensive financial solutions detailed to meet your personal and business growth needs.
          </p>
        </div>
      </section>

      {/* 2. MAIN CONTACT SECTION */}
      <div className="relative bg-transparent">

        <section className="relative z-10 px-4 sm:px-6 md:px-20 pt-10 md:pt-16 pb-12">
          {/* Use items-stretch to ensure both columns have the exact same height */}
          <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[0.7fr_1.3fr] gap-12 lg:gap-16 items-stretch text-center lg:text-left">

            {/* Left Side: Text and Image */}
            <div className="flex flex-col h-full"> {/* Added h-full to parent */}
              <div className="mb-8">
                <span className="inline-block px-3 py-1 rounded bg-blue-500/10 text-blue-400 text-[10px] md:text-[11px] font-bold tracking-[0.2em] mb-4 border border-blue-500/20 uppercase">
                  CONTACT US
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold leading-[1.2] lg:leading-[1.1] mb-4">
                  Your Dream Home is <br className="hidden sm:block" />
                  <span className="text-blue-500">Just a Loan Away!</span>
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto lg:mx-0 font-light">
                  Turn your dream of owning a home into reality with our hassle-free home loan solutions.
                  Get quick approval and the best interest rates.
                </p>
              </div>

              {/* IMAGE CONTAINER: Fixed for exact overlap */}
              <div className="w-full max-w-[480px]">
                <img
                  src="/home/contact img.png"
                  alt="Support Specialist"
                  className="w-full h-auto rounded-[32px] shadow-2xl border border-white/5"
                />
              </div>
            </div>
            {/* Right Side: Form Card */}
            <div className="bg-white/[0.05] backdrop-blur-[24px] border border-white/10 rounded-[16px] p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full mx-auto lg:mx-0 text-left">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <FormInput label="Name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" />
                  <FormInput 
  label="Phone Number" 
  name="phone" 
  type="tel"
  maxLength={10}
  value={formData.phone} 
  onChange={handleChange} 
  placeholder="7645839566" 
/>
                </div>

                <FormInput label="Your Email" name="email" value={formData.email} onChange={handleChange} placeholder="Email@Example.com" type="email" />

                <div>
                  <label className="text-[10px] md:text-[11px] text-gray-400 mb-1.5 block font-semibold uppercase tracking-widest">Select Your Service</label>
                  <div className="relative">
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full h-12 md:h-13 px-4 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer font-light"
                    >
                      {services.map((s) => <option key={s} value={s} className="bg-[#020617]">{s}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">▼</div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] md:text-[11px] text-gray-400 mb-1.5 block font-semibold uppercase tracking-widest">Message</label>
                  <textarea
                    name="message"
                    rows="3"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 resize-none transition-all font-light"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 md:h-13 mt-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-[12px] md:text-[13px] font-bold tracking-widest text-white transition-all uppercase shadow-lg shadow-blue-600/30"
                >
                  {loading ? "Processing..." : "Submit Request"}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* 3. TRUST & ICON SECTION */}
        <section className="relative z-10 pt-4 pb-12 border-t border-white/5">
          <p className="text-gray-300 text-center text-[10px] sm:text-xs md:text-sm mb-8 md:mb-12 font-bold uppercase tracking-[0.2em] px-4">
            Trusted by startups and growing businesses worldwide
          </p>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row flex-wrap items-center md:items-start justify-center gap-10 md:gap-20 lg:gap-36 px-6">
            <ContactDetail icon={<Mail size={32} className="md:w-[42px] md:h-[42px]" />} title="Email Support" value="info@thome.co.in" />
            <ContactDetail icon={<Phone size={32} className="md:w-[42px] md:h-[42px]" />} title="Phone" value="+91 70321 83836" />
            <ContactDetail icon={<MessageCircle size={32} className="md:w-[42px] md:h-[42px]" />} title="Live Chat" value="Available 24/7" />
          </div>
        </section>
      </div>
      </div>
    </div>
  );
}

/* SUB-COMPONENTS */

function FormInput({ label, ...props }) {
  return (
    <div className="w-full">
      <label className="text-[10px] md:text-[11px] text-gray-400 mb-1.5 block font-semibold uppercase tracking-widest">{label}</label>
      <input
        {...props}
        className="w-full h-12 md:h-13 px-4 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-all font-light"
        required
      />
    </div>
  );
}

function ContactDetail({ icon, title, value }) {
  return (
    <div className="flex items-center gap-4 md:gap-6 group cursor-default w-full md:w-auto justify-start sm:justify-center md:justify-start max-w-[250px] md:max-w-none mx-auto md:mx-0">
      <div className="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 shrink-0">
        <div className="absolute inset-0 bg-blue-600/25 blur-[25px] md:blur-[35px] rounded-full scale-150 group-hover:bg-blue-500/40 transition-all duration-500" />
        <div className="absolute inset-0 bg-blue-400/20 blur-[10px] md:blur-[15px] rounded-full scale-100 group-hover:bg-blue-400/50 transition-all duration-500" />
        <div className="relative z-10 text-blue-400 group-hover:text-blue-200 transition-colors drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="flex flex-col text-left">
        <h4 className="text-base md:text-lg font-bold text-white leading-tight tracking-tight">{title}</h4>
        <p className="text-gray-400 text-[18px] font-normal mt-1 group-hover:text-gray-200 transition-colors">{value}</p>
      </div>
    </div>
  );
}
