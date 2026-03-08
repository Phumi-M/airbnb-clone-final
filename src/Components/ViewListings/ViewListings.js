import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { listListing, deleteListing } from "../../Action/ListingActions";
import { showToast } from "../../Action/ToastAction";
import { formatPriceZAR } from "../../utils/format";
import StarIcon from "@mui/icons-material/Star";
import "./ViewListings.css";

const ViewListings = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { listings = [], loading, error } = useSelector((state) => state.listingList) || {};

  useEffect(() => {
    dispatch(listListing());
  }, [dispatch]);

  const handleDelete = (e, id, title) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Delete "${title || "this listing"}"? This cannot be undone.`)) {
      dispatch(deleteListing(id));
      dispatch(showToast("Listing deleted.", "success"));
    }
  };

  const getPropertyTypeLine = (listing) => {
    const type = listing.type || "Entire home";
    const loc = listing.location ? ` in ${listing.location}` : "";
    return `${type}${loc}`;
  };

  const getFeaturesLine = (listing) => {
    const parts = [];
    const guests = Number(listing.guests) || 0;
    const beds = Number(listing.bedrooms) || 0;
    const baths = Number(listing.bathrooms) || 0;
    if (guests) parts.push(`${guests} guest${guests !== 1 ? "s" : ""}`);
    parts.push(listing.type || "Entire Home");
    if (beds) parts.push(`${beds} bed${beds !== 1 ? "s" : ""}`);
    if (baths) parts.push(`${baths} bath${baths !== 1 ? "s" : ""}`);
    const amenities = Array.isArray(listing.amenities) ? listing.amenities : (Array.isArray(listing.amenitiesList) ? listing.amenitiesList : []);
    const displayAmenities = amenities.slice(0, 4).filter(Boolean);
    displayAmenities.forEach((a) => parts.push(typeof a === "string" ? a : a.label || a));
    return parts.join(" • ") || "—";
  };

  if (loading && listings.length === 0) {
    return (
      <div className="view_listings view_listings_loading">
        <h1>My Hotel List</h1>
        <p>Loading your listings…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="view_listings view_listings_error">
        <h1>My Hotel List</h1>
        <p className="view_listings_errorMessage" role="alert">{error}</p>
        <button type="button" className="view_listings_retry" onClick={() => dispatch(listListing())}>
          Try again
        </button>
        <Link to="/create-listing" className="view_listings_cta">Create a listing</Link>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="view_listings view_listings_empty">
        <h1>My Hotel List</h1>
        <p>You have not created any listings yet.</p>
        <Link to="/create-listing" className="view_listings_cta">
          Create a listing
        </Link>
      </div>
    );
  }

  const isListings = location.pathname === "/listings";

  return (
    <div className="view_listings">
      <nav className="view_listings_nav">
        <Link
          to="/reservations"
          className={`view_listings_navLink ${location.pathname === "/reservations" ? "view_listings_navLink_active" : ""}`}
        >
          View Reservations
        </Link>
        <Link
          to="/listings"
          className={`view_listings_navLink ${isListings ? "view_listings_navLink_active" : ""}`}
        >
          View Listings
        </Link>
        <Link
          to="/create-listing"
          className={`view_listings_navLink ${location.pathname === "/create-listing" ? "view_listings_navLink_active" : ""}`}
        >
          Create Listing
        </Link>
      </nav>
      <div className="view_listings_separator" />
      <h1 className="view_listings_title">My Hotel List</h1>
      <ul className="view_listings_list">
        {listings.map((listing) => (
          <li key={listing.id} className="view_listings_row">
            <div className="view_listings_row_imageWrap">
              <div className="view_listings_row_image">
                <img
                  src={listing.img || (listing.images && listing.images[0])}
                  alt={listing.title || "Listing"}
                />
              </div>
              <div className="view_listings_row_actions">
                <Link
                  to={"/listings/edit/" + listing.id}
                  className="view_listings_btn view_listings_btn_update"
                >
                  Update
                </Link>
                <button
                  type="button"
                  className="view_listings_btn view_listings_btn_delete"
                  onClick={(e) => handleDelete(e, listing.id, listing.title)}
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="view_listings_row_details">
              <p className="view_listings_row_type">{getPropertyTypeLine(listing)}</p>
              <h3 className="view_listings_row_title">{listing.title}</h3>
              <p className="view_listings_row_features">{getFeaturesLine(listing)}</p>
              <p className="view_listings_row_rating">
                <StarIcon className="view_listings_star" />
                5.0 (215 reviews)
              </p>
            </div>
            <div className="view_listings_row_priceWrap">
              <p className="view_listings_row_price">
                {(() => {
                  const amount = listing.priceDisplay || (listing.price != null ? formatPriceZAR(listing.price, false) : "—");
                  const hasUnit = typeof amount === "string" && amount.includes("/ night");
                  return (
                    <>
                      {amount}
                      {!hasUnit && amount !== "—" && <span className="view_listings_row_priceUnit"> / night</span>}
                    </>
                  );
                })()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewListings;
