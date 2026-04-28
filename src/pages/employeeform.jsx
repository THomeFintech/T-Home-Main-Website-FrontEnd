import React, { useState } from "react";
import { FileText, UploadCloud, Send } from "lucide-react";

export default function HiringForm() {

  /* ================= STATE ================= */
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    qualification: "",
    experience: "",
    cover_letter: "",
    resume: null,
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const BASE_URL = import.meta.env.VITE_API_URL;

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "resume") {
      setFormData((prev) => ({
        ...prev,
        resume: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.resume) {
      setMsg("❌ Please upload resume");
      return;
    }

    const form = new FormData();

    form.append("full_name", formData.full_name);
    form.append("phone", formData.phone);
    form.append("qualification", formData.qualification);
    form.append("experience", formData.experience);
    form.append("cover_letter", formData.cover_letter);
    form.append("resume", formData.resume);

    console.log("🚀 Sending FormData...");

    try {
      setLoading(true);
      setMsg("");

      const res = await await fetch(`${BASE_URL}/apply-job`, {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      console.log("✅ Response:", data);

      if (data.status === "success") {
        setMsg("✅ Application submitted successfully!");

        setFormData({
          full_name: "",
          phone: "",
          qualification: "",
          experience: "",
          cover_letter: "",
          resume: null,
        });
      } else {
        setMsg("❌ Failed to submit");
      }

    } catch (err) {
      console.error(err);
      setMsg("❌ Error submitting application");
    } finally {
      setLoading(false);
    }
  };

  /* ================= STYLES ================= */
  const inputClass =
    "w-full rounded-xl border border-white/30 bg-white/20 backdrop-blur-md px-4 py-3 text-[12px] sm:text-[16px] text-white placeholder:text-white/60 outline-none transition focus:border-white/60 focus:ring-2 focus:ring-white/30 shadow-inner";

  const labelClass = "mb-2 block text-sm sm:text-[16px] font-medium text-white/80";

  return (
  <div className="min-h-screen pt-28 pb-10 px-4 flex items-start justify-center bg-[radial-gradient(circle,#1E2447_0%,#000000_70%)]">

    <div className="relative w-full max-w-3xl mx-auto rounded-[28px] border border-white/30 bg-white/10 backdrop-blur-2xl p-6 md:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.5)]">      {/* HEADER */}
      <div className="mb-8 flex items-center gap-3">
        <FileText className="h-7 w-7 text-blue-300" />
        <h2 className="text-3xl font-semibold text-blue-200">
          Employee Hiring Form
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="grid md:grid-cols-2 gap-6">

          {/* FULL NAME */}
          <div>
            <label className={labelClass}>Full Name</label>
            <input
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* PHONE */}
          <div>
            <label className={labelClass}>Mobile Number</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* QUALIFICATION */}
          <div>
            <label className={labelClass}>Qualification</label>
            <input
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* EXPERIENCE */}
          <div>
            <label className={labelClass}>Experience</label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

        </div>

        {/* COVER LETTER */}
        <div>
          <label className={labelClass}>Cover Letter</label>
          <textarea
            name="cover_letter"
            value={formData.cover_letter}
            onChange={handleChange}
            rows="4"
            className={inputClass}
            required
          />
        </div>

        {/* FILE UPLOAD */}
        <div>
          <label className={labelClass}>Upload Resume</label>

          <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/30 rounded-xl bg-white/10 cursor-pointer hover:bg-white/20 transition">
            <UploadCloud className="h-8 w-8 text-white/70 mb-2" />
            <span className="text-sm text-white/70">
              Click to upload
            </span>

            <input
              type="file"
              name="resume"
              onChange={handleChange}
              className="hidden"
            />
          </label>

          {formData.resume && (
            <p className="mt-2 text-sm text-white/70">
              Selected: {formData.resume.name}
            </p>
          )}
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 py-4 rounded-xl text-white font-semibold"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>

        {/* MESSAGE */}
        {msg && (
          <p className="text-center text-sm text-green-400">
            {msg}
          </p>
        )}

      </form>
    </div>
    </div>
  );
}
