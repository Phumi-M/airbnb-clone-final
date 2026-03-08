# Source structure

**API documentation:** [../docs/API.md](../docs/API.md) – endpoints, request/response shapes, auth.

- **`App.js`** – Root: Router, Header, Footer, Routes, Modal, Toast, ErrorBoundary.
- **`store.js`** – Redux store (listings, user, modal, toast, reservations); initial state from localStorage.
- **`index.js`** – React root and store provider.

## Folders

- **`Action/`** – Redux thunk actions: `ListingActions`, `UserAction`, `ModalAction`, `ToastAction`, `ReservationActions`.
- **`reducers/`** – Redux reducers for each slice.
- **`Types/`** – Redux action type constants.
- **`Components/`** – UI components; each in its own folder with `.js` + `.css`.
  - **`Header`** – Logo, search bar, user menu.
  - **`Home`** – Banner, province cards, places-to-stay, experiences, gift cards, hosting CTA, inspiration.
  - **`SearchPage`** – Query params, filters, sort, `SearchResults`; exports `DEFAULT_LISTINGS`.
  - **`ListingDetail`** – Full listing view and booking sidebar.
  - **`Cards`** – Reusable listing card (used on Home and in listings grids).
  - **`Modal`** – Wrapper for Login and Language/Currency modals.
  - **`ProtectedRoute`** – Wraps routes that require login; redirects and opens login modal.
- **`utils/`** – Reusable helpers:
  - **`listings.js`** – Province/location filtering, short description.
  - **`format.js`** – Dates, price, pluralization.
  - **`searchParams.js`** – Build/parse search query strings.
  - **`validation.js`** – Email, password, required field validation.
  - **`auth.js`** – Token storage, JWT decode, local token generation.
  - **`dom.js`** – Scroll to first error.
  - **`axiosAuth.js`** – Axios interceptors: attach token, show toast on errors.
- **`hooks/`** – `useDocumentTitle`, `useClickOutside`.

## Shared data

- **`DEFAULT_LISTINGS`** – Defined in `SearchPage/SearchPage.js`, imported by Home and ListingDetail so cards and detail stay in sync.
- **`PROVINCES`**, **`filterListingsByProvince`** – From `utils/listings.js`; used on Home and for filtering.
