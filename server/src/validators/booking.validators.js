import { body, param } from "express-validator";

export const bookEventValidator = [
  param("id").isMongoId().withMessage("Invalid Event Id"),

  body("requestedTickets")
    .notEmpty()
    .withMessage("Requested ticket quantity is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Requested tickets must be a positive whole number")
    .toInt(),
];
