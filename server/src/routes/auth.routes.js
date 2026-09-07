import { Router } from "express";

import {
  getCurrentUser,
  login,
  register,
} from "../controllers/auth.controller.js";

import { authenticate } from "../middleware/authenticate.js";
import { validateRequest } from "../middleware/validateRequest.js";

import {
  loginValidator,
  registerValidator,
} from "../validators/auth.validators.js";

const router = Router();

router.post("/register", registerValidator, validateRequest, register);

router.post("/login", loginValidator, validateRequest, login);

router.get("/me", authenticate, getCurrentUser);

export { router as authRouter };
