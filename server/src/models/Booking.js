import mongoose from "mongoose";
import {
  BOOKING_STATUSES,
  BOOKING_STATUS_VALUES,
} from "../constants/events.js";

export const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer is required"],
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event is required"],
    },
    ticketsBooked: {
      type: Number,
      required: [true, "Ticket quantity is required"],
      min: [1, "Atleast 1 ticket must be booked"],
      validate: {
        validator: Number.isInteger,
        message: "Ticket quantity must be a whole number",
      },
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    bookingStatus: {
      type: String,
      enum: {
        values: BOOKING_STATUS_VALUES,
        message: "Choose a valid booking status",
      },
      default: BOOKING_STATUSES.CONFIRMED,
    },
  },
  {
    timestamps: true,
  },
);

bookingSchema.index({
  customer: 1,
  createdAt: -1,
});

bookingSchema.index({
  event: 1,
  bookingStatus: 1,
});

bookingSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    delete returnedObject.__v;
    return returnedObject;
  },
});

export const Booking = mongoose.model("Booking", bookingSchema);
