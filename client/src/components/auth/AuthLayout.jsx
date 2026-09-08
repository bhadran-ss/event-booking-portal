import { Link } from "react-router-dom";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">
        <section className="relative hidden overflow-hidden bg-slate-700 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
          <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-white/10" />

          <div className="relative">
            <Link to="/events" className="text-2xl font-bold tracking-tight">
              EventHub
            </Link>
          </div>

          <div className="relative max-w-md">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-200">
              Discover. Organize. Experience.
            </p>

            <h2 className="text-4xl font-bold leading-tight">
              Your next memorable event starts here.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-200">
              Browse upcoming events, reserve tickets, or organize experiences
              for your audience.
            </p>
          </div>

          <p className="relative text-sm text-slate-200">
            Multi-vendor event and ticket booking portal
          </p>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
          <div className="w-full max-w-md">
            <Link
              to="/events"
              className="mb-10 inline-block text-2xl font-bold text-slate-700 lg:hidden"
            >
              EventHub
            </Link>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>

            <p className="mt-2 text-slate-600">{subtitle}</p>

            <div className="mt-8">{children}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
