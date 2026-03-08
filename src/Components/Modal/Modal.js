/**
 * Global modal container: renders login or language/currency content based on Redux modal state.
 * Handles enter/exit animation, Escape to close, focus trap, and body scroll lock.
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FocusTrap from "focus-trap-react";
import { closeModal } from "../../Action/ModalAction";
import Login from "../Login/Login";
import LanguageCurrencyModal from "../LanguageCurrencyModal/LanguageCurrencyModal";
import "./Modal.css";

const ANIMATION_DURATION_MS = 250;

/** Modal type -> component to render inside the dialog. */
const CONTENT_MAP = {
  login: Login,
  language: LanguageCurrencyModal,
};

const MODAL_LABELS = {
  login: "Log in or sign up",
  language: "Language and region",
};

const Modal = () => {
  const dispatch = useDispatch();
  const modalState = useSelector((state) => state.modal);
  const { openClose, content } = modalState;
  const closeButtonRef = useRef(null);
  const previousActiveElement = useRef(null);
  const [isVisible, setVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
  }, []);

  // Run exit animation then close
  useEffect(() => {
    if (!isClosing) return;
    const id = setTimeout(() => {
      dispatch(closeModal());
      setIsClosing(false);
    }, ANIMATION_DURATION_MS);
    return () => clearTimeout(id);
  }, [isClosing, dispatch]);

  // Enter animation: show after mount
  useEffect(() => {
    if (openClose !== "open") return;
    setVisible(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
    return () => cancelAnimationFrame(id);
  }, [openClose]);

  // Close on Escape
  useEffect(() => {
    if (openClose !== "open" || isClosing) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openClose, isClosing, handleClose]);

  // Lock body scroll and manage focus when modal opens
  useEffect(() => {
    if (openClose !== "open") return;
    previousActiveElement.current = document.activeElement;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => {
      document.body.style.overflow = "";
      previousActiveElement.current?.focus?.();
    };
  }, [openClose]);

  const isRendered = openClose === "open" || isClosing;
  if (!isRendered) return null;

  const ContentComponent = CONTENT_MAP[content];
  const modalContent = ContentComponent ? (
    <ContentComponent />
  ) : content ? (
    <div>{content}</div>
  ) : null;

  const overlayClasses = [
    "modal_overlay",
    isVisible && !isClosing && "modal_visible",
    isClosing && "modal_closing",
  ]
    .filter(Boolean)
    .join(" ");

  const contentClasses = [
    "modal_content",
    isVisible && !isClosing && "modal_visible",
    isClosing && "modal_closing",
  ]
    .filter(Boolean)
    .join(" ");

  const dialog = (
    <div
      className={contentClasses}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-label={MODAL_LABELS[content] || "Modal"}
    >
      <button
        ref={closeButtonRef}
        type="button"
        className="modal_close"
        onClick={handleClose}
        aria-label="Close modal"
      >
        ×
      </button>
      {modalContent}
    </div>
  );

  return (
    <div
      className={overlayClasses}
      onClick={handleClose}
      role="presentation"
    >
      <FocusTrap
        active={isRendered}
        focusTrapOptions={{
          initialFocus: () => closeButtonRef.current,
          allowOutsideClick: true,
          escapeDeactivates: false,
        }}
      >
        {dialog}
      </FocusTrap>
    </div>
  );
};

export default Modal;
