import { Router } from "express";

import { USER_ROLES } from "../constants/roles.js";

import { getMyBookings } from "../controllers/booking.controller.js";

import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

router.get(
  "/my-bookings",
  authenticate,
  authorize(USER_ROLES.CUSTOMER),
  getMyBookings,
);

export { router as bookingRouter };
