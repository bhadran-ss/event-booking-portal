import dotenv from "dotenv";
import app from "./app.js";

const port = Number(process.env.PORT) || 5000;

const server = app.listen(port, () => {
  console.log(`EventHub API running at http://localhost:${port}`);
});

const shutdown = (signal) => {
  console.log(`${signal} received. Closing server...`);

  server.close(() => {
    console.log("Server closed successfully.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
