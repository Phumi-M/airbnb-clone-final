/**
 * Listing detail page: gallery, title, host, features, description, sleep setup,
 * amenities, calendar, reviews, map, and booking sidebar. Data from DEFAULT_LISTINGS + Redux by id.
 */
import { useState, useMemo, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addReservation } from "../../Action/ReservationActions";
import { openModal } from "../../Action/ModalAction";
import { buildSearchQueryString } from "../../utils/searchParams";
import { DEFAULT_LISTINGS } from "../SearchPage/SearchPage";
import StarIcon from "@mui/icons-material/Star";
import ShareIcon from "@mui/icons-material/IosShare";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import GridViewIcon from "@mui/icons-material/GridView";
import FlagIcon from "@mui/icons-material/OutlinedFlag";
import { DateRangePicker } from "react-date-range";
import { enUS } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./ListingDetail.css";

const formatCalendarDate = (d) => d.toLocaleDateString("en-ZA", { month: "short", day: "numeric", year: "numeric" });
const getNights = (start, end) => Math.max(0, Math.round((end - start) / (1000 * 60 * 60 * 24)));
const formatZAR = (n) => `R${Number(n).toLocaleString("en-ZA")}`;

const DEFAULT_HOST = { name: "Ghazal", joined: "May 2021", reviews: 12, superhost: true, responseRate: "100%", responseTime: "within an hour" };
const DEFAULT_FEATURES = [
  { label: "Entire home", icon: "🏠", text: "You'll have the apartment to yourself." },
  { label: "Enhanced Clean", icon: "✨", text: "This Host committed to Airbnb's 5-step enhanced cleaning process.", showMore: true },
  { label: "Self check-in", icon: "🔑", text: "Check yourself in with the keypad." },
  { label: "Free cancellation", icon: "📅", text: "Free cancellation before check-in." },
];
const DEFAULT_AMENITIES = ["Garden view", "Kitchen", "Wifi", "Pets allowed", "Washer", "Dryer", "Air conditioning", "Security cameras", "Refrigerator", "Bicycles"];
const DEFAULT_HOUSE_RULES = ["Check-in: After 4:00 PM", "Checkout: 10:00 AM", "Self check-in with lockbox", "No smoking", "No pets", "No parties or events"];
const REVIEW_TEMPLATES = [
  { name: "Jose", date: "December 2021", text: "Host was very attentive. Great stay!" },
  { name: "Luke", date: "November 2021", text: "Nice place to stay!" },
  { name: "Shayna", date: "November 2021", text: "Wonderful neighborhood, easy access to restaurants." },
];
// Generate category scores that average to the listing rating (4.6–5.0), different per listing
const getCategoryScores = (rating, listingId) => {
  const base = typeof rating === "number" ? rating : parseFloat(rating) || 4.8;
  const offsets = [0.2, -0.1, 0.1, -0.2, 0, 0.1];
  const shift = (listingId % 3) - 1;
  return ["Cleanliness", "Accuracy", "Communication", "Location", "Check-in", "Value"].map((_, i) => {
    const raw = base + (offsets[i] || 0) + shift * 0.05;
    const clamped = Math.max(4.0, Math.min(5, Math.round(raw * 10) / 10));
    return clamped;
  });
};
// Generate review ratings that vary per listing (4.6, 4.7, 4.8, 4.9, 5.0)
const getReviewsForListing = (rating, listingId) => {
  const base = typeof rating === "number" ? rating : parseFloat(rating) || 4.8;
  const seeds = [0.2, -0.1, 0.1];
  return REVIEW_TEMPLATES.map((r, i) => ({
    ...r,
    rating: Math.max(4.5, Math.min(5, Math.round((base + (seeds[i] || 0)) * 10) / 10)),
  }));
};

