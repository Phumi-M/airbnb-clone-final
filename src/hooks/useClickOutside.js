import { useEffect } from "react";

/**
 * Run a callback when a click happens outside the ref element. Reusable for dropdowns, modals, etc.
 * @param {React.RefObject<HTMLElement|null>} ref
 * @param {() => void} onClickOutside
 */
export function useClickOutside(ref, onClickOutside) {
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClickOutside();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, onClickOutside]);
}
