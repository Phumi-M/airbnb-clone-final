import { Link } from "react-router-dom";
import "./GiftCardsPage.css";

const GiftCardsPage = () => (
  <div className="giftcards_page">
    <h1>Shop Airbnb gift cards</h1>
    <p className="giftcards_page_lead">
      Give the gift of travel. Airbnb gift cards can be used for stays and experiences around the world.
    </p>
    <div className="giftcards_page_info">
      <p>Choose from a variety of designs and amounts. Recipients can use their gift card toward any booking on the platform.</p>
      <Link to="/" className="giftcards_page_back">← Back to home</Link>
    </div>
  </div>
);

export default GiftCardsPage;
