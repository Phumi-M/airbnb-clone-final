/**
 * Express server with MongoDB (Mongoose).
 * Security: helmet, body size limit, rate limit on auth, CORS and JWT_SECRET in production.
 */
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const listingRoutes = require("./routes/listings");
const reservationRoutes = require("./routes/reservations");

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";

if (isProduction && (!process.env.JWT_SECRET || String(process.env.JWT_SECRET).trim().length < 16)) {
  console.error("JWT_SECRET must be set in production (min 16 characters).");
  process.exit(1);
}

connectDB();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: isProduction ? (process.env.CORS_ORIGIN || true) : true,
  credentials: true,
}));
app.use(express.json({ limit: "100kb" }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many attempts. Try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/login", authLimiter);
app.use("/register", authLimiter);

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/", authRoutes);
app.use("/listings", listingRoutes);
app.use("/reservations", reservationRoutes);

// Serve React build in production only if build dir and index.html exist.
// When backend is deployed alone (Root Dir = backend), build/ is not present — skip static serving.
const buildPath = path.join(__dirname, "..", "build");
const buildIndexPath = path.join(buildPath, "index.html");
const hasBuild = isProduction && fs.existsSync(buildPath) && fs.existsSync(buildIndexPath);
if (hasBuild) {
  app.use(express.static(buildPath));
  app.get("*", (req, res) => {
    res.sendFile(buildIndexPath);
  });
} else if (isProduction) {
  // No build: respond to GET / so visitors see a message instead of "Cannot GET /"
  app.get("/", (req, res) => {
    res.status(200).type("text/plain").send("API only. Use the frontend URL to open the app.");
  });
}

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});
