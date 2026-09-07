import { body } from "express-validator";
import { USER_ROLE_VALUES } from "../constants/roles.js";

export const registerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .isLength({ min: 2, max: 80 })
    .withMessage("Name must contain between 2 and 80 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Enter a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 8, max: 72 })
    .withMessage("Password must contain between 8 and 72 characters"),

  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .bail()
    .isIn(USER_ROLE_VALUES)
    .withMessage("Role must be ORGANIZER or CUSTOMER"),
];

export const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Enter a valid email address")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),
];
