import { Link } from "react-router-dom";

export default function MyBookingsPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <Link to="/events" className="font-semibold text-slate-600 hover:text-slate-700">
          ← Back to events
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-slate-900">My Bookings</h1>

        <p className="mt-3 text-slate-600">
          Customer booking cards will be added later.
        </p>
      </div>
    </main>
  );
}
