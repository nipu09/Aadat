const mongoose = require("mongoose");
const env = require("./env");

// Throws on failure; server.js decides what to do (log + exit).
async function connectDB() {
  await mongoose.connect(env.mongoUri);
  console.log("MongoDB connected");
}

module.exports = connectDB;