const DEFAULT_SLEEP_PHOTOS = [
  { src: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600", room: "Bedroom", beds: "1 queen bed" },
  { src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600", room: "Bedroom", beds: "1 double bed" },
];

// Location coordinates and display names for "Where you'll be" map (South Africa)
const LOCATION_MAP = {
  "Cape Town": { lat: -33.9249, lng: 18.4241, display: "Cape Town, Western Cape, South Africa" },
  "Durban": { lat: -29.8587, lng: 31.0218, display: "Durban, KwaZulu-Natal, South Africa" },
  "Johannesburg": { lat: -26.2041, lng: 28.0473, display: "Johannesburg, Gauteng, South Africa" },
  "Stellenbosch": { lat: -33.9321, lng: 18.8602, display: "Stellenbosch, Western Cape, South Africa" },
  "Drakensberg": { lat: -29.1167, lng: 29.45, display: "Drakensberg, KwaZulu-Natal, South Africa" },
  "Karoo": { lat: -32.2667, lng: 22.5333, display: "Karoo, Western Cape, South Africa" },
  "Dullstroom": { lat: -25.4167, lng: 30.1, display: "Dullstroom, Mpumalanga, South Africa" },
  "Ballito": { lat: -29.534, lng: 31.2144, display: "Ballito, KwaZulu-Natal, South Africa" },
};
const DEFAULT_MAP_CENTER = { lat: -33.9249, lng: 18.4241, display: "South Africa" };
const getMapLocation = (location) => {
  if (!location || typeof location !== "string") return DEFAULT_MAP_CENTER;
  const key = Object.keys(LOCATION_MAP).find((k) => k.toLowerCase() === location.trim().toLowerCase());
  return key ? LOCATION_MAP[key] : { ...DEFAULT_MAP_CENTER, display: `${location.trim()}, South Africa` };
};
// Google Maps embed – uses same look as Google Maps (place centered, zoom 14)
const getMapEmbedUrl = (lat, lng, displayAddress) => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  if (apiKey) {
    return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(apiKey)}&q=${encodeURIComponent(lat + "," + lng)}&zoom=14`;
  }
  return `https://www.google.com/maps?q=${lat},${lng}&z=14&output=embed`;
};

// Explore other options – related places per region (South Africa)
const EXPLORE_OPTIONS = {
  "Cape Town": { label: "Western Cape", places: ["Stellenbosch", "Franschhoek", "Hermanus", "Simon's Town", "Camps Bay", "Constantia", "Paarl", "Somerset West"] },
  "Durban": { label: "KwaZulu-Natal", places: ["Ballito", "Umhlanga", "Pietermaritzburg", "Scottburgh", "Margate", "Drakensberg", "Westville", "Salt Rock"] },
  "Johannesburg": { label: "Gauteng", places: ["Pretoria", "Sandton", "Rosebank", "Fourways", "Midrand", "Centurion", "Soweto", "Melrose"] },
  "Stellenbosch": { label: "Western Cape", places: ["Cape Town", "Franschhoek", "Paarl", "Hermanus", "Somerset West", "Constantia", "Simon's Town"] },
  "Drakensberg": { label: "KwaZulu-Natal", places: ["Durban", "Underberg", "Winterton", "Champagne Valley", "Ballito", "Howick", "Nottingham Road"] },
  "Karoo": { label: "Western Cape", places: ["Oudtshoorn", "Graaff-Reinet", "Prince Albert", "Sutherland", "Beaufort West", "Cradock", "Matjiesfontein"] },
  "Dullstroom": { label: "Mpumalanga", places: ["Nelspruit", "Graskop", "Sabie", "Kruger National Park", "Hazyview", "Barberton", "Lydenburg"] },
  "Ballito": { label: "KwaZulu-Natal", places: ["Durban", "Umhlanga", "Salt Rock", "Shakas Rock", "Zimbali", "Pietermaritzburg", "Margate"] },
};
const getExploreOptions = (location) => {
  if (!location || typeof location !== "string") return { label: "South Africa", places: ["Cape Town", "Durban", "Johannesburg", "Stellenbosch", "Ballito", "Drakensberg", "Pretoria", "Hermanus", "Franschhoek", "Umhlanga"] };
  const key = Object.keys(EXPLORE_OPTIONS).find((k) => k.toLowerCase() === location.trim().toLowerCase());
  return key ? EXPLORE_OPTIONS[key] : { label: "South Africa", places: ["Cape Town", "Durban", "Johannesburg", "Stellenbosch", "Ballito", "Drakensberg"] };
};

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userLogin?.userInfo);
  const storedListings = useSelector((state) => state.listingList?.listings) || [];
  const allListings = [...DEFAULT_LISTINGS, ...storedListings];
  const listing = allListings.find((l) => String(l.id) === String(id));

  const today = useMemo(() => new Date(), []);
  const defaultEnd = useMemo(() => { const d = new Date(today); d.setDate(d.getDate() + 2); return d; }, [today]);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const calendarRange = useMemo(() => ({ startDate, endDate, key: "selection" }), [startDate, endDate]);
  const nightsFromCalendar = getNights(startDate, endDate);

  const handleCalendarSelect = (ranges) => {
    const { startDate: s, endDate: e } = ranges.selection;
    setStartDate(s);
    setEndDate(e);
    setCheckIn(s.toISOString().slice(0, 10));
    setCheckOut(e.toISOString().slice(0, 10));
  };

  const handleCheckInChange = (e) => {
    const val = e.target.value;
    setCheckIn(val);
    if (val) {
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
        setStartDate(d);
        if (endDate <= d || !checkOut) {
          const end = new Date(d);
          end.setDate(end.getDate() + 1);
          setEndDate(end);
          setCheckOut(end.toISOString().slice(0, 10));
        }
      }
    }
  };

  const handleCheckOutChange = (e) => {
    const val = e.target.value;
    setCheckOut(val);
    if (val) {
      const d = new Date(val);
      if (!isNaN(d.getTime())) setEndDate(d);
    }
  };

  const handleClearDates = () => {
    setStartDate(today);
    setEndDate(defaultEnd);
    setCheckIn(today.toISOString().slice(0, 10));
    setCheckOut(defaultEnd.toISOString().slice(0, 10));
  };

  // Initialize booking date inputs when listing first loads
  useEffect(() => {
    if (!listing) return;
    setCheckIn(startDate.toISOString().slice(0, 10));
    setCheckOut(endDate.toISOString().slice(0, 10));
  }, [listing, startDate, endDate]);

  const handleReserve = () => {
    if (!userInfo) {
      dispatch(openModal("open", "login"));
      return;
    }
    const nights = nightsFromCalendar > 0 ? nightsFromCalendar : 1;
    const subtotal = pricePerNight * nights;
    const weeklyDiscount = Math.round(subtotal * 0.05);
    const cleaningFee = 62;
    const serviceFee = Math.round(subtotal * 0.12);
    const taxes = 29;
    const totalAmount = subtotal - weeklyDiscount + cleaningFee + serviceFee + taxes;
    const userEmail = userInfo.email || userInfo.username || "";
    if (!userEmail) return;
    dispatch(
      addReservation({
        userEmail,
        listingId: listing.id,
        title: listing.title,
        location: listing.location,
        img: mainImg,
        priceDisplay: listing.priceDisplay || listing.price || `R${pricePerNight} / night`,
        startDate: startDate.toISOString ? startDate.toISOString().slice(0, 10) : startDate,
        endDate: endDate.toISOString ? endDate.toISOString().slice(0, 10) : endDate,
        guests,
        total: totalAmount,
      })
    );
    navigate("/reservations");
  };

  if (!listing) {
    return (
      <div className="listing_detail listing_detail_notfound">
        <p>Listing not found.</p>
        <Link to="/">Back to home</Link>
      </div>
    );
  }

  const images = listing.images?.length ? listing.images : (listing.img ? [listing.img] : []);
  const mainImg = images[0] || listing.img;
  const thumbImages = images.length > 1 ? images.slice(1, 5) : Array(4).fill(mainImg);
  const pricePerNight = typeof listing.price === "number" ? listing.price : parseFloat(String(listing.price).replace(/[^0-9.]/g, "")) || 3500;
  const nights = nightsFromCalendar > 0 ? nightsFromCalendar : 7;
  const subtotal = pricePerNight * nights;
  const weeklyDiscount = Math.round(subtotal * 0.05);
  const cleaningFee = 62;
  const serviceFee = Math.round(subtotal * 0.12);
  const taxes = 29;
  const total = subtotal - weeklyDiscount + cleaningFee + serviceFee + taxes;
  const priceDisplay = listing.priceDisplay || listing.price || `R${pricePerNight} / night`;
  const description = listing.description || "Spacious and bright, in a real building with character. You will enjoy all the charms of the city thanks to its ideal location. Close to many shops, bars and restaurants.";
  const reviewCount = listing.reviewCount ?? 7;
  const rating = listing.star ?? 5.0;
  const categoryLabels = ["Cleanliness", "Accuracy", "Communication", "Location", "Check-in", "Value"];
  const categoryScores = getCategoryScores(rating, Number(listing.id) || 0);
  const reviewCards = getReviewsForListing(rating, Number(listing.id) || 0);
  const mapLocation = getMapLocation(listing.location);
  const exploreOptions = getExploreOptions(listing.location);
  const mapEmbedUrl = getMapEmbedUrl(mapLocation.lat, mapLocation.lng);
  const mapDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapLocation.lat + "," + mapLocation.lng)}`;

  return (
    <div className="listing_detail">
      <div className="listing_detail_wrap">
        <div className="listing_detail_header">
          <div className="listing_detail_header_left">
            <p className="listing_detail_location_subheading">{listing.location}{mapLocation.display !== listing.location ? ` · ${mapLocation.display}` : ""}</p>
            <h1 className="listing_detail_title" id="listing-detail-heading">{listing.title}</h1>
            <p className="listing_detail_subtitle" aria-describedby="listing-detail-heading">
              <StarIcon className="listing_detail_star" aria-hidden /> {rating}
              <span className="listing_detail_subtitle_sep">·</span>
              <button type="button" className="listing_detail_subtitle_link">{reviewCount} reviews</button>
              <span className="listing_detail_subtitle_sep">·</span>
              Superhost
              <span className="listing_detail_subtitle_sep">·</span>
              <button type="button" className="listing_detail_subtitle_link">{listing.location}</button>
            </p>
          </div>
          <div className="listing_detail_header_actions">
            <button type="button" className="listing_detail_action_btn">
              <ShareIcon fontSize="small" /> Share
            </button>
            <button type="button" className="listing_detail_action_btn">
              <FavoriteBorderIcon fontSize="small" /> Save
            </button>
          </div>
        </div>

        <div className="listing_detail_gallery">
          <div className="listing_detail_gallery_main">
            <img src={mainImg} alt={listing.title} />
          </div>
          <div className="listing_detail_gallery_grid">
            {thumbImages.map((src, i) => (
              <div key={i} className="listing_detail_gallery_thumb">
                <img src={src} alt="" />
                {i === thumbImages.length - 1 && (
                  <button type="button" className="listing_detail_show_photos" onClick={() => setShowAllPhotos(true)}>
                    <GridViewIcon fontSize="small" /> Show all photos
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <button type="button" className="listing_detail_show_photos listing_detail_show_photos_mobile" onClick={() => setShowAllPhotos(true)}>
          <GridViewIcon fontSize="small" /> Show all photos
        </button>

        <div className="listing_detail_columns">
          <div className="listing_detail_main">
            <div className="listing_detail_body">
          <section className="listing_detail_section listing_detail_host_summary" aria-labelledby="listing_host_heading">
            <h2 id="listing_host_heading">Entire rental unit hosted by {DEFAULT_HOST.name}</h2>
            <p>{listing.descriptionShort || listing.description}</p>
            <div className="listing_detail_host_avatar" aria-hidden />
          </section>

          <section className="listing_detail_section listing_detail_features">
            {DEFAULT_FEATURES.map((f, i) => (
              <div key={i} className="listing_detail_feature">
                <span className="listing_detail_feature_icon" aria-hidden>{f.icon}</span>
                <div>
                  <strong className="listing_detail_feature_label">{f.label}:</strong> {f.text}
                  {f.showMore && <button type="button" className="listing_detail_show_more listing_detail_show_more_inline"> Show more</button>}
                </div>
              </div>
            ))}
          </section>

          <section className="listing_detail_section" id="about" aria-labelledby="about-heading">
            <h2 id="about-heading">About this place</h2>
            <p className="listing_detail_description">{description}</p>
            <button type="button" className="listing_detail_show_more">Show more</button>
          </section>

          <section className="listing_detail_section listing_detail_sleep_section" id="where-youll-sleep" aria-labelledby="listing_sleep_heading">
            <h2 id="listing_sleep_heading">Where you&apos;ll sleep</h2>
            <div className="listing_detail_sleep_grid">
              {(listing.sleepPhotos && listing.sleepPhotos.length > 0 ? listing.sleepPhotos : DEFAULT_SLEEP_PHOTOS).map((room, i) => (
                <div key={i} className="listing_detail_sleep_card">
                  <img src={room.src} alt={room.room} className="listing_detail_sleep_img" loading="lazy" />
                  <p className="listing_detail_sleep_room"><strong>{room.room}</strong></p>
                  <p className="listing_detail_sleep_beds">{room.beds}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="listing_detail_section" id="amenities" aria-labelledby="amenities-heading">
            <h2 id="amenities-heading">What this place offers</h2>
            <ul className="listing_detail_amenities">
              {(listing.amenities && listing.amenities.length) ? listing.amenities.slice(0, 10).map((a, i) => (
                <li key={i}>{a}</li>
              )) : DEFAULT_AMENITIES.slice(0, 10).map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
            <button type="button" className="listing_detail_show_more">Show all amenities</button>
          </section>

          <section className="listing_detail_section listing_detail_calendar">
            <h2 className="listing_detail_calendar_title">
              {nightsFromCalendar > 0 ? `${nightsFromCalendar} night${nightsFromCalendar !== 1 ? "s" : ""} in ${listing.location}` : "Select your dates"}
            </h2>
            {nightsFromCalendar > 0 && (
              <p className="listing_detail_calendar_range">
                {formatCalendarDate(startDate)} - {formatCalendarDate(endDate)}
              </p>
            )}
            <div className="listing_detail_calendar_picker">
              <DateRangePicker
                ranges={[calendarRange]}
                onChange={handleCalendarSelect}
                locale={enUS}
                months={2}
                direction="horizontal"
                showMonthAndYearPickers={false}
              />
            </div>
            <div className="listing_detail_calendar_footer">
              <button type="button" className="listing_detail_calendar_clear" onClick={handleClearDates}>
                Clear dates
              </button>
            </div>
          </section>

          <section className="listing_detail_section listing_detail_reviews">
            <h2><StarIcon className="listing_detail_star" /> {rating} · {reviewCount} reviews</h2>
            <div className="listing_detail_review_bars">
              {categoryLabels.map((label, i) => {
                const score = categoryScores[i];
                const pct = ((score - 4) / 1) * 100;
                return (
                  <div key={label} className="listing_detail_review_bar">
                    <span>{label}</span>
                    <div className="listing_detail_review_bar_bg"><div className="listing_detail_review_bar_fill" style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} /></div>
                    <span>{score.toFixed(1)}</span>
                  </div>
                );
              })}
            </div>
            <div className="listing_detail_review_cards">
              {reviewCards.map((r, i) => (
                <div key={i} className="listing_detail_review_card">
                  <div className="listing_detail_review_avatar" />
                  <p><strong>{r.name}</strong> · {r.date} · <StarIcon className="listing_detail_star listing_detail_star_small" aria-hidden /> {r.rating.toFixed(1)}</p>
                  <p>{r.text}</p>
                </div>
              ))}
            </div>
            <button type="button" className="listing_detail_btn_outline">Show all {reviewCount} reviews</button>
          </section>

          <section className="listing_detail_section listing_detail_where" aria-labelledby="listing_where_heading">
            <h2 id="listing_where_heading">Where you&apos;ll be</h2>
            <p className="listing_detail_where_location">{mapLocation.display}</p>
            <div className="listing_detail_map_wrap">
              <iframe
                title={`Map of ${mapLocation.display}`}
                src={mapEmbedUrl}
                className="listing_detail_map_iframe"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={mapDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="listing_detail_map_link"
              >
                View on Google Maps
              </a>
            </div>
          </section>

          <section className="listing_detail_section listing_detail_host_full">
            <div className="listing_detail_host_header">
              <div className="listing_detail_host_avatar large" />
              <div>
                <h2>Hosted by {DEFAULT_HOST.name}</h2>
                <p>Joined {DEFAULT_HOST.joined} · {DEFAULT_HOST.reviews} Reviews · Identity verified · Superhost</p>
              </div>
            </div>
            <p>Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.</p>
            <p>Response rate: {DEFAULT_HOST.responseRate} · Response time: {DEFAULT_HOST.responseTime}</p>
            <button type="button" className="listing_detail_btn_primary">Contact Host</button>
            <p className="listing_detail_disclaimer">To protect your payment, never transfer money or communicate outside of the Airbnb website or app.</p>
          </section>

          <section className="listing_detail_section listing_detail_things" id="things-to-know" aria-labelledby="things-to-know-heading">
            <h2 id="things-to-know-heading">Things to know</h2>
            <div className="listing_detail_section_content listing_detail_things_grid">
              <div className="listing_detail_things_block" aria-labelledby="house-rules-heading">
                <h3 id="house-rules-heading">House rules</h3>
                <ul>
                  {DEFAULT_HOUSE_RULES.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
              <div className="listing_detail_things_block" aria-labelledby="health-safety-heading">
                <h3 id="health-safety-heading">Health & safety</h3>
                <ul>
                  <li>Committed to Airbnb&apos;s enhanced cleaning process</li>
                  <li>Carbon monoxide alarm</li>
                  <li>Smoke alarm</li>
                </ul>
              </div>
              <div className="listing_detail_things_block" aria-labelledby="cancellation-heading">
                <h3 id="cancellation-heading">Cancellation policy</h3>
                <p>Free cancellation before check-in.</p>
              </div>
            </div>
          </section>

          <section className="listing_detail_section listing_detail_explore" aria-labelledby="listing_explore_heading">
            <h2 id="listing_explore_heading">Explore other options in {exploreOptions.label}</h2>
            <div className="listing_detail_explore_grid">
              {exploreOptions.places.map((place) => (
                <Link
                  key={place}
                  to={`/search?${buildSearchQueryString({ location: place })}`}
                  className="listing_detail_explore_link"
                >
                  {place}
                </Link>
              ))}
            </div>
          </section>
            </div>
          </div>

          <aside className="listing_detail_booking">
        <div className="listing_detail_booking_sticky">
          <p className="listing_detail_booking_price">{priceDisplay}</p>
          <p className="listing_detail_booking_meta">
            <StarIcon className="listing_detail_star" aria-hidden /> {rating}
            <button type="button" className="listing_detail_booking_reviews_link"> {reviewCount} reviews</button>
          </p>
          <div className="listing_detail_booking_dates">
            <div className="listing_detail_booking_field">
              <label htmlFor="listing-checkin">CHECK-IN</label>
              <input id="listing-checkin" type="date" value={checkIn} onChange={handleCheckInChange} min={today.toISOString().slice(0, 10)} aria-label="Check-in date" />
            </div>
            <div className="listing_detail_booking_field">
              <label htmlFor="listing-checkout">CHECKOUT</label>
              <input id="listing-checkout" type="date" value={checkOut} onChange={handleCheckOutChange} min={checkIn || today.toISOString().slice(0, 10)} aria-label="Check-out date" />
            </div>
          </div>
          <div className="listing_detail_booking_field">
            <label>GUESTS</label>
            <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n} guest{n !== 1 ? "s" : ""}</option>
              ))}
            </select>
          </div>
          <button type="button" className="listing_detail_btn_reserve" onClick={handleReserve}>
            {userInfo ? "Reserve" : "Log in to reserve"}
          </button>
          <p className="listing_detail_booking_note">You won&apos;t be charged yet</p>
          <h3 className="listing_detail_booking_breakdown_heading" id="cost-breakdown">Cost breakdown</h3>
          <div className="listing_detail_booking_breakdown" role="list">
            <div className="listing_detail_booking_breakdown_row" role="listitem">
              <p>{formatZAR(pricePerNight)} × {nights} night{nights !== 1 ? "s" : ""}</p>
              <p>{formatZAR(subtotal)}</p>
            </div>
            {weeklyDiscount > 0 && (
              <div className="listing_detail_booking_breakdown_row listing_detail_booking_discount" role="listitem">
                <p>Weekly discount</p>
                <p>-{formatZAR(weeklyDiscount)}</p>
              </div>
            )}
            <div className="listing_detail_booking_breakdown_row" role="listitem">
              <p>Cleaning fee</p>
              <p>{formatZAR(cleaningFee)}</p>
            </div>
            <div className="listing_detail_booking_breakdown_row" role="listitem">
              <p>Service fee</p>
              <p>{formatZAR(serviceFee)}</p>
            </div>
            <div className="listing_detail_booking_breakdown_row" role="listitem">
              <p>Occupancy taxes and fees</p>
              <p>{formatZAR(taxes)}</p>
            </div>
            <div className="listing_detail_booking_breakdown_row listing_detail_booking_total" role="listitem">
              <p>Total</p>
              <p>{formatZAR(total)}</p>
            </div>
          </div>
          <button type="button" className="listing_detail_report"><FlagIcon fontSize="small" /> Report this listing</button>
          </div>
        </aside>
        </div>
      </div>

      {showAllPhotos && (
        <div className="listing_detail_lightbox" role="dialog" aria-modal="true" onClick={() => setShowAllPhotos(false)}>
          <button type="button" className="listing_detail_lightbox_close" onClick={() => setShowAllPhotos(false)} aria-label="Close">×</button>
          <div className="listing_detail_lightbox_inner" onClick={(e) => e.stopPropagation()}>
            {images.map((src, i) => (
              <img key={i} src={src} alt="" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingDetail;
