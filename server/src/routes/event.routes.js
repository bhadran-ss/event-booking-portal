import { Router } from "express";

import { USER_ROLES } from "../constants/roles.js";

import {
  createEvent,
  getEventById,
  getEvents,
} from "../controllers/event.controller.js";

import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { validateRequest } from "../middleware/validateRequest.js";

import {
  createEventValidator,
  eventIdValidator,
  listEventsValidator,
} from "../validators/event.validators.js";

const router = Router();

router.get("/", listEventsValidator, validateRequest, getEvents);

router.post(
  "/",
  authenticate,
  authorize(USER_ROLES.ORGANIZER),
  createEventValidator,
  validateRequest,
  createEvent,
);

router.get("/:id", eventIdValidator, validateRequest, getEventById);

export { router as eventRouter };
