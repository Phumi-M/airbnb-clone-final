/**
 * Site header: logo, search bar (where/dates/guests), and user menu or login CTA.
 * Search submits to /search with query params; dropdowns use useClickOutside to close.
 */
import { useState, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import NearMeIcon from "@mui/icons-material/NearMe";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TerrainIcon from "@mui/icons-material/Terrain";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import LandscapeIcon from "@mui/icons-material/Landscape";
import { Avatar } from "@mui/material";
import { openModal } from "../../Action/ModalAction";
import { logout } from "../../Action/UserAction";
import { formatDateISO } from "../../utils/format";
import { buildSearchQueryString } from "../../utils/searchParams";
import { useClickOutside } from "../../hooks/useClickOutside";
import { DateRangePicker } from "react-date-range";
import { enUS } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./Header.css";

/** Suggested destinations aligned with places on the site (provinces + key locations). */
const SUGGESTED_DESTINATIONS = [
  { value: "", label: "Nearby", description: "Find what's around you", Icon: NearMeIcon },
  { value: "Western Cape", label: "Western Cape", description: "Cape Town, Stellenbosch & wine lands", Icon: LandscapeIcon },
  { value: "Gauteng", label: "Gauteng", description: "Johannesburg and surrounds", Icon: LocationCityIcon },
  { value: "KwaZulu-Natal", label: "KwaZulu-Natal", description: "Durban, Drakensberg & coast", Icon: BeachAccessIcon },
  { value: "Mpumalanga", label: "Mpumalanga", description: "Dullstroom & Kruger region", Icon: TerrainIcon },
  { value: "Cape Town", label: "Cape Town", description: "For sights like Table Mountain", Icon: LocationOnIcon },
  { value: "Johannesburg", label: "Johannesburg", description: "City of Gold", Icon: LocationCityIcon },
  { value: "Durban", label: "Durban", description: "Beaches and culture", Icon: BeachAccessIcon },
  { value: "Ballito", label: "Ballito", description: "Coastal getaway", Icon: BeachAccessIcon },
  { value: "Stellenbosch", label: "Stellenbosch", description: "Wine lands", Icon: LandscapeIcon },
  { value: "Drakensberg", label: "Drakensberg", description: "Mountains and hiking", Icon: TerrainIcon },
  { value: "Dullstroom", label: "Dullstroom", description: "Highlands getaway", Icon: TerrainIcon },
  { value: "Karoo", label: "Karoo", description: "Wide open landscapes", Icon: LandscapeIcon },
];

/** Format date for search bar display (e.g. "Mar 15"). */
const formatDisplayDate = (d) => {
  if (!d || !(d instanceof Date) || isNaN(d.getTime())) return "Add dates";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const datePickerRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [whereDropdownOpen, setWhereDropdownOpen] = useState(false);
  const whereDropdownRef = useRef(null);

  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d;
  });
  const [guests, setGuests] = useState(1);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const userInfo = useSelector((state) => state.userLogin?.userInfo);

  const closeDropdown = useCallback(() => setDropdownOpen(false), []);
  useClickOutside(dropdownRef, closeDropdown);

  const closeWhereDropdown = useCallback(() => setWhereDropdownOpen(false), []);
  useClickOutside(whereDropdownRef, closeWhereDropdown);

  const closeDatePicker = useCallback(() => setDatePickerOpen(false), []);
  useClickOutside(datePickerRef, closeDatePicker);

  const selectionRange = { startDate, endDate, key: "selection" };

  const handleSelect = (ranges) => {
    if (ranges?.selection) {
      setStartDate(ranges.selection.startDate);
      setEndDate(ranges.selection.endDate);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = buildSearchQueryString({
      location: location.trim(),
      startDate: formatDateISO(startDate),
      endDate: formatDateISO(endDate),
      guests,
    });
    navigate(`/search?${query}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
  };

  const displayName = userInfo?.name || userInfo?.email || userInfo?.username || "User";

  return (
    <header className="header">
      <Link to="/" className="header_logoLink" aria-label="Go to home">
        <img
          className="header_logo"
          src="https://i.pinimg.com/originals/3c/bf/be/3cbfbe148597341fa56f2f87ade90956.png"
          alt=""
        />
      </Link>
      <form className="header_searchBar" onSubmit={handleSearch}>
        <div className="header_searchBar_segment header_searchBar_hotel header_searchBar_whereWrap" ref={whereDropdownRef}>
          <label className="header_searchBar_label">Where</label>
          <input
            type="text"
            className="header_searchBar_input"
            placeholder="Search destinations"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onFocus={() => setWhereDropdownOpen(true)}
            aria-label="Search destinations"
            aria-expanded={whereDropdownOpen}
            aria-haspopup="listbox"
            aria-autocomplete="list"
          />
          {whereDropdownOpen && (
            <div className="header_whereDropdown" role="listbox" aria-label="Suggested destinations">
              <div className="header_whereDropdown_title">Suggested destinations</div>
              <div className="header_whereDropdown_list">
                {SUGGESTED_DESTINATIONS.map((dest) => {
                  const Icon = dest.Icon;
                  return (
                    <button
                      key={dest.value || "nearby"}
                      type="button"
                      role="option"
                      className="header_whereDropdown_item"
                      onClick={() => {
                        setLocation(dest.value);
                        setWhereDropdownOpen(false);
                      }}
                    >
                      <span className="header_whereDropdown_icon" aria-hidden>
                        <Icon sx={{ fontSize: 20 }} />
                      </span>
                      <span className="header_whereDropdown_text">
                        <span className="header_whereDropdown_primary">{dest.label}</span>
                        <span className="header_whereDropdown_secondary">{dest.description}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className="header_searchBar_divider" aria-hidden />
        <div className="header_searchBar_segment header_searchBar_dates" ref={datePickerRef}>
          <button type="button" className="header_searchBar_trigger" onClick={() => setDatePickerOpen((p) => !p)} aria-expanded={datePickerOpen} aria-haspopup="dialog" aria-label="Check in date">
            <span className="header_searchBar_label">Check in</span>
            <span className="header_searchBar_value">{formatDisplayDate(startDate)}</span>
          </button>
          <div className="header_searchBar_dividerVertical" aria-hidden />
          <button type="button" className="header_searchBar_trigger" onClick={() => setDatePickerOpen(true)} aria-label="Check out date">
            <span className="header_searchBar_label">Check out</span>
            <span className="header_searchBar_value">{formatDisplayDate(endDate)}</span>
          </button>
          {datePickerOpen && (
            <div className="header_searchBar_dateDropdown" role="dialog" aria-label="Select dates">
              <DateRangePicker ranges={[selectionRange]} onChange={handleSelect} locale={enUS} minDate={new Date()} moveRangeOnFirstSelection={false} />
            </div>
          )}
        </div>
        <div className="header_searchBar_divider" aria-hidden />
        <div className="header_searchBar_segment header_searchBar_guests">
          <label className="header_searchBar_label">Who</label>
          <div className="header_searchBar_guestsRow">
            <input
              type="number"
              className="header_searchBar_guestsInput"
              min={1}
              max={16}
              value={guests}
              onChange={(e) => setGuests(Math.min(16, Math.max(1, Number(e.target.value) || 1)))}
              aria-label="Number of guests"
            />
            <span className="header_searchBar_guestsText">{guests === 1 ? "guest" : "guests"}</span>
          </div>
        </div>
        <button type="submit" className="header_searchBar_searchBtn" aria-label="Search">
          <SearchIcon className="header_searchBar_searchIcon" />
          Search
        </button>
      </form>
      <div className="header_right">
          {userInfo ? (
            <>
              <button
                type="button"
                className="header_globe"
                aria-label="Language and region"
                onClick={() => dispatch(openModal("open", "language"))}
              >
                <LanguageIcon className="header_globeIcon" fontSize="small" aria-hidden />
              </button>
              <span className="header_userName">{displayName}</span>
              <div className="header_dropdownWrapper" ref={dropdownRef}>
                <button
                  type="button"
                  className="header_pillMenu"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                  aria-label="User menu"
                >
                  <MenuIcon className="header_pillIcon" fontSize="small" aria-hidden />
                  <Avatar sx={{ width: 28, height: 28 }} className="header_pillAvatar" />
                </button>
                {dropdownOpen && (
                  <div className="header_dropdown" role="menu">
                    <Link to="/admin" className="header_dropdownItem header_dropdownLink" onClick={() => setDropdownOpen(false)}>Dashboard</Link>
                    <Link to="/create-listing" className="header_dropdownItem header_dropdownLink" onClick={() => setDropdownOpen(false)}>Create a listing</Link>
                    <Link to="/listings" className="header_dropdownItem header_dropdownLink" onClick={() => setDropdownOpen(false)}>View listings</Link>
                    <button type="button" className="header_dropdownItem" role="menuitem" onClick={() => { navigate("/reservations"); setDropdownOpen(false); }}>View reservations</button>
                    <button type="button" className="header_dropdownItem" role="menuitem" onClick={handleLogout}>Log out</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button type="button" className="header_becomeHost" onClick={() => dispatch(openModal("open", "login"))}>Become a Host</button>
              <button type="button" className="header_globe" aria-label="Language and region" onClick={() => dispatch(openModal("open", "language"))}>
                <LanguageIcon className="header_globeIcon" fontSize="small" aria-hidden />
              </button>
              <button type="button" className="header_pillMenu header_pillMenu_guest" onClick={() => dispatch(openModal("open", "login"))} aria-label="Log in or sign up">
                <MenuIcon className="header_pillIcon" fontSize="small" aria-hidden />
                <PersonOutlineIcon className="header_pillPerson" fontSize="small" aria-hidden />
              </button>
            </>
          )}
      </div>
    </header>
  );
};

export default Header;
