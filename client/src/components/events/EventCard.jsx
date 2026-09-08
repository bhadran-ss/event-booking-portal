import { formatCurrency, formatEventDate } from "../../utils/formatters";

export default function EventCard({ event, onViewDetails }) {
  const isSoldOut = event.availableTickets <= 0;

  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {event.category}
        </span>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isSoldOut ? "bg-red-100 text-red-700" : "bg-slate-900 text-white"
          }`}
        >
          {isSoldOut ? "Sold Out" : `${event.availableTickets} remaining`}
        </span>
      </div>

      <h2 className="mt-4 text-xl font-bold text-slate-900">{event.title}</h2>

      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
        {event.description}
      </p>

      <div className="mt-5 space-y-2 text-sm text-slate-600">
        <p>
          <span className="font-semibold text-slate-800">Date:</span>{" "}
          {formatEventDate(event.date)}
        </p>

        <p>
          <span className="font-semibold text-slate-800">Location:</span>{" "}
          {event.location}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-slate-200 pt-5">
        <div>
          <p className="text-xs text-slate-500">Ticket price</p>
          <p className="text-lg font-bold text-slate-900">
            {formatCurrency(event.ticketPrice)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onViewDetails(event._id)}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          View details
        </button>
      </div>
    </article>
  );
}
