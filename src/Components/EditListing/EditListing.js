import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateListing } from "../../Action/ListingActions";
import { showToast } from "../../Action/ToastAction";
import { trimString, validateListingBasics, validateListingCapacity, validateListingPricing, LISTING_TITLE_MAX_LENGTH, LISTING_DESCRIPTION_MAX_LENGTH } from "../../utils/validation";
import { scrollToFirstError } from "../../utils/dom";
import { getListingDescriptionShort } from "../../utils/listings";
import { formatPriceZAR } from "../../utils/format";
import "./EditListing.css";

const PROPERTY_TYPES = ["Apartment", "House", "Cabin", "Villa", "Loft", "Studio", "Other"];

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const listingId = id ? Number(id) : null;
  const listings = useSelector((state) => state.listingList?.listings) || [];
  const listing = listings.find((l) => l.id === listingId);

  const [form, setForm] = useState({
    title: "",
    location: "",
    description: "",
    bedrooms: "",
    bathrooms: "",
    guests: "",
    type: "",
    price: "",
    weeklyDiscount: "",
    cleaningFee: "",
    serviceFee: "",
    occupancyTaxes: "",
    amenitiesList: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (!listing) return;
    setForm({
      title: listing.title || "",
      location: listing.location || "",
      description: listing.description || "",
      bedrooms: String(listing.bedrooms ?? ""),
      bathrooms: String(listing.bathrooms ?? ""),
      guests: String(listing.guests ?? ""),
      type: listing.type || "",
      price: listing.price != null ? String(listing.price) : "",
      weeklyDiscount: listing.weeklyDiscount != null ? String(listing.weeklyDiscount) : "",
      cleaningFee: listing.cleaningFee != null ? String(listing.cleaningFee) : "",
      serviceFee: listing.serviceFee != null ? String(listing.serviceFee) : "",
      occupancyTaxes: listing.occupancyTaxes != null ? String(listing.occupancyTaxes) : "",
      amenitiesList: Array.isArray(listing.amenities) ? listing.amenities : [],
    });
  }, [listing]);

  if (listingId == null || (listings.length > 0 && !listing)) {
    navigate("/listings", { replace: true });
    return null;
  }

  if (!listing) {
    return (
      <div className="edit_listing">
        <p>Loading...</p>
      </div>
    );
  }

  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const basics = validateListingBasics(form);
    const capacity = validateListingCapacity(form);
    const pricing = validateListingPricing(form);
    const e = { ...basics.errors, ...capacity.errors, ...pricing.errors };
    setErrors(e);
    if (Object.keys(e).length > 0 && formRef.current) {
      scrollToFirstError(formRef);
    }
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    const priceNum = parseFloat(form.price, 10);
    const bedrooms = parseInt(form.bedrooms, 10);
    const bathrooms = parseFloat(form.bathrooms, 10);
    const guests = parseInt(form.guests, 10);
    const updated = {
      ...listing,
      title: trimString(form.title),
      location: trimString(form.location),
      description: trimString(form.description),
      descriptionShort: getListingDescriptionShort({ guests, bedrooms, bathrooms }),
      bedrooms,
      bathrooms,
      guests,
      type: trimString(form.type),
      price: priceNum,
      priceDisplay: formatPriceZAR(priceNum, true),
      amenities: form.amenitiesList || [],
      weeklyDiscount: form.weeklyDiscount === "" ? 0 : parseFloat(form.weeklyDiscount, 10),
      cleaningFee: form.cleaningFee === "" ? 0 : parseFloat(form.cleaningFee, 10),
      serviceFee: form.serviceFee === "" ? 0 : parseFloat(form.serviceFee, 10),
      occupancyTaxes: form.occupancyTaxes === "" ? 0 : parseFloat(form.occupancyTaxes, 10),
    };
    dispatch(updateListing(updated));
    dispatch(showToast("Listing updated.", "success"));
    setIsSubmitting(false);
    navigate("/listings");
  };

  return (
    <div className="edit_listing">
      <h1>Edit listing</h1>
      <form ref={formRef} onSubmit={handleSubmit} noValidate className="edit_listing_form">
        <section className="edit_listing_section" aria-labelledby="edit-basics-heading">
          <h2 id="edit-basics-heading">Basic info</h2>
          <div className="edit_listing_field">
            <label htmlFor="edit-title">Title *</label>
            <input id="edit-title" type="text" value={form.title} onChange={(e) => updateField("title", e.target.value)} maxLength={LISTING_TITLE_MAX_LENGTH} className={errors.title ? "edit_listing_input_error" : ""} aria-invalid={!!errors.title} aria-describedby={errors.title ? "edit-title-error" : undefined} />
            {errors.title && <span id="edit-title-error" className="edit_listing_error" role="alert">{errors.title}</span>}
          </div>
          <div className="edit_listing_field">
            <label htmlFor="edit-location">Location *</label>
            <input id="edit-location" type="text" value={form.location} onChange={(e) => updateField("location", e.target.value)} className={errors.location ? "edit_listing_input_error" : ""} aria-invalid={!!errors.location} />
            {errors.location && <span className="edit_listing_error" role="alert">{errors.location}</span>}
          </div>
          <div className="edit_listing_field">
            <label htmlFor="edit-description">Description *</label>
            <textarea id="edit-description" value={form.description} onChange={(e) => updateField("description", e.target.value)} rows={4} maxLength={LISTING_DESCRIPTION_MAX_LENGTH} className={errors.description ? "edit_listing_input_error" : ""} aria-invalid={!!errors.description} />
            {errors.description && <span className="edit_listing_error" role="alert">{errors.description}</span>}
          </div>
          <div className="edit_listing_field">
            <label htmlFor="edit-type">Property type *</label>
            <select id="edit-type" value={form.type} onChange={(e) => updateField("type", e.target.value)} className={errors.type ? "edit_listing_input_error" : ""} aria-invalid={!!errors.type}>
              <option value="">Select type</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {errors.type && <span className="edit_listing_error">{errors.type}</span>}
          </div>
        </section>
        <section className="edit_listing_section">
          <h2>Capacity</h2>
          <div className="edit_listing_row">
            <div className="edit_listing_field">
              <label htmlFor="edit-bedrooms">Bedrooms *</label>
              <input id="edit-bedrooms" type="number" min={0} value={form.bedrooms} onChange={(e) => updateField("bedrooms", e.target.value)} className={errors.bedrooms ? "edit_listing_input_error" : ""} aria-invalid={!!errors.bedrooms} />
              {errors.bedrooms && <span className="edit_listing_error">{errors.bedrooms}</span>}
            </div>
            <div className="edit_listing_field">
              <label htmlFor="edit-bathrooms">Bathrooms *</label>
              <input id="edit-bathrooms" type="number" min={0} step="0.5" value={form.bathrooms} onChange={(e) => updateField("bathrooms", e.target.value)} className={errors.bathrooms ? "edit_listing_input_error" : ""} aria-invalid={!!errors.bathrooms} />
              {errors.bathrooms && <span className="edit_listing_error">{errors.bathrooms}</span>}
            </div>
            <div className="edit_listing_field">
              <label htmlFor="edit-guests">Guests *</label>
              <input id="edit-guests" type="number" min={1} value={form.guests} onChange={(e) => updateField("guests", e.target.value)} className={errors.guests ? "edit_listing_input_error" : ""} aria-invalid={!!errors.guests} />
              {errors.guests && <span className="edit_listing_error">{errors.guests}</span>}
            </div>
          </div>
        </section>
        <section className="edit_listing_section">
          <h2>Pricing</h2>
          <div className="edit_listing_field">
            <label htmlFor="edit-price">Price per night (ZAR) *</label>
            <input id="edit-price" type="number" min={1} value={form.price} onChange={(e) => updateField("price", e.target.value)} className={errors.price ? "edit_listing_input_error" : ""} aria-invalid={!!errors.price} />
            {errors.price && <span className="edit_listing_error">{errors.price}</span>}
          </div>
          <div className="edit_listing_row">
            <div className="edit_listing_field">
              <label htmlFor="edit-weeklyDiscount">Weekly discount (%)</label>
              <input id="edit-weeklyDiscount" type="number" min={0} max={100} value={form.weeklyDiscount} onChange={(e) => updateField("weeklyDiscount", e.target.value)} className={errors.weeklyDiscount ? "edit_listing_input_error" : ""} aria-invalid={!!errors.weeklyDiscount} />
              {errors.weeklyDiscount && <span className="edit_listing_error" role="alert">{errors.weeklyDiscount}</span>}
            </div>
            <div className="edit_listing_field">
              <label htmlFor="edit-cleaningFee">Cleaning fee (ZAR)</label>
              <input id="edit-cleaningFee" type="number" min={0} value={form.cleaningFee} onChange={(e) => updateField("cleaningFee", e.target.value)} />
            </div>
          </div>
          <div className="edit_listing_row">
            <div className="edit_listing_field">
              <label htmlFor="edit-serviceFee">Service fee (ZAR)</label>
              <input id="edit-serviceFee" type="number" min={0} step="0.01" value={form.serviceFee} onChange={(e) => updateField("serviceFee", e.target.value)} />
            </div>
            <div className="edit_listing_field">
              <label htmlFor="edit-occupancyTaxes">Occupancy taxes (ZAR)</label>
              <input id="edit-occupancyTaxes" type="number" min={0} step="0.01" value={form.occupancyTaxes} onChange={(e) => updateField("occupancyTaxes", e.target.value)} />
            </div>
          </div>
        </section>
        <div className="edit_listing_actions">
          <button type="button" className="edit_listing_btn_secondary" onClick={() => navigate("/listings")}>Cancel</button>
          <button type="submit" className="edit_listing_btn_primary" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save changes"}</button>
        </div>
      </form>
    </div>
  );
};

export default EditListing;
