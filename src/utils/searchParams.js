/**
 * Build and parse search query params for the /search page. Reusable from Banner Search and Header.
 */

/**
 * @param {{ location?: string, startDate?: string | Date, endDate?: string | Date, guests?: number | string }}
 * @returns {string} query string without leading "?", e.g. "location=Cape+Town&startDate=2025-03-01"
 */
export function buildSearchQueryString({ location, startDate, endDate, guests }) {
  const params = new URLSearchParams();
  const loc = typeof location === "string" ? location.trim() : "";
  if (loc) params.set("location", loc);
  if (startDate != null) params.set("startDate", formatForParam(startDate));
  if (endDate != null) params.set("endDate", formatForParam(endDate));
  if (guests != null) params.set("guests", String(guests));
  return params.toString();
}

/**
 * Normalize date/value for URL search params (ISO date string or string).
 * @param {Date|string} value
 * @returns {string}
 */
function formatForParam(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string") return value;
  return "";
}

/**
 * @param {URLSearchParams|string} searchParams
 * @returns {{ location: string, startDate: string, endDate: string, guests: string }}
 */
export function getSearchParams(searchParams) {
  const params = typeof searchParams === "string"
    ? new URLSearchParams(searchParams)
    : searchParams;
  return {
    location: params.get("location") || "",
    startDate: params.get("startDate") || "",
    endDate: params.get("endDate") || "",
    guests: params.get("guests") || "2",
  };
}
