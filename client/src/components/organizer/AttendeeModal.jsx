import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getEventAttendees } from "../../api/organizer.api";
import { getApiError } from "../../utils/getApiError";
import { formatCurrency } from "../../utils/formatters";
import LoadingSpinner from "../common/LoadingSpinner";

export default function AttendeeModal({ event, onClose }) {
  const [attendees, setAttendees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAttendees = useCallback(async () => {
    setIsLoading(true);

    try {
      const result = await getEventAttendees(event._id);
      setAttendees(result.attendees);
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setIsLoading(false);
    }
  }, [event._id]);

  useEffect(() => {
    loadAttendees();
  }, [loadAttendees]);

  useEffect(() => {
    const handleEscape = (keyboardEvent) => {
      if (keyboardEvent.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);

      document.body.style.overflow = "";
    };
  }, [onClose]);

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
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="font-bold text-slate-900">Attendees</h2>

            <p className="text-sm text-slate-500">{event.title}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-xl text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20 text-slate-700">
            <LoadingSpinner size="lg" />
          </div>
        ) : attendees.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <h3 className="font-semibold text-slate-900">No attendees yet</h3>

            <p className="mt-2 text-sm text-slate-600">
              No confirmed bookings were found for this event.
            </p>
          </div>
        ) : (
          <div className="p-5">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                    <th className="px-3 py-3">Customer</th>
                    <th className="px-3 py-3">Email</th>
                    <th className="px-3 py-3">Tickets</th>
                    <th className="px-3 py-3">Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {attendees.map((attendee, index) => {
                    const customer = attendee.customer ?? attendee;

                    const tickets =
                      attendee.ticketsBooked ??
                      attendee.totalTicketsBooked ??
                      attendee.totalTickets ??
                      0;

                    const amount =
                      attendee.totalAmount ??
                      attendee.totalSpent ??
                      attendee.revenue ??
                      0;

                    return (
                      <tr
                        key={attendee._id ?? attendee.customerId ?? index}
                        className="border-b border-slate-100 text-sm"
                      >
                        <td className="px-3 py-4 font-semibold text-slate-900">
                          {customer?.name ??
                            attendee.customerName ??
                            "Customer"}
                        </td>

                        <td className="px-3 py-4 text-slate-600">
                          {customer?.email ??
                            attendee.customerEmail ??
                            "Unavailable"}
                        </td>

                        <td className="px-3 py-4 text-slate-700">{tickets}</td>

                        <td className="px-3 py-4 font-semibold text-slate-900">
                          {formatCurrency(amount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
