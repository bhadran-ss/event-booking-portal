import { formatCurrency, formatEventDate } from "../../utils/formatters";

export default function OrganizerEventCard({ event, onViewAttendees }) {
  const ticketsSold = Number(
    event.ticketsSold ??
      event.soldTickets ??
      event.salesSummary?.ticketsSold ??
      event.totalTickets - event.availableTickets,
  );

  const totalRevenue = Number(
    event.totalRevenue ??
      event.revenue ??
      event.salesSummary?.totalRevenue ??
      ticketsSold * event.ticketPrice,
  );

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {event.category}
          </span>

          <h2 className="mt-3 text-xl font-bold text-slate-900">
            {event.title}
          </h2>
        </div>

        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
          {event.availableTickets} remaining
        </span>
      </div>

      <div className="mt-4 space-y-1 text-sm text-slate-600">
        <p>{formatEventDate(event.date)}</p>
        <p>{event.location}</p>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 border-y border-slate-200 py-4 text-center">
        <div>
          <p className="text-xs text-slate-500">Capacity</p>
          <p className="mt-1 font-bold text-slate-900">{event.totalTickets}</p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Sold</p>
          <p className="mt-1 font-bold text-slate-900">{ticketsSold}</p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Revenue</p>
          <p className="mt-1 font-bold text-slate-900">
            {formatCurrency(totalRevenue)}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          onViewAttendees(event);
        }}
        className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
      >
        View Attendees
      </button>
    </article>
  );
}
