/**
 * Home page: hero banner, province cards, places-to-stay by province,
 * experiences, gift cards, hosting CTA, and inspiration destinations.
 * Listings are merged from API/store and DEFAULT_LISTINGS for consistent UI.
 */
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Banner from "../Banner/Banner";
import Card from "../Cards/Cards";
import { useDispatch, useSelector } from "react-redux";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { listListing } from "./../../Action/ListingActions";
import { DEFAULT_LISTINGS } from "../SearchPage/SearchPage";
import { PROVINCES, filterListingsByProvince } from "../../utils/listings";
import "./Home.css";

const SEARCH_URL = "/search";

/** Province cards for the first row (Western Cape, KZN, Mpumalanga, Gauteng). */
const PROVINCE_CARDS = [
  {
    name: "Western Cape",
    searchUrl: `${SEARCH_URL}?location=${encodeURIComponent("Western Cape")}`,
    src: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800",
    description: "Cape Town, Stellenbosch, wine lands and coast.",
  },
  {
    name: "KwaZulu-Natal",
    searchUrl: `${SEARCH_URL}?location=${encodeURIComponent("KwaZulu-Natal")}`,
    src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    description: "Durban, Drakensberg, beaches and mountains.",
  },
  {
    name: "Mpumalanga",
    searchUrl: `${SEARCH_URL}?location=${encodeURIComponent("Mpumalanga")}`,
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    description: "Dullstroom, Kruger region and highveld.",
  },
  {
    name: "Gauteng",
    searchUrl: `${SEARCH_URL}?location=${encodeURIComponent("Gauteng")}`,
    src: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800",
    description: "Johannesburg and surrounds.",
  },
];

/** Tab labels for the inspiration section. */
const INSPIRATION_TABS = [
  "Destinations for arts & culture",
  "Destinations for outdoor adventure",
  "Mountain cabins",
  "Beach destinations",
  "Popular destinations",
  "Unique Stays",
];

/** Destination links shown in the inspiration grid. */
const INSPIRATION_DESTINATIONS = [
  { city: "Phoenix", region: "Arizona" },
  { city: "San Francisco", region: "California" },
  { city: "Newick", region: "England" },
  { city: "Hot Springs", region: "Arkansas" },
  { city: "Barcelona", region: "Catalonia" },
  { city: "London", region: "England" },
  { city: "Los Angeles", region: "California" },
  { city: "Prague", region: "Czechia" },
  { city: "Scarborough", region: "England" },
  { city: "San Diego", region: "California" },
  { city: "Washington", region: "District of Columbia" },
];

