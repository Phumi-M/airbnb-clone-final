/**
 * User auth actions: login (API + local fallback), register (local), logout.
 * Uses auth utils for token storage and local JWT-style tokens.
 */
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_CLEAR_ERROR,
  USER_LOGOUT,
} from "../Types/UserTypes";
import axios from "axios";
import {
  setStoredToken,
  removeStoredToken,
  generateLocalToken,
  isValidTokenShape,
} from "../utils/auth";

const REGISTERED_USERS_KEY = "airbnb_registeredUsers";

/** Get registered users from localStorage (for local signup fallback). */
const getRegisteredUsers = () => {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/** Persist registered users to localStorage. */
const saveRegisteredUsers = (users) => {
  try {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  } catch {
    // ignore
  }
};

/**
 * Login: POST /login with { email, password }.
 * Expects API response: { user: { id, name, email }, token }.
 * On API failure, falls back to locally registered users and issues a local JWT-style token.
 */
export const login = (email, password) => async (dispatch) => {
  dispatch({ type: USER_LOGIN_REQUEST });
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const { data } = await axios.post(
      "http://localhost:5000/login",
      { email, password },
      config
    );
    const rawUser = data.user || data.userInfo || data;
    const userInfo =
      typeof rawUser === "object" && rawUser !== null
        ? {
            name: rawUser.name ?? rawUser.username ?? "",
            email: rawUser.email ?? "",
            ...(rawUser.id != null && { id: rawUser.id }),
          }
        : { name: "", email: "" };
    const token = data.token || data.accessToken;
    if (typeof token === "string" && token.trim() && isValidTokenShape(token)) {
      setStoredToken(token.trim());
    }
    try {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    } catch {}
    dispatch({ type: USER_LOGIN_SUCCESS, payload: { userInfo, token: token && typeof token === "string" ? token.trim() : null } });
  } catch (error) {
    const registered = getRegisteredUsers();
    const user = registered.find(
      (u) => u.email.toLowerCase() === String(email).trim().toLowerCase()
    );
    if (user && user.password === password) {
      const userInfo = { name: user.name, email: user.email };
      const token = generateLocalToken(user.email);
      setStoredToken(token);
      try {
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
      } catch {}
      dispatch({ type: USER_LOGIN_SUCCESS, payload: { userInfo, token } });
    } else {
      dispatch({
        type: USER_LOGIN_FAIL,
        payload:
          error.response?.data?.message ||
          error.message ||
          "Invalid email or password.",
      });
    }
  }
};

/** Register a new user locally and log them in with a generated token. */
export const register = (name, email, password) => (dispatch) => {
  dispatch({ type: USER_LOGIN_REQUEST });
  const trimmedEmail = String(email).trim().toLowerCase();
  const users = getRegisteredUsers();
  if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: "An account with this email already exists.",
    });
    return;
  }
  const userInfo = { name: String(name).trim(), email: trimmedEmail };
  const newUser = { ...userInfo, password };
  saveRegisteredUsers([...users, newUser]);
  const token = generateLocalToken(trimmedEmail);
  setStoredToken(token);
  try {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  } catch {}
  dispatch({ type: USER_LOGIN_SUCCESS, payload: { userInfo, token } });
};

/** Clear any login error in state. */
export const clearLoginError = () => ({ type: USER_CLEAR_ERROR });

/** Clear user and token from state and localStorage. */
export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  removeStoredToken();
  dispatch({ type: USER_LOGOUT });
};