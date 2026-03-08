/**
 * Redux store: combined reducers, thunk middleware, and initial state.
 * Hydration: if getValidToken() exists, restore userInfo from localStorage; else clear stale token/user.
 * Listings are restored from airbnb_listings so UI can show data before or without API.
 */
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";

import { listingListReducers } from "./reducers/listingReducer";
import { modalReducer } from "./reducers/modalReducer";
import { userLoginReducers } from "./reducers/userReducer";
import { toastReducer } from "./reducers/toastReducer";
import { reservationReducer } from "./reducers/reservationReducer";
import { getValidToken, getStoredToken, removeStoredToken } from "./utils/auth";

const reducer = combineReducers({
  listingList: listingListReducers,
  modal: modalReducer,
  userLogin: userLoginReducers,
  toast: toastReducer,
  reservations: reservationReducer,
});

/* Hydrate user and listings from localStorage; invalid/expired token triggers cleanup */
let userInfoFromLocalStorage = null;
let tokenFromLocalStorage = null;
let listingsFromLocalStorage = [];

try {
  if (typeof window !== "undefined" && window.localStorage) {
    const token = getValidToken();
    if (token) {
      tokenFromLocalStorage = token;
      const stored = window.localStorage.getItem("userInfo");
      userInfoFromLocalStorage = stored ? JSON.parse(stored) : null;
    } else if (getStoredToken()) {
      removeStoredToken();
      window.localStorage.removeItem("userInfo");
    }
    const listStored = window.localStorage.getItem("airbnb_listings");
    listingsFromLocalStorage = listStored ? JSON.parse(listStored) : [];
  }
} catch {
  userInfoFromLocalStorage = null;
  tokenFromLocalStorage = null;
  listingsFromLocalStorage = [];
}

const initialState = {
  userLogin: {
    userInfo: userInfoFromLocalStorage,
    token: tokenFromLocalStorage,
  },
  listingList: { listings: listingsFromLocalStorage },
};

const middleware = [thunk];

const composeEnhancers =
  (typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const store = createStore(
  reducer,
  initialState,
  composeEnhancers(applyMiddleware(...middleware))
);

export default store;