import { Link } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

export default function EventsPage() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-slate-100">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold text-slate-700">EventHub</h1>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="hidden text-sm text-slate-600 sm:block">
                  {user?.name}
                </span>

                {user?.role === "CUSTOMER" && (
                  <Link
                    to="/my-bookings"
                    className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    My Bookings
                  </Link>
                )}

                <button
                  type="button"
                  onClick={logout}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="font-semibold text-slate-700">
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-lg bg-slate-600 px-4 py-2 font-semibold text-white"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mt-2 text-4xl font-bold text-slate-900">Events</h2>
      </section>
    </main>
  );
}
