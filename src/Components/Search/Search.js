import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDateISO } from "../../utils/format";
import { buildSearchQueryString } from "../../utils/searchParams";
import "./Search.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
import { enUS } from "date-fns/locale";
import PeopleIcon from "@mui/icons-material/People";
import { Button } from "@mui/material";

const Search = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [guests, setGuests] = useState(2);

  const selectionRange = {
    startDate,
    endDate,
    key: "selection",
  };

  const handleSelect = (ranges) => {
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.endDate);
  };

  const handleSearch = () => {
    const query = buildSearchQueryString({
      location,
      startDate: formatDateISO(startDate),
      endDate: formatDateISO(endDate),
      guests,
    });
    navigate(`/search?${query}`);
  };

  return (
    <div className="search">
      <input
        type="text"
        className="search_location"
        placeholder="Where are you going?"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <DateRangePicker
        ranges={[selectionRange]}
        onChange={handleSelect}
        locale={enUS}
      />
      <div className="search_guests">
        <h2>Number of guests</h2>
        <PeopleIcon />
        <input
          type="number"
          min={1}
          max={16}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value) || 1)}
        />
      </div>
      <Button onClick={handleSearch}>Search Airbnb</Button>
    </div>
  );
};

export default Search;
