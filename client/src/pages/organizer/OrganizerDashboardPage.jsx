import Navbar from "../../layouts/Navbar";

export default function OrganizerDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-3xl font-bold text-slate-900">
          Organizer Dashboard
        </h1>

        <p className="mt-2 text-slate-600">
          Create events and view ticket sales.
        </p>
      </section>
    </main>
  );
}
