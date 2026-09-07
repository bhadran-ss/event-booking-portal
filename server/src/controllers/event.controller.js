import { Event } from "../models/Event.js";

const escapeRegularExpression = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      location,
      ticketPrice,
      totalTickets,
    } = req.body;

    const event = await Event.create({
      title,
      description,
      category,
      date,
      location,
      ticketPrice,
      totalTickets,
      availableTickets: totalTickets,
      organizer: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: {
        event,
      },
    });
  } catch (error) {
    console.error("Create event error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create event",
    });
  }
};

export const getEvents = async (req, res) => {
  try {
    const { category, search } = req.query;

    const filter = {
      date: {
        $gt: new Date(),
      },
    };

    if (category) {
      filter.category = category;
    }

    if (search) {
      const safeSearch = escapeRegularExpression(search);
      const searchExpression = new RegExp(safeSearch, "i");

      filter.$or = [
        { title: searchExpression },
        { description: searchExpression },
        { location: searchExpression },
      ];
    }

    const events = await Event.find(filter)
      .populate("organizer", "name")
      .sort({ date: 1 });

    return res.status(200).json({
      success: true,
      message: "Events retrieved successfully",
      data: {
        count: events.length,
        events,
      },
    });
  } catch (error) {
    console.error("Retrieve events error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve events",
    });
  }
};

export const getEventById = async (req, res) => {
  try {
    console.log("id", req.params.id);
    const event = await Event.findById(req.params.id).populate(
      "organizer",
      "name",
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event retrieved successfully",
      data: {
        event,
      },
    });
  } catch (error) {
    console.error("Retrieve event error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve event",
    });
  }
};