const Home = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [inspirationTab, setInspirationTab] = useState(0);
  const listingList = useSelector((state) => state.listingList);
  const { error, listings: storedListings } = listingList;
  const allListings = [...DEFAULT_LISTINGS, ...(storedListings || [])];

  useDocumentTitle("Home");

  useEffect(() => {
    dispatch(listListing());
  }, [dispatch]);

  // Scroll to #places-to-stay when navigating with hash
  useEffect(() => {
    if (location.hash === "#places-to-stay") {
      const el = document.getElementById("places-to-stay");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  return (
    <div className="home">
      {error && (
        <div className="home_error" role="alert">
          {error}
        </div>
      )}
      <Banner />
      <div className="home_section">
        <section className="home_inspiration_trip_section" aria-labelledby="inspiration-trip-heading">
          <h2 id="inspiration-trip-heading" className="home_inspiration_trip_heading">
            Inspiration for your next trip
          </h2>
          <div className="home_section_row1 home_section_provinces">
            {PROVINCE_CARDS.map((prov) => (
              <Card
                key={prov.name}
                to={prov.searchUrl}
                src={prov.src}
                title={prov.name}
                description={prov.description}
                ariaLabel={`View all places in ${prov.name}`}
                showArrow
              />
            ))}
          </div>
        </section>

        <section id="places-to-stay" className="home_places_section" aria-labelledby="places-to-stay-heading">
          <h2 id="places-to-stay-heading" className="home_places_heading">Places to stay</h2>

          {PROVINCES.map((province) => {
            const provinceListings = filterListingsByProvince(allListings, province);
            if (provinceListings.length === 0) return null;
            const searchUrl = `${SEARCH_URL}?location=${encodeURIComponent(province)}`;
            return (
              <div key={province} className="home_places_group">
                <div className="home_places_group_header">
                  <h3 className="home_places_subheading">{province}</h3>
                  <Link to={searchUrl} className="home_places_view_all">
                    View all
                  </Link>
                </div>
                <div className="home_places_grid">
                  {provinceListings.map((listing) => (
                    <Card
                      key={listing.id}
                      to={`/listing/${listing.id}`}
                      id={listing.id}
                      star={listing.star}
                      src={listing.img}
                      title={listing.title}
                      description={listing.descriptionShort || listing.description}
                      price={listing.priceDisplay || listing.price}
                      guestFavorite={listing.guestFavorite}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        <section className="home_experiences_section" aria-labelledby="experiences-heading">
          <h2 id="experiences-heading" className="home_experiences_heading">Discover Airbnb Experiences</h2>
          <div className="home_experiences_grid">
            <Link to="/experiences" className="home_experiences_card">
              <div
                className="home_experiences_card_bg"
                style={{ backgroundImage: "url(https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800)" }}
                aria-hidden
              />
              <span className="home_experiences_card_title">Things to do on your trip</span>
              <span className="home_experiences_card_btn">Experiences</span>
            </Link>
            <Link to="/online-experiences" className="home_experiences_card">
              <div
                className="home_experiences_card_bg"
                style={{ backgroundImage: "url(https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800)" }}
                aria-hidden
              />
              <span className="home_experiences_card_title">Things to do from home</span>
              <span className="home_experiences_card_btn">Online Experiences</span>
            </Link>
          </div>
        </section>

        <section className="home_giftcards_section" aria-labelledby="giftcards-heading">
          <div className="home_giftcards_content">
            <div className="home_giftcards_text">
              <h2 id="giftcards-heading" className="home_giftcards_heading">
                Shop Airbnb
                <br />
                gift cards
              </h2>
              <Link to="/gift-cards" className="home_giftcards_btn">
                Learn more
              </Link>
            </div>
            <div className="home_giftcards_img_wrap">
              <img
                src={`${process.env.PUBLIC_URL || ""}/images/gift-cards.png`}
                alt="Shop Airbnb gift cards – three gift cards with lavender, red, and sunset designs"
                className="home_giftcards_img"
              />
            </div>
          </div>
        </section>

        <section className="home_hosting_banner" aria-labelledby="hosting-banner-heading">
          <div className="home_hosting_banner_bg" aria-hidden />
          <div className="home_hosting_banner_content">
            <h2 id="hosting-banner-heading" className="home_hosting_banner_heading">
              Questions about hosting?
            </h2>
            <Link to="/info/hosting" className="home_hosting_banner_btn">
              Ask a Superhost
            </Link>
          </div>
        </section>

        <section className="home_inspiration_section" aria-labelledby="inspiration-heading">
          <h2 id="inspiration-heading" className="home_inspiration_heading">
            Inspiration for future getaways
          </h2>
          <div className="home_inspiration_tabs" role="tablist" aria-label="Destination categories">
            {INSPIRATION_TABS.map((label, i) => (
              <button
                key={label}
                type="button"
                role="tab"
                aria-selected={inspirationTab === i}
                className={`home_inspiration_tab ${inspirationTab === i ? "home_inspiration_tab_active" : ""}`}
                onClick={() => setInspirationTab(i)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="home_inspiration_grid">
            {INSPIRATION_DESTINATIONS.map(({ city, region }) => (
              <Link
                key={`${city}-${region}`}
                to={`${SEARCH_URL}?location=${encodeURIComponent(city)}`}
                className="home_inspiration_dest"
              >
                <span className="home_inspiration_dest_city">{city}</span>
                <span className="home_inspiration_dest_region">{region}</span>
              </Link>
            ))}
          </div>
          <Link to={SEARCH_URL} className="home_inspiration_show_more">
            Show more
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Home;
