import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getEvents } from "../../api/event.api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EventCard from "../../components/events/EventCard";
import EventFilters from "../../components/events/EventFilters";
import { getApiError } from "../../utils/getApiError";
import EventDetailsModal from "../../components/events/EventDetailsModal";
import Navbar from "../../layouts/Navbar";

export default function EventsPage() {
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
      <Navbar />

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
