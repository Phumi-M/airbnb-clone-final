import { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { createListing } from "../../Action/ListingActions";
import { showToast } from "../../Action/ToastAction";
import { scrollToFirstError } from "../../utils/dom";
import { trimString, validateListingBasics, validateListingCapacity, validateListingPricing, LISTING_TITLE_MAX_LENGTH, LISTING_DESCRIPTION_MAX_LENGTH } from "../../utils/validation";
import { getListingDescriptionShort } from "../../utils/listings";
import { formatPriceZAR } from "../../utils/format";
import "./CreateListing.css";

const DRAFT_KEY = "airbnb_create_listing_draft";

const PROPERTY_TYPES = [
  "Apartment",
  "House",
  "Cabin",
  "Villa",
  "Loft",
  "Studio",
  "Other",
];

const AMENITY_OPTIONS = [
  "WiFi",
  "Kitchen",
  "Washer",
  "Dryer",
  "Air conditioning",
  "Heating",
  "TV",
  "Parking",
  "Pool",
  "Gym",
  "Workspace",
  "Elevator",
  "Smoke alarm",
  "First aid kit",
  "Fire extinguisher",
  "Pets allowed",
  "Garden",
  "BBQ grill",
];

const STEPS = [
  { id: "basics", title: "Basics", icon: "📋" },
  { id: "details", title: "Details", icon: "🛏️" },
  { id: "pricing", title: "Pricing", icon: "💰" },
  { id: "photos", title: "Photos", icon: "📷" },
  { id: "amenities", title: "Amenities", icon: "✨" },
  { id: "review", title: "Review", icon: "✅" },
];

const MAX_IMAGES = 10;
const MAX_IMAGE_SIZE_MB = 5;

const defaultForm = () => ({
  title: "",
  location: "",
  description: "",
  bedrooms: "",
  bathrooms: "",
  guests: "",
  type: "",
  price: "",
  amenitiesList: [],
  weeklyDiscount: "",
  cleaningFee: "",
  serviceFee: "",
  occupancyTaxes: "",
});

const CreateListing = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState(defaultForm);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const stepId = STEPS[stepIndex]?.id || "basics";

  const saveDraft = useCallback(() => {
    try {
      const draft = {
        form: { ...form },
        images: images.map((i) => i.dataUrl),
        stepIndex,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // ignore
    }
  }, [form, images, stepIndex]);

  useEffect(() => {
    const t = setTimeout(saveDraft, 800);
    return () => clearTimeout(t);
  }, [form, images, stepIndex, saveDraft]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw);
      if (draft.form) {
        const merged = { ...defaultForm(), ...draft.form };
        if (Array.isArray(draft.form.amenitiesList)) merged.amenitiesList = draft.form.amenitiesList;
        else if (draft.form.amenities && typeof draft.form.amenities === "string") {
          merged.amenitiesList = draft.form.amenities.split(",").map((a) => a.trim()).filter(Boolean);
        }
        setForm(merged);
      }
      if (Array.isArray(draft.images) && draft.images.length) {
        setImages(draft.images.map((dataUrl) => ({ file: null, dataUrl })));
      }
      if (typeof draft.stepIndex === "number" && draft.stepIndex >= 0 && draft.stepIndex < STEPS.length) {
        setStepIndex(draft.stepIndex);
      }
    } catch {
      // ignore
    }
  }, []);

  const update = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const toggleAmenity = (amenity) => {
    setForm((prev) => {
      const list = prev.amenitiesList || [];
      const next = list.includes(amenity) ? list.filter((a) => a !== amenity) : [...list, amenity];
      return { ...prev, amenitiesList: next };
    });
  };

  const validateStep = (step) => {
    let e = {};
    if (step === "basics") {
      const result = validateListingBasics(form);
      e = result.errors;
    } else if (step === "details") {
      const result = validateListingCapacity(form);
      e = result.errors;
    } else if (step === "pricing") {
      const result = validateListingPricing(form);
      e = result.errors;
    } else if (step === "photos") {
      if (images.length === 0) e.images = "Add at least one photo.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (!validateStep(stepId)) {
      scrollToFirstError(formRef);
      return;
    }
    if (stepIndex < STEPS.length - 1) setStepIndex((i) => i + 1);
  };

  const goBack = () => {
    setStepIndex((i) => Math.max(0, i - 1));
  };

  const processFiles = (files) => {
    const list = Array.from(files || []);
    const remaining = MAX_IMAGES - images.length;
    if (list.length > remaining) {
      setErrors((prev) => ({ ...prev, images: `You can add ${remaining} more (max ${MAX_IMAGES}).` }));
      return;
    }
    for (const file of list) {
      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, images: `"${file.name}" is over ${MAX_IMAGE_SIZE_MB}MB.` }));
        return;
      }
    }
    setErrors((prev) => ({ ...prev, images: "" }));
    setImageLoading(true);
    const readers = list.map((file) =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ file, dataUrl: reader.result });
        reader.readAsDataURL(file);
      })
    );
    Promise.all(readers).then((newImages) => {
      setImages((prev) => [...prev, ...newImages].slice(0, MAX_IMAGES));
      setImageLoading(false);
    });
  };

  const handleImageChange = (e) => {
    processFiles(e.target.files);
    e.target.value = "";
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFiles(e.dataTransfer?.files);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  const onDragLeave = () => setDragOver(false);

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => ({ ...prev, images: "" }));
  };

  const setCover = (index) => {
    if (index <= 0) return;
    setImages((prev) => {
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.unshift(item);
      return next;
    });
  };

  const clearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}
    setForm(defaultForm());
    setImages([]);
    setErrors({});
    setStepIndex(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (stepId !== "review") {
      goNext();
      return;
    }
    const stepsToValidate = ["basics", "details", "pricing", "photos"];
    for (let i = 0; i < stepsToValidate.length; i++) {
      if (!validateStep(stepsToValidate[i])) {
        setStepIndex(i);
        setTimeout(() => scrollToFirstError(formRef), 100);
        return;
      }
    }
    setIsSubmitting(true);
    const priceNum = parseFloat(form.price, 10);
    const bedrooms = parseInt(form.bedrooms, 10);
    const bathrooms = parseFloat(form.bathrooms, 10);
    const guests = parseInt(form.guests, 10);
    const uniqueId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `listing_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    const listing = {
      id: uniqueId,
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
      amenities: Array.isArray(form.amenitiesList) ? form.amenitiesList : [],
      weeklyDiscount: form.weeklyDiscount === "" ? 0 : parseFloat(form.weeklyDiscount, 10),
      cleaningFee: form.cleaningFee === "" ? 0 : parseFloat(form.cleaningFee, 10),
      serviceFee: form.serviceFee === "" ? 0 : parseFloat(form.serviceFee, 10),
      occupancyTaxes: form.occupancyTaxes === "" ? 0 : parseFloat(form.occupancyTaxes, 10),
      img: images[0]?.dataUrl || "",
      images: images.map((i) => i.dataUrl),
      star: 0,
      reviewCount: 0,
      total: "",
    };
    dispatch(createListing(listing));
    dispatch(showToast("Listing published.", "success"));
    clearDraft();
    setIsSubmitting(false);
    setSubmitSuccess(true);
  };

  if (submitSuccess) {
    return (
      <div className="create_listing create_listing_success">
        <div className="create_listing_success_card">
          <span className="create_listing_success_icon" aria-hidden>✓</span>
          <h2>Your listing is live</h2>
          <p>Guests can now find and book your place.</p>
          <div className="create_listing_success_actions">
            <Link to="/search" className="create_listing_btn_primary">Browse listings</Link>
            <button
              type="button"
              className="create_listing_btn_secondary"
              onClick={() => {
                setSubmitSuccess(false);
                setForm(defaultForm());
                setImages([]);
                setErrors({});
                setStepIndex(0);
              }}
            >
              Add another listing
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create_listing">
      <div className="create_listing_header">
        <h1>Create a listing</h1>
        <p className="create_listing_draft_hint">Your progress is saved automatically.</p>
      </div>

      <nav className="create_listing_steps" aria-label="Listing steps">
        {STEPS.map((step, i) => (
          <button
            key={step.id}
            type="button"
            className={`create_listing_step ${i === stepIndex ? "active" : ""} ${i < stepIndex ? "done" : ""}`}
            onClick={() => setStepIndex(i)}
            aria-current={i === stepIndex ? "step" : undefined}
          >
            <span className="create_listing_step_num">{i + 1}</span>
            <span className="create_listing_step_title">{step.title}</span>
          </button>
        ))}
      </nav>

      <form ref={formRef} onSubmit={handleSubmit} noValidate className="create_listing_form">
        {/* Step: Basics */}
        {stepId === "basics" && (
          <section className="create_listing_section" aria-labelledby="step-basics">
            <h2 id="step-basics">Basics</h2>
            <div className="create_listing_field">
              <label htmlFor="title">Listing title *</label>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="e.g. Cozy apartment in the city"
                maxLength={LISTING_TITLE_MAX_LENGTH}
                className={errors.title ? "create_listing_input_error" : ""}
                aria-invalid={!!errors.title}
              />
              <span className="create_listing_char">{form.title.length}/{LISTING_TITLE_MAX_LENGTH}</span>
              {errors.title && <span className="create_listing_error">{errors.title}</span>}
            </div>
            <div className="create_listing_field">
              <label htmlFor="location">Location *</label>
              <input
                id="location"
                type="text"
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder="City or area"
                className={errors.location ? "create_listing_input_error" : ""}
                aria-invalid={!!errors.location}
              />
              {errors.location && <span className="create_listing_error">{errors.location}</span>}
            </div>
            <div className="create_listing_field">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Describe your place..."
                rows={4}
                maxLength={LISTING_DESCRIPTION_MAX_LENGTH}
                className={errors.description ? "create_listing_input_error" : ""}
                aria-invalid={!!errors.description}
              />
              <span className="create_listing_char">{form.description.length}/{LISTING_DESCRIPTION_MAX_LENGTH}</span>
              {errors.description && <span className="create_listing_error">{errors.description}</span>}
            </div>
            <div className="create_listing_field">
              <label htmlFor="type">Property type *</label>
              <select
                id="type"
                value={form.type}
                onChange={(e) => update("type", e.target.value)}
                className={errors.type ? "create_listing_input_error" : ""}
                aria-invalid={!!errors.type}
              >
                <option value="">Select type</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.type && <span className="create_listing_error">{errors.type}</span>}
            </div>
          </section>
        )}

        {/* Step: Details */}
        {stepId === "details" && (
          <section className="create_listing_section" aria-labelledby="step-details">
            <h2 id="step-details">Capacity &amp; rooms</h2>
            <div className="create_listing_row create_listing_row3">
              <div className="create_listing_field">
                <label htmlFor="bedrooms">Bedrooms *</label>
                <input
                  id="bedrooms"
                  type="number"
                  min={0}
                  value={form.bedrooms}
                  onChange={(e) => update("bedrooms", e.target.value)}
                  className={errors.bedrooms ? "create_listing_input_error" : ""}
                  aria-invalid={!!errors.bedrooms}
                />
                {errors.bedrooms && <span className="create_listing_error">{errors.bedrooms}</span>}
              </div>
              <div className="create_listing_field">
                <label htmlFor="bathrooms">Bathrooms *</label>
                <input
                  id="bathrooms"
                  type="number"
                  min={0}
                  step="0.5"
                  value={form.bathrooms}
                  onChange={(e) => update("bathrooms", e.target.value)}
                  className={errors.bathrooms ? "create_listing_input_error" : ""}
                  aria-invalid={!!errors.bathrooms}
                />
                {errors.bathrooms && <span className="create_listing_error">{errors.bathrooms}</span>}
              </div>
              <div className="create_listing_field">
                <label htmlFor="guests">Max guests *</label>
                <input
                  id="guests"
                  type="number"
                  min={1}
                  value={form.guests}
                  onChange={(e) => update("guests", e.target.value)}
                  className={errors.guests ? "create_listing_input_error" : ""}
                  aria-invalid={!!errors.guests}
                />
                {errors.guests && <span className="create_listing_error">{errors.guests}</span>}
              </div>
            </div>
          </section>
        )}

        {/* Step: Pricing */}
        {stepId === "pricing" && (
          <section className="create_listing_section" aria-labelledby="step-pricing">
            <h2 id="step-pricing">Pricing</h2>
            <div className="create_listing_field">
              <label htmlFor="price">Price per night (ZAR) *</label>
              <input
                id="price"
                type="number"
                min={1}
                step={1}
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
                placeholder="e.g. 1200"
                className={errors.price ? "create_listing_input_error" : ""}
                aria-invalid={!!errors.price}
              />
              {form.price && !errors.price && (
                <p className="create_listing_price_preview">
                  R{Number(form.price).toLocaleString("en-ZA")} per night
                </p>
              )}
              {errors.price && <span className="create_listing_error">{errors.price}</span>}
            </div>
            <div className="create_listing_row">
              <div className="create_listing_field">
                <label htmlFor="weeklyDiscount">Weekly discount (%)</label>
                <input
                  id="weeklyDiscount"
                  type="number"
                  min={0}
                  max={100}
                  value={form.weeklyDiscount}
                  onChange={(e) => update("weeklyDiscount", e.target.value)}
                  placeholder="0–100"
                  className={errors.weeklyDiscount ? "create_listing_input_error" : ""}
                />
                {errors.weeklyDiscount && <span className="create_listing_error">{errors.weeklyDiscount}</span>}
              </div>
              <div className="create_listing_field">
                <label htmlFor="cleaningFee">Cleaning fee (ZAR)</label>
                <input
                  id="cleaningFee"
                  type="number"
                  min={0}
                  value={form.cleaningFee}
                  onChange={(e) => update("cleaningFee", e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="create_listing_row">
              <div className="create_listing_field">
                <label htmlFor="serviceFee">Service fee (ZAR)</label>
                <input id="serviceFee" type="number" min={0} step="0.01" value={form.serviceFee} onChange={(e) => update("serviceFee", e.target.value)} placeholder="0" />
              </div>
              <div className="create_listing_field">
                <label htmlFor="occupancyTaxes">Occupancy taxes (ZAR)</label>
                <input id="occupancyTaxes" type="number" min={0} step="0.01" value={form.occupancyTaxes} onChange={(e) => update("occupancyTaxes", e.target.value)} placeholder="0" />
              </div>
            </div>
          </section>
        )}

        {/* Step: Photos */}
        {stepId === "photos" && (
          <section className="create_listing_section" aria-labelledby="step-photos">
            <h2 id="step-photos">Photos</h2>
            <p className="create_listing_hint">First photo is the cover. Drag to reorder or click &quot;Set as cover&quot;.</p>
            <div
              className={`create_listing_dropzone ${dragOver ? "create_listing_dropzone_active" : ""}`}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
              aria-label="Add photos (click or drag and drop)"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="create_listing_file_input_hidden"
                aria-describedby={errors.images ? "images-error" : undefined}
              />
              {imageLoading ? (
                <span className="create_listing_dropzone_text">Uploading...</span>
              ) : (
                <span className="create_listing_dropzone_text">Click or drag photos here (max {MAX_IMAGES}, {MAX_IMAGE_SIZE_MB}MB each)</span>
              )}
            </div>
            {errors.images && <span id="images-error" className="create_listing_error create_listing_error_block">{errors.images}</span>}
            <div className="create_listing_previews">
              {images.map((img, index) => (
                <div key={index} className="create_listing_preview_wrap">
                  {index === 0 && <span className="create_listing_cover_badge">Cover</span>}
                  <img src={img.dataUrl} alt={`Preview ${index + 1}`} className="create_listing_preview_img" />
                  <div className="create_listing_preview_actions">
                    {index > 0 && (
                      <button type="button" className="create_listing_preview_btn" onClick={(e) => { e.stopPropagation(); setCover(index); }} title="Set as cover">Set cover</button>
                    )}
                    <button type="button" className="create_listing_remove_img" onClick={(e) => { e.stopPropagation(); removeImage(index); }} aria-label={`Remove image ${index + 1}`}>×</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Step: Amenities */}
        {stepId === "amenities" && (
          <section className="create_listing_section" aria-labelledby="step-amenities">
            <h2 id="step-amenities">Amenities</h2>
            <p className="create_listing_hint">Select all that apply.</p>
            <div className="create_listing_amenities_grid">
              {AMENITY_OPTIONS.map((a) => (
                <label key={a} className="create_listing_amenity_item">
                  <input
                    type="checkbox"
                    checked={(form.amenitiesList || []).includes(a)}
                    onChange={() => toggleAmenity(a)}
                  />
                  <span>{a}</span>
                </label>
              ))}
            </div>
          </section>
        )}

        {/* Step: Review */}
        {stepId === "review" && (
          <section className="create_listing_section create_listing_review" aria-labelledby="step-review">
            <h2 id="step-review">Review your listing</h2>
            <div className="create_listing_review_card">
              {images[0]?.dataUrl && <img src={images[0].dataUrl} alt="" className="create_listing_review_thumb" />}
              <div className="create_listing_review_body">
                <h3>{form.title || "Untitled"}</h3>
                <p className="create_listing_review_meta">{form.location} · {form.type}</p>
                <p className="create_listing_review_desc">{form.description ? `${form.description.slice(0, 120)}${form.description.length > 120 ? "…" : ""}` : "No description."}</p>
                <p className="create_listing_review_price">
                  {form.price ? `R${Number(form.price).toLocaleString("en-ZA")} / night` : "—"}
                </p>
                <p className="create_listing_review_amenities">
                  {(form.amenitiesList || []).length ? form.amenitiesList.join(", ") : "No amenities selected."}
                </p>
              </div>
            </div>
          </section>
        )}

        <div className="create_listing_actions">
          <button type="button" className="create_listing_btn_secondary" onClick={goBack} disabled={stepIndex === 0}>
            Back
          </button>
          {stepId !== "review" ? (
            <button type="button" className="create_listing_btn_primary" onClick={goNext}>
              Next
            </button>
          ) : (
            <button type="submit" className="create_listing_btn_primary" disabled={isSubmitting}>
              {isSubmitting ? "Publishing…" : "Publish listing"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateListing;
