import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { getEvents } from "../../api/event.api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EventCard from "../../components/events/EventCard";
import EventFilters from "../../components/events/EventFilters";
import { useAuth } from "../../hooks/useAuth";
import { getApiError } from "../../utils/getApiError";
import EventDetailsModal from "../../components/events/EventDetailsModal";

export default function EventsPage() {
  const { isAuthenticated, user, logout } = useAuth();

  const [events, setEvents] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const loadEvents = useCallback(async () => {
    setIsLoading(true);

    try {
      const eventList = await getEvents({
        category,
        search,
      });

      setEvents(eventList);
    } catch (error) {
      toast.error(getApiError(error));
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleSearch = (event) => {
    event.preventDefault();
    setSearch(searchInput.trim());
  };

  const handleClear = () => {
    setSearchInput("");
    setSearch("");
    setCategory("");
  };

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

      <section className="mx-auto max-w-7xl px-4 py-10">
        <EventFilters
          searchInput={searchInput}
          category={category}
          onSearchInputChange={setSearchInput}
          onCategoryChange={setCategory}
          onSubmit={handleSearch}
          onClear={handleClear}
        />

        {isLoading ? (
          <div className="flex justify-center py-20 text-slate-700">
            <LoadingSpinner size="lg" />
          </div>
        ) : events.length === 0 ? (
          <div className="mt-8 rounded-xl border border-slate-200 bg-white px-5 py-14 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              No upcoming events found
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Try another search term or category.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onViewDetails={setSelectedEventId}
              />
            ))}
          </div>
        )}
      </section>
      {selectedEventId && (
        <EventDetailsModal
          eventId={selectedEventId}
          onClose={() => setSelectedEventId(null)}
          onBookingCompleted={loadEvents}
        />
      )}
    </main>
  );
}
