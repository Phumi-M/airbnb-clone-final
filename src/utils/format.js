/**
 * Reusable formatting helpers for dates, prices, and pluralized text.
 */

const DEFAULT_DATE_LOCALE = "en-ZA";

/**
 * @param {Date} date
 * @returns {string} ISO date string (YYYY-MM-DD)
 */
export function formatDateISO(date) {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

/**
 * @param {string} startStr
 * @param {string} endStr
 * @param {string} [locale]
 * @returns {string}
 */
export function formatDateRange(startStr, endStr, locale = DEFAULT_DATE_LOCALE) {
  if (!startStr || !endStr) return "";
  const options = { day: "numeric", month: "long" };
  try {
    const start = new Date(startStr);
    const end = new Date(endStr);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return "";
    return `${start.toLocaleDateString(locale, options)} to ${end.toLocaleDateString(locale, options)}`;
  } catch {
    return "";
  }
}

/**
 * @param {number} amount
 * @param {boolean} [perNight] - append " / night"
 * @returns {string} e.g. "R3 500 / night" or "R10 500 total"
 */
export function formatPriceZAR(amount, perNight = true) {
  const num = Number(amount);
  if (isNaN(num)) return "";
  const formatted = `R${Math.round(num).toLocaleString("en-ZA")}${perNight ? " / night" : ""}`;
  return formatted;
}

/**
 * @param {number} count
 * @param {string} singular - e.g. "stay"
 * @param {string} [plural] - e.g. "stays" (defaults to singular + "s")
 * @returns {string} e.g. "4 stays" or "1 stay"
 */
export function formatPlural(count, singular, plural) {
  const n = Number(count);
  const word = n === 1 ? singular : (plural || `${singular}s`);
  return `${n} ${word}`;
}
