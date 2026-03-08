/**
 * Toast notifications: show (message + variant) and clear. Used by actions and axios interceptor.
 */
import { SHOW_TOAST, CLEAR_TOAST } from "../Types/ToastTypes";

export const showToast = (message, variant) => {
  const payload = typeof message === "string" ? { message, variant: variant || "info" } : message;
  return { type: SHOW_TOAST, payload };
};

export const clearToast = () => ({ type: CLEAR_TOAST });
