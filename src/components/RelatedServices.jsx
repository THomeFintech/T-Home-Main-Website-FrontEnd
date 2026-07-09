import { Link } from "react-router-dom";

export default function RelatedServices({
  title = "Related Services",
  services = [],
}) {
  if (!services.length) return null;

  return (
    <section className="mt-10 mb-24 border-t border-white/10 pt-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="mb-8 text-3xl font-bold text-white">
          {title}
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.path}
              to={service.path}
              aria-label={`Learn more about ${service.title}`}
              className="
                group
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                p-6
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-blue-500/40
                hover:bg-white/[0.06]
                hover:shadow-[0_20px_40px_rgba(0,0,0,0.35)]
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            >
              <h3 className="text-xl font-semibold text-white transition-colors group-hover:text-blue-300">
                {service.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                {service.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}