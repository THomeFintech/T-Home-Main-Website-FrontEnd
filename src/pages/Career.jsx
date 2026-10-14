import React from "react";
import SEO from "../components/SEO";

/*
  Careers page. Roles and the resume email come from the CEO's hiring poster
  (Change Document 4.5: list only the roles you are actually hiring for).
  To change the openings, edit OPEN_ROLES below.
*/
const OPEN_ROLES = [
  "Full Stack Developer Intern",
  "Backend Developer Intern",
  "Graphic Designer Intern",
  "Video Editor Intern",
  "Database Intern",
  "Content Intern",
  "SEO Intern",
];

const RESUME_EMAIL = "info@thome.co.in";

export default function Career() {
  return (
    <div
      className="min-h-screen pt-24 font-sans text-slate-100"
      style={{
        background:
          "radial-gradient(1200px 680px at 20% -10%, rgba(90,140,255,0.18), transparent 62%), radial-gradient(980px 580px at 100% 0%, rgba(36,107,198,0.14), transparent 60%), linear-gradient(180deg, #071327 0%, #08162b 100%)",
      }}
    >
      <SEO
        title="Careers"
        description="Build the future of financial services with T-HOME Fintech. Current internship openings."
        path="/career"
      />

      <div className="mx-auto max-w-4xl px-6 py-16 text-center">
        <p className="mb-3 text-xs tracking-wide text-blue-400">CAREERS</p>
        <h1 className="mb-3 text-4xl font-bold leading-tight md:text-5xl">
          Build the Future of Financial Services With T-HOME.
        </h1>
        <p className="mb-8 text-xl font-semibold text-yellow-300">We&apos;re Hiring Interns</p>

        <p className="mb-4 text-sm text-gray-400">We are looking for:</p>
        <ul className="mx-auto grid max-w-xl gap-3 text-left">
          {OPEN_ROLES.map((role) => (
            <li
              key={role}
              className="rounded-[14px] border border-[#2f5fbe] bg-[#0b1d45]/70 px-5 py-4 text-base font-semibold text-white"
            >
              {role}
            </li>
          ))}
        </ul>

        <p className="mt-10 text-base text-white">
          Send Resume at:{" "}
          <a href={`mailto:${RESUME_EMAIL}`} className="font-semibold text-blue-400 underline">
            {RESUME_EMAIL}
          </a>
        </p>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-gray-400">
          Build your future with T-Home Fintech! Be a part of our journey to build innovative
          financial solutions for a better tomorrow.
        </p>
      </div>
    </div>
  );
}
