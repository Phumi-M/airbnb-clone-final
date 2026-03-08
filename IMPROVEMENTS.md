# Suggested Improvements

## 1. **Reserve button (Listing detail)**
- **Current:** "Reserve" is a non-functional button.
- **Improve:** On click, validate dates and guest count; if user is logged in, redirect to a checkout/confirmation step (or show “Request to book” summary). If not logged in, open the login modal and then continue to reserve.
- Optionally show a price summary (“R X,XXX total”) and disable the button when dates are invalid.

## 2. **Modal accessibility**
- **Current:** Dialog uses a generic `aria-label="Modal"`.
- **Improve:** Set a dynamic `aria-label` (and optionally `aria-labelledby`) based on content, e.g. `"Log in"`, `"Language and region"`, so screen readers announce the purpose of each modal.

## 3. **Language/currency in header**
- **Current:** Globe opens the modal but the header doesn’t reflect the chosen language or currency.
- **Improve:** Read `airbnb_language` / `airbnb_currency` (or your keys) from localStorage and show a short label next to the globe (e.g. “English (ZA)” or “ZAR”). Optional: dispatch a Redux action when the user saves so the header updates without a refresh.

## 4. **Reservations page**
- **Current:** Placeholder “Your reservations” / “Coming soon”.
- **Improve:** Add a simple reservations list (e.g. from localStorage or Redux): listing title, dates, total, status. Reuse the same data shape you’ll use when the Reserve flow is implemented.

## 5. **Redux store**
- **Current:** Uses deprecated `createStore`.
- **Improve:** Migrate to `@reduxjs/toolkit` and `configureStore` for future-proofing and better DevTools integration. Keep the same reducers/actions and only change the store setup.

## 6. **Route-level code splitting**
- **Current:** All route components are imported in `App.js`.
- **Improve:** Use `React.lazy()` and `<Suspense>` for heavy routes (e.g. `CreateListing`, `ListingDetail`, `SearchPage`) to reduce initial bundle size and improve first load.

## 7. **404 / not found page**
- **Current:** Unknown routes may render a blank or inconsistent view.
- **Improve:** Add a catch-all route that renders a “Page not found” view with a link back to home and, if desired, to the sitemap.

## 8. **Document title per page**
- **Current:** Document title is likely the same for every page.
- **Improve:** In each main page component (or in a small layout/wrapper), set `document.title` (e.g. “Listing – Cozy Cottage | Airbnb Clone”) so tabs and history are clearer and SEO is improved.

## 9. **Focus trap in modals**
- **Current:** Modal closes on Escape and focuses the close button; focus can still leave the modal.
- **Improve:** Implement a focus trap so Tab/Shift+Tab cycles only through focusable elements inside the modal until it is closed. This improves keyboard and screen-reader usability.

## 10. **Search filters**
- **Current:** Search page has filter buttons (Cancellation, Type of place, Price, etc.) that don’t filter results.
- **Improve:** Wire at least one filter (e.g. price range or type) to the listing list and URL (e.g. `?minPrice=1000&maxPrice=3000`) so state is shareable and the UI reflects the filter.

---

**Quick wins:** #2 (modal aria-label), #7 (404 page), #8 (document title).  
**High impact:** #1 (Reserve flow), #4 (Reservations page), #10 (search filters).
