/**
 * Axios instance configuration: attach JWT to requests and handle 401/5xx/network errors globally.
 * Import this module (e.g. in index.js or before any API call) so interceptors are registered.
 * API base: REACT_APP_API_URL (e.g. https://airbnb-backend.onrender.com) or http://localhost:5000.
 */
import axios from "axios";
import { getValidToken, removeStoredToken } from "./auth";
import store from "../store";
import { showToast } from "../Action/ToastAction";
import { logout } from "../Action/UserAction";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
axios.defaults.baseURL = API_BASE_URL;

/** Request: add Authorization: Bearer <token> when getValidToken() returns a token. */
axios.interceptors.request.use(
  (config) => {
    const token = getValidToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/** Response: on 401 clear token and userInfo, dispatch logout and "Session expired" toast; on 5xx/network show generic error toast. */
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      removeStoredToken();
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.removeItem("userInfo");
        }
      } catch {}
      store.dispatch(logout());
      store.dispatch(showToast("Session expired. Please log in again.", "error"));
    } else if (status >= 500) {
      store.dispatch(showToast("Something went wrong. Please try again later.", "error"));
    } else if (error.message === "Network Error" || !error.response) {
      store.dispatch(showToast("Connection problem. Check your network and try again.", "error"));
    }
    return Promise.reject(error);
  }
);
