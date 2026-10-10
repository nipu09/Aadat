const mongoose = require("mongoose");
const env = require("./config/env");
const connectDB = require("./config/db");
const app = require("./app");

async function start() {
  await connectDB();

  const server = app.listen(env.port, () => {
    console.log(`Backend running on port ${env.port} (${env.nodeEnv})`);
  });

  // Graceful shutdown so deploys don't drop in-flight requests
  const shutdown = (signal) => {
    console.log(`${signal} received, shutting down...`);
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});

start().catch((error) => {
  console.error("Startup failed:", error.message);
  process.exit(1);
});
