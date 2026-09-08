import { formatCurrency, formatEventDate } from "../../utils/formatters";

export default function BookingCard({ booking }) {
  const event = booking.event;
  const isConfirmed = booking.bookingStatus === "CONFIRMED";

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Booking
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            {event?.title || "Event unavailable"}
          </h2>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isConfirmed ? "bg-slate-900 text-white" : "bg-red-100 text-red-700"
          }`}
        >
          {booking.bookingStatus}
        </span>
      </div>

      <div className="mt-5 grid gap-4 border-y border-slate-200 py-5 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            Event date
          </p>

          <p className="mt-1 text-sm text-slate-800">
            {formatEventDate(event?.date)}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            Location
          </p>

          <p className="mt-1 text-sm text-slate-800">
            {event?.location || "Unavailable"}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            Tickets booked
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-900">
            {booking.ticketsBooked}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            Total amount
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-900">
            {formatCurrency(booking.totalAmount)}
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Booked on {formatEventDate(booking.createdAt)}
      </p>
    </article>
  );
}
