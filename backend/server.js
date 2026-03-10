require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const listingRoutes = require("./routes/listings");
const reservationRoutes = require("./routes/reservations");

const app = express();

// Use Render-assigned PORT or fallback
const PORT = process.env.PORT || 5000;

// Check JWT secret in production
const isProduction = process.env.NODE_ENV === "production";
if (isProduction && (!process.env.JWT_SECRET || String(process.env.JWT_SECRET).trim().length < 16)) {
  console.error("JWT_SECRET must be set in production (min 16 characters).");
  process.exit(1);
}

// Connect to MongoDB using environment variable
const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) {
  console.error("MONGODB_URI must be set in environment variables!");
  process.exit(1);
}
connectDB(MONGO_URI);

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: isProduction ? (process.env.CORS_ORIGIN || true) : true,
  credentials: true,
}));
app.use(express.json({ limit: "100kb" }));

// Rate limiting for auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many attempts. Try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/login", authLimiter);
app.use("/register", authLimiter);

// Health check endpoint
app.get("/health", (req, res) => res.json({ ok: true }));

// API routes
app.use("/", authRoutes);
app.use("/listings", listingRoutes);
app.use("/reservations", reservationRoutes);

// Serve React build in production (after API routes)
if (isProduction) {
  const buildPath = path.join(__dirname, "..", "build");
  app.use(express.static(buildPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});