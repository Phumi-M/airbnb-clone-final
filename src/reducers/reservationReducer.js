import { RESERVATION_ADD, RESERVATION_LOAD, RESERVATION_REMOVE } from "../Types/ReservationTypes";

const getInitialList = () => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const raw = window.localStorage.getItem("airbnb_reservations");
      return raw ? JSON.parse(raw) : [];
    }
  } catch {
    // ignore
  }
  return [];
};

export const reservationReducer = (state = { list: getInitialList() }, action) => {
  switch (action.type) {
    case RESERVATION_LOAD:
      return { list: action.payload || [] };

    case RESERVATION_ADD:
      return { list: [...(state.list || []), action.payload] };

    case RESERVATION_REMOVE:
      return { list: (state.list || []).filter((r) => r.id !== action.payload) };

    default:
      return state;
  }
};
