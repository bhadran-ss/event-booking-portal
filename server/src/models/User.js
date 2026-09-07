import mongoose from "mongoose";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { USER_ROLES, USER_ROLE_VALUES } from "../constants/roles.js";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must contain at least 2 characters"],
      maxlength: [80, "Name cannot exceed 80 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [250, "Email cannot exceed 250 characters"],
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must contain at least 8 characters"],
      maxlength: [72, "Password cannot exceed 72 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: USER_ROLE_VALUES,
        message: "Role must be ORGANIZER or CUSTOMER",
      },
      default: USER_ROLES.CUSTOMER,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function hashModifiedPassword() {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await hashPassword(this.password);
});

userSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
) {
  return verifyPassword(candidatePassword, this.password);
};

export const User = mongoose.model("User", userSchema);
