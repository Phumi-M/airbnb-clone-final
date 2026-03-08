import { useParams, Link } from "react-router-dom";
import "./InfoPage.css";

const INFO_CONTENT = {
  help: {
    title: "Help Center",
    lead: "Find answers to common questions about booking, hosting, and getting the most out of the platform.",
    body: (
      <>
        <section className="info_section">
          <h2>Booking a stay</h2>
          <p>Search by location and dates on the home or search page. Browse listings, read descriptions and reviews, and use filters to narrow your options. When you find a place you like:</p>
          <ul>
            <li>Check availability and the cancellation policy before reserving.</li>
            <li>Message the host if you have questions about the space or area.</li>
            <li>Payment is processed securely when you confirm your reservation.</li>
          </ul>
        </section>
        <section className="info_section">
          <h2>Managing your reservation</h2>
          <p>View and change your bookings from your account. You can update dates or cancel according to the listing’s cancellation policy. Refunds are issued to the original payment method.</p>
        </section>
        <section className="info_section">
          <h2>Need more help?</h2>
          <p>Contact support for assistance with specific issues. Include your reservation details and a clear description of the problem so we can help you quickly.</p>
        </section>
      </>
    ),
    related: [
      { label: "Cancellation options", to: "/info/cancellation" },
      { label: "Safety information", to: "/info/safety" },
    ],
  },
  safety: {
    title: "Safety information",
    lead: "Your safety and security matter. Here’s how we help protect guests and hosts.",
    body: (
      <>
        <section className="info_section">
          <h2>Before you book</h2>
          <ul>
            <li>Read the full listing description, house rules, and amenities.</li>
            <li>Check reviews from other guests and the host’s response rate.</li>
            <li>Message the host to ask about safety features, parking, or access.</li>
            <li>Confirm the address and check-in instructions after you book.</li>
          </ul>
        </section>
        <section className="info_section">
          <h2>During your stay</h2>
          <ul>
            <li>Keep your personal belongings secure and know where emergency exits are.</li>
            <li>Respect house rules and neighborhood norms (noise, guests, etc.).</li>
            <li>Report any safety concerns to the host and to us as soon as possible.</li>
          </ul>
        </section>
        <section className="info_section">
          <h2>Trust and verification</h2>
          <p>We encourage identity verification and use reviews to build trust. Both guests and hosts can leave reviews after a stay. We take reports of fraud or unsafe behavior seriously.</p>
        </section>
      </>
    ),
    related: [
      { label: "Help Center", to: "/info/help" },
      { label: "Report a concern", to: "/info/report-concern" },
    ],
  },
  cancellation: {
    title: "Cancellation options",
    lead: "Understanding cancellation policies helps you book with confidence and know what to expect if your plans change.",
    body: (
      <>
        <section className="info_section">
          <h2>Flexible</h2>
          <p>Free cancellation before a set time (e.g. 24 or 48 hours before check-in). Refunds may be partial depending on how close to check-in you cancel. Check the listing for exact terms.</p>
        </section>
        <section className="info_section">
          <h2>Moderate</h2>
          <p>Full refund if you cancel at least 5 days before check-in. If you cancel within 5 days, you may receive a partial refund for nights not spent.</p>
        </section>
        <section className="info_section">
          <h2>Strict</h2>
          <p>Full refund only if you cancel within 48 hours of booking and at least 14 days before check-in. After that, partial refunds may apply. Some listings may have different rules—always read the policy on the listing page.</p>
        </section>
        <div className="info_callout">
          <p><strong>Tip:</strong> The cancellation policy is shown on every listing. Review it before you book so you know your options.</p>
        </div>
      </>
    ),
    related: [
      { label: "Help Center", to: "/info/help" },
      { label: "COVID-19 response", to: "/info/covid-19" },
    ],
  },
  "covid-19": {
    title: "Our COVID-19 Response",
    lead: "We follow local health guidelines and support hosts and guests with clear policies and flexibility when needed.",
    body: (
      <>
        <section className="info_section">
          <h2>Cleaning and hygiene</h2>
          <p>Hosts may follow enhanced cleaning protocols. Look for “Enhanced Clean” or similar information on listings. We encourage hosts to allow time between stays when possible.</p>
        </section>
        <section className="info_section">
          <h2>Flexibility</h2>
          <p>During periods of uncertainty, we may offer more flexible cancellation options. Check the policy on your reservation and our help center for the latest updates.</p>
        </section>
        <section className="info_section">
          <h2>Your responsibility</h2>
          <p>Please follow local rules and restrictions, respect any host requirements (e.g. masks, distancing), and do not travel if you are unwell or have been advised to isolate.</p>
        </section>
      </>
    ),
    related: [
      { label: "Cancellation options", to: "/info/cancellation" },
      { label: "Safety information", to: "/info/safety" },
    ],
  },
  accessibility: {
    title: "Supporting people with disabilities",
    lead: "We are committed to making our platform accessible so everyone can find and enjoy a place to stay.",
    body: (
      <>
        <section className="info_section">
          <h2>Accessibility features</h2>
          <p>Listings may include information about step-free access, wide doorways, accessible bathrooms, and other features. Use the search and filters to find stays that meet your needs. When in doubt, message the host before booking.</p>
        </section>
        <section className="info_section">
          <h2>Making requests</h2>
          <p>If you have specific requirements (e.g. ground-floor room, shower chair, allergy-friendly), contact the host before booking to confirm the space works for you. Hosts are encouraged to describe their space accurately.</p>
        </section>
        <section className="info_section">
          <h2>Feedback</h2>
          <p>We welcome feedback on how we can improve accessibility. If you have suggestions or encounter barriers, contact support. Your input helps us serve the community better.</p>
        </section>
      </>
    ),
    related: [
      { label: "Help Center", to: "/info/help" },
      { label: "Safety information", to: "/info/safety" },
    ],
  },
  "report-concern": {
    title: "Report a neighborhood concern",
    lead: "If you have a concern about a listing or something in the neighborhood, we want to hear from you.",
    body: (
      <>
        <section className="info_section">
          <h2>How to report</h2>
          <p>Use the “Report this listing” or “Report” option on the listing page, or contact support with the listing details and a clear description of your concern (noise, safety, parties, etc.).</p>
        </section>
        <section className="info_section">
          <h2>What we do</h2>
          <p>Reports are reviewed by our team. We may contact the host, request changes, or take action in line with our policies. We do not share your identity with the host when you report. Serious or repeated issues can lead to listing or account action.</p>
        </section>
      </>
    ),
    related: [
      { label: "Safety information", to: "/info/safety" },
      { label: "Help Center", to: "/info/help" },
    ],
  },
  community: {
    title: "Community",
    lead: "Our community initiatives support people in need and promote belonging and inclusion.",
    body: (
      <>
        <section className="info_section">
          <h2>Disaster relief housing</h2>
          <p>In times of disaster, hosts can offer free or discounted stays to those affected. We help connect people with temporary housing and support relief efforts where we can.</p>
        </section>
        <section className="info_section">
          <h2>Refugee support</h2>
          <p>We work with organizations to provide housing and support for refugees and displaced people. Hosts can choose to offer stays at reduced or no cost for these programs.</p>
        </section>
        <section className="info_section">
          <h2>Diversity and belonging</h2>
          <p>We are committed to a platform where everyone can belong. We do not tolerate discrimination based on race, religion, national origin, disability, or other protected characteristics.</p>
        </section>
        <section className="info_section">
          <h2>Combating discrimination</h2>
          <p>If you experience or witness discrimination, report it. We take such reports seriously and take action in line with our nondiscrimination policy. We also provide resources and training to support an inclusive community.</p>
        </section>
      </>
    ),
    related: [
      { label: "Try hosting", to: "/info/hosting" },
      { label: "How to host responsibly", to: "/info/host-responsibly" },
    ],
  },
  hosting: {
    title: "Try hosting",
    lead: "Share your space and earn money by hosting guests from around the world.",
    body: (
      <>
        <section className="info_section">
          <h2>Why host?</h2>
          <ul>
            <li>Set your own schedule, availability, and prices.</li>
            <li>Connect with travelers and earn extra income.</li>
            <li>Showcase your space and neighborhood.</li>
          </ul>
        </section>
        <section className="info_section">
          <h2>Get started</h2>
          <p>Create a listing with photos, a clear description, and house rules. You can start with a single room or your entire place. Keep your calendar updated and respond to messages promptly.</p>
          <p className="info_cta"><Link to="/create-listing" className="info_cta_link">Create a listing</Link> — you’ll need to sign in first.</p>
        </section>
      </>
    ),
    related: [
      { label: "Hosting resources", to: "/info/hosting-resources" },
      { label: "Host protection", to: "/info/hosting-protection" },
      { label: "Host responsibly", to: "/info/host-responsibly" },
    ],
  },
  "hosting-protection": {
    title: "AirCover: protection for Hosts",
    lead: "Host protection is designed to give you peace of mind when you share your space.",
    body: (
      <>
        <section className="info_section">
          <h2>What’s included</h2>
          <p>Protection may cover damage to your property caused by guests, subject to terms and conditions. It is not a substitute for your own insurance. Coverage limits and exclusions apply—review the full policy for details.</p>
        </section>
        <section className="info_section">
          <h2>How it works</h2>
          <p>If you experience covered damage, report it through the platform as soon as possible. Our team will review your claim and guide you through the process. You may be asked to provide photos or other documentation.</p>
        </section>
      </>
    ),
    related: [
      { label: "Try hosting", to: "/info/hosting" },
      { label: "Hosting resources", to: "/info/hosting-resources" },
    ],
  },
  "hosting-resources": {
    title: "Explore hosting resources",
    lead: "Tools and tips to help you create a great listing and host successfully.",
    body: (
      <>
        <section className="info_section">
          <h2>Getting started</h2>
          <p>Learn how to write an attractive listing, take strong photos, set competitive pricing, and communicate clearly with guests. Small details (accurate descriptions, quick replies) can improve your reviews and bookings.</p>
        </section>
        <section className="info_section">
          <h2>Best practices</h2>
          <ul>
            <li>Keep your calendar and availability up to date.</li>
            <li>Respond to messages and booking requests quickly.</li>
            <li>Maintain a clean space and accurate listing.</li>
            <li>Set clear house rules and stick to your cancellation policy.</li>
          </ul>
          <p className="info_cta"><Link to="/create-listing" className="info_cta_link">Create or manage your listing</Link></p>
        </section>
      </>
    ),
    related: [
      { label: "Try hosting", to: "/info/hosting" },
      { label: "Host responsibly", to: "/info/host-responsibly" },
    ],
  },
  "community-forum": {
    title: "Community forum",
    lead: "Connect with other hosts and guests to share tips, ask questions, and learn from the community.",
    body: (
      <>
        <section className="info_section">
          <p>The community forum is a place to discuss hosting, travel, platform updates, and best practices. Share your experience and learn from others. We moderate the forum to keep it helpful and respectful.</p>
        </section>
      </>
    ),
    related: [
      { label: "Community", to: "/info/community" },
      { label: "Hosting resources", to: "/info/hosting-resources" },
    ],
  },
  "host-responsibly": {
    title: "How to host responsibly",
    lead: "Responsible hosting helps keep everyone safe and strengthens trust in the community.",
    body: (
      <>
        <section className="info_section">
          <h2>Follow local laws</h2>
          <p>Ensure your listing complies with local regulations, including zoning, taxes, permits, and short-term rental rules. Requirements vary by city and country—check with your local authority if you’re unsure.</p>
        </section>
        <section className="info_section">
          <h2>Be clear and honest</h2>
          <p>Accurately describe your space, amenities, and rules. Update your calendar when you’re not available and respond to messages promptly. Misleading listings can lead to bad reviews and policy action.</p>
        </section>
        <section className="info_section">
          <h2>Respect neighbors</h2>
          <p>Set clear expectations for guests about noise, parking, and behavior. Good communication and house rules help maintain positive relations with your neighborhood and reduce complaints.</p>
        </section>
      </>
    ),
    related: [
      { label: "Try hosting", to: "/info/hosting" },
      { label: "Hosting resources", to: "/info/hosting-resources" },
    ],
  },
  newsroom: {
    title: "Newsroom",
    lead: "Company news, press releases, and updates for media and the public.",
    body: (
      <>
        <section className="info_section">
          <p>Stay informed about new features, partnerships, and how we’re working to improve the platform for hosts and guests. We publish updates on product launches, safety initiatives, and community programs.</p>
        </section>
      </>
    ),
    related: [
      { label: "New features", to: "/info/new-features" },
      { label: "Letter from founders", to: "/info/founders-letter" },
    ],
  },
  "new-features": {
    title: "Learn about new features",
    lead: "We regularly add new tools and improvements for guests and hosts.",
    body: (
      <>
        <section className="info_section">
          <h2>For guests</h2>
          <p>Better search filters, wishlists, and messaging make it easier to find and book the right stay. You can save favorite listings, compare options, and communicate with hosts before and during your trip.</p>
        </section>
        <section className="info_section">
          <h2>For hosts</h2>
          <p>Listing tools, calendar management, and insights help you host more effectively. Set pricing, manage availability, and see how your listing performs so you can improve over time.</p>
        </section>
      </>
    ),
    related: [
      { label: "Newsroom", to: "/info/newsroom" },
      { label: "Help Center", to: "/info/help" },
    ],
  },
  "founders-letter": {
    title: "Letter from our founders",
    lead: "Our mission is to create a world where anyone can belong anywhere.",
    body: (
      <>
        <section className="info_section">
          <p>We started with a simple idea: connect people who have space with people who need a place to stay. Today we continue to focus on trust, community, and making travel and hosting more human.</p>
          <p>We believe that when you stay in someone’s space, you get more than a place to sleep—you get a connection to a place and its people. Thank you for being part of this community.</p>
        </section>
      </>
    ),
    related: [
      { label: "Community", to: "/info/community" },
      { label: "Careers", to: "/info/careers" },
    ],
  },
  careers: {
    title: "Careers",
    lead: "Join our team and help shape the future of travel and hosting.",
    body: (
      <>
        <section className="info_section">
          <p>We look for people who are passionate about community, design, and technology. Roles span engineering, product, design, operations, and more. Check our careers page for open positions and how to apply.</p>
        </section>
      </>
    ),
    related: [
      { label: "About", to: "/info/founders-letter" },
      { label: "Investors", to: "/info/investors" },
    ],
  },
  investors: {
    title: "Investors",
    lead: "Information for investors and the financial community.",
    body: (
      <>
        <section className="info_section">
          <p>Find quarterly results, SEC filings, earnings calls, and other investor resources on our investor relations site. We are committed to transparent communication with our shareholders.</p>
        </section>
      </>
    ),
    related: [
      { label: "Newsroom", to: "/info/newsroom" },
      { label: "Careers", to: "/info/careers" },
    ],
  },
  luxe: {
    title: "Airbnb Luxe",
    lead: "Luxury homes and villas with high-end amenities and dedicated trip design.",
    body: (
      <>
        <section className="info_section">
          <p>Luxe listings are verified for quality and come with premium support for a seamless stay. Expect exceptional design, top amenities, and personalized service. Ideal for special occasions and group getaways.</p>
        </section>
      </>
    ),
    related: [
      { label: "Search stays", to: "/search" },
      { label: "Help Center", to: "/info/help" },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    lead: "We respect your privacy and are committed to protecting your personal data in line with applicable laws.",
    body: (
      <>
        <section className="info_section">
          <h2>What we collect</h2>
          <p>We collect information you provide (name, email, payment details, messages, profile) and data about how you use the platform (searches, bookings, device information, IP address). We may also receive information from third parties (e.g. payment processors).</p>
        </section>
        <section className="info_section">
          <h2>How we use it</h2>
          <p>We use your data to provide and improve our services, process payments, communicate with you, prevent fraud, and ensure safety and security. We may use aggregated or anonymized data for analytics and product improvement.</p>
        </section>
        <section className="info_section">
          <h2>Your choices</h2>
          <p>You can access and update your profile, manage communication preferences, and request deletion or portability of your data in line with applicable law. Contact us or use in-app settings to exercise your rights.</p>
        </section>
      </>
    ),
    related: [
      { label: "Terms of Service", to: "/info/terms" },
      { label: "Help Center", to: "/info/help" },
    ],
  },
  terms: {
    title: "Terms of Service",
    lead: "By using our platform, you agree to these terms. Please read them carefully.",
    body: (
      <>
        <section className="info_section">
          <h2>Eligibility</h2>
          <p>You must be at least 18 years old and able to enter into a binding contract to use our services. By creating an account, you represent that you meet these requirements.</p>
        </section>
        <section className="info_section">
          <h2>Your account</h2>
          <p>You are responsible for keeping your account secure and for all activity under your account. Do not share your password or allow others to use your account.</p>
        </section>
        <section className="info_section">
          <h2>Listings and bookings</h2>
          <p>Hosts are responsible for accurate listings and complying with local laws. Guests are responsible for following house rules and paying for stays. Cancellation policies apply as stated at the time of booking. Disputes should be reported through the platform.</p>
        </section>
        <section className="info_section">
          <h2>Conduct</h2>
          <p>You must not discriminate, harass, or break the law. We may suspend or remove accounts that violate our policies. We reserve the right to refuse service and to modify these terms with notice where required.</p>
        </section>
      </>
    ),
    related: [
      { label: "Privacy Policy", to: "/info/privacy" },
      { label: "Help Center", to: "/info/help" },
    ],
  },
  sitemap: {
    title: "Sitemap",
    lead: "Main pages and sections on this site.",
    body: (
      <>
        <section className="info_section">
          <h2>Main navigation</h2>
          <ul className="info_sitemap_list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/search">Search stays</Link></li>
            <li><Link to="/create-listing">Create a listing</Link></li>
            <li><Link to="/listings">My listings</Link></li>
            <li><Link to="/reservations">Reservations</Link></li>
            <li><Link to="/admin">Admin dashboard</Link></li>
          </ul>
        </section>
        <section className="info_section">
          <h2>Help &amp; support</h2>
          <ul className="info_sitemap_list">
            <li><Link to="/info/help">Help Center</Link></li>
            <li><Link to="/info/safety">Safety information</Link></li>
            <li><Link to="/info/cancellation">Cancellation options</Link></li>
          </ul>
        </section>
        <section className="info_section">
          <h2>Legal</h2>
          <ul className="info_sitemap_list">
            <li><Link to="/info/privacy">Privacy</Link></li>
            <li><Link to="/info/terms">Terms</Link></li>
          </ul>
        </section>
      </>
    ),
  },
};

const InfoPage = () => {
  const { topic } = useParams();
  const content = topic ? INFO_CONTENT[topic] : null;

  if (!content) {
    return (
      <div className="info_page">
        <div className="info_page_inner">
          <Link to="/" className="info_page_back">← Back to home</Link>
          <div className="info_404">
            <h1>Page not found</h1>
            <p>We couldn’t find the page you’re looking for.</p>
            <Link to="/info/sitemap" className="info_cta_link">View sitemap</Link>
          </div>
        </div>
      </div>
    );
  }

  const related = content.related || [];

  return (
    <div className="info_page">
      <div className="info_page_inner">
        <Link to="/" className="info_page_back">← Back to home</Link>
        <article className="info_article">
          <header className="info_header">
            <h1 className="info_page_title">{content.title}</h1>
            {content.lead && <p className="info_lead">{content.lead}</p>}
          </header>
          <div className="info_page_body">{content.body}</div>
          {related.length > 0 && (
            <footer className="info_related">
              <h2 className="info_related_title">Related</h2>
              <ul className="info_related_list">
                {related.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="info_related_link">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </footer>
          )}
        </article>
      </div>
    </div>
  );
};

export default InfoPage;
