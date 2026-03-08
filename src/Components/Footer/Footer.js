/**
 * Site footer: support/community/hosting/about columns, legal links, language/currency, social icons.
 */
import { Link } from "react-router-dom";
import LanguageIcon from "@mui/icons-material/Language";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import "./Footer.css";

const FOOTER_COLUMNS = [
  {
    heading: "Support",
    links: [
      { label: "Help Center", to: "/info/help", external: false },
      { label: "Safety information", to: "/info/safety", external: false },
      { label: "Cancellation options", to: "/info/cancellation", external: false },
      { label: "Our COVID-19 Response", to: "/info/covid-19", external: false },
      { label: "Supporting people with disabilities", to: "/info/accessibility", external: false },
      { label: "Report a neighborhood concern", to: "/info/report-concern", external: false },
    ],
  },
  {
    heading: "Community",
    links: [
      { label: "Airbnb.org: disaster relief housing", to: "/info/community", external: false },
      { label: "Support: Afghan refugees", to: "/info/community", external: false },
      { label: "Celebrating diversity & belonging", to: "/info/community", external: false },
      { label: "Combating discrimination", to: "/info/community", external: false },
    ],
  },
  {
    heading: "Hosting",
    links: [
      { label: "Try hosting", to: "/create-listing", external: false },
      { label: "AirCover: protection for Hosts", to: "/info/hosting-protection", external: false },
      { label: "Explore hosting resources", to: "/info/hosting-resources", external: false },
      { label: "Visit our community forum", to: "/info/community-forum", external: false },
      { label: "How to host responsibly", to: "/info/host-responsibly", external: false },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "Newsroom", to: "/info/newsroom", external: false },
      { label: "Learn about new features", to: "/info/new-features", external: false },
      { label: "Letter from our founders", to: "/info/founders-letter", external: false },
      { label: "Careers", to: "/info/careers", external: false },
      { label: "Investors", to: "/info/investors", external: false },
      { label: "Airbnb Luxe", to: "/info/luxe", external: false },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer_columns">
        {FOOTER_COLUMNS.map((col) => (
          <nav key={col.heading} className="footer_col" aria-label={col.heading}>
            <h3 className="footer_heading">{col.heading}</h3>
            <ul className="footer_links">
              {col.links.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a href={link.to} className="footer_link" target="_blank" rel="noopener noreferrer">
                      {link.label}
                    </a>
                  ) : (
                    <Link to={link.to} className="footer_link">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="footer_bottom">
        <div className="footer_bottom_left">
          <span className="footer_copyright">© 2022 Airbnb, Inc.</span>
          <span className="footer_sep">·</span>
          <Link to="/info/privacy" className="footer_legal">Privacy</Link>
          <span className="footer_sep">·</span>
          <Link to="/info/terms" className="footer_legal">Terms</Link>
          <span className="footer_sep">·</span>
          <Link to="/info/sitemap" className="footer_legal">Sitemap</Link>
        </div>
        <div className="footer_bottom_right">
          <button type="button" className="footer_lang" aria-label="Language">
            <LanguageIcon className="footer_icon" fontSize="small" aria-hidden />
            <span className="footer_lang_text">English (US)</span>
          </button>
          <button type="button" className="footer_currency" aria-label="Currency">
            <span className="footer_icon footer_currency_symbol" aria-hidden>$</span>
            <span>USD</span>
          </button>
          <div className="footer_social" aria-label="Social links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer_social_link" aria-label="Facebook">
              <FacebookIcon />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer_social_link" aria-label="Twitter">
              <TwitterIcon />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer_social_link" aria-label="Instagram">
              <InstagramIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
