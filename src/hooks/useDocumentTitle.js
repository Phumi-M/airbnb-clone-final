import { useEffect } from "react";

const APP_TITLE = "Airbnb Clone";

/**
 * Set document.title for the current page. Restores previous title on unmount.
 * @param {string} title - Page title (e.g. "Search" or "Cozy Cottage"). Full title becomes "title | Airbnb Clone".
 * @param {boolean} [prependAppName=true] - If true, title is "title | Airbnb Clone"; if false, title is used as-is.
 */
export function useDocumentTitle(title, prependAppName = true) {
  useEffect(() => {
    const previous = document.title;
    document.title = title
      ? prependAppName
        ? `${title} | ${APP_TITLE}`
        : title
      : APP_TITLE;
    return () => {
      document.title = previous;
    };
  }, [title, prependAppName]);
}
