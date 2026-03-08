# Security Best Practices

This document summarizes security measures used in the project.

## Authentication (JWT)

- **Algorithm:** Tokens are signed and verified with **HS256** only. The server rejects tokens with `alg: none` or other algorithms (algorithm confusion prevention).
- **Secret:** In production, **JWT_SECRET** must be set in the environment; the server exits if it is missing when `NODE_ENV=production`. Use a long, random secret (e.g. 32+ bytes).
- **Expiry:** JWTs expire after 7 days. The client uses `getValidToken()` so expired tokens are not sent.
- **Storage:** Tokens are stored in `localStorage`; for higher security consider httpOnly cookies (requires backend support).
- **401 handling:** On 401, the frontend clears the token and user info and dispatches logout so the UI reflects logged-out state.

## Passwords

- **Hashing:** Passwords are hashed with **bcrypt** (cost 12) before storage. Never stored or logged in plain text.
- **Length:** Min 6, max 128 characters (enforced on backend and frontend) to prevent abuse and DoS via expensive hashing.
- **Validation:** Email and password are validated and trimmed on both client and server; same generic message for invalid login (“Invalid email or password”) to avoid user enumeration.

## Input Validation and Sanitization

- **Auth:** Email length ≤ 254, password length 6–128, name length ≤ 100. All strings trimmed.
- **Listings:** Title, location, description, etc. have max lengths in the Mongoose schema. Request body is sanitized: strings trimmed, array lengths capped (e.g. images 30, amenities 50, categories 20), type restricted to a fixed enum.
- **Reservations:** `listingId`, `startDate`, `endDate`, and `total` are required and validated; `startDate < endDate`, `total >= 0`; optional string fields trimmed and length-limited.
- **IDs:** Listing and reservation IDs are validated as valid MongoDB ObjectIds where applicable; invalid IDs return 400.

## Server Hardening

- **Helmet:** Security headers are applied (e.g. X-Content-Type-Options, X-Frame-Options). CSP is disabled by default to avoid breaking the app; enable and tune if needed.
- **Body size:** `express.json({ limit: "100kb" })` to reduce risk of large payload DoS.
- **Rate limiting:** Login and register are rate-limited (e.g. 20 requests per 15 minutes per IP). Responses use standard rate-limit headers.
- **CORS:** In production, set **CORS_ORIGIN** to the frontend origin(s) if you want to restrict allowed origins.

## Data and XSS

- **Sensitive data:** User responses (e.g. `toJSON`) strip password and internal fields. Only `id`, `name`, `email` (and similar) are exposed for the current user.
- **React:** Default escaping in JSX reduces XSS risk. Avoid `dangerouslySetInnerHTML` with user-controlled content.
- **APIs:** Responses are JSON; avoid embedding raw HTML from user input.

## Checklist for Production

1. Set **JWT_SECRET** to a strong random value.
2. Set **NODE_ENV=production**.
3. Set **CORS_ORIGIN** to your frontend URL(s) if you restrict origins.
4. Use HTTPS for the API and frontend.
5. Keep dependencies updated (`npm audit`, upgrade packages).
6. Ensure MongoDB is not exposed publicly without auth and is backed up.
