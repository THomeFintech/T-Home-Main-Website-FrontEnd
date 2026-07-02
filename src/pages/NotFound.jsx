import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center">
      <p className="mb-2 text-sm font-medium uppercase tracking-widest text-blue-300">
        404
      </p>
      <h1 className="mb-4 text-3xl font-semibold text-white md:text-4xl">
        Page not found
      </h1>
      <p className="mb-8 max-w-md text-slate-300">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link
        to="/"
        className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
      >
        Back to homepage
      </Link>
    </div>
  );
}
