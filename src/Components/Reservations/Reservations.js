import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { loadReservations, removeReservation } from "../../Action/ReservationActions";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import "./Reservations.css";

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-ZA", { month: "short", day: "numeric", year: "numeric" });
};

const Reservations = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userLogin?.userInfo);
  const list = useSelector((state) => state.reservations?.list) || [];
  const userEmail = (userInfo?.email || userInfo?.username || "").toLowerCase().trim();
  const myReservations = list.filter((r) => (r.userEmail || "").toLowerCase().trim() === userEmail);

  useDocumentTitle("Your reservations");

  useEffect(() => {
    dispatch(loadReservations());
  }, [dispatch]);

  const handleRemove = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Cancel this reservation?")) dispatch(removeReservation(id));
  };

  return (
    <div className="reservations_page">
      <div className="reservations_container">
        <h1 className="reservations_heading">Your reservations</h1>
        {myReservations.length === 0 ? (
          <div className="reservations_empty">
            <p>You don&apos;t have any reservations yet.</p>
            <Link to="/" className="reservations_empty_link">Browse stays</Link>
          </div>
        ) : (
          <ul className="reservations_list">
            {myReservations.map((r) => (
              <li key={r.id} className="reservations_item">
                <Link to={`/listing/${r.listingId}`} className="reservations_card">
                  <div className="reservations_card_image">
                    <img src={r.img} alt={r.title} />
                  </div>
                  <div className="reservations_card_body">
                    <p className="reservations_card_location">{r.location}</p>
                    <h2 className="reservations_card_title">{r.title}</h2>
                    <p className="reservations_card_dates">
                      {formatDate(r.startDate)} – {formatDate(r.endDate)}
                    </p>
                    <p className="reservations_card_guests">{r.guests} {r.guests === 1 ? "guest" : "guests"}</p>
                    <p className="reservations_card_total">Total R{Number(r.total).toLocaleString("en-ZA")}</p>
                  </div>
                </Link>
                <button
                  type="button"
                  className="reservations_cancel"
                  onClick={(e) => handleRemove(e, r.id)}
                  aria-label="Cancel reservation"
                >
                  Cancel reservation
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Reservations;
