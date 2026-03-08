/**
 * Reusable validation helpers for forms (login, signup, listing, etc.).
 * All validators return { valid: boolean, message?: string }.
 */

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD_LENGTH = 6;
/** Max password length to match backend and prevent excessive hashing. */
export const MAX_PASSWORD_LENGTH = 128;
export const MAX_EMAIL_LENGTH = 254;

/**
 * Trim whitespace from a string; returns empty string for non-strings.
 * @param {*} value - Input value (typically from form field)
 * @returns {string}
 */
export function trimString(value) {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Validate email format and presence. Max length 254 (RFC).
 * @param {string} email - Email to validate
 * @returns {{ valid: boolean, message?: string }}
 */
export function validateEmail(email) {
  const trimmed = trimString(email);
  if (!trimmed) return { valid: false, message: "Email is required." };
  if (trimmed.length > MAX_EMAIL_LENGTH) return { valid: false, message: "Email is too long." };
  if (!EMAIL_REGEX.test(trimmed)) return { valid: false, message: "Please enter a valid email address." };
  return { valid: true };
}

/**
 * Validate password: required, min/max length to match backend and prevent abuse.
 * @param {string} password - Password to validate
 * @param {number} [minLength] - Minimum length (default: MIN_PASSWORD_LENGTH)
 * @param {number} [maxLength] - Maximum length (default: MAX_PASSWORD_LENGTH)
 * @returns {{ valid: boolean, message?: string }}
 */
export function validatePassword(password, minLength, maxLength) {
  const min = minLength ?? MIN_PASSWORD_LENGTH;
  const max = maxLength ?? MAX_PASSWORD_LENGTH;
  if (!password) return { valid: false, message: "Password is required." };
  if (password.length < min) return { valid: false, message: `Password must be at least ${min} characters.` };
  if (password.length > max) return { valid: false, message: `Password must be at most ${max} characters.` };
  return { valid: true };
}

/**
 * Validate that a required field has a non-empty value after trim.
 * @param {*} value - Field value
 * @param {string} [fieldName] - Display name for error message (e.g. "Title")
 * @returns {{ valid: boolean, message?: string }}
 */
export function validateRequired(value, fieldName) {
  const trimmed = trimString(value);
  const name = fieldName || "This field";
  if (!trimmed) return { valid: false, message: `${name} is required.` };
  return { valid: true };
}

/** Max lengths for listing fields (used by create/edit). */
export const LISTING_TITLE_MAX_LENGTH = 100;
export const LISTING_DESCRIPTION_MAX_LENGTH = 500;

/**
 * Validate listing basics: title, location, description, type.
 * @param {{ title?: string, location?: string, description?: string, type?: string }}
 * @returns {{ valid: boolean, errors: Record<string, string> }}
 */
export function validateListingBasics(form) {
  const errors = {};
  const t = (name, label) => {
    const r = validateRequired(form[name], label);
    if (!r.valid) errors[name] = r.message;
  };
  t("title", "Title");
  t("location", "Location");
  t("description", "Description");
  t("type", "Property type");
  const titleLen = trimString(form.title).length;
  if (!errors.title && titleLen > LISTING_TITLE_MAX_LENGTH) {
    errors.title = `Title must be ${LISTING_TITLE_MAX_LENGTH} characters or less.`;
  }
  const descLen = trimString(form.description).length;
  if (!errors.description && descLen > LISTING_DESCRIPTION_MAX_LENGTH) {
    errors.description = `Description must be ${LISTING_DESCRIPTION_MAX_LENGTH} characters or less.`;
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Validate listing capacity: bedrooms >= 0, bathrooms >= 0, guests >= 1.
 * @param {{ bedrooms?: string|number, bathrooms?: string|number, guests?: string|number }}
 * @returns {{ valid: boolean, errors: Record<string, string> }}
 */
export function validateListingCapacity(form) {
  const errors = {};
  const bed = parseInt(form.bedrooms, 10);
  if (form.bedrooms === "" || isNaN(bed) || bed < 0) errors.bedrooms = "Enter 0 or more bedrooms.";
  const bath = parseFloat(form.bathrooms, 10);
  if (form.bathrooms === "" || isNaN(bath) || bath < 0) errors.bathrooms = "Enter 0 or more bathrooms.";
  const g = parseInt(form.guests, 10);
  if (form.guests === "" || isNaN(g) || g < 1) errors.guests = "Enter at least 1 guest.";
  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Validate listing pricing: price required and > 0; optional weekly discount 0–100%.
 * @param {{ price?: string|number, weeklyDiscount?: string }}
 * @returns {{ valid: boolean, errors: Record<string, string> }}
 */
export function validateListingPricing(form) {
  const errors = {};
  const price = parseFloat(form.price, 10);
  if (form.price === "" || isNaN(price) || price <= 0) {
    errors.price = "Enter a valid price per night (greater than 0).";
  }
  const wd = form.weeklyDiscount === "" ? 0 : parseFloat(form.weeklyDiscount, 10);
  if (form.weeklyDiscount !== "" && (isNaN(wd) || wd < 0 || wd > 100)) {
    errors.weeklyDiscount = "Weekly discount must be between 0 and 100%.";
  }
  return { valid: Object.keys(errors).length === 0, errors };
}
