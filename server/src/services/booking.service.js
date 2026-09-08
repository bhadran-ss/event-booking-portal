import mongoose from "mongoose";

import { Booking } from "../models/Booking.js";
import { Event } from "../models/Event.js";

export class BookingServiceError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = "BookingServiceError";
    this.statusCode = statusCode;
  }
}

const calculateTotalAmount = (ticketPrice, requestedTickets) => {
  return (
    Math.round((ticketPrice * requestedTickets + Number.EPSILON) * 100) / 100
  );
};

export const createTicketBooking = async ({
  eventId,
  customerId,
  requestedTickets,
}) => {
  let bookingId;

  await mongoose.connection.transaction(
    async (session) => {
      const event = await Event.findOneAndUpdate(
        {
          _id: eventId,
          date: {
            $gt: new Date(),
          },
          availableTickets: {
            $gte: requestedTickets,
          },
        },
        {
          $inc: {
            availableTickets: -requestedTickets,
          },
        },
        {
          session,
          returnDocument: "after",
        },
      );

      if (!event) {
        const eventState = await Event.findById(eventId)
          .select("date availableTickets")
          .session(session);

        if (!eventState) {
          throw new BookingServiceError("Event not found", 404);
        }

        if (eventState.date <= new Date()) {
          throw new BookingServiceError("Past events cannot be booked", 400);
        }

        const available = eventState.availableTickets;

        const message =
          available === 0
            ? "This event is sold out"
            : `Only ${available} ticket(s) are currently available`;

        throw new BookingServiceError(message, 409);
      }

      const totalAmount = calculateTotalAmount(
        event.ticketPrice,
        requestedTickets,
      );

      const [booking] = await Booking.create(
        [
          {
            customer: customerId,
            event: eventId,
            ticketsBooked: requestedTickets,
            totalAmount,
          },
        ],
        {
          session,
        },
      );

      bookingId = booking._id;
    },
    {
      readPreference: "primary",
      readConcern: {
        level: "snapshot",
      },
      writeConcern: {
        w: "majority",
      },
    },
  );

  return Booking.findById(bookingId).populate(
    "event",
    "title category date location ticketPrice availableTickets",
  );
};
