/**
 * Backend API base URL.
 * Set REACT_APP_API_URL in production (e.g. https://airbnb-backend.onrender.com).
 * Defaults to http://localhost:5000 for local development.
 */
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";
