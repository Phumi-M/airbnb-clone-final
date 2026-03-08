import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="notfound">
      <h1 className="notfound_title">Page not found</h1>
      <p className="notfound_text">We couldn’t find the page you’re looking for.</p>
      <div className="notfound_actions">
        <Link to="/" className="notfound_link notfound_link_primary">Back to home</Link>
        <Link to="/info/sitemap" className="notfound_link">View sitemap</Link>
      </div>
    </div>
  );
};

export default NotFound;
