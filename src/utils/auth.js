/**
 * JWT helpers for session validation.
 * Token format: header.payload.signature (payload is base64url JSON with exp).
 * Use getValidToken() when you need a token that is both present and not expired.
 */

const TOKEN_KEY = "airbnb_token";
const USER_KEY = "userInfo";

/** Basic JWT/local token shape: non-empty string with at least two dot-separated parts. */
export function isValidTokenShape(token) {
  return typeof token === "string" && token.trim().length > 0 && token.split(".").length >= 2;
}

export const getStoredToken = () => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(TOKEN_KEY);
    }
  } catch {
    return null;
  }
  return null;
};

/**
 * Returns the stored token only if it has valid shape and is not expired.
 * Use this for attaching to API requests and for session hydration.
 */
export function getValidToken() {
  const token = getStoredToken();
  if (!token || !isValidTokenShape(token) || isTokenExpired(token)) return null;
  return token;
}

/** Store token only if it is a non-empty string (validates before persisting). */
export const setStoredToken = (token) => {
  try {
    if (typeof window !== "undefined" && window.localStorage && typeof token === "string" && token.trim()) {
      window.localStorage.setItem(TOKEN_KEY, token.trim());
    }
  } catch {
    // ignore
  }
};

export const removeStoredToken = () => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // ignore
  }
};

/**
 * Decode JWT payload without verification (client-side only).
 * For production, verify token signature on the server.
 */
export const decodeJwtPayload = (token) => {
  if (!token || typeof token !== "string") return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    let payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (payload.length % 4) payload += "=";
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

/**
 * Returns true if token is expired (or invalid).
 */
export const isTokenExpired = (token) => {
  const payload = decodeJwtPayload(token);
  if (!payload || payload.exp == null) return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
};

/**
 * Generate a simple JWT-like token for local signup (no backend).
 * Expires in 7 days. Payload: { sub: email, exp, iat }.
 */
export const generateLocalToken = (email) => {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 7 * 24 * 60 * 60;
  const payloadObj = { sub: email, exp, iat: now };
  const payloadB64 = btoa(JSON.stringify(payloadObj))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return `eyJhbGciOiJIUzI1NiJ9.${payloadB64}.local`;
};

export { TOKEN_KEY, USER_KEY };
