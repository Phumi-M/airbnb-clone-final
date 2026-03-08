/**
 * User model: authentication and profile.
 * Password is hashed with bcrypt on save; email is unique and indexed.
 * toJSON strips password and __v and exposes id instead of _id.
 * @module models/User
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      maxlength: [128, "Password must be at most 128 characters"],
      select: false,
    },
    phone: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

/** Hash password before saving (only when password is modified). */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/** Compare plain-text candidate with stored hash. Used at login. */
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.password;
    delete ret.__v;
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
