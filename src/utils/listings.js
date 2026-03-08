/**
 * Reusable listing helpers: filtering and description formatting.
 */

/** Location (city/area) → Province for South Africa */
export const LOCATION_TO_PROVINCE = {
  "Cape Town": "Western Cape",
  "Stellenbosch": "Western Cape",
  "Karoo": "Western Cape",
  "Johannesburg": "Gauteng",
  "Durban": "KwaZulu-Natal",
  "Drakensberg": "KwaZulu-Natal",
  "Ballito": "KwaZulu-Natal",
  "Dullstroom": "Mpumalanga",
};

/** Province names for grouping (order for display) */
export const PROVINCES = [
  "Western Cape",
  "Gauteng",
  "KwaZulu-Natal",
  "Mpumalanga",
];

/**
 * Get province for a location string (city/area name).
 * @param {string} [location]
 * @returns {string|null}
 */
export function getProvinceForLocation(location) {
  if (!location || typeof location !== "string") return null;
  const key = Object.keys(LOCATION_TO_PROVINCE).find(
    (k) => k.toLowerCase() === location.trim().toLowerCase()
  );
  return key ? LOCATION_TO_PROVINCE[key] : null;
}

/**
 * Filter listings by province name (all locations in that province).
 * @param {Array<{ location?: string }>} list
 * @param {string} provinceName
 * @returns {typeof list}
 */
export function filterListingsByProvince(list, provinceName) {
  if (!provinceName || !String(provinceName).trim()) return list;
  const province = String(provinceName).trim();
  return list.filter((item) => getProvinceForLocation(item.location) === province);
}

/**
 * Filter listings by location or province (case-insensitive).
 * If the query matches a province name, returns listings in that province.
 * Otherwise filters by location/title partial match.
 * @param {Array<{ location?: string, title?: string }>} list
 * @param {string} query - search query (location or province name)
 * @returns {typeof list}
 */
export function filterListingsByLocation(list, query) {
  if (!query || !String(query).trim()) return list;
  const q = String(query).trim();
  const provinceMatch = PROVINCES.find((p) => p.toLowerCase() === q.toLowerCase());
  if (provinceMatch) return filterListingsByProvince(list, provinceMatch);
  const qLower = q.toLowerCase();
  return list.filter(
    (item) =>
      (item.location && item.location.toLowerCase().includes(qLower)) ||
      (item.title && item.title.toLowerCase().includes(qLower))
  );
}

/**
 * Build short listing description: "X guests · Y bedroom(s) · Z bath(s)"
 * @param {{ guests?: number, bedrooms?: number, bathrooms?: number }}
 * @returns {string}
 */
export function getListingDescriptionShort({ guests = 0, bedrooms = 0, bathrooms = 0 }) {
  const g = Number(guests) || 0;
  const b = Number(bedrooms) || 0;
  const bath = Number(bathrooms) || 0;
  const parts = [];
  if (g) parts.push(`${g} guest${g !== 1 ? "s" : ""}`);
  if (b) parts.push(`${b} bedroom${b !== 1 ? "s" : ""}`);
  if (bath) parts.push(`${bath} bath${bath !== 1 ? "s" : ""}`);
  return parts.join(" · ") || "";
}
