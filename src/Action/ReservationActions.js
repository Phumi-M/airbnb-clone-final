/**
 * Reservation actions: load/add/remove reservations; state persisted in localStorage.
 */
import { RESERVATION_ADD, RESERVATION_LOAD, RESERVATION_REMOVE } from "../Types/ReservationTypes";

const STORAGE_KEY = "airbnb_reservations";

const getStored = () => {
  try {
    const raw = typeof window !== "undefined" && window.localStorage && window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveStored = (list) => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
  } catch {
    // ignore
  }
};

export const loadReservations = () => (dispatch) => {
  const list = getStored();
  dispatch({ type: RESERVATION_LOAD, payload: list });
};

export const addReservation = (reservation) => (dispatch) => {
  const list = getStored();
  const newItem = {
    ...reservation,
    id: reservation.id || "res_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9),
    createdAt: reservation.createdAt || new Date().toISOString(),
  };
  const next = [...list, newItem];
  saveStored(next);
  dispatch({ type: RESERVATION_ADD, payload: newItem });
};

export const removeReservation = (id) => (dispatch) => {
  const list = getStored().filter((r) => r.id !== id);
  saveStored(list);
  dispatch({ type: RESERVATION_REMOVE, payload: id });
};
