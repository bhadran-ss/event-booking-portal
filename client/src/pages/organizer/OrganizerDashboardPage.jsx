import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

export default function OrganizerDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-bold text-slate-700">
              EventHub Organizer
            </h1>
            <p className="text-sm text-slate-500">Welcome, {user?.name}</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Logout
          </button>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-3xl font-bold text-slate-900">
          Organizer Dashboard
        </h2>
      </section>
    </main>
  );
}
