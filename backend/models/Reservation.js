/**
 * Reservation (booking) model.
 * References User and Listing; stores dates, guests, total, and optional copy fields (title, location, img).
 * Indexes: user+startDate (list by user), listing (list by property).
 * @module models/Reservation
 */
const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
      index: true,
    },
    userEmail: { type: String, required: true, trim: true },
    listingId: { type: mongoose.Schema.Types.Mixed },
    title: { type: String, default: "" },
    location: { type: String, default: "" },
    img: { type: String, default: "" },
    priceDisplay: { type: String, default: "" },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    guests: { type: Number, default: 1, min: 1 },
    total: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

reservationSchema.set("toJSON", {
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

/* Indexes: list reservations by user (newest first), and by listing */
reservationSchema.index({ user: 1, startDate: -1 });
reservationSchema.index({ listing: 1 });

const Reservation = mongoose.model("Reservation", reservationSchema);
module.exports = Reservation;
