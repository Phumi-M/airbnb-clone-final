import { SHOW_TOAST, CLEAR_TOAST } from "../Types/ToastTypes";

const initialState = { message: null, variant: "info" };

export const toastReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_TOAST: {
      const p = action.payload;
      const message = p && typeof p === "object" && "message" in p ? p.message : p;
      const variant = (p && typeof p === "object" && p.variant) ? p.variant : "info";
      return { message, variant };
    }
    case CLEAR_TOAST:
      return { message: null, variant: "info" };
    default:
      return state;
  }
};
