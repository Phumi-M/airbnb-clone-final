/**
 * MongoDB connection using Mongoose.
 * Uses MONGODB_URI from environment (default: mongodb://localhost:27017/airbnb_clone).
 * Exits process on connection failure so the server does not run without a DB.
 * @module config/db
 */

const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/airbnb_clone";

/**
 * Connect to MongoDB. Called once at server startup.
 * Options: pool size 10, 5s server selection timeout.
 */
const connectDB = async () => {
  try {
    const opts = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    };
    await mongoose.connect(MONGODB_URI, opts);
    console.log("MongoDB connected:", mongoose.connection.host);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

module.exports = connectDB;
