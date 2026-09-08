import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { getOrganizerEvents } from "../../api/organizer.api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Navbar from "../../layouts/Navbar";
import AttendeeModal from "../../components/organizer/AttendeeModal";
import CreateEventForm from "../../components/organizer/CreateEventForm";
import OrganizerEventCard from "../../components/organizer/OrganizerEventCard";
import { getApiError } from "../../utils/getApiError";
import { formatCurrency } from "../../utils/formatters";

const getTicketsSold = (event) => {
  return Number(
    event.ticketsSold ??
      event.soldTickets ??
      event.salesSummary?.ticketsSold ??
      event.totalTickets - event.availableTickets,
  );
};

const getRevenue = (event) => {
  const ticketsSold = getTicketsSold(event);

  return Number(
    event.totalRevenue ??
      event.revenue ??
      event.salesSummary?.totalRevenue ??
      ticketsSold * event.ticketPrice,
  );
};

export default function OrganizerDashboardPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadEvents = useCallback(async () => {
    setIsLoading(true);

    try {
      const eventList = await getOrganizerEvents();
      setEvents(eventList);
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const totals = useMemo(() => {
    return events.reduce(
      (summary, event) => ({
        ticketsSold: summary.ticketsSold + getTicketsSold(event),
        revenue: summary.revenue + getRevenue(event),
      }),
      {
        ticketsSold: 0,
        revenue: 0,
      },
    );
  }, [events]);

  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Organizer Dashboard
          </h1>

          <p className="mt-2 text-slate-600">
            Create events and review ticket sales.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Total events</p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {events.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Tickets sold</p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {totals.ticketsSold}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Total revenue</p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {formatCurrency(totals.revenue)}
            </p>
          </div>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[360px_1fr]">
          <CreateEventForm onCreated={loadEvents} />

          <div>
            <h2 className="text-xl font-bold text-slate-900">My Events</h2>

            {isLoading ? (
              <div className="flex justify-center py-20 text-slate-700">
                <LoadingSpinner size="lg" />
              </div>
            ) : events.length === 0 ? (
              <div className="mt-5 rounded-xl border border-slate-200 bg-white px-5 py-14 text-center">
                <h3 className="font-semibold text-slate-900">
                  No events created
                </h3>

                <p className="mt-2 text-sm text-slate-600">
                  Use the form to create your first event.
                </p>
              </div>
            ) : (
              <div className="mt-5 grid gap-5 xl:grid-cols-2">
                {events.map((event) => (
                  <OrganizerEventCard
                    key={event._id}
                    event={event}
                    onViewAttendees={setSelectedEvent}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {selectedEvent && (
        <AttendeeModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </main>
  );
}
