/**
 * Listing list state: loading, error, and listings array.
 * Handles fetch lifecycle and CRUD (add, update, delete).
 */
import {
  LISTING_LIST_REQUEST,
  LISTING_LIST_SUCCESS,
  LISTING_LIST_FAIL,
  LISTING_ADD,
  LISTING_UPDATE,
  LISTING_DELETE,
} from "../Types/ListingTypes";

export const listingListReducers = (state = { listings: [] }, action) => {
  switch (action.type) {
    case LISTING_LIST_REQUEST:
      return { ...state, loading: true, error: null };

    case LISTING_LIST_SUCCESS:
      return { loading: false, listings: action.payload, error: null };

    case LISTING_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };

    case LISTING_ADD:
      return { ...state, listings: [...(state.listings || []), action.payload] };

    case LISTING_UPDATE: {
      const list = state.listings || [];
      const updated = list.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
      return { ...state, listings: updated };
    }

    case LISTING_DELETE: {
      const list = state.listings || [];
      const filtered = list.filter((item) => item.id !== action.payload);
      return { ...state, listings: filtered };
    }

    default:
      return state;
  }
};
