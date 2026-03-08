/**
 * Listing (accommodation) model.
 * References User as createdBy; supports all fields used by the frontend (search, detail, create/edit).
 * Indexes: location, createdBy, categories for efficient queries.
 * @module models/Listing
 */
const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
    },
    description: {
      type: String,
      default: "",
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    descriptionShort: { type: String, default: "", maxlength: 200 },
    type: {
      type: String,
      default: "Other",
      enum: ["Apartment", "House", "Cabin", "Villa", "Loft", "Studio", "Other"],
    },
    bedrooms: { type: Number, default: 0, min: 0 },
    bathrooms: { type: Number, default: 0, min: 0 },
    guests: { type: Number, default: 1, min: 1 },
    price: { type: Number, required: true, min: 0 },
    priceDisplay: { type: String, default: "", maxlength: 50 },
    img: { type: String, default: "", maxlength: 2048 },
    images: [{ type: String }],
    amenities: [{ type: String }],
    categories: [{ type: String }],
    weeklyDiscount: { type: Number, default: 0, min: 0, max: 100 },
    cleaningFee: { type: Number, default: 0, min: 0 },
    serviceFee: { type: Number, default: 0, min: 0 },
    occupancyTaxes: { type: Number, default: 0, min: 0 },
    star: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    total: { type: String, default: "" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  { timestamps: true }
);

listingSchema.set("toJSON", {
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

/* Indexes for filtering and lookups */
listingSchema.index({ location: 1 });
listingSchema.index({ createdBy: 1 });
listingSchema.index({ categories: 1 });

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
