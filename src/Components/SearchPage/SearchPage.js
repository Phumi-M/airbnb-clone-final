import { useSearchParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import { formatDateRange } from "../../utils/format";
import { formatPlural } from "../../utils/format";
import { filterListingsByLocation } from "../../utils/listings";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import "./SearchPage.css";
import SearchResults from "../SearchResults/SearchResults";

/**
 * Search page: reads query params, filters listings by location/dates/guests,
 * and renders filter chips + sort + SearchResults. Uses DEFAULT_LISTINGS + Redux listings.
 */

// Default listing data shared with Home and ListingDetail so cards and detail stay in sync.
export const DEFAULT_LISTINGS = [
  {
    id: 1,
    img: "https://tse1.mm.bing.net/th/id/OIP.xfUxXNB9SkktAa1yrtKfRwHaE5?w=2262&h=1496&rs=1&pid=ImgDetMain&o=7&rm=3",
    location: "Cape Town",
    title: "Lakeside Retreat",
    description: "4 guests · 2 bedrooms · 2 beds · 2 baths",
    star: 4.8,
    reviewCount: 12,
    price: "R3 500 / night",
    total: "R10 500 total",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    location: "Durban",
    title: "Beachfront Paradise",
    description: "4 guests · 2 bedrooms · 2 beds · 2 baths",
    star: 4.9,
    reviewCount: 24,
    price: "R3 200 / night",
    total: "R9 600 total",
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    location: "Cape Town",
    title: "Cozy Cottage",
    description: "2 guests · 1 bedroom · 1 bed · 1 bath",
    star: 4.7,
    reviewCount: 8,
    price: "R1 650 / night",
    total: "R4 950 total",
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    location: "Johannesburg",
    title: "Modern Villa",
    description: "6 guests · 3 bedrooms · 4 beds · 3 baths",
    star: 4.9,
    reviewCount: 31,
    price: "R3 400 / night",
    total: "R10 200 total",
  },
  {
    id: 5,
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    location: "Johannesburg",
    title: "City Loft",
    description: "2 guests · 1 bedroom · 1 bed · 1 bath",
    star: 4.5,
    reviewCount: 6,
    price: "R3 200 / night",
    total: "R9 600 total",
  },
  {
    id: 6,
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    location: "Cape Town",
    title: "Treehouse Escape",
    description: "2 guests · 1 bedroom · 1 bed · 1 bath",
    star: 4.8,
    reviewCount: 15,
    price: "R3 000 / night",
    total: "R9 000 total",
  },
  {
    id: 7,
    img: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
    location: "Drakensberg",
    title: "Ski Lodge",
    description: "6 guests · 3 bedrooms · 3 beds · 2 baths",
    star: 4.6,
    reviewCount: 9,
    price: "R2 800 / night",
    total: "R8 400 total",
  },
  {
    id: 8,
    img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    location: "Stellenbosch",
    title: "Rustic Farmhouse",
    description: "8 guests · 4 bedrooms · 4 beds · 3 baths",
    star: 4.9,
    reviewCount: 18,
    price: "R2 400 / night",
    total: "R7 200 total",
  },
  {
    id: 9,
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    location: "Johannesburg",
    title: "Luxury Penthouse",
    description: "4 guests · 2 bedrooms · 2 beds · 2 baths",
    star: 5.0,
    reviewCount: 42,
    price: "R3 500 / night",
    total: "R10 500 total",
  },
  {
    id: 10,
    img: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800",
    location: "Karoo",
    title: "Desert Oasis",
    description: "2 guests · 1 bedroom · 1 bed · 1 bath",
    star: 4.7,
    reviewCount: 11,
    price: "R2 600 / night",
    total: "R7 800 total",
  },
  {
    id: 11,
    img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
    location: "Cape Town",
    title: "Garden Bungalow",
    description: "2 guests · 1 bedroom · 1 bed · 1 bath",
    star: 4.6,
    reviewCount: 7,
    price: "R1 400 / night",
    total: "R4 200 total",
  },
  {
    id: 12,
    img: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800",
    location: "Durban",
    title: "Waterfront House",
    description: "6 guests · 3 bedrooms · 3 beds · 2 baths",
    star: 4.8,
    reviewCount: 22,
    price: "R2 900 / night",
    total: "R8 700 total",
  },
  {
    id: 13,
    img: "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800",
    location: "Cape Town",
    title: "Historic Townhouse",
    description: "4 guests · 2 bedrooms · 2 beds · 2 baths",
    star: 4.9,
    reviewCount: 19,
    price: "R3 400 / night",
    total: "R10 200 total",
  },
  {
    id: 14,
    img: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800",
    location: "Dullstroom",
    title: "A-Frame Cabin",
    description: "2 guests · 1 bedroom · 1 bed · 1 bath",
    star: 4.8,
    reviewCount: 14,
    price: "R2 600 / night",
    total: "R7 800 total",
  },
  {
    id: 15,
    img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
    location: "Cape Town",
    title: "Tiny Home",
    description: "2 guests · 1 bedroom · 1 bed · 1 bath",
    star: 4.5,
    reviewCount: 5,
    price: "R1 400 / night",
    total: "R4 200 total",
  },
  {
    id: 16,
    img: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800",
    location: "Durban",
    title: "Pool House",
    description: "4 guests · 2 bedrooms · 2 beds · 2 baths",
    star: 4.7,
    reviewCount: 10,
    price: "R2 700 / night",
    total: "R8 100 total",
  },
  {
    id: 17,
    img: "https://images.unsplash.com/photo-1600563438938-a9a27216b4f5?w=800",
    location: "Stellenbosch",
    title: "Wine Country Estate",
    description: "8 guests · 4 bedrooms · 4 beds · 3 baths",
    star: 5.0,
    reviewCount: 28,
    price: "R3 500 / night",
    total: "R10 500 total",
  },
  {
    id: 18,
    img: "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800",
    location: "Dullstroom",
    title: "Lake House",
    description: "6 guests · 3 bedrooms · 3 beds · 2 baths",
    star: 4.8,
    reviewCount: 16,
    price: "R2 500 / night",
    total: "R7 500 total",
  },
  {
    id: 19,
    img: "https://images.unsplash.com/photo-1600047509782-20d39509f26d?w=800",
    location: "Cape Town",
    title: "Mountain View Condo",
    description: "4 guests · 2 bedrooms · 2 beds · 2 baths",
    star: 4.6,
    reviewCount: 13,
    price: "R3 000 / night",
    total: "R9 000 total",
  },
  {
    id: 20,
    img: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800",
    location: "Durban",
    title: "Tropical Hideaway",
    description: "4 guests · 2 bedrooms · 2 beds · 2 baths",
    star: 4.7,
    reviewCount: 9,
    price: "R2 800 / night",
    total: "R8 400 total",
  },
];

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const storedListings = useSelector((state) => state.listingList?.listings) || [];
  const listings = [...DEFAULT_LISTINGS, ...storedListings];
  const location = (searchParams.get("location") || "").trim();
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const guests = searchParams.get("guests") || "2";

  const filtered = filterListingsByLocation(listings, location);
  const dateRangeText = formatDateRange(startDate, endDate);
  const summaryParts = [
    formatPlural(filtered.length, "stay"),
    dateRangeText,
    formatPlural(Number(guests) || 0, "guest"),
  ].filter(Boolean);
  const summaryText = summaryParts.join(" - ");
  const title = location ? `Stays in ${location}` : "Stays nearby";

  useDocumentTitle(title);

  return (
    <div className="searchpage">
      <div className="searchpage_info">
        <p>{summaryText}</p>
        <h1>{title}</h1>
        <div className="searchpage_filters">
          <Button variant="outlined">Cancellation Flexibility</Button>
          <Button variant="outlined">Type of place</Button>
          <Button variant="outlined">Price</Button>
          <Button variant="outlined">Rooms and beds</Button>
          <Button variant="outlined">More filters</Button>
          <select className="searchpage_sort" aria-label="Sort results" defaultValue="">
            <option value="">Relevance</option>
          </select>
        </div>
      </div>
      <div className="searchpage_results">
        {filtered.length > 0 ? (
          filtered.map((listing) => (
            <SearchResults
              key={listing.id}
              id={listing.id}
              img={listing.img}
              location={listing.location}
              title={listing.title}
              description={listing.descriptionShort || listing.description}
              star={listing.star}
              price={listing.priceDisplay || listing.price}
              total={listing.total}
            />
          ))
        ) : (
          <div className="searchpage_empty">
            <p>{location ? `No stays found in ${location}.` : "No stays found."} Try a different location or dates.</p>
            <Link to="/search" className="searchpage_empty_link">View all stays</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
