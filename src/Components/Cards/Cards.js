/**
 * Reusable listing card: image, title, description, price, star rating, optional wishlist.
 * Renders as Link when `to` is provided, otherwise a div. Wishlist state is persisted in localStorage.
 */
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "./Cards.css";

const WISHLIST_KEY = "airbnb_wishlist";

/** Read wishlist listing IDs from localStorage. */
const getWishlistIds = () => {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const Cards = ({ src, title, description, price, to, id: listingId, star, guestFavorite, ariaLabel, showArrow }) => {
  const [savedIds, setSavedIds] = useState(getWishlistIds);
  const isSaved = listingId != null && savedIds.includes(String(listingId));

  const toggleWishlist = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent navigation when clicking wishlist
      if (listingId == null) return;
      const next = isSaved ? savedIds.filter((i) => i !== String(listingId)) : [...savedIds, String(listingId)];
      setSavedIds(next);
      try {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
      } catch {}
    },
    [listingId, isSaved, savedIds]
  );

  useEffect(() => {
    setSavedIds(getWishlistIds());
  }, [listingId]);

  const content = (
    <>
      <div className="card_img_wrap">
        <img src={src} alt={title || "Listing"} />
        {guestFavorite && (
          <span className="card_guest_favorite" aria-hidden>Guest favorite</span>
        )}
        {listingId != null && (
          <button
            type="button"
            className="card_wishlist"
            onClick={toggleWishlist}
            aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={isSaved}
          >
            {isSaved ? (
              <FavoriteIcon className="card_wishlist_icon card_wishlist_icon_filled" />
            ) : (
              <FavoriteBorderIcon className="card_wishlist_icon" />
            )}
          </button>
        )}
      </div>
      <div className="card_info">
        <h2>{title}</h2>
        <h4>{description}</h4>
        <div className="card_info_bottom">
          {price && <h3>{price}</h3>}
          {star != null && (
            <span className="card_star">
              <StarIcon className="card_star_icon" aria-hidden /> {Number(star).toFixed(star % 1 === 0 ? 0 : 2)}
            </span>
          )}
          {showArrow && to && (
            <span className="card_arrow" aria-hidden>
              <ArrowForwardIcon className="card_arrow_icon" />
            </span>
          )}
        </div>
      </div>
    </>
  );

  if (to) {
    return (
      <Link to={to} className="card card_link" aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  return <div className="card">{content}</div>;
};

export default Cards;
