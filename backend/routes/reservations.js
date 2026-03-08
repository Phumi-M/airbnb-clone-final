/**
 * Reservation routes. All require JWT (protect middleware).
 * GET: list current user's reservations; POST: create a reservation.
 * @module routes/reservations
 */

const express = require("express");
const Reservation = require("../models/Reservation");
const { protect } = require("../middleware/auth");

const router = express.Router();

/**
 * GET /reservations
 * Returns reservations for the authenticated user, sorted by startDate desc.
 */
router.get("/", protect, async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate("listing", "title location img price")
      .sort({ startDate: -1 })
      .lean();
    const normalized = reservations.map((doc) => {
      const id = doc._id.toString();
      const { _id, __v, ...rest } = doc;
      return { id, ...rest };
    });
    res.json(normalized);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch reservations" });
  }
});

/**
 * POST /reservations
 * Create a reservation. Validates listingId, startDate < endDate, total >= 0.
 */
router.post("/", protect, async (req, res) => {
  try {
    const body = req.body || {};
    const listingId = body.listingId || body.listing;
    if (!listingId) {
      return res.status(400).json({ message: "listingId is required" });
    }
    const startDate = body.startDate ? new Date(body.startDate) : null;
    const endDate = body.endDate ? new Date(body.endDate) : null;
    if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ message: "Valid startDate and endDate are required" });
    }
    if (startDate >= endDate) {
      return res.status(400).json({ message: "endDate must be after startDate" });
    }
    const total = Number(body.total);
    if (typeof total !== "number" || isNaN(total) || total < 0) {
      return res.status(400).json({ message: "Valid total (number >= 0) is required" });
    }
    const guests = Math.min(Math.max(1, parseInt(body.guests, 10) || 1), 50);
    const reservation = await Reservation.create({
      user: req.user._id,
      listing: listingId,
      userEmail: req.user.email || String(body.userEmail || "").trim().slice(0, 254),
      listingId,
      title: String(body.title || "").trim().slice(0, 100),
      location: String(body.location || "").trim().slice(0, 200),
      img: String(body.img || "").trim().slice(0, 2048),
      priceDisplay: String(body.priceDisplay || "").trim().slice(0, 50),
      startDate,
      endDate,
      guests,
      total,
    });
    res.status(201).json(reservation.toJSON());
  } catch (err) {
    if (err.name === "ValidationError") {
      const msg = Object.values(err.errors).map((e) => e.message).join(" ");
      return res.status(400).json({ message: msg });
    }
    res.status(500).json({ message: err.message || "Failed to create reservation" });
  }
});

module.exports = router;
