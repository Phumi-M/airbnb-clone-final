/**
 * JWT auth middleware for protected routes.
 * Verifies token with HS256 only (algorithm confusion prevention).
 * @module middleware/auth
 */

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "airbnb_clone_dev_secret_change_in_production";
const JWT_OPTIONS = { algorithms: ["HS256"] };

/**
 * Protect route: require valid JWT. Sets req.user (lean user doc, no password).
 */
const protect = async (req, res, next) => {
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.slice(7).trim();
  }
  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET, JWT_OPTIONS);
    const user = await User.findById(decoded.id).select("-password").lean();
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized or token expired" });
  }
};

module.exports = { protect, JWT_SECRET };
