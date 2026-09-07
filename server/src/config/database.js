import mongoose from "mongoose";

export const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing from the environment variables");
  }

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log(`MongoDB Connected : ${mongoose.connection.host}`);
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
};
