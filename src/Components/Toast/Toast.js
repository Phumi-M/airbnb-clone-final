/**
 * Global toast: reads message/variant from Redux, auto-dismisses after 5s, dismiss button.
 */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearToast } from "../../Action/ToastAction";
import "./Toast.css";

const AUTO_DISMISS_MS = 5000;

const Toast = () => {
  const dispatch = useDispatch();
  const { message, variant = "info" } = useSelector((state) => state.toast) || {};

  useEffect(() => {
    if (!message) return;
    const id = setTimeout(() => dispatch(clearToast()), AUTO_DISMISS_MS);
    return () => clearTimeout(id);
  }, [message, dispatch]);

  if (!message) return null;

  return (
    <div
      className={`toast toast_${variant}`}
      role="alert"
      aria-live="polite"
    >
      <span className="toast_message">{message}</span>
      <button
        type="button"
        className="toast_dismiss"
        onClick={() => dispatch(clearToast())}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
