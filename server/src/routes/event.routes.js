import { Router } from "express";

import { USER_ROLES } from "../constants/roles.js";

import { bookEvent } from "../controllers/booking.controller.js";

import {
  createEvent,
  getEventById,
  getEvents,
} from "../controllers/event.controller.js";

import {
  getEventAttendees,
  getOrganizerEvents,
} from "../controllers/organizer.controller.js";

import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { validateRequest } from "../middleware/validateRequest.js";

import { bookEventValidator } from "../validators/booking.validators.js";

import {
  createEventValidator,
  eventIdValidator,
  listEventsValidator,
} from "../validators/event.validators.js";

const router = Router();

router.get(
  "/organizer/my-events",
  authenticate,
  authorize(USER_ROLES.ORGANIZER),
  getOrganizerEvents,
);

router.get("/", listEventsValidator, validateRequest, getEvents);

router.post(
  "/",
  authenticate,
  authorize(USER_ROLES.ORGANIZER),
  createEventValidator,
  validateRequest,
  createEvent,
);

router.post(
  "/:id/book",
  authenticate,
  authorize(USER_ROLES.CUSTOMER),
  bookEventValidator,
  validateRequest,
  bookEvent,
);

router.get(
  "/:id/attendees",
  authenticate,
  authorize(USER_ROLES.ORGANIZER),
  eventIdValidator,
  validateRequest,
  getEventAttendees,
);

router.get("/:id", eventIdValidator, validateRequest, getEventById);

export { router as eventRouter };
