import { Booking } from "../models/Booking.js";

import {
  BookingServiceError,
  createTicketBooking,
} from "../services/booking.service.js";

export const bookEvent = async (req, res) => {
  try {
    const booking = await createTicketBooking({
      eventId: req.params.id,
      customerId: req.user._id,
      requestedTickets: req.body.requestedTickets,
    });

    return res.status(201).json({
      success: true,
      message: "Tickets booked successfully",
      data: {
        booking,
      },
    });
  } catch (error) {
    if (error instanceof BookingServiceError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Book event error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to complete the booking",
    });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      customer: req.user._id,
    })
      .populate(
        "event",
        "title category date location ticketPrice availableTickets",
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: {
        count: bookings.length,
        bookings,
      },
    });
  } catch (error) {
    console.error("Retrieve bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve bookings",
    });
  }
};
