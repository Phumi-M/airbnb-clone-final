/**
 * Reusable DOM helpers (scroll, focus). Use in forms and wizards.
 */

/**
 * Scroll the first element matching an error selector into view. Use after validation fails.
 * @param {React.RefObject<HTMLElement>} formRef - ref to the form or container
 * @param {string} [errorSelector] - default: ".create_listing_input_error, [aria-invalid='true']"
 */
export function scrollToFirstError(formRef, errorSelector = ".create_listing_input_error, [aria-invalid='true']") {
  const el = formRef?.current?.querySelector?.(errorSelector);
  el?.scrollIntoView?.({ behavior: "smooth", block: "center" });
}
