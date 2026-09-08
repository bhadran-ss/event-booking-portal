import { BOOKING_STATUSES } from "../constants/events.js";

import { Booking } from "../models/Booking.js";
import { Event } from "../models/Event.js";
import { User } from "../models/User.js";

export const getOrganizerEvents = async (req, res) => {
  try {
    const events = await Event.aggregate([
      {
        $match: {
          organizer: req.user._id,
        },
      },
      {
        $lookup: {
          from: Booking.collection.name,
          let: {
            eventId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$event", "$$eventId"],
                    },
                    {
                      $eq: ["$bookingStatus", BOOKING_STATUSES.CONFIRMED],
                    },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                ticketsSold: {
                  $sum: "$ticketsBooked",
                },
                totalRevenue: {
                  $sum: "$totalAmount",
                },
                totalBookings: {
                  $sum: 1,
                },
              },
            },
          ],
          as: "salesSummary",
        },
      },
      {
        $set: {
          salesSummary: {
            $ifNull: [
              {
                $arrayElemAt: ["$salesSummary", 0],
              },
              {
                ticketsSold: 0,
                totalRevenue: 0,
                totalBookings: 0,
              },
            ],
          },
        },
      },
      {
        $project: {
          __v: 0,
        },
      },
      {
        $sort: {
          date: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Organizer events retrieved successfully",
      data: {
        count: events.length,
        events,
      },
    });
  } catch (error) {
    console.error("Retrieve organizer events error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve organizer events",
    });
  }
};

export const getEventAttendees = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).select("title organizer");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (!event.organizer.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You can only view attendees for your own events",
      });
    }

    const attendees = await Booking.aggregate([
      {
        $match: {
          event: event._id,
          bookingStatus: BOOKING_STATUSES.CONFIRMED,
        },
      },
      {
        $group: {
          _id: "$customer",
          ticketsBooked: {
            $sum: "$ticketsBooked",
          },
          totalAmount: {
            $sum: "$totalAmount",
          },
          bookingCount: {
            $sum: 1,
          },
          latestBookingAt: {
            $max: "$createdAt",
          },
        },
      },
      {
        $lookup: {
          from: User.collection.name,
          localField: "_id",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $unwind: "$customer",
      },
      {
        $project: {
          _id: 0,
          customer: {
            id: "$customer._id",
            name: "$customer.name",
            email: "$customer.email",
          },
          ticketsBooked: 1,
          totalAmount: 1,
          bookingCount: 1,
          latestBookingAt: 1,
        },
      },
      {
        $sort: {
          latestBookingAt: -1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Event attendees retrieved successfully",
      data: {
        event: {
          id: event._id,
          title: event.title,
        },
        count: attendees.length,
        attendees,
      },
    });
  } catch (error) {
    console.error("Retrieve attendees error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve event attendees",
    });
  }
};
