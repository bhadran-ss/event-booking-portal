import jwt from "jsonwebtoken";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing!");
  }
  return secret;
};

export const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    getJwtSecret(),
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, getJwtSecret());
};
