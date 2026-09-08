import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { bookEvent } from "../../api/booking.api";
import { getEventById } from "../../api/event.api";
import { useAuth } from "../../hooks/useAuth";
import { getApiError } from "../../utils/getApiError";
import { formatCurrency, formatEventDate } from "../../utils/formatters";
import LoadingSpinner from "../common/LoadingSpinner";

export default function EventDetailsModal({
  eventId,
  onClose,
  onBookingCompleted,
}) {
  const { isAuthenticated, user } = useAuth();

  const [event, setEvent] = useState(null);
  const [requestedTickets, setRequestedTickets] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [loadError, setLoadError] = useState("");

  const loadEvent = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const eventData = await getEventById(eventId);
      setEvent(eventData);
    } catch (error) {
      setLoadError(getApiError(error));
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleBooking = async () => {
    const ticketCount = Number(requestedTickets);

    if (!Number.isInteger(ticketCount) || ticketCount < 1) {
      toast.error("Enter a valid ticket quantity.");
      return;
    }

    if (ticketCount > event.availableTickets) {
      toast.error(`Only ${event.availableTickets} tickets are available.`);
      return;
    }

    setIsBooking(true);

    try {
      await bookEvent(event._id, ticketCount);

      toast.success("Tickets booked successfully.");

      setRequestedTickets(1);

      await loadEvent();
      await onBookingCompleted();
    } catch (error) {
      toast.error(getApiError(error));
      await loadEvent();
      await onBookingCompleted();
    } finally {
      setIsBooking(false);
    }
  };

  const handleBackdropClick = (clickEvent) => {
    if (clickEvent.target === clickEvent.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
    >
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Event Details</h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20 text-slate-700">
            <LoadingSpinner size="lg" />
          </div>
        ) : loadError ? (
          <div className="p-8 text-center">
            <p className="text-red-600">{loadError}</p>

            <button
              type="button"
              onClick={loadEvent}
              className="mt-4 rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {event.category}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  event.availableTickets <= 0
                    ? "bg-red-100 text-red-700"
                    : "bg-slate-900 text-white"
                }`}
              >
                {event.availableTickets <= 0
                  ? "Sold Out"
                  : `${event.availableTickets} tickets remaining`}
              </span>
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-900">
              {event.title}
            </h1>

            <p className="mt-3 leading-7 text-slate-600">{event.description}</p>

            <div className="mt-6 border-y border-slate-200 py-5">
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase text-slate-500">
                    Date
                  </dt>
                  <dd className="mt-1 text-sm text-slate-800">
                    {formatEventDate(event.date)}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase text-slate-500">
                    Location
                  </dt>
                  <dd className="mt-1 text-sm text-slate-800">
                    {event.location}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase text-slate-500">
                    Ticket price
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-900">
                    {formatCurrency(event.ticketPrice)}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase text-slate-500">
                    Total capacity
                  </dt>
                  <dd className="mt-1 text-sm text-slate-800">
                    {event.totalTickets} tickets
                  </dd>
                </div>
              </dl>
            </div>

            {!isAuthenticated ? (
              <div className="mt-5 rounded-lg bg-slate-100 p-4 text-center">
                <p className="text-sm text-slate-700">
                  Please log in as a customer to book tickets.
                </p>

                <Link
                  to="/login"
                  className="mt-3 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                >
                  Login to book
                </Link>
              </div>
            ) : user?.role === "ORGANIZER" ? (
              <div className="mt-5 rounded-lg bg-slate-100 p-4 text-sm text-slate-700">
                Organizer accounts cannot book tickets.
              </div>
            ) : event.availableTickets <= 0 ? (
              <div className="mt-5 rounded-lg bg-red-50 p-4 text-center font-semibold text-red-700">
                This event is sold out.
              </div>
            ) : (
              <div className="mt-5">
                <label
                  htmlFor="requestedTickets"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Number of tickets
                </label>

                <input
                  id="requestedTickets"
                  type="number"
                  min="1"
                  max={event.availableTickets}
                  value={requestedTickets}
                  onChange={(inputEvent) =>
                    setRequestedTickets(inputEvent.target.value)
                  }
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200"
                />

                <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-100 p-4">
                  <span className="text-sm text-slate-600">Total amount</span>

                  <span className="text-xl font-bold text-slate-900">
                    {formatCurrency(
                      event.ticketPrice * (Number(requestedTickets) || 0),
                    )}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleBooking}
                  disabled={isBooking}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isBooking && <LoadingSpinner size="sm" />}

                  {isBooking ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
