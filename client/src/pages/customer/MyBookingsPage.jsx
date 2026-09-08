import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { getMyBookings } from "../../api/booking.api";
import BookingCard from "../../components/bookings/BookingCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getApiError } from "../../utils/getApiError";
import Navbar from "../../layouts/Navbar";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadBookings = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const bookingList = await getMyBookings();
      setBookings(bookingList);
    } catch (error) {
      const message = getApiError(error);

      setLoadError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>

        <p className="mt-2 text-slate-600">
          View all the tickets you have booked.
        </p>

        {isLoading ? (
          <div className="flex justify-center py-20 text-slate-700">
            <LoadingSpinner size="lg" />
          </div>
        ) : loadError ? (
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-red-600">{loadError}</p>

            <button
              type="button"
              onClick={loadBookings}
              className="mt-4 rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-700"
            >
              Try again
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              No bookings yet
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Browse upcoming events and book your first ticket.
            </p>

            <Link
              to="/events"
              className="mt-5 inline-block rounded-lg bg-slate-900 px-5 py-2.5 font-semibold text-white hover:bg-slate-700"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {bookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
