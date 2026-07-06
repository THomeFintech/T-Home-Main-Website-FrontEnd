import { Link } from "react-router-dom";

export default function RelatedServices({
  title = "Related Services",
  services = [],
}) {
  if (!services.length) return null;

  return (
    <section className="mt-16 border-t pt-10">
      <h2 className="text-2xl font-bold mb-6">
        {title}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Link
          key={service.path}
          to={service.path}
          aria-label={`Learn more about ${service.title}`}
          className="group rounded-xl border p-5 transition-all duration-200 hover:border-blue-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <h3 className="font-semibold group-hover:text-blue-600">
            {service.title}
          </h3>
        
          <p className="mt-2 text-sm text-gray-600">
            {service.description}
          </p>
        </Link>
        ))}
      </div>
    </section>
  );
}