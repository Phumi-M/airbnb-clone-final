import { useNavigate } from "react-router-dom";
import "./OnlineExperiencesPage.css";

const OnlineExperiencesPage = () => {
  const navigate = useNavigate();
  return (
    <div className="online_experiences_page">
      <h1>Things to do from home</h1>
      <p>Join online experiences led by hosts around the world.</p>
      <button
        type="button"
        className="online_experiences_page_btn"
        onClick={() => navigate("/#places-to-stay")}
      >
        Browse stays
      </button>
    </div>
  );
};

export default OnlineExperiencesPage;
