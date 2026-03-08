import { useNavigate } from "react-router-dom";
import "./ExperiencesPage.css";

const ExperiencesPage = () => {
  const navigate = useNavigate();
  return (
    <div className="experiences_page">
      <h1>Things to do on your trip</h1>
      <p>Discover experiences and activities when you travel.</p>
      <button
        type="button"
        className="experiences_page_btn"
        onClick={() => navigate("/#places-to-stay")}
      >
        Browse stays
      </button>
    </div>
  );
};

export default ExperiencesPage;
