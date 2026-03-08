/**
 * Listing CRUD routes.
 * Input sanitization: trim strings, limit array lengths to prevent payload abuse.
 * @module routes/listings
 */

const mongoose = require("mongoose");
const express = require("express");
const Listing = require("../models/Listing");
const { protect } = require("../middleware/auth");

const router = express.Router();

const MAX_IMAGES = 30;
const MAX_AMENITIES = 50;
const MAX_CATEGORIES = 20;
const VALID_TYPES = ["Apartment", "House", "Cabin", "Villa", "Loft", "Studio", "Other"];

function trim(s) {
  return typeof s === "string" ? s.trim() : s;
}

function sanitizeListingBody(body) {
  const b = body || {};
  const arr = (v) => (Array.isArray(v) ? v.filter((i) => typeof i === "string").map(trim) : []);
  const images = arr(b.images).slice(0, MAX_IMAGES);
  const amenities = arr(b.amenities).slice(0, MAX_AMENITIES);
  const categories = arr(b.categories).slice(0, MAX_CATEGORIES);
  const type = VALID_TYPES.includes(trim(b.type)) ? trim(b.type) : "Other";
  return {
    title: trim(b.title),
    location: trim(b.location),
    description: trim(b.description),
    descriptionShort: trim(b.descriptionShort),
    type,
    bedrooms: b.bedrooms,
    bathrooms: b.bathrooms,
    guests: b.guests,
    price: b.price,
    priceDisplay: trim(b.priceDisplay),
    img: trim(b.img),
    images,
    amenities,
    categories,
    weeklyDiscount: b.weeklyDiscount,
    cleaningFee: b.cleaningFee,
    serviceFee: b.serviceFee,
    occupancyTaxes: b.occupancyTaxes,
    star: b.star,
    reviewCount: b.reviewCount,
    total: trim(b.total),
  };
}

function isValidObjectId(id) {
  if (!id || typeof id !== "string") return false;
  try {
    const oid = new mongoose.Types.ObjectId(id);
    return oid.toString() === id;
  } catch {
    return false;
  }
}

/**
 * GET /listings
 * Returns all listings with createdBy populated (id, name, email).
 */
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate("createdBy", "name email")
      .lean();
    const normalized = listings.map((doc) => {
      const id = doc._id.toString();
      const createdBy = doc.createdBy;
      const createdByStr = createdBy
        ? { id: createdBy._id?.toString(), name: createdBy.name, email: createdBy.email }
        : null;
      const { _id, __v, ...rest } = doc;
      return { id, ...rest, createdBy: createdByStr };
    });
    res.json(normalized);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch listings" });
  }
});

/**
 * GET /listings/:id
 * Returns one listing by id; 400 for invalid id, 404 if not found.
 */
router.get("/:id", async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid listing id" });
  }
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("createdBy", "name email")
      .lean();
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    const id = listing._id.toString();
    const createdBy = listing.createdBy;
    const createdByStr = createdBy
      ? { id: createdBy._id?.toString(), name: createdBy.name, email: createdBy.email }
      : null;
    const { _id, __v, ...rest } = listing;
    res.json({ id, ...rest, createdBy: createdByStr });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.status(500).json({ message: err.message || "Failed to fetch listing" });
  }
});

/**
 * POST /listings
 * Create a listing. Body: title, location, price required; inputs sanitized (trim, array limits).
 */
router.post("/", async (req, res) => {
  try {
    const sanitized = sanitizeListingBody(req.body);
    const createdBy = res.locals.userId || null;
    const listing = await Listing.create({
      ...sanitized,
      createdBy: createdBy || undefined,
    });
    const out = listing.toJSON();
    res.status(201).json(out);
  } catch (err) {
    if (err.name === "ValidationError") {
      const msg = Object.values(err.errors).map((e) => e.message).join(" ");
      return res.status(400).json({ message: msg });
    }
    res.status(500).json({ message: err.message || "Failed to create listing" });
  }
});

/**
 * PUT /listings/:id
 * Update listing; body sanitized. Returns updated document.
 */
router.put("/:id", async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid listing id" });
  }
  const sanitized = sanitizeListingBody(req.body);
  const update = {};
  Object.keys(sanitized).forEach((k) => {
    if (sanitized[k] !== undefined) update[k] = sanitized[k];
  });
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    );
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.json(listing.toJSON());
  } catch (err) {
    if (err.name === "ValidationError") {
      const msg = Object.values(err.errors).map((e) => e.message).join(" ");
      return res.status(400).json({ message: msg });
    }
    if (err.name === "CastError") {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.status(500).json({ message: err.message || "Failed to update listing" });
  }
});

/**
 * DELETE /listings/:id
 * Delete listing. 400 for invalid id, 204 on success.
 */
router.delete("/:id", async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid listing id" });
  }
  try {
    const result = await Listing.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.status(204).send();
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.status(500).json({ message: err.message || "Failed to delete listing" });
  }
});

module.exports = router;
