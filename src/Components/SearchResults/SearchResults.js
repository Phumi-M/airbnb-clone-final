/**
 * Single search result row/card: image, location, title, description, star rating, price, total. Clear link to listing.
 */
import { Link } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "./SearchResults.css";

const SearchResults = ({ id, img, location, title, description, star, price, total }) => {
  const content = (
    <>
      <div className="searchResults_imgWrap">
        <img src={img} alt={title || "Listing"} loading="lazy" />
        <FavoriteBorderIcon className="searchResults_heart" aria-label="Save" />
        {id != null && (
          <span className="searchResults_viewLabel" aria-hidden>
            <ArrowForwardIcon fontSize="small" /> View details
          </span>
        )}
      </div>
      <div className="searchResults_info">
        <div className="searchResults_infoTop">
          <p className="searchResults_location">{location ? location.toUpperCase() : ""}</p>
          <h3 className="searchResults_title">{title}</h3>
          <p className="searchResults_description">{description}</p>
        </div>
        <div className="searchResults_infoBottom">
          <div className="searchResults_stars">
            {star != null && (
              <>
                <StarIcon className="searchResults_starIcon" fontSize="small" aria-hidden />
                <span><strong>{Number(star).toFixed(1)}</strong></span>
              </>
            )}
          </div>
          <div className="searchResults_price">
            <h2 className="searchResults_priceAmount">{price}</h2>
            <p className="searchResults_priceTotal">{total}</p>
          </div>
        </div>
      </div>
    </>
  );

  if (id != null) {
    return (
      <Link to={`/listing/${id}`} className="searchResults searchResults_link">
        {content}
      </Link>
    );
  }

  return <div className="searchResults">{content}</div>;
};

export default SearchResults;
