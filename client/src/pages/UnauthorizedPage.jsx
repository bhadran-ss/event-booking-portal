import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md text-center">
        <p className="text-6xl font-bold text-slate-600">403</p>

        <h1 className="mt-5 text-3xl font-bold text-slate-900">
          Access denied
        </h1>

        <p className="mt-3 text-slate-600">
          Your account does not have permission to access this page.
        </p>

        <Link
          to="/events"
          className="mt-7 inline-block rounded-xl bg-slate-600 px-5 py-3 font-semibold text-white transition hover:bg-slate-700"
        >
          Browse events
        </Link>
      </div>
    </main>
  );
}
