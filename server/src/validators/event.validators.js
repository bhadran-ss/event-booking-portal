import { body, param, query } from "express-validator";

import { EVENT_CATEGORIES } from "../constants/events.js";

export const createEventValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .bail()
    .isLength({ max: 120 })
    .withMessage("Title cannot exceed 120 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .bail()
    .isLength({ max: 3000 })
    .withMessage("Description cannot exceed 3000 characters"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .bail()
    .isIn(EVENT_CATEGORIES)
    .withMessage("Choose a valid event category"),

  body("date")
    .notEmpty()
    .withMessage("Event date is required")
    .bail()
    .isISO8601()
    .withMessage("Enter a valid ISO event date")
    .bail()
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("Event date must be in the future");
      }

      return true;
    })
    .toDate(),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required")
    .bail()
    .isLength({ max: 200 })
    .withMessage("Location cannot exceed 200 characters"),

  body("ticketPrice")
    .notEmpty()
    .withMessage("Ticket price is required")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("Ticket price must be zero or greater")
    .toFloat(),

  body("totalTickets")
    .notEmpty()
    .withMessage("Total tickets is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Total tickets must be a positive whole number")
    .toInt(),
];

export const listEventsValidator = [
  query("category")
    .optional({ checkFalsy: true })
    .isIn(EVENT_CATEGORIES)
    .withMessage("Choose a valid event category"),

  query("search")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage("Search cannot exceed 100 characters"),
];

export const eventIdValidator = [
  param("id").isMongoId().withMessage("Invalid event ID"),
];
