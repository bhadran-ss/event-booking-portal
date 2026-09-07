import mongoose from "mongoose";
import { EVENT_CATEGORIES } from "../constants/events.js";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },

    description: {
      type: String,
      required: [true, "Event description is required"],
      trim: true,
      maxlength: [3000, "Description cannot exceed 3000 characters"],
    },

    category: {
      type: String,
      required: [true, "Event category is required"],
      enum: {
        values: EVENT_CATEGORIES,
        message: "Choose a valid event category",
      },
    },

    date: {
      type: Date,
      required: [true, "Event date is required"],
    },

    location: {
      type: String,
      required: [true, "Event location is required"],
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
    },

    ticketPrice: {
      type: Number,
      required: [true, "Ticket price is required"],
      min: [0, "Ticket price cannot be negative"],
    },

    totalTickets: {
      type: Number,
      required: [true, "Total tickets is required"],
      min: [1, "At least one ticket is required"],
      validate: {
        validator: Number.isInteger,
        message: "Total tickets must be a whole number",
      },
    },

    availableTickets: {
      type: Number,
      required: [true, "Available tickets is required"],
      min: [0, "Available tickets cannot be negative"],

      default() {
        return this.totalTickets;
      },

      validate: [
        {
          validator: Number.isInteger,
          message: "Available tickets must be a whole number",
        },
        {
          validator(value) {
            return value <= this.totalTickets;
          },
          message: "Available tickets cannot exceed total tickets",
        },
      ],
    },

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Organizer is required"],
    },
  },
  {
    timestamps: true,
  },
);

eventSchema.index({
  date: 1,
  category: 1,
});

eventSchema.index({
  organizer: 1,
  createdAt: -1,
});

eventSchema.index({
  title: "text",
  description: "text",
  location: "text",
});

eventSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    delete returnedObject.__v;
    return returnedObject;
  },
});

export const Event = mongoose.model("Event", eventSchema);
