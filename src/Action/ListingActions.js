/**
 * Listing CRUD and list-fetch actions.
 * listListing: GET /listings from API; on failure uses localStorage and shows toast.
 * createListing, updateListing, deleteListing: Redux + localStorage only (API CRUD available at PUT/DELETE /listings/:id).
 */
import {
  LISTING_LIST_REQUEST,
  LISTING_LIST_SUCCESS,
  LISTING_LIST_FAIL,
  LISTING_ADD,
  LISTING_UPDATE,
  LISTING_DELETE,
} from "../Types/ListingTypes";
import axios from "axios";
import { showToast } from "./ToastAction";

const LISTINGS_STORAGE_KEY = "airbnb_listings";

/**
 * Fetch listings: GET http://localhost:5000/listings.
 * On success, dispatch payload (array). On failure, use saved listings from localStorage or dispatch LISTING_LIST_FAIL.
 */
export const listListing = () => async (dispatch) => {
  try {
    dispatch({ type: LISTING_LIST_REQUEST });
    const { data } = await axios.get("http://localhost:5000/listings");
    dispatch({ type: LISTING_LIST_SUCCESS, payload: data });
  } catch (error) {
    const friendlyMessage = "Could not load listings. Showing saved data if available.";
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const saved = window.localStorage.getItem(LISTINGS_STORAGE_KEY);
        const listings = saved ? JSON.parse(saved) : [];
        if (listings.length) {
          dispatch({ type: LISTING_LIST_SUCCESS, payload: listings });
          dispatch(showToast("Using your saved listings.", "info"));
        } else {
          dispatch({ type: LISTING_LIST_FAIL, payload: friendlyMessage });
        }
      } else {
        dispatch({ type: LISTING_LIST_FAIL, payload: friendlyMessage });
      }
    } catch {
      dispatch({ type: LISTING_LIST_FAIL, payload: friendlyMessage });
    }
  }
};

/** Persist current listings from Redux state to localStorage. */
const persistListings = (getState) => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const list = getState().listingList?.listings || [];
      window.localStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(list));
    }
  } catch {
    // ignore
  }
};

/** Add a new listing and persist to localStorage. Skips if payload is invalid. */
export const createListing = (listing) => (dispatch, getState) => {
  if (!listing || typeof listing.title !== "string" || !listing.title.trim() || typeof listing.location !== "string" || !listing.location.trim()) {
    return;
  }
  dispatch({ type: LISTING_ADD, payload: listing });
  persistListings(getState);
};

/** Update an existing listing and persist. Validates id and payload. */
export const updateListing = (listing) => (dispatch, getState) => {
  if (!listing || listing.id == null) return;
  dispatch({ type: LISTING_UPDATE, payload: listing });
  persistListings(getState);
};

/** Delete a listing by id and persist. No-op if id is missing. */
export const deleteListing = (id) => (dispatch, getState) => {
  if (id == null || id === "") return;
  dispatch({ type: LISTING_DELETE, payload: id });
  persistListings(getState);
};