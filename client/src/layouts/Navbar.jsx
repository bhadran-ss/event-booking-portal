import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

const getNavLinkClass = ({ isActive }) => {
  return `rounded-lg px-3 py-2 text-sm font-semibold transition ${
    isActive
      ? "bg-slate-100 text-slate-900"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;
};

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <Link to="/events" className="text-xl font-bold text-slate-900">
          EventHub
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <NavLink to="/events" className={getNavLinkClass}>
            Events
          </NavLink>

          {isAuthenticated && user?.role === "CUSTOMER" && (
            <NavLink to="/my-bookings" className={getNavLinkClass}>
              My Bookings
            </NavLink>
          )}

          {isAuthenticated && user?.role === "ORGANIZER" && (
            <NavLink to="/organizer/events" className={getNavLinkClass}>
              Dashboard
            </NavLink>
          )}

          {isAuthenticated ? (
            <>
              <span className="hidden px-2 text-sm text-slate-500 md:block">
                {user?.name}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700 sm:px-4"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={getNavLinkClass}>
                Login
              </NavLink>

              <Link
                to="/register"
                className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700 sm:px-4"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
