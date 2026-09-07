import "dotenv/config";
import app from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
const port = Number(process.env.PORT) || 5000;

let server;

const startServer = async () => {
  await connectDatabase();

  server = app.listen(port, () => {
    console.log(`EventHub API running at http://localhost:${port}`);
  });
};

const shutdown = async (signal) => {
  console.log(`${signal} received. Closing server...`);

  if (server) {
    await new Promise((resolve) => {
      server.close(resolve);
    });
  }

  if (mongoose.connection.readyState !== 0) {
    await disconnectDatabase();
  }

  console.log("closed successfully.");
  process.exit(0);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer().catch((error) => {
  console.error("Unable to start the server:", error.message);
  process.exit(1);
});
