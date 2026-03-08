/**
 * Auth routes: login and register.
 * Input validation: email/password length limits to prevent abuse and DoS.
 * @module routes/auth
 */

const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../middleware/auth");

const router = express.Router();

const MAX_EMAIL_LENGTH = 254;
const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 128;

/** Issue a JWT for the given user id; HS256, expires in 7 days. */
const createToken = (userId) =>
  jwt.sign({ id: userId }, JWT_SECRET, { algorithm: "HS256", expiresIn: "7d" });

function validateAuthInput(email, password, requireName, name) {
  const normalized = String(email ?? "").trim().toLowerCase();
  if (!normalized) return { ok: false, message: "Email and password are required" };
  if (normalized.length > MAX_EMAIL_LENGTH) return { ok: false, message: "Invalid email" };
  if (!password || typeof password !== "string") return { ok: false, message: "Password is required" };
  if (password.length < MIN_PASSWORD_LENGTH) return { ok: false, message: "Password must be at least 6 characters" };
  if (password.length > MAX_PASSWORD_LENGTH) return { ok: false, message: "Invalid password" };
  if (requireName) {
    const n = String(name ?? "").trim();
    if (!n) return { ok: false, message: "Name is required" };
    if (n.length > 100) return { ok: false, message: "Name is too long" };
  }
  return { ok: true, normalized };
}

/**
 * POST /login
 * Body: { email, password }. Returns user (id, name, email) and token.
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const validation = validateAuthInput(email, password, false);
    if (!validation.ok) {
      return res.status(400).json({ message: validation.message });
    }
    const normalized = validation.normalized;
    const user = await User.findOne({ email: normalized }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const safe = await User.findById(user._id).select("-password").lean();
    const token = createToken(user._id.toString());
    res.json({
      user: { id: safe._id.toString(), name: safe.name, email: safe.email },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Login failed" });
  }
});

/**
 * POST /register
 * Body: { name, email, password }. Creates user, returns same shape as login.
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    const validation = validateAuthInput(email, password, true, name);
    if (!validation.ok) {
      return res.status(400).json({ message: validation.message });
    }
    const normalized = validation.normalized;
    const trimmedName = String(name ?? "").trim();
    const existing = await User.findOne({ email: normalized });
    if (existing) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }
    const user = await User.create({
      name: trimmedName,
      email: normalized,
      password,
    });
    const safe = user.toJSON();
    const token = createToken(user._id.toString());
    res.status(201).json({
      user: { id: safe.id, name: safe.name, email: safe.email },
      token,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const msg = Object.values(err.errors).map((e) => e.message).join(" ");
      return res.status(400).json({ message: msg });
    }
    res.status(500).json({ message: err.message || "Registration failed" });
  }
});

module.exports = router;
